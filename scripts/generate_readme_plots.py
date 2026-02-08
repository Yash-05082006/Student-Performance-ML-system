
### 📌 Code for Generating Visualizations


import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Connect to database
conn = sqlite3.connect("students.db")
df = pd.read_sql_query("SELECT * FROM student_records", conn)
conn.close()

# Create images folder
import os
os.makedirs("dashboard/images", exist_ok=True)

# 1. Performance Distribution
plt.figure(figsize=(6,4))
sns.countplot(data=df, x="final_performance", hue="final_performance", palette="viridis", legend=False)
plt.title("Student Performance Distribution")
plt.savefig("dashboard/images/performance_distribution.png")
plt.close()

# 2. Attendance vs Internal Score
plt.figure(figsize=(6,4))
sns.scatterplot(data=df, x="attendance", y="internal_score", hue="final_performance")
plt.title("Attendance vs Internal Score")
plt.savefig("dashboard/images/attendance_vs_score.png")
plt.close()

# 3. Feature Correlation Heatmap
plt.figure(figsize=(6,4))
sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="coolwarm")
plt.title("Feature Correlation Heatmap")
plt.savefig("dashboard/images/correlation_heatmap.png")
plt.close()

print("README visualizations generated successfully!")
