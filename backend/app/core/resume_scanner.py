import os
import sys
import json
import re
import logging
import joblib
import pandas as pd
from typing import Dict, Any
import requests
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ── Model Loading ─────────────────────────────────────────────────────
# Try ensemble first, fall back to single LightGBM for backward compat.
ML_MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../ml_engine/models")
ENSEMBLE_PATH = os.path.join(ML_MODELS_DIR, "salary_ensemble_model.pkl")
LGB_PATH = os.path.join(ML_MODELS_DIR, "salary_lgb_model.pkl")

# train_ensemble.py is not a proper package (no ml_engine/__init__.py), and the
# EnsembleRegressor pickle was saved as a plain module-level class, so the
# module must be importable as top-level `train_ensemble` for unpickling to work.
if ML_MODELS_DIR not in sys.path:
    sys.path.insert(0, ML_MODELS_DIR)

_ensemble = None
_lgb_model = None
_use_ensemble = False


def get_model():
    """Load the best available model: ensemble or single LightGBM."""
    global _ensemble, _lgb_model, _use_ensemble

    if _ensemble is not None or _lgb_model is not None:
        return _ensemble if _use_ensemble else _lgb_model

    # Try ensemble first
    if os.path.exists(ENSEMBLE_PATH):
        try:
            from train_ensemble import EnsembleRegressor
            _ensemble = EnsembleRegressor.load(ENSEMBLE_PATH)
            _use_ensemble = True
            logging.info("Loaded ensemble model (LGB+XGB+CatBoost)")
            return _ensemble
        except Exception as e:
            logging.warning(f"Failed to load ensemble model: {e}")

    # Fall back to single LightGBM
    if os.path.exists(LGB_PATH):
        try:
            _lgb_model = joblib.load(LGB_PATH)
            _use_ensemble = False
            logging.info("Loaded single LightGBM model (fallback)")
            return _lgb_model
        except Exception as e:
            logging.error(f"Failed to load LightGBM model: {e}")

    return None


def _is_groq_key_valid() -> bool:
    """Check if the Groq API key is present and not a placeholder."""
    return bool(GROQ_API_KEY) and GROQ_API_KEY not in ("your_groq_api_key_here", "")


