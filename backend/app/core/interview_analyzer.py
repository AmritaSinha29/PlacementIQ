import os
import requests
import joblib
from fastapi import UploadFile
from typing import Dict, Any

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../ml_engine/models/custom_interview_nlp_model.pkl")

_nlp_model = None

def get_nlp_model():
    global _nlp_model
    if _nlp_model is None:
        try:
            _nlp_model = joblib.load(MODEL_PATH)
        except Exception as e:
            print(f"Could not load custom NLP model: {e}")
    return _nlp_model

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

async def transcribe_audio(audio_file: UploadFile) -> str:
    """Uses Groq's extremely fast Whisper API to transcribe the audio."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")
        
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}"
    }
    
    files = {
        "file": (audio_file.filename, await audio_file.read(), audio_file.content_type),
    }
    
    data = {
        "model": "whisper-large-v3",
        "response_format": "json"
    }
    
    response = requests.post("https://api.groq.com/openai/v1/audio/transcriptions", headers=headers, files=files, data=data)
    
    if response.status_code != 200:
        raise Exception(f"Groq Whisper Error: {response.text}")
        
    return response.json().get("text", "")

def analyze_interview_response(question: str, transcript: str) -> Dict[str, Any]:
    """Uses our custom-trained NLP Pipeline for scoring, and Llama 3.1 for next question."""
    
    # 1. Evaluate using our UNIQUELY trained Machine Learning Model
    model = get_nlp_model()
    tech_score = 0
    conf_score = 0
    if model:
        # Our model expects: "question [SEP] answer"
        input_text = [f"{question} [SEP] {transcript}"]
        preds = model.predict(input_text)[0]
        tech_score = int(preds[0])
        conf_score = int(preds[1])

    # 2. Get conversational feedback and next question using LLM
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")
        
    prompt = f"""
    The candidate was asked: "{question}"
    The candidate answered: "{transcript}"
    
    Our proprietary ML model gave them a Technical Accuracy Score of {tech_score}/100 and a Confidence Score of {conf_score}/100.
    
    Write a 2-sentence feedback explaining why they might have gotten these scores.
    Then, generate the 'next_question' based on their performance.
    
    Output strictly in JSON:
    {{
        "feedback": string,
        "next_question": string
    }}
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
        "temperature": 0.2
    }
    
    response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Groq LLM Error: {response.text}")
        
    import json
    llm_result = json.loads(response.json()['choices'][0]['message']['content'])
    
    return {
        "confidence_score": conf_score,
        "clarity_score": conf_score, # Mapping clarity to confidence for UI simplicity
        "tech_accuracy_score": tech_score,
        "feedback": llm_result.get("feedback", ""),
        "next_question": llm_result.get("next_question", "")
    }
