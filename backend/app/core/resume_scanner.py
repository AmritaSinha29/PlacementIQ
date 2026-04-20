import os
import json
import joblib
import pandas as pd
from typing import Dict, Any
import requests
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Load the LightGBM model (Assuming it's mounted or accessible)
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../ml_engine/models/salary_lgb_model.pkl")
_model = None

def get_model():
    global _model
    if _model is None:
        try:
            _model = joblib.load(MODEL_PATH)
        except Exception as e:
            print(f"Failed to load LightGBM model at {MODEL_PATH}: {e}")
    return _model

def extract_features_from_resume(resume_text: str) -> Dict[str, Any]:
    """Uses Groq to extract structured data from a raw resume text."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")
        
    prompt = f"""
    You are an expert technical recruiter AI. Extract the following metrics from the provided resume.
    If a metric is not explicitly stated, estimate it reasonably based on the context, or use these defaults:
    tier: 3 (1=elite, 2=mid, 3=average), cgpa: 7.0, leetcode_problems_solved: 50, github_commits_last_year: 100, hackathon_wins: 0, past_internships: 0, projects: 1, communication_score: 70, sector_demand_index: 1.0.
    
    Output strictly in JSON format matching this schema:
    {{
        "tier": int,
        "cgpa": float,
        "leetcode_problems_solved": int,
        "github_commits_last_year": int,
        "hackathon_wins": int,
        "past_internships": int,
        "projects": int,
        "communication_score": float,
        "sector_demand_index": float
    }}
    
    Resume Text:
    {resume_text}
    """
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": "You are a JSON-only API. Only return valid JSON."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.1
    }
    
    response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Groq API Error: {response.text}")
        
    result_text = response.json()['choices'][0]['message']['content']
    return json.loads(result_text)

def scan_resume_and_predict(resume_text: str) -> Dict[str, Any]:
    """End-to-end pipeline: Parse resume -> Extract Features -> Predict Salary"""
    # 1. Extract Features
    features = extract_features_from_resume(resume_text)
    
    # 2. Prepare DataFrame for LightGBM
    # Order must match the training set exactly:
    # tier, cgpa, leetcode_problems_solved, github_commits_last_year, hackathon_wins, past_internships, projects, communication_score, sector_demand_index
    feature_cols = [
        'tier', 'cgpa', 'leetcode_problems_solved', 'github_commits_last_year', 
        'hackathon_wins', 'past_internships', 'projects', 'communication_score', 'sector_demand_index'
    ]
    
    df = pd.DataFrame([features])[feature_cols]
    
    # 3. Predict Salary
    model = get_model()
    if not model:
        raise Exception("LightGBM model could not be loaded. Please ensure the model file exists.")
        
    predicted_salary = float(model.predict(df)[0])
    
    return {
        "extracted_features": features,
        "predicted_salary_lpa": round(predicted_salary, 2)
    }
