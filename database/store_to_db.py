import sqlite3
import pandas as pd

# Connect to SQLite database (creates file if not exists)
conn = sqlite3.connect("students.db")
cursor = conn.cursor()

# Load the generated CSV data
df = pd.read_csv("student_data.csv")

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS student_records (
    attendance INTEGER,
    internal_score INTEGER,
    assignment_score INTEGER,
    backlogs INTEGER,
    engagement INTEGER,
    final_performance TEXT
)
""")

# Insert data into table
df.to_sql("student_records", conn, if_exists="replace", index=False)

conn.commit()
conn.close()

print("Data successfully stored in SQLite database: students.db")
