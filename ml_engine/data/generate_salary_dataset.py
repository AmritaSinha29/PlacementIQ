import pandas as pd
import numpy as np
import os

def generate_categorical_salary_dataset(num_samples=100000, output_path="categorical_salary_data.csv"):
    """
    Generates a realistic 100k dataset where tech factors are highly granular categorical levels
    based on complexity, domain, and stack (as requested).
    """
    np.random.seed(42)
    print(f"Generating {num_samples} categorical records...")
    
    # Categories
    institute_tiers = ['Tier 4 (Local)', 'Tier 3 (State)', 'Tier 2 (NIT/IIIT)', 'Tier 1 (IIT/BITS)']
    project_tiers = [
        'None', 
        'Basic Scripts/CLI', 
        'Simple CRUD/Web', 
        'Intermediate Fullstack', 
        'Advanced Cloud/DevOps', 
        'AI/ML/Data Pipelines', 
        'Enterprise Distributed Systems', 
        'Novel Research/Patents'
    ]
    internship_tiers = [
        'None',
        'Unpaid/Local Startup',
        'Mid-size Agency',
        'Series A/B Startup',
        'Fortune 500 Non-Tech',
        'Unicorn Tech Startup',
        'FAANG/Big Tech/HFT'
    ]
    hackathon_tiers = [
        'None',
        'College Level Participant',
        'College Level Winner',
        'National Level Participant',
        'National Level Winner',
        'International/Global Winner'
    ]
    coding_tiers = [
        'Beginner (0-50 Easy)',
        'Novice (100+ Mixed)',
        'Intermediate (Top 10%)',
        'Advanced (Top 2%)',
        'Elite (ICPC/Global Ranker)'
    ]

    # Generate random features based on logical probabilities
    institute = np.random.choice(institute_tiers, num_samples, p=[0.4, 0.4, 0.15, 0.05])
    cgpa = np.random.normal(7.5, 1.2, num_samples).clip(5.0, 10.0)
    
    project = np.random.choice(project_tiers, num_samples, p=[0.05, 0.2, 0.3, 0.2, 0.1, 0.08, 0.05, 0.02])
    internship = np.random.choice(internship_tiers, num_samples, p=[0.2, 0.3, 0.2, 0.15, 0.08, 0.05, 0.02])
    hackathon = np.random.choice(hackathon_tiers, num_samples, p=[0.4, 0.2, 0.15, 0.15, 0.08, 0.02])
    coding = np.random.choice(coding_tiers, num_samples, p=[0.3, 0.4, 0.2, 0.08, 0.02])

    # Modifiers mapping (Base salary impact in LPA)
    institute_mod = {'Tier 4 (Local)': 3.0, 'Tier 3 (State)': 4.5, 'Tier 2 (NIT/IIIT)': 9.0, 'Tier 1 (IIT/BITS)': 16.0}
    project_mod = {
        'None': 0.0, 'Basic Scripts/CLI': 0.5, 'Simple CRUD/Web': 1.0, 
        'Intermediate Fullstack': 2.5, 'Advanced Cloud/DevOps': 4.0, 
        'AI/ML/Data Pipelines': 5.0, 'Enterprise Distributed Systems': 7.0, 
        'Novel Research/Patents': 10.0
    }
    internship_mod = {
        'None': 0.0, 'Unpaid/Local Startup': 0.5, 'Mid-size Agency': 1.5, 
        'Series A/B Startup': 3.0, 'Fortune 500 Non-Tech': 4.0, 
        'Unicorn Tech Startup': 6.0, 'FAANG/Big Tech/HFT': 12.0
    }
    hackathon_mod = {
        'None': 0.0, 'College Level Participant': 0.2, 'College Level Winner': 1.0, 
        'National Level Participant': 1.5, 'National Level Winner': 3.5, 
        'International/Global Winner': 8.0
    }
    coding_mod = {
        'Beginner (0-50 Easy)': 0.0, 'Novice (100+ Mixed)': 1.0, 
        'Intermediate (Top 10%)': 3.0, 'Advanced (Top 2%)': 7.0, 
        'Elite (ICPC/Global Ranker)': 15.0
    }

    # Vectorized lookup for salary calculation
    base_salaries = np.vectorize(institute_mod.get)(institute)
    p_mod = np.vectorize(project_mod.get)(project)
    i_mod = np.vectorize(internship_mod.get)(internship)
    h_mod = np.vectorize(hackathon_mod.get)(hackathon)
    c_mod = np.vectorize(coding_mod.get)(coding)
    cgpa_mod = (cgpa - 7.0) * 0.8
    
    # Cap total modifiers depending on base (Diminishing returns to simulate real world)
    total_mod = p_mod + i_mod + h_mod + c_mod + cgpa_mod
    
    # Real-world tech salaries are highly right-skewed (log-normal distribution)
    # Elite coders at FAANG with research get extreme multipliers.
    multiplier = np.where((coding == 'Elite (ICPC/Global Ranker)') & (internship == 'FAANG/Big Tech/HFT'), 1.8, 1.0)
    
    salary_lpa = (base_salaries + total_mod) * multiplier + np.random.normal(0, 1.5, num_samples)
    salary_lpa = np.maximum(salary_lpa, 3.0) # Absolute minimum floor is 3 LPA
    
    df = pd.DataFrame({
        'institute_tier': institute,
        'cgpa': round(pd.Series(cgpa), 2),
        'highest_project_level': project,
        'highest_internship_level': internship,
        'highest_hackathon_level': hackathon,
        'coding_level': coding,
        'salary_lpa': round(pd.Series(salary_lpa), 2)
    })
    
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Successfully generated 100k categorical records and saved to {output_path}")
    return df

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    generate_categorical_salary_dataset(100000, os.path.join(script_dir, "categorical_salary_data.csv"))
