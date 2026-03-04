
# Model Training Script (Improved)

from preprocessing.preprocess import load_and_preprocess_data
from sklearn.metrics import accuracy_score, f1_score, classification_report
from sklearn.model_selection import cross_val_score

# ML models
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC

import joblib

# Load preprocessed data

X, y, X_train, X_test, y_train, y_test, label_encoder = load_and_preprocess_data()


# Define models with purpose

models = {

    # Linear baseline model
    # Fast, interpretable, works well if data is linearly separable
    "Logistic Regression": LogisticRegression(max_iter=1000),

    # Rule-based model (tree structure)
    # Captures non-linear relationships, easy to interpret
    "Decision Tree": DecisionTreeClassifier(),

    # Ensemble of multiple trees
    # Reduces overfitting and improves generalization
    "Random Forest": RandomForestClassifier(),

    # Distance-based model
    # Classifies based on similarity to nearest neighbors
    "KNN": KNeighborsClassifier(),

    # Margin-based classifier
    # Effective for complex decision boundaries
    "SVM": SVC(),

    # Boosting model
    # Sequentially improves weak learners
    "Gradient Boosting": GradientBoostingClassifier()
}

best_model = None
best_f1 = 0
best_model_name = ""


# Train and evaluate each model

for name, model in models.items():

    print(f"\n🔹 Training: {name}")

    # Train model
    model.fit(X_train, y_train)

    # Test predictions
    predictions = model.predict(X_test)

    # Metrics
    accuracy = accuracy_score(y_test, predictions)
    f1 = f1_score(y_test, predictions, average="macro")

    # Cross-validated F1 score
    cv_f1 = cross_val_score(model, X, y, cv=5, scoring="f1_macro").mean()

    print(f"Accuracy: {accuracy:.2f}")
    print(f"F1 Score (macro): {f1:.2f}")
    print(f"CV F1 Score: {cv_f1:.2f}")

    print(classification_report(y_test, predictions))

    # Select best model based on CV F1
    if cv_f1 > best_f1:
        best_f1 = cv_f1
        best_model = model
        best_model_name = name

# Save best model

joblib.dump(best_model, "saved_models/student_model_v1.pkl")

print(f"\n Best Model: {best_model_name}")
print(f"Best CV F1 Score: {best_f1:.2f}")
print("Model saved as saved_models/student_model_v1.pkl")