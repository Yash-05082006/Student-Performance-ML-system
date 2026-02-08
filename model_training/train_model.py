# ==============================
# Student Performance Model Training Script
# ==============================

import sqlite3
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
import joblib

# ------------------------------
# Step 1: Connect to SQLite database
# ------------------------------
# We are loading student data directly from SQL (not CSV)
conn = sqlite3.connect("students.db")
df = pd.read_sql_query("SELECT * FROM student_records", conn)
conn.close()

# ------------------------------
# Step 2: Encode target labels
# ------------------------------
# ML models need numbers, not text labels
# So we convert High/Medium/Low → 0,1,2
label_encoder = LabelEncoder()
df["final_performance"] = label_encoder.fit_transform(df["final_performance"])

# ------------------------------
# Step 3: Separate features and target
# ------------------------------
X = df.drop("final_performance", axis=1)  # Input features
y = df["final_performance"]               # Output label

# ------------------------------
# Step 4: Split into training and testing data
# ------------------------------
# 80% for training, 20% for testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ------------------------------
# Step 5: Define models to train
# ------------------------------
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Decision Tree": DecisionTreeClassifier(),
    "Random Forest": RandomForestClassifier()
}

best_model = None
best_accuracy = 0

# ------------------------------
# Step 6: Train and evaluate each model
# ------------------------------
for name, model in models.items():
    model.fit(X_train, y_train)  # Train model
    predictions = model.predict(X_test)  # Predict on test data

    accuracy = accuracy_score(y_test, predictions)
    print(f"\n{name} Accuracy: {accuracy:.2f}")
    print(classification_report(y_test, predictions))

    # Save the best model
    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = model

# ------------------------------
# Step 7: Save the best performing model
# ------------------------------
joblib.dump(best_model, "saved_models/student_model_v1.pkl")
print("\n Best model saved as saved_models/student_model_v1.pkl")

