
# Here’s the full pipeline in flowchart form:

START
  │
  ▼
Generate Synthetic Student Data (Python)
  │
  ▼
Save as CSV File (student_data.csv)
  │
  ▼
Store Data in SQLite Database (students.db)
  │
  ▼
Load Data from Database for ML
  │
  ▼
Data Preprocessing
  ├─ Convert Labels to Numbers
  └─ Split Train/Test
  │
  ▼
Train Multiple ML Models
  ├─ Logistic Regression
  ├─ Decision Tree
  └─ Random Forest
  │
  ▼
Evaluate Model Accuracy
  │
  ▼
Select Best Model
  │
  ▼
Save Model (student_model_v1.pkl)
  │
  ▼
New Student Data Input
  │
  ▼
Load Saved Model
  │
  ▼
Predict Student Performance
  │
  ▼
Store Prediction in Database
  │
  ▼
END (System Ready for Next Student)