def _extract_features_via_keywords(resume_text: str) -> Dict[str, Any]:
    """
    Fallback keyword-based classifier when no Groq API key is available.
    Scans the resume text for known keywords to classify into the model's categories.
    This allows the full PDF -> LightGBM pipeline to work completely offline.
    """
    text = resume_text.lower()

    # --- Institute Tier ---
    if any(k in text for k in ["iit ", "iit-", "iit b", "iit d", "iit m", "iit k"]):
        institute_tier = "Tier 1a (IIT Top 5)"
    elif any(k in text for k in ["bits ", "bits pilani", "isi"]):
        institute_tier = "Tier 1b (Other IITs/BITS)"
    elif any(k in text for k in ["nit trichy", "nit warangal", "nit surathkal", "mnnit"]):
        institute_tier = "Tier 2a (Top NITs)"
    elif any(k in text for k in ["nit ", "nit-", "iiit", "dtu", "nsut", "anna university", "anna"]):
        institute_tier = "Tier 2b (Other NITs/IIITs)"
    elif any(k in text for k in ["jadavpur", "vit", "manipal", "srm", "coep"]):
        institute_tier = "Tier 3a (Good State/Private)"
    elif any(k in text for k in ["university", "state university", "engineering college"]):
        institute_tier = "Tier 3b (Average State)"
    else:
        institute_tier = "Tier 4a (Average Private)"

    # --- CGPA ---
    cgpa_match = re.search(r'(?:cgpa|gpa|cpi)[:\s]*(\d+\.?\d*)', text)
    cgpa = float(cgpa_match.group(1)) if cgpa_match else 7.0
    if cgpa > 10:
        cgpa = cgpa / 10.0  # Handle percentage-style GPAs

    # --- Project Level ---
    if any(k in text for k in ["research", "patent", "publication", "ieee", "arxiv"]):
        project = "Novel Research/Patents"
    elif any(k in text for k in ["distributed", "microservice", "kubernetes", "kafka"]):
        project = "Enterprise Distributed Systems"
    elif any(k in text for k in ["machine learning", "deep learning", "nlp", "data pipeline", "tensorflow", "pytorch"]):
        project = "AI/ML/Data Pipelines"
    elif any(k in text for k in ["aws", "azure", "gcp", "docker", "ci/cd", "devops", "cloud"]):
        project = "Advanced Cloud/DevOps"
    elif any(k in text for k in ["fullstack", "full stack", "react", "next.js", "angular", "mern", "mean"]):
        project = "Intermediate Fullstack"
    elif any(k in text for k in ["crud", "web app", "website", "html", "flask", "django"]):
        project = "Simple CRUD/Web App"
    elif any(k in text for k in ["script", "python", "automation"]):
        project = "Basic Scripts/CLI Tools"
    else:
        project = "None"

    # --- Internship Level ---
    if any(k in text for k in ["google", "microsoft", "amazon", "meta", "apple", "faang", "goldman", "citadel", "quant"]):
        internship = "FAANG HQ/Quant/HFT"
    elif any(k in text for k in ["ms idc", "google india", "amazon india", "atlassian", "uber"]):
        internship = "Big Tech India (MS IDC/Google/Amazon)"
    elif any(k in text for k in ["unicorn", "razorpay", "cred", "zerodha", "swiggy", "zomato", "phonepe"]):
        internship = "Indian Unicorn (Razorpay/CRED/Swiggy)"
    elif any(k in text for k in ["fortune 500", "tcs", "infosys", "wipro", "cognizant", "hcl"]):
        internship = "Service Company (TCS/Infosys/Wipro)"
    elif any(k in text for k in ["series a", "series b", "startup", "funded"]):
        internship = "Product Startup (Series A/B)"
    elif any(k in text for k in ["internship", "intern"]):
        internship = "Mid-size Product Company"
    elif any(k in text for k in ["unpaid", "volunteer"]):
        internship = "Unpaid/College Project"
    else:
        internship = "None"

    # --- Hackathon Level ---
    if any(k in text for k in ["international", "global winner", "mlh grand"]):
        hackathon = "International/Global Winner"
    elif any(k in text for k in ["national winner", "smart india hackathon winner", "won national"]):
        hackathon = "National Level Winner"
    elif any(k in text for k in ["national", "smart india", "sih"]):
        hackathon = "National Level Participant"
    elif any(k in text for k in ["hackathon winner", "won hackathon", "1st prize", "first prize"]):
        hackathon = "College Level Winner"
    elif any(k in text for k in ["hackathon", "participated"]):
        hackathon = "College Level Participant"
    else:
        hackathon = "None"

    # --- Coding Level ---
    if any(k in text for k in ["icpc", "ioi", "global rank", "world finalist"]):
        coding = "Elite (ICPC/IOI/Global Ranker)"
    elif any(k in text for k in ["top 2%", "codeforces master", "5 star", "knight", "candidate master"]):
        coding = "Master (Top 2%, CF Master)"
    elif any(k in text for k in ["expert", "top 5%", "500+"]):
        coding = "Expert (500+, Top 5%)"
    elif any(k in text for k in ["top 10%", "300+ problems", "leetcode", "codeforces", "codechef"]):
        coding = "Advanced (300-500, Top 10%)"
    elif any(k in text for k in ["100+", "competitive programming", "hackerrank"]):
        coding = "Intermediate (100-300 problems)"
    else:
        coding = "Beginner (0-50 Easy)"

    # --- Domain ---
    if any(k in text for k in ["data science", "machine learning", "ai", "artificial intelligence"]):
        domain = "Data Science/AI Specialization"
    elif any(k in text for k in ["electronics", "ece", "vlsi"]):
        domain = "Electronics/ECE"
    else:
        domain = "Computer Science/IT"

    # --- Certifications ---
    if any(k in text for k in ["aws certified", "gcp certified", "azure certified"]):
        certifications = "Advanced Cloud (AWS/GCP/Azure Certified)"
    elif any(k in text for k in ["coursera", "udemy"]):
        certifications = "Basic Online (Coursera/Udemy)"
    else:
        certifications = "None"

    return {
        "institute_tier": institute_tier,
        "cgpa": round(min(10.0, max(0.0, cgpa)), 2),
        "highest_project_level": project,
        "highest_internship_level": internship,
        "highest_hackathon_level": hackathon,
        "coding_level": coding,
        "domain": domain,
        "certifications": certifications,
        "college_avg_package_lpa": 8.0,   # Default sensible baseline
        "placement_rate_pct": 75.0,       # Default sensible baseline
        "num_internships": 1 if internship != "None" else 0,
        "backlogs": 0
    }


