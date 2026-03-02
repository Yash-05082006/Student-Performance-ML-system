# 🎓 Student Academic Performance Prediction System

## 📌 Problem Statement
Universities often struggle to identify students who may be at academic risk early enough for effective intervention. Academic performance depends on multiple factors such as attendance, internal assessments, assignments, and engagement. Manual tracking of these patterns is difficult and time-consuming.

## 🎯 Project Goal
This project aims to build a **machine learning–powered system** that predicts a student's final academic performance (High / Medium / Low) using key academic indicators. The system also provides a dashboard for analyzing trends and making real-time predictions.

---

## 🧠 System Overview

This system consists of:

1. **Data Generation & Storage** – Student academic records stored in an SQL database  
2. **Model Training Pipeline** – Traditional ML models trained on academic features  
3. **Prediction System** – Uses trained model to predict student performance  
4. **Dashboard/UI** – Visualizes data trends and allows interactive predictions  

---

## 🛠 Tech Stack

| Component | Technology |
|----------|------------|
| Programming Language | Python |
| Database | SQLite |
| ML Libraries | Scikit-learn, Pandas, NumPy |
| Model Serialization | Joblib |
| Dashboard | React + TypeScript (Vite) |
| Charts | Recharts |
| Version Control | Git & GitHub |

---


```markdown

## Pipeline

```mermaid
flowchart TD

A[Start] --> B[Generate Synthetic Data\nPython Script]
B --> C[Save CSV student_data]
C --> D[Store Data SQLite students_db]
D --> E[Load Data for ML]

E --> F[Preprocessing Module]
F --> F1[Encode Labels High Medium Low to 0 1 2]
F --> F2[Stratified Train Test Split]

F1 --> G
F2 --> G

G[Train ML Models]

G --> H1[Logistic Regression]
G --> H2[Decision Tree]
G --> H3[Random Forest]
G --> H4[KNN]
G --> H5[SVM]
G --> H6[Gradient Boosting]

H1 --> I[Evaluate Macro F1 Cross Validation]
H2 --> I
H3 --> I
H4 --> I
H5 --> I
H6 --> I

I --> J[Select Best Model CV F1]

J --> K[Save Model student_model_v1]
K --> L[New Student Input Dashboard]
L --> M[Load Saved Model]
M --> N[Predict Performance]
N --> O[Store Prediction Database]
O --> P[End]
```

## 📁 Project Folder Structure


project/
│
├── data_generator/ # Scripts to generate synthetic student data
├── database/ # Scripts to create and manage SQLite DB
├── scripts/ # Utility & testing scripts
├── models/ # Saved trained ML models (.pkl)
├── dashboard/ # React frontend dashboard
└── README.md

## Data Pipeline

Student data is generated using a Python script

Data is stored in a SQLite database

The ML model is trained using this database

The trained model is saved for future predictions

New prediction inputs can be added to the database for future retraining

 ## Model Lifecycle

Initial model is trained on historical academic data

New student prediction records can be stored

Model can be periodically retrained with updated data

Versioned models can be maintained for comparison

 ## Dashboard Features

Overview statistics (total students, average scores, performance distribution)

Scatter plots and performance analytics

Interactive student performance prediction form

Model information and performance metrics display


---

## 🔄 System Workflow

```mermaid
flowchart LR
A[Student Data Generation] --> B[SQLite Database]
B --> C[Model Training Pipeline]
C --> D[Trained ML Model PKL]
D --> E[Prediction Module]
E --> F[Dashboard Visualizations]
```


## 📊 Data Visualizations

**These visualizations are generated from the student dataset and help in understanding performance patterns and relationships between different academic factors.**

### Performance Distribution
![Performance Distribution](Visualizations/images/performance_distribution.png)

This chart shows how students are distributed across the three performance categories:

High Performance

Medium Performance

Low Performance

It helps quickly understand the overall academic standing of the student population.

### Attendance vs Internal Score
![Attendance vs Internal Score](Visualizations/images/attendance_vs_score.png)

This scatter plot visualizes the relationship between attendance percentage and internal test scores.

Each point represents a student

Helps identify trends between classroom presence and academic performance

Useful for spotting students at academic risk

### Feature Correlation Heatmap
![Feature Correlation Heatmap](Visualizations/images/correlation_heatmap_copy.png)

This heatmap shows the correlation between all major academic features used in the model:

Attendance

Internal Score

Assignment Score

Backlogs

Engagement

Darker shades indicate stronger relationships (positive or negative).
This helps understand how different academic factors influence each other.