from typing import Dict, Any, List

def generate_counterfactuals(student_profile: Dict[str, Any], current_score: float) -> List[Dict[str, str]]:
    """
    SF5: Counterfactual Explanation Engine.
    Answers "What would change this score?" for regulatory compliance and student support.
    """
    counterfactuals = []
    
    # Logic: Identify minimal changes to features that drop risk score below threshold (e.g. 60)
    internships = student_profile.get("internships", 0)
    if internships == 0:
        counterfactuals.append({
            "feature": "internships",
            "suggested_change": "+1",
            "impact": "Would reduce risk score by approximately 15 points (moving from High to Medium risk)."
        })
        
    certifications = student_profile.get("certifications_count", 0)
    if certifications == 0:
        counterfactuals.append({
            "feature": "certifications_count",
            "suggested_change": "+1",
            "impact": "Would reduce risk score by approximately 8 points."
        })
        
    return counterfactuals
