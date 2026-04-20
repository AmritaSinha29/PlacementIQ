import pandas as pd
import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

def train_custom_interview_model(data_path="../data/interview_qa_dataset.csv", model_output_path="custom_interview_nlp_model.pkl"):
    if not os.path.exists(data_path):
        print(f"Dataset not found at {data_path}.")
        return
        
    print(f"Loading custom interview data from {data_path}...")
    df = pd.read_csv(data_path)
    
    # We will combine question and answer as the input text
    X = df['question'] + " [SEP] " + df['answer']
    y = df[['tech_accuracy', 'confidence']]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Building NLP Pipeline (TF-IDF + MultiOutput RandomForest)...")
    # A specialized NLP pipeline specifically for grading text responses
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=1000, stop_words='english')),
        ('regressor', MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42)))
    ])
    
    print("Training custom model...")
    pipeline.fit(X_train, y_train)
    
    import numpy as np
    y_pred = pipeline.predict(X_test)
    rmse_tech = np.sqrt(mean_squared_error(y_test['tech_accuracy'], y_pred[:, 0]))
    rmse_conf = np.sqrt(mean_squared_error(y_test['confidence'], y_pred[:, 1]))
    
    print("\n--- Custom Model Evaluation ---")
    print(f"Tech Accuracy RMSE: {rmse_tech:.2f}")
    print(f"Confidence RMSE: {rmse_conf:.2f}")
    
    joblib.dump(pipeline, model_output_path)
    print(f"\nUnique Interview Model saved to {model_output_path}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    train_custom_interview_model()
