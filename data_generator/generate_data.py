# ============================================
# Synthetic Student Data Generator (Improved)
# ============================================

import pandas as pd
import numpy as np

# Number of students
NUM_STUDENTS = 500

# For reproducibility (same random data each run)
np.random.seed(42)

data = []

for _ in range(NUM_STUDENTS):

    # -----------------------------
    # Generate base features
    # -----------------------------
    attendance = np.random.randint(40, 101)          # 40% to 100%
    internal_score = np.random.randint(30, 101)      # 30 to 100
    assignment_score = np.random.randint(30, 101)    # 30 to 100
    backlogs = np.random.randint(0, 5)               # 0 to 4
    engagement = np.random.randint(1, 11)            # 1 to 10

    # -----------------------------
    # Create a weighted performance score
    # (Simulates real academic impact)
    # -----------------------------
    performance_score = (
        0.35 * attendance +
        0.25 * internal_score +
        0.20 * assignment_score +
        0.10 * engagement -
        5 * backlogs
    )

    # -----------------------------
    # Add random noise
    # This makes data more realistic and
    # prevents perfect rule-based separation
    # -----------------------------
    noise = np.random.normal(0, 5)
    performance_score += noise

    # -----------------------------
    # Convert score → class label
    # Using ranges instead of strict rules
    # -----------------------------
    if performance_score >= 75:
        final_performance = "High"
    elif performance_score >= 55:
        final_performance = "Medium"
    else:
        final_performance = "Low"

    # Store record
    data.append([
        attendance,
        internal_score,
        assignment_score,
        backlogs,
        engagement,
        final_performance
    ])

# Create DataFrame
columns = [
    "attendance",
    "internal_score",
    "assignment_score",
    "backlogs",
    "engagement",
    "final_performance"
]

df = pd.DataFrame(data, columns=columns)

# Save to CSV
df.to_csv("student_data.csv", index=False)

print("Improved synthetic dataset generated: student_data.csv")