import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import os
import joblib

def train_salary_regressor(data_path="../data/categorical_salary_data.csv", model_output_path="salary_lgb_model.pkl"):
    """
    Trains a LightGBM Regressor using the new highly categorized features.
    """
    if not os.path.exists(data_path):
        print(f"Dataset not found at {data_path}. Please run generate_salary_dataset.py first.")
        return
        
    print(f"Loading dataset from {data_path}...")
    df = pd.DataFrame(pd.read_csv(data_path))
    
    # Convert string columns to pandas 'category' type
    categorical_cols = [
        'institute_tier', 'highest_project_level', 
        'highest_internship_level', 'highest_hackathon_level', 'coding_level'
    ]
    for col in categorical_cols:
        df[col] = df[col].astype('category')
    
    # Features and Target
    X = df.drop(columns=['salary_lpa'])
    y = df['salary_lpa']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # LightGBM Dataset
    train_data = lgb.Dataset(X_train, label=y_train)
    test_data = lgb.Dataset(X_test, label=y_test, reference=train_data)
    
    params = {
        'objective': 'regression',
        'metric': 'rmse',
        'boosting_type': 'gbdt',
        'learning_rate': 0.05,
        'num_leaves': 63,
        'max_depth': -1,
        'feature_fraction': 0.9,
        'verbose': -1
    }
    
    print("Training LightGBM Salary Regressor on Categorical Tech Records...")
    model = lgb.train(
        params,
        train_data,
        num_boost_round=1000,
        valid_sets=[train_data, test_data],
        callbacks=[lgb.early_stopping(stopping_rounds=50)]
    )
    
    # Evaluation
    y_pred = model.predict(X_test, num_iteration=model.best_iteration)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print("\n--- Final Categorical Model Performance ---")
    print(f"RMSE: {rmse:.2f} LPA")
    print(f"MAE:  {mae:.2f} LPA")
    print(f"R2:   {r2:.4f}")
    
    # Save Model
    joblib.dump(model, model_output_path)
    print(f"\nModel saved to {model_output_path}")
    
    # Feature Importance
    importance = model.feature_importance(importance_type='gain')
    feature_names = X.columns
    fi_df = pd.DataFrame({'feature': feature_names, 'importance': importance})
    fi_df = fi_df.sort_values(by='importance', ascending=False)
    print("\nTop Categorical Features driving salary:")
    print(fi_df)

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    train_salary_regressor()
