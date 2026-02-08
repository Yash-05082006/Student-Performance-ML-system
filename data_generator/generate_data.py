import pandas as pd
import numpy as np

# Number of students to generate
NUM_STUDENTS = 500

np.random.seed(42)

data = []

for _ in range(NUM_STUDENTS):
    attendance = np.random.randint(40, 101)  # 40% to 100%
    internal_score = np.random.randint(30, 101)
    assignment_score = np.random.randint(30, 101)
    backlogs = np.random.randint(0, 5)
    engagement = np.random.randint(1, 11)  # Scale of 1–10

    # Performance logic (simple rule-based labeling)
    avg_score = (internal_score + assignment_score) / 2

    if attendance > 75 and avg_score > 70 and backlogs == 0:
        final_performance = "High"
    elif attendance > 60 and avg_score > 50:
        final_performance = "Medium"
    else:
        final_performance = "Low"

    data.append([
        attendance,
        internal_score,
        assignment_score,
        backlogs,
        engagement,
        final_performance
    ])

columns = [
    "attendance",
    "internal_score",
    "assignment_score",
    "backlogs",
    "engagement",
    "final_performance"
]

df = pd.DataFrame(data, columns=columns)

# Save generated data
df.to_csv("student_data.csv", index=False)

print("Student dataset generated successfully as student_data.csv")
