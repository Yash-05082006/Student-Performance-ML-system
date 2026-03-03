
# Data Preprocessing Module

import sqlite3
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

def load_and_preprocess_data(db_path="students.db"):
    """
    Loads student data from SQLite database,
    encodes labels, and splits into train/test sets.
    """

   
    # Load data from SQLite
    
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("SELECT * FROM student_records", conn)
    conn.close()

   
    # Encode target labels
    # ML models need numbers, not text
    
    label_encoder = LabelEncoder()
    df["final_performance"] = label_encoder.fit_transform(df["final_performance"])

    
    # Separate features and target
    
    X = df.drop("final_performance", axis=1)
    y = df["final_performance"]

    
    # Train-test split (80-20)
   
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    return X, y, X_train, X_test, y_train, y_test, label_encoder