import os
import requests
from fastapi import UploadFile
from typing import Dict, Any

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
    """Uses Llama 3.1 to grade the answer for confidence, clarity, and tech accuracy."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")
        
    prompt = f"""
    You are an expert technical interviewer for a top-tier software company.
    The candidate was asked the following question: "{question}"
    
    The candidate's transcribed spoken answer is: "{transcript}"
    
    Analyze the candidate's answer and evaluate the following:
    1. 'confidence_score' (1-100): How confident and direct did they sound (ignoring typical speech disfluencies, but penalizing heavy rambling or uncertainty).
    2. 'clarity_score' (1-100): How clear and structured was the answer?
    3. 'tech_accuracy_score' (1-100): Did they actually answer the technical question correctly?
    4. 'feedback': Constructive criticism (2-3 sentences max).
    5. 'next_question': Generate the next logical technical interview question to ask them, scaling difficulty based on how well they answered.
    
    Output STRICTLY in JSON format:
    {{
        "confidence_score": int,
        "clarity_score": int,
        "tech_accuracy_score": int,
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
    return json.loads(response.json()['choices'][0]['message']['content'])
