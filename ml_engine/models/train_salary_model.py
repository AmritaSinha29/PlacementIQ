import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import os
import joblib

def train_salary_regressor(data_path="../data/Placement_Data_Full_Class.csv", model_output_path="salary_lgb_model.pkl"):
    """
    Trains a LightGBM Regressor to predict starting salary based on the Kaggle Campus Recruitment Dataset.
    """
    if not os.path.exists(data_path):
        print(f"Dataset not found at {data_path}. Please download and place the CSV.")
        return
        
    df = pd.DataFrame(pd.read_csv(data_path))
    
    # Preprocessing for the Kaggle Dataset
    # 1. We only want to predict salary for students who were placed, 
    #    so we filter out the non-placed students (who have NaN salary)
    df = df[df['status'] == 'Placed'].copy()
    
    # 2. Convert raw salary to LPA (Lakhs Per Annum) to match the dashboard's expectation
    df['starting_salary_lpa'] = df['salary'] / 100000.0
    
    # 3. Drop columns that are irrelevant (sl_no, status, and raw salary)
    df = df.drop(columns=['sl_no', 'status', 'salary'])
    
    # 4. Convert all string/object columns to pandas 'category' type for LightGBM
    categorical_cols = df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        df[col] = df[col].astype('category')
        
    # Features and Target
    X = df.drop(columns=['starting_salary_lpa'])
    y = df['starting_salary_lpa']
    
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
        'num_leaves': 31,
        'max_depth': -1,
        'feature_fraction': 0.8,
        'verbose': -1 # Suppress warnings
    }
    
    print("Training LightGBM Salary Regressor on Real Kaggle Data...")
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
    print("\nTop Features driving salary:")
    print(fi_df.head(7))

if __name__ == "__main__":
    # Move to the current directory of the script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    train_salary_regressor()
