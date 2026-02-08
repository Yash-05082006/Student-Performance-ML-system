import joblib
import sqlite3
import pandas as pd

# ------------------------------
# 1. Load trained model
# ------------------------------
model = joblib.load("saved_models/student_model_v1.pkl")

# ------------------------------
# 2. New student data (example)
# ------------------------------
new_student = {
    "attendance": 85,
    "internal_score": 78,
    "assignment_score": 80,
    "backlogs": 0,
    "engagement": 9
}

# Convert to DataFrame
input_df = pd.DataFrame([new_student])

# ------------------------------
# 3. Make prediction
# ------------------------------
prediction = model.predict(input_df)[0]

label_map = {0: "High", 1: "Low", 2: "Medium"}
predicted_label = label_map[prediction]

print("Predicted Performance:", predicted_label)

# ------------------------------
# 4. Store new student + prediction in database
# ------------------------------
conn = sqlite3.connect("students.db")
cursor = conn.cursor()

cursor.execute("""
INSERT INTO student_records 
(attendance, internal_score, assignment_score, backlogs, engagement, final_performance)
VALUES (?, ?, ?, ?, ?, ?)
""", (
    new_student["attendance"],
    new_student["internal_score"],
    new_student["assignment_score"],
    new_student["backlogs"],
    new_student["engagement"],
    predicted_label
))

conn.commit()
conn.close()

print("New student data stored in database.")
