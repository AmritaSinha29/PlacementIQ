import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
import mlflow

def main():
    print("Starting baseline training...")
    # Placeholder for actual data loading
    # df = pd.read_csv('../data/processed/students.csv')
    
    # Dummy data generation for testing environment
    df = pd.DataFrame({
        'cgpa': [8.5, 7.2, 9.1, 6.5, 7.8],
        'internships': [2, 0, 3, 0, 1],
        'placement_within_6m': [1, 0, 1, 0, 1]
    })
    
    X = df[['cgpa', 'internships']]
    y = df['placement_within_6m']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Initialize MLflow run
    mlflow.set_experiment("PlacementIQ_Baseline")
    with mlflow.start_run():
        model = XGBClassifier(eval_metric='logloss')
        model.fit(X_train, y_train)
        
        accuracy = model.score(X_test, y_test)
        print(f"Baseline Accuracy: {accuracy}")
        
        mlflow.log_metric("accuracy", accuracy)
        mlflow.xgboost.log_model(model, "model")

if __name__ == "__main__":
    main()
