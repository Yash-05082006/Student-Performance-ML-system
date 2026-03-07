"""
Student Performance Prediction API
FastAPI backend for serving ML model predictions
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Literal
import joblib
import pandas as pd
import numpy as np
from pathlib import Path

# Initialize FastAPI app
app = FastAPI(
    title="Student Performance Prediction API",
    description="API for predicting student academic performance using ML",
    version="1.0.0"
)

# Add CORS middleware for React dashboard
origins = [
    "http://localhost:8081",
    "http://127.0.0.1:8081"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model loading
MODEL_PATH = Path("saved_models/student_model_v1.pkl")
ENCODER_PATH = Path("saved_models/label_encoder.pkl")

_model = None
_label_encoder = None


def load_model():
    """Load the trained model and label encoder"""
    global _model, _label_encoder
    try:
        _model = joblib.load(MODEL_PATH)
        _label_encoder = joblib.load(ENCODER_PATH)
        print("✅ Model and label encoder loaded successfully")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        raise


# Load model on startup
@app.on_event("startup")
async def startup_event():
    load_model()


# Request/Response Models
class StudentInput(BaseModel):
    attendance: int = Field(..., ge=0, le=100, description="Attendance percentage (0-100)")
    testScore: int = Field(..., ge=0, le=100, description="Internal test score (0-100)")
    assignmentScore: int = Field(..., ge=0, le=100, description="Assignment score (0-100)")
    backlogs: int = Field(..., ge=0, le=10, description="Number of backlogs (0-10)")
    engagement: int = Field(..., ge=0, le=100, description="Engagement score (0-100)")


class Factor(BaseModel):
    name: str
    impact: Literal["positive", "neutral", "negative"]


class FeatureImportance(BaseModel):
    feature: str
    importance: float = Field(..., ge=0, le=1)


class PredictionResponse(BaseModel):
    level: Literal["High", "Medium", "Low"]
    confidence: float = Field(..., ge=0, le=100)
    recommendations: List[str]
    factors: List[Factor]
    feature_importance: List[FeatureImportance]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


# Helper functions
def get_recommendations(level: str) -> List[str]:
    """Get recommendations based on performance level"""
    recommendations = {
        "High": [
            "Student is performing well — encourage participation in mentoring programs.",
            "Consider recommending advanced coursework or research opportunities.",
            "Continue monitoring to maintain current trajectory.",
        ],
        "Medium": [
            "Schedule a check-in meeting to discuss academic goals.",
            "Recommend study groups or tutoring resources.",
            "Monitor attendance and assignment submissions closely.",
        ],
        "Low": [
            "Immediate academic counseling is recommended.",
            "Connect student with tutoring and support services.",
            "Review attendance barriers and develop an improvement plan.",
            "Consider reduced course load for the next semester.",
        ],
    }
    return recommendations.get(level, [])


def analyze_factors(input_data: StudentInput) -> List[Factor]:
    """Analyze contributing factors based on input values"""
    factors = []
    
    # Attendance analysis
    if input_data.attendance >= 75:
        factors.append(Factor(name="Attendance", impact="positive"))
    elif input_data.attendance >= 60:
        factors.append(Factor(name="Attendance", impact="neutral"))
    else:
        factors.append(Factor(name="Attendance", impact="negative"))
    
    # Test score analysis
    if input_data.testScore >= 70:
        factors.append(Factor(name="Test Score", impact="positive"))
    elif input_data.testScore >= 50:
        factors.append(Factor(name="Test Score", impact="neutral"))
    else:
        factors.append(Factor(name="Test Score", impact="negative"))
    
    # Assignment score analysis
    if input_data.assignmentScore >= 70:
        factors.append(Factor(name="Assignments", impact="positive"))
    elif input_data.assignmentScore >= 50:
        factors.append(Factor(name="Assignments", impact="neutral"))
    else:
        factors.append(Factor(name="Assignments", impact="negative"))
    
    # Backlogs analysis
    if input_data.backlogs == 0:
        factors.append(Factor(name="Backlogs", impact="positive"))
    elif input_data.backlogs <= 2:
        factors.append(Factor(name="Backlogs", impact="neutral"))
    else:
        factors.append(Factor(name="Backlogs", impact="negative"))
    
    # Engagement analysis
    if input_data.engagement >= 70:
        factors.append(Factor(name="Engagement", impact="positive"))
    elif input_data.engagement >= 50:
        factors.append(Factor(name="Engagement", impact="neutral"))
    else:
        factors.append(Factor(name="Engagement", impact="negative"))
    
    return factors


# API Endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        model_loaded=_model is not None and _label_encoder is not None
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict(student: StudentInput):
    """Predict student performance based on input features"""
    if _model is None or _label_encoder is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Prepare input data
        input_data = pd.DataFrame([{
            "attendance": student.attendance,
            "internal_score": student.testScore,
            "assignment_score": student.assignmentScore,
            "backlogs": student.backlogs,
            "engagement": student.engagement,
        }])
        
        # Make prediction
        prediction = _model.predict(input_data)[0]
        predicted_label = _label_encoder.inverse_transform([prediction])[0]
        
        # Get prediction probabilities for confidence score
        if hasattr(_model, "predict_proba"):
            probabilities = _model.predict_proba(input_data)[0]
            confidence = float(np.max(probabilities)) * 100
        else:
            # Fallback if model doesn't support probability predictions
            confidence = 85.0
        
        # Analyze contributing factors
        factors = analyze_factors(student)
        
        # Get recommendations
        recommendations = get_recommendations(predicted_label)
        
        # Compute feature importance for this prediction
        feature_names = ["attendance", "internal_score", "assignment_score", "backlogs", "engagement"]
        display_names = {
            "attendance": "Attendance",
            "internal_score": "Test Score",
            "assignment_score": "Assignment Score",
            "backlogs": "Backlogs",
            "engagement": "Engagement"
        }
        
        feature_importance_list = []
        
        if hasattr(_model, "feature_importances_"):
            # Get global feature importances from the model
            importances = _model.feature_importances_
            for feat, imp in zip(feature_names, importances):
                feature_importance_list.append(FeatureImportance(
                    feature=display_names[feat],
                    importance=round(float(imp), 3)
                ))
        elif hasattr(_model, "coef_"):
            # For linear models (SVM, Logistic Regression)
            coefs = np.abs(_model.coef_[0]) if _model.coef_.ndim > 1 else np.abs(_model.coef_)
            # Normalize to sum to 1
            coefs = coefs / coefs.sum()
            for feat, imp in zip(feature_names, coefs):
                feature_importance_list.append(FeatureImportance(
                    feature=display_names[feat],
                    importance=round(float(imp), 3)
                ))
        else:
            # Fallback to equal importance
            equal_importance = 1.0 / len(feature_names)
            for feat in feature_names:
                feature_importance_list.append(FeatureImportance(
                    feature=display_names[feat],
                    importance=round(equal_importance, 3)
                ))
        
        # Sort by importance descending
        feature_importance_list.sort(key=lambda x: x.importance, reverse=True)
        
        return PredictionResponse(
            level=predicted_label,
            confidence=round(confidence, 2),
            recommendations=recommendations,
            factors=factors,
            feature_importance=feature_importance_list
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


# Load student data for analytics
_data_df = None

def load_student_data():
    """Load student data from CSV for analytics"""
    global _data_df
    try:
        _data_df = pd.read_csv("student_data.csv")
        # Rename columns to match API format
        _data_df = _data_df.rename(columns={
            "internal_score": "testScore",
            "assignment_score": "assignmentScore",
            "final_performance": "performance"
        })
        print(f"✅ Loaded {_data_df.shape[0]} student records")
    except Exception as e:
        print(f"⚠️ Could not load student data: {e}")
        _data_df = None


# Load data on startup
@app.on_event("startup")
async def load_data_on_startup():
    load_student_data()


# Response Models for new endpoints
class StudentRecord(BaseModel):
    attendance: int
    testScore: int
    assignmentScore: int
    backlogs: int
    engagement: int
    performance: str


class PerformanceDistribution(BaseModel):
    high: int
    medium: int
    low: int


class BacklogDistribution(BaseModel):
    zero: int = Field(..., alias="0")
    one: int = Field(..., alias="1")
    two: int = Field(..., alias="2")
    three_plus: int = Field(..., alias="3+")


class AnalyticsResponse(BaseModel):
    total_students: int
    avg_attendance: float
    avg_test_score: float
    avg_assignment_score: float
    avg_engagement: float
    performance_distribution: PerformanceDistribution
    backlog_distribution: dict


class ModelInfoResponse(BaseModel):
    algorithm: str
    training_size: int
    features: List[str]
    feature_importance: dict


@app.get("/students", response_model=List[StudentRecord])
async def get_students():
    """Return all student records for analytics"""
    if _data_df is None:
        raise HTTPException(status_code=503, detail="Student data not loaded")
    
    return _data_df.to_dict(orient="records")


@app.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics():
    """Return dataset statistics for dashboard"""
    if _data_df is None:
        raise HTTPException(status_code=503, detail="Student data not loaded")
    
    total = len(_data_df)
    
    # Performance distribution
    perf_counts = _data_df["performance"].value_counts().to_dict()
    
    # Backlog distribution
    backlog_counts = _data_df["backlogs"].value_counts().to_dict()
    backlog_dist = {
        "0": backlog_counts.get(0, 0),
        "1": backlog_counts.get(1, 0),
        "2": backlog_counts.get(2, 0),
        "3+": sum(backlog_counts.get(k, 0) for k in backlog_counts if k >= 3)
    }
    
    return AnalyticsResponse(
        total_students=total,
        avg_attendance=round(_data_df["attendance"].mean(), 1),
        avg_test_score=round(_data_df["testScore"].mean(), 1),
        avg_assignment_score=round(_data_df["assignmentScore"].mean(), 1),
        avg_engagement=round(_data_df["engagement"].mean(), 1),
        performance_distribution=PerformanceDistribution(
            high=perf_counts.get("High", 0),
            medium=perf_counts.get("Medium", 0),
            low=perf_counts.get("Low", 0)
        ),
        backlog_distribution=backlog_dist
    )


@app.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info():
    """Return ML model metadata and feature importance"""
    if _model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Get model class name
    algorithm = _model.__class__.__name__
    
    # Get training size from data
    training_size = len(_data_df) if _data_df is not None else 0
    
    # Feature names (matching the model training features)
    features = ["attendance", "internal_score", "assignment_score", "backlogs", "engagement"]
    
    # Get feature importance if available
    feature_importance = {}
    if hasattr(_model, "feature_importances_"):
        importances = _model.feature_importances_
        for feat, imp in zip(features, importances):
            feature_importance[feat] = round(float(imp), 3)
    elif hasattr(_model, "coef_"):
        # For linear models, use absolute coefficients normalized
        coefs = np.abs(_model.coef_[0]) if _model.coef_.ndim > 1 else np.abs(_model.coef_)
        coefs = coefs / coefs.sum()
        for feat, imp in zip(features, coefs):
            feature_importance[feat] = round(float(imp), 3)
    else:
        # Fallback to equal importance
        for feat in features:
            feature_importance[feat] = round(1.0 / len(features), 3)
    
    return ModelInfoResponse(
        algorithm=algorithm,
        training_size=training_size,
        features=features,
        feature_importance=feature_importance
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
