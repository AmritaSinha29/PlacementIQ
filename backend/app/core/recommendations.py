from typing import List, Dict, Any

def get_next_best_actions(student_profile: Dict[str, Any], risk_band: str, shap_values: Dict[str, float]) -> List[Dict[str, str]]:
    """
    Generates a ranked list of interventions for a student based on their risk band and SHAP factors.
    As per PRD Feature F5.
    """
    actions = []
    
    if risk_band == "Low Risk":
        return actions # No interventions needed for low risk

    # 1. Skill-up recommendation logic
    if shap_values.get("internships", 0) < 0:
        actions.append({
            "type": "Skill-Up Recommendation",
            "priority": "High",
            "description": "Enroll in a structured cloud computing or data science certification program.",
            "rationale": "Low internship exposure is negatively impacting placement probability."
        })

    # 2. Mock interview logic
    if student_profile.get("semester", 0) >= 6:
        actions.append({
            "type": "Mock Interview Coaching",
            "priority": "High" if risk_band == "Critical" else "Medium",
            "description": "Schedule 3 mock interviews matched to the target sector.",
            "rationale": "Student is nearing graduation; interview readiness is paramount."
        })

    # 3. Resume improvement
    actions.append({
        "type": "Resume Gap Analysis",
        "priority": "Medium",
        "description": "Conduct an automated gap analysis against target job descriptions.",
        "rationale": "Standard intervention for all medium/high-risk students."
    })
    
    # 4. Lender EMI restructuring logic
    if risk_band == "Critical Risk":
        actions.append({
            "type": "EMI Restructuring Alert",
            "priority": "Critical",
            "description": "Flag to collections team for potential early restructuring discussion.",
            "rationale": "Severe employability challenges detected within 6 months of EMI start date."
        })

    return sorted(actions, key=lambda x: {"Critical": 1, "High": 2, "Medium": 3}.get(x["priority"], 4))
