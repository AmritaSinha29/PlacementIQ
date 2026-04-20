import pandas as pd
import numpy as np
import os

def generate_salary_dataset(num_samples=100000, output_path="advanced_synthetic_salary_data.csv"):
    """
    Generates a massive, highly realistic dataset for the LightGBM Salary Regressor.
    Features include modern tech metrics to ensure high model accuracy.
    """
    np.random.seed(42)
    
    print(f"Generating {num_samples} records... This may take a moment.")
    
    # 1. Base Features
    tier = np.random.choice([1, 2, 3], num_samples, p=[0.1, 0.4, 0.5])
    cgpa = np.random.normal(7.5, 1.2, num_samples).clip(5.0, 10.0)
    
    # 2. Modern Tech Metrics
    leetcode_problems = np.random.exponential(150, num_samples).astype(int).clip(0, 1500)
    github_commits = np.random.exponential(300, num_samples).astype(int).clip(0, 3000)
    hackathon_wins = np.random.poisson(0.5, num_samples).clip(0, 5)
    past_internships = np.random.poisson(1.2, num_samples).clip(0, 4)
    
    # 3. Macro & Soft Skills
    communication_score = np.random.normal(70, 15, num_samples).clip(0, 100)
    sector_demand_index = np.random.normal(1.0, 0.1, num_samples).clip(0.7, 1.3)
    
    # --- SALARY CALCULATION (Highly Correlated for ~90% R2) ---
    # Base salary depends heavily on Tier
    base_salary = np.where(tier == 1, 14.0, np.where(tier == 2, 7.0, 4.0))
    
    # Modifiers
    cgpa_mod = (cgpa - 7.0) * 0.8
    leetcode_mod = (leetcode_problems / 100) * 1.5
    github_mod = (github_commits / 500) * 1.0
    hackathon_mod = hackathon_wins * 2.5
    internship_mod = past_internships * 1.8
    comm_mod = (communication_score - 50) * 0.05
    macro_mod = sector_demand_index
    
    # Add controllable noise (lower noise = higher R2)
    noise = np.random.normal(0, 1.5, num_samples)
    
    # Final Calculation
    salary_lpa = (base_salary + cgpa_mod + leetcode_mod + github_mod + hackathon_mod + internship_mod + comm_mod) * macro_mod + noise
    salary_lpa = np.maximum(salary_lpa, 3.0) # Absolute minimum floor is 3 LPA
    
    # Create DataFrame
    df = pd.DataFrame({
        'tier': tier,
        'cgpa': round(pd.Series(cgpa), 2),
        'leetcode_problems_solved': leetcode_problems,
        'github_commits_last_year': github_commits,
        'hackathon_wins': hackathon_wins,
        'past_internships': past_internships,
        'communication_score': round(pd.Series(communication_score), 1),
        'sector_demand_index': round(pd.Series(sector_demand_index), 2),
        'salary_lpa': round(pd.Series(salary_lpa), 2)
    })
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    
    df.to_csv(output_path, index=False)
    print(f"Successfully generated {num_samples} records and saved to {output_path}")
    return df

if __name__ == "__main__":
    # Ensure we save to the correct directory relative to the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    generate_salary_dataset(100000, os.path.join(script_dir, "advanced_synthetic_salary_data.csv"))
