```mermaid
flowchart TD

  A[Start] --> B[Generate Synthetic Student Data\n(Python Script)]

  B --> C[Save as CSV\nstudent_data.csv]

  C --> D[Store Data in SQLite Database\nstudents.db]

  D --> E[Load Data from Database]
  
  E --> F[Data Preprocessing Module]

  F --> F1[Encode Labels\nHigh/Medium/Low → 0/1/2]
  F --> F2[Stratified Train-Test Split]

  F1 --> G
  F2 --> G

  G[Train Multiple ML Models]

  G --> H1[Logistic Regression\nLinear Baseline]
  G --> H2[Decision Tree\nRule-Based Model]
  G --> H3[Random Forest\nEnsemble Model]
  G --> H4[KNN\nDistance-Based Model]
  G --> H5[SVM\nMargin-Based Classifier]
  G --> H6[Gradient Boosting\nBoosting Ensemble]

  H1 --> I[Evaluate Using\nMacro F1 Score + Cross-Validation]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  H6 --> I

  I --> J[Select Best Model\nBased on CV F1 Score]

  J --> K[Save Best Model\nstudent_model_v1.pkl\n(Local Only)]

  K --> L[New Student Input\n(Dashboard / Script)]

  L --> M[Load Saved Model]

  M --> N[Predict Student Performance]

  N --> O[Store Prediction in Database]

  O --> P[End\nSystem Ready for Next Student]
  ```