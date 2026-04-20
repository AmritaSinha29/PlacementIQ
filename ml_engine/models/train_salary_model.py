import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import os
import joblib

def train_salary_regressor(data_path="../data/synthetic_salary_data.csv", model_output_path="salary_lgb_model.pkl"):
    """
    Trains a LightGBM Regressor to predict starting salary based on the PRD specification.
    """
    if not os.path.exists(data_path):
        print(f"Dataset not found at {data_path}. Please run generate_salary_dataset.py first.")
        return
        
    df = pd.DataFrame(pd.read_csv(data_path))
    
    X = df.drop(columns=['starting_salary_lpa'])
    y = df['starting_salary_lpa']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # LightGBM Dataset
    train_data = lgb.Dataset(X_train, label=y_train)
    test_data = lgb.Dataset(X_test, label=y_test, reference=train_data)
    
    params = {
        'objective': 'regression',
        'metric': 'rmse',
        'boosting_type': 'gbdt',
        'learning_rate': 0.05,
        'num_leaves': 31,
        'max_depth': -1,
        'feature_fraction': 0.8
    }
    
    print("Training LightGBM Salary Regressor...")
    model = lgb.train(
        params,
        train_data,
        num_boost_round=500,
        valid_sets=[train_data, test_data],
        callbacks=[lgb.early_stopping(stopping_rounds=50)]
    )
    
    # Evaluation
    y_pred = model.predict(X_test, num_iteration=model.best_iteration)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print("\n--- Model Performance ---")
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
    print("\nTop Features:")
    print(fi_df.head())

if __name__ == "__main__":
    # Move to the current directory of the script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    train_salary_regressor()
