import pandas as pd
import numpy as np
import os

def generate_salary_dataset(num_samples=5000, output_path="synthetic_salary_data.csv"):
    """
    Generates a recommended synthetic dataset for the LightGBM Salary Prediction Regressor.
    Features include:
    - cgpa: 5.0 to 10.0
    - internships: 0 to 5
    - tier: 1, 2, or 3
    - sector_demand_index: Macro-economic signal (0.5 to 1.5)
    - coding_score: 0 to 100
    - communication_score: 0 to 100
    
    Target:
    - starting_salary_lpa: Calculated based on weighted features + noise
    """
    np.random.seed(42)
    
    # Generate features
    cgpa = np.random.normal(7.5, 1.2, num_samples).clip(5.0, 10.0)
    internships = np.random.poisson(1.5, num_samples).clip(0, 5)
    tier = np.random.choice([1, 2, 3], num_samples, p=[0.1, 0.4, 0.5])
    sector_demand_index = np.random.normal(1.0, 0.2, num_samples).clip(0.5, 1.5)
    coding_score = np.random.normal(70, 15, num_samples).clip(0, 100)
    comm_score = np.random.normal(65, 15, num_samples).clip(0, 100)
    
    # Calculate target (Salary in LPA - Lakhs Per Annum)
    # Base salary depends heavily on Tier
    base_salary = np.where(tier == 1, 12.0, np.where(tier == 2, 6.0, 3.5))
    
    # Modifiers
    cgpa_mod = (cgpa - 7.0) * 0.5
    internship_mod = internships * 0.8
    coding_mod = (coding_score - 50) * 0.05
    comm_mod = (comm_score - 50) * 0.03
    macro_mod = sector_demand_index * 1.2
    
    # Noise
    noise = np.random.normal(0, 1.5, num_samples)
    
    salary = base_salary + cgpa_mod + internship_mod + coding_mod + comm_mod * macro_mod + noise
    salary = np.maximum(salary, 2.5) # Minimum salary threshold
    
    df = pd.DataFrame({
        'cgpa': round(pd.Series(cgpa), 2),
        'internships': internships,
        'tier': tier,
        'sector_demand_index': round(pd.Series(sector_demand_index), 2),
        'coding_score': round(pd.Series(coding_score), 1),
        'communication_score': round(pd.Series(comm_score), 1),
        'starting_salary_lpa': round(pd.Series(salary), 2)
    })
    
    df.to_csv(output_path, index=False)
    print(f"Generated {num_samples} records and saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_salary_dataset()
