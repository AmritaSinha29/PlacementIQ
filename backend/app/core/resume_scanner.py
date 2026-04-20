import os
import json
import joblib
import pandas as pd
from typing import Dict, Any
import requests
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

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
    """Uses Groq to extract and classify structured categorical data from a raw resume text."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")
        
    prompt = f"""
    You are an expert technical recruiter AI. Analyze the provided resume and classify the student's background into the EXACT specific categorical strings provided below.
    Do NOT invent your own categories. You must pick the one that best applies.
    
    Categories to pick from:
    1. institute_tier: 'Tier 4 (Local)', 'Tier 3 (State)', 'Tier 2 (NIT/IIIT)', 'Tier 1 (IIT/BITS)'
    2. highest_project_level: 'None', 'Basic Scripts/CLI', 'Simple CRUD/Web', 'Intermediate Fullstack', 'Advanced Cloud/DevOps', 'AI/ML/Data Pipelines', 'Enterprise Distributed Systems', 'Novel Research/Patents'
    3. highest_internship_level: 'None', 'Unpaid/Local Startup', 'Mid-size Agency', 'Series A/B Startup', 'Fortune 500 Non-Tech', 'Unicorn Tech Startup', 'FAANG/Big Tech/HFT'
    4. highest_hackathon_level: 'None', 'College Level Participant', 'College Level Winner', 'National Level Participant', 'National Level Winner', 'International/Global Winner'
    5. coding_level: 'Beginner (0-50 Easy)', 'Novice (100+ Mixed)', 'Intermediate (Top 10%)', 'Advanced (Top 2%)', 'Elite (ICPC/Global Ranker)'
    
    If you cannot find evidence for a category, pick the lowest tier (e.g., 'None' or 'Tier 3 (State)').
    Also extract the student's cgpa as a float (e.g., 8.5). If not found, default to 7.0.
    
    Output strictly in JSON format matching this schema:
    {{
        "institute_tier": string,
        "cgpa": float,
        "highest_project_level": string,
        "highest_internship_level": string,
        "highest_hackathon_level": string,
        "coding_level": string
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
            {"role": "system", "content": "You are a JSON-only API. Only return valid JSON with exact string matches."},
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
    """End-to-end pipeline: Parse resume -> Classify Features -> Predict Salary"""
    # 1. Extract and Classify Features via LLM
    features = extract_features_from_resume(resume_text)
    
    # 2. Prepare DataFrame for LightGBM
    feature_cols = [
        'institute_tier', 'cgpa', 'highest_project_level', 
        'highest_internship_level', 'highest_hackathon_level', 'coding_level'
    ]
    
    df = pd.DataFrame([features])[feature_cols]
    
    # Convert string columns to categorical for LightGBM
    for col in feature_cols:
        if col != 'cgpa':
            df[col] = df[col].astype('category')
    
    # 3. Predict Salary
    model = get_model()
    if not model:
        raise Exception("LightGBM model could not be loaded. Please ensure the model file exists.")
        
    predicted_salary = float(model.predict(df)[0])
    
    return {
        "extracted_classifications": features,
        "predicted_salary_lpa": round(predicted_salary, 2)
    }
