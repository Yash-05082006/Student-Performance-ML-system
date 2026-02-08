import sqlite3
import pandas as pd

# Connect to database
conn = sqlite3.connect("students.db")

# Read first 5 rows from table
df = pd.read_sql_query("SELECT * FROM student_records LIMIT 5", conn)

print(df)

conn.close()
