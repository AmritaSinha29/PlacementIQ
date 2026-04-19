import os
import logging
from typing import Dict, Any
from groq import Groq

# Initialize Groq client using the API key from environment variables
# as specified in the PRD (Groq API — Llama 3.1 8B)
api_key = os.environ.get("GROQ_API_KEY", "")
client = Groq(api_key=api_key) if api_key else None

def generate_risk_narrative(student_profile: Dict[str, Any], shap_values: Dict[str, float]) -> str:
    """
    Generates a 2-3 sentence plain-English explanation for a student's risk score 
    using SHAP attribution output and the Groq LLM API.
    """
    if not client:
        logging.warning("GROQ_API_KEY is missing. Using fallback narrative template.")
        return _fallback_template(shap_values)

    prompt = _build_prompt(student_profile, shap_values)
    
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are PlacementIQ, an AI risk analyst. Explain the student's placement risk score in 2-3 concise, professional sentences based on the provided SHAP values. Focus on the most impactful positive and negative factors."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
            max_tokens=150,
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"Failed to generate LLM narrative: {e}")
        return _fallback_template(shap_values)

def _build_prompt(student: Dict[str, Any], shap: Dict[str, float]) -> str:
    sorted_shap = sorted(shap.items(), key=lambda x: abs(x[1]), reverse=True)
    top_factors = ", ".join([f"{k} (impact: {v:.2f})" for k, v in sorted_shap[:3]])
    
    return f"""
    Student Profile: {student.get('course', 'Unknown Course')}, CGPA Band: {student.get('cgpa_band', 'N/A')}
    Top Risk Factors (SHAP values): {top_factors}
    
    Write the 2-3 sentence explanation.
    """

def _fallback_template(shap: Dict[str, float]) -> str:
    if not shap:
        return "Risk score calculated based on baseline academic and demographic factors."
    
    sorted_shap = sorted(shap.items(), key=lambda x: abs(x[1]), reverse=True)
    primary_driver = sorted_shap[0]
    direction = "increased" if primary_driver[1] > 0 else "decreased"
    
    return f"This student's risk score is primarily driven by {primary_driver[0]}, which significantly {direction} their risk profile. Other contributing factors include baseline academic performance and current macroeconomic trends."
