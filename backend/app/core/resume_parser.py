import logging
from typing import Dict, Any

def parse_resume(file_bytes: bytes) -> Dict[str, Any]:
    """
    Parses a PDF resume to extract structured features using NLP (spaCy / PyMuPDF).
    Returns a dictionary of features that can be fed directly into the ML models.
    """
    logging.info("Parsing resume bytes...")
    
    # Mocking the extraction process that would normally use PyMuPDF and spaCy NER
    extracted_features = {
        "internships_count": 2,
        "certifications": ["AWS Solutions Architect", "Data Science Bootcamp"],
        "skills": ["Python", "Machine Learning", "React", "SQL"],
        "has_leadership_role": True,
        "education_tier": "Tier 2",
        "extracted_cgpa": 8.5
    }
    
    return extracted_features
