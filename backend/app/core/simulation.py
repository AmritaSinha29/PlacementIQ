import logging
from typing import Dict, Any, List

def run_portfolio_simulation(current_portfolio: List[Dict[str, Any]], scenario: Dict[str, Any]) -> Dict[str, Any]:
    """
    SF4: Cohort Simulation & What-If Engine.
    Simulates portfolio outcomes based on macroeconomic shocks or targeted growth.
    """
    logging.info(f"Running simulation with scenario constraints: {scenario}")
    
    # 1. Parse scenario shocks
    it_hiring_drop = scenario.get("it_hiring_drop_pct", 0.0)
    new_disbursements_tier3 = scenario.get("new_disbursements_tier3", 0)
    
    # 2. Re-score existing portfolio based on shocks
    simulated_npa_count = 0
    total_loans = len(current_portfolio) + new_disbursements_tier3
    
    for student in current_portfolio:
        risk_score = student.get("base_score", 50.0)
        
        # Apply shocks
        if student.get("sector") == "IT":
            risk_score += (it_hiring_drop * 0.5) # Increase risk proportionally
            
        if risk_score > 80:
            simulated_npa_count += 1
            
    # 3. Simulate new disbursements (assume higher baseline risk for Tier 3)
    simulated_npa_count += int(new_disbursements_tier3 * 0.15) # 15% default assumption
    
    projected_npa_rate = (simulated_npa_count / total_loans) * 100 if total_loans > 0 else 0
    
    return {
        "scenario": scenario,
        "total_simulated_loans": total_loans,
        "projected_npa_rate": round(projected_npa_rate, 2),
        "impact_analysis": f"Portfolio NPA rate projected to shift to {projected_npa_rate:.2f}% under these conditions."
    }