def extract_features_from_resume(resume_text: str) -> Dict[str, Any]:
    """
    Extracts structured categorical features from resume text.
    Uses Groq LLM when API key is available, falls back to keyword classifier otherwise.
    """
    if not _is_groq_key_valid():
        logging.warning("GROQ_API_KEY not set — using keyword-based feature extraction (offline mode).")
        return _extract_features_via_keywords(resume_text)

    prompt = f"""
    You are an expert technical recruiter AI. Analyze the provided resume and classify the student's background into the EXACT specific categorical strings provided below.
    Do NOT invent your own categories. You must pick the one that best applies.
    
    Categories to pick from:
    1. institute_tier: 'Tier 1a (IIT Top 5)', 'Tier 1b (Other IITs/BITS)', 'Tier 2a (Top NITs)', 'Tier 2b (Other NITs/IIITs)', 'Tier 3a (Good State/Private)', 'Tier 3b (Average State)', 'Tier 4a (Average Private)', 'Tier 4b (Unknown/Unranked)'
    2. highest_project_level: 'None', 'Academic Assignments Only', 'Basic Scripts/CLI Tools', 'Simple CRUD/Web App', 'Mobile App (Flutter/React Native)', 'Intermediate Fullstack', 'Advanced Cloud/DevOps', 'AI/ML/Data Pipelines', 'Blockchain/Web3/IoT', 'Enterprise Distributed Systems', 'Novel Research/Patents'
    3. highest_internship_level: 'None', 'Unpaid/College Project', 'Local Startup (<50 emp)', 'Service Company (TCS/Infosys/Wipro)', 'Mid-size Product Company', 'Product Startup (Series A/B)', 'Fortune 500 Non-Tech', 'Indian Unicorn (Razorpay/CRED/Swiggy)', 'Big Tech India (MS IDC/Google/Amazon)', 'FAANG HQ/Quant/HFT'
    4. highest_hackathon_level: 'None', 'College Level Participant', 'College Level Winner', 'Inter-College/Regional Participant', 'Inter-College/Regional Winner', 'National Level Participant', 'National Level Winner', 'International/Global Winner'
    5. coding_level: 'Beginner (0-50 Easy)', 'Novice (50-100 Mixed)', 'Intermediate (100-300 problems)', 'Advanced (300-500, Top 10%)', 'Expert (500+, Top 5%)', 'Master (Top 2%, CF Master)', 'Elite (ICPC/IOI/Global Ranker)'
    6. domain: 'Computer Science/IT', 'Data Science/AI Specialization', 'Electronics/ECE', 'Electrical/EEE', 'Mechanical', 'Civil', 'Chemical/Biotech', 'Other Engineering'
    7. certifications: 'None', 'Basic Online (Coursera/Udemy)', 'Intermediate (Specialization/Nanodegree)', 'Advanced Cloud (AWS/GCP/Azure Certified)', 'Multiple Certifications', 'Specialized (GATE Qualified/CFA)'
    
    If you cannot find evidence for a category, pick the lowest appropriate tier (e.g., 'None' or 'Tier 4b (Unknown/Unranked)').
    
    Also extract the following numeric fields:
    - cgpa: float (e.g. 8.5). If not found, default to 7.0.
    - college_avg_package_lpa: float (estimate from 3.0 to 25.0 based on college tier). Default to 8.0.
    - placement_rate_pct: float (estimate from 30.0 to 100.0 based on college tier). Default to 75.0.
    - num_internships: int (count the total number of internships mentioned). Default to 0.
    - backlogs: int (count the number of active backlogs, usually 0). Default to 0.
    
    Output strictly in JSON format matching this schema:
    {{
        "institute_tier": string,
        "cgpa": float,
        "highest_project_level": string,
        "highest_internship_level": string,
        "highest_hackathon_level": string,
        "coding_level": string,
        "domain": string,
        "certifications": string,
        "college_avg_package_lpa": float,
        "placement_rate_pct": float,
        "num_internships": int,
        "backlogs": int
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

    try:
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload, timeout=30)
        if response.status_code != 200:
            logging.error(f"Groq API Error ({response.status_code}): {response.text}")
            logging.warning("Falling back to keyword-based extraction.")
            return _extract_features_via_keywords(resume_text)

        result_text = response.json()['choices'][0]['message']['content']
        return json.loads(result_text)
    except Exception as e:
        logging.error(f"Groq API call failed: {e}. Falling back to keyword extraction.")
        return _extract_features_via_keywords(resume_text)


def scan_resume_and_predict(resume_text: str) -> Dict[str, Any]:
    """
    End-to-end pipeline: Parse resume -> Classify Features -> Predict Salary.

    Now supports:
    - Ensemble model (LGB+XGB+CatBoost) with fallback to single LGB
    - SHAP explainability per prediction
    - Confidence intervals from model disagreement
    - Interaction features (tier×coding, tier×internship)
    """
    # 1. Extract and Classify Features (LLM or keyword fallback)
    features = extract_features_from_resume(resume_text)

    # 2. Prepare DataFrame
    feature_cols = [
        'institute_tier', 'highest_project_level', 'highest_internship_level',
        'highest_hackathon_level', 'coding_level', 'domain', 'certifications',
        'cgpa', 'college_avg_package_lpa', 'placement_rate_pct',
        'num_internships', 'backlogs'
    ]

    # Fill missing fields with sensible defaults
    defaults = {
        'institute_tier': 'Tier 4b (Unknown/Unranked)',
        'highest_project_level': 'None',
        'highest_internship_level': 'None',
        'highest_hackathon_level': 'None',
        'coding_level': 'Beginner (0-50 Easy)',
        'domain': 'Computer Science/IT',
        'certifications': 'None',
        'cgpa': 7.0,
        'college_avg_package_lpa': 8.0,
        'placement_rate_pct': 75.0,
        'num_internships': 0,
        'backlogs': 0
    }
    
    for col in feature_cols:
        if col not in features:
            features[col] = defaults[col]

    df = pd.DataFrame([features])[feature_cols]

    # Add interaction features (required by ensemble)
    tier_order = {
        "Tier 1a (IIT Top 5)": 8, "Tier 1b (Other IITs/BITS)": 7,
        "Tier 2a (Top NITs)": 6, "Tier 2b (Other NITs/IIITs)": 5,
        "Tier 3a (Good State/Private)": 4, "Tier 3b (Average State)": 3,
        "Tier 4a (Average Private)": 2, "Tier 4b (Unknown/Unranked)": 1,
    }
    coding_order = {
        "Beginner (0-50 Easy)": 1, "Novice (50-100 Mixed)": 2,
        "Intermediate (100-300 problems)": 3, "Advanced (300-500, Top 10%)": 4,
        "Expert (500+, Top 5%)": 5, "Master (Top 2%, CF Master)": 6,
        "Elite (ICPC/IOI/Global Ranker)": 7,
    }
    internship_order = {
        "None": 0, "Unpaid/College Project": 1, "Local Startup (<50 emp)": 2,
        "Service Company (TCS/Infosys/Wipro)": 3, "Mid-size Product Company": 4,
        "Product Startup (Series A/B)": 5, "Fortune 500 Non-Tech": 6,
        "Indian Unicorn (Razorpay/CRED/Swiggy)": 7,
        "Big Tech India (MS IDC/Google/Amazon)": 8,
        "FAANG HQ/Quant/HFT": 9,
    }
    df["tier_x_coding"] = df["institute_tier"].map(tier_order).fillna(1) * df["coding_level"].map(coding_order).fillna(1)
    df["tier_x_internship"] = df["institute_tier"].map(tier_order).fillna(1) * df["highest_internship_level"].map(internship_order).fillna(0)
    df["academic_strength"] = df["cgpa"] * df["college_avg_package_lpa"]

    # Convert string columns to categorical
    categorical_cols = [
        'institute_tier', 'highest_project_level', 'highest_internship_level',
        'highest_hackathon_level', 'coding_level', 'domain', 'certifications'
    ]
    for col in categorical_cols:
        df[col] = df[col].astype('category')

    # 3. Predict Salary
    model = get_model()
    if not model:
        raise Exception("No salary model could be loaded. Please train the model first.")

    if _use_ensemble:
        # Ensemble prediction with SHAP and CI
        predicted_salary = float(model.predict(df)[0])
        
        # SHAP breakdown
        try:
            shap_breakdown = model.explain_single(df)
        except Exception:
            shap_breakdown = {}

        # Confidence interval
        try:
            lower, upper = model.get_confidence_interval(df)
            confidence_interval = [round(float(lower[0]), 2), round(float(upper[0]), 2)]
        except Exception:
            confidence_interval = [round(predicted_salary * 0.8, 2), round(predicted_salary * 1.2, 2)]

        # Model agreement (std of individual predictions / mean)
        try:
            import numpy as np
            individual_preds = []
            for name, m in model.models.items():
                if name == "lgb":
                    individual_preds.append(float(m.predict(df, num_iteration=m.best_iteration)[0]))
                elif name == "cat":
                    individual_preds.append(float(m.predict(df)[0]))
            if individual_preds:
                agreement = 1.0 - (np.std(individual_preds) / np.mean(individual_preds))
                agreement = round(max(0, min(1, agreement)), 3)
            else:
                agreement = 0.9
        except Exception:
            agreement = 0.9

        return {
            "extracted_classifications": features,
            "predicted_salary_lpa": round(predicted_salary, 2),
            "confidence_interval": confidence_interval,
            "shap_breakdown": shap_breakdown,
            "model_agreement": agreement,
            "model_type": "ensemble_lgb_xgb_cat",
        }
    else:
        # Single LightGBM fallback (backward compatible)
        # Only use the original feature columns (no interaction features)
        df_lgb = df[feature_cols].copy()
        for col in categorical_cols:
            df_lgb[col] = df_lgb[col].astype('category')
        predicted_salary = float(model.predict(df_lgb)[0])

        return {
            "extracted_classifications": features,
            "predicted_salary_lpa": round(predicted_salary, 2),
            "model_type": "lightgbm_single",
        }
