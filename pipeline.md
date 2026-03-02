```mermaid
flowchart TD

  A[Start] --> B[Generate Synthetic Student Data<br>(Python Script)]

  B --> C[Save as CSV<br>student_data.csv]

  C --> D[Store Data in SQLite Database<br>students.db]

  D --> E[Load Data from Database]
  
E --> F[Data Preprocessing Module]

  F --> F1[Encode Labels<br>High/Medium/Low → 0/1/2]
  F --> F2[Stratified Train-Test Split]

  F1 --> G
  F2 --> G

  G[Train Multiple ML Models]

  G --> H1[Logistic Regression<br>Linear Baseline]
  G --> H2[Decision Tree<br>Rule-Based Model]
  G --> H3[Random Forest<br>Ensemble Model]
  G --> H4[KNN<br>Distance-Based Model]
  G --> H5[SVM<br>Margin-Based Classifier]
  G --> H6[Gradient Boosting<br>Boosting Ensemble]

  H1 --> I[Evaluate Using<br>Macro F1 Score + Cross-Validation]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  H6 --> I

  I --> J[Select Best Model<br>Based on CV F1 Score]

  J --> K[Save Best Model<br>student_model_v1.pkl<br>(Local Only)]

  K --> L[New Student Input<br>(Dashboard / Script)]

  L --> M[Load Saved Model]

  M --> N[Predict Student Performance]

  N --> O[Store Prediction in Database]

  O --> P[End<br>System Ready for Next Student]
```