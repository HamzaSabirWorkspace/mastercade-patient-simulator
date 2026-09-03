"""
Mastercade AI Patient Simulator - FastAPI Backend Server
Provides RESTful APIs for ward selection, random patient generation,
interactive AI Q&A consultation, and medical diagnostic feedback.
"""

from __future__ import annotations

import os
import uuid
import time
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# Import patient simulator engine
from patient_simulator import PatientSimulator, WARDS, _GEMINI_AVAILABLE, _FAKER_AVAILABLE

app = FastAPI(
    title="Mastercade Patient Simulator API",
    description="Interactive Medical Patient Simulation API powered by Gemini AI",
    version="1.0.0",
)

# Enable CORS for all front-end clients (Localhost, Vercel, Netlify, GitHub Pages, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session database: session_id -> PatientSimulator instance
sessions: Dict[str, PatientSimulator] = {}

# Detailed Ward Metadata
WARD_METADATA = {
    "Cardiology": {
        "icon": "Heart",
        "description": "Acute cardiac conditions including MI, arrhythmia, and heart failure.",
        "color": "#EF4444", # Red accent
        "difficulty": "Intermediate",
    },
    "Neurology": {
        "icon": "Brain",
        "description": "Neurological disorders including migraines, seizure disorders, and movement issues.",
        "color": "#8B5CF6", # Purple accent
        "difficulty": "Advanced",
    },
    "Respiratory": {
        "icon": "Wind",
        "description": "Pulmonary illnesses including asthma exacerbations, pneumonia, and COPD.",
        "color": "#3B82F6", # Blue accent
        "difficulty": "Beginner",
    },
    "GI": {
        "icon": "Activity",
        "description": "Gastrointestinal disorders including appendicitis, GERD, and IBS.",
        "color": "#F59E0B", # Amber accent
        "difficulty": "Intermediate",
    },
    "Endocrinology": {
        "icon": "Zap",
        "description": "Hormonal and metabolic disorders including diabetes, hypo & hyperthyroidism.",
        "color": "#10B981", # Emerald accent
        "difficulty": "Intermediate",
    },
    "Renal": {
        "icon": "Droplet",
        "description": "Kidney function impairments, acute kidney injury, CKD, and nephrolithiasis.",
        "color": "#06B6D4", # Cyan accent
        "difficulty": "Advanced",
    },
    "Infectious Disease": {
        "icon": "ShieldAlert",
        "description": "Systemic bacterial, viral, and localized skin or urinary infections.",
        "color": "#EC4899", # Pink accent
        "difficulty": "Beginner",
    },
    "Orthopedics": {
        "icon": "Bone",
        "description": "Musculoskeletal traumatic injuries, joint osteoarthritis, and disc herniations.",
        "color": "#6366F1", # Indigo accent
        "difficulty": "Beginner",
    },
}

# --- Pydantic Data Models ---

class StartSessionRequest(BaseModel):
    ward: str = Field(..., description="Name of the ward to generate a patient from")

class AskQuestionRequest(BaseModel):
    session_id: str = Field(..., description="Active session ID")
    question: str = Field(..., description="Doctor's question to the simulated patient")
    api_key: Optional[str] = Field(None, description="Optional Gemini API Key passed dynamically from front-end")

class SubmitDiagnosisRequest(BaseModel):
    session_id: str = Field(..., description="Active session ID")
    diagnosis: str = Field(..., description="Doctor's submitted diagnosis")
    notes: Optional[str] = Field(None, description="Doctor's clinical consultation notes")

# --- Routes ---

@app.get("/")
def root():
    return {
        "company": "Mastercade",
        "app": "Patient Simulator API",
        "status": "online",
        "docs": "/docs",
        "endpoints": ["/api/health", "/api/wards", "/api/session/start", "/api/session/ask", "/api/session/diagnose"]
    }

@app.get("/api/health")
def health_check():
    api_key_present = bool(
        os.environ.get("GEMINI_API_KEY") 
        or os.environ.get("GOOGLE_API_KEY") 
        or getattr(PatientSimulator, '_HARDCODED_GEMINI_API_KEY', None)
    )
    return {
        "status": "healthy",
        "service": "Mastercade Patient Simulator",
        "active_sessions": len(sessions),
        "llm_available": _GEMINI_AVAILABLE and api_key_present,
        "faker_available": _FAKER_AVAILABLE,
        "model": os.environ.get("GEMINI_MODEL", "gemini-3.5-flash-lite")
    }

@app.get("/api/wards")
def list_wards():
    result = []
    for name, data in WARDS.items():
        meta = WARD_METADATA.get(name, {
            "icon": "Cross",
            "description": f"Clinical cases for {name}.",
            "color": "#2563EB",
            "difficulty": "Standard"
        })
        result.append({
            "name": name,
            "disease_count": len(data["diseases"]),
            "icon": meta["icon"],
            "description": meta["description"],
            "color": meta["color"],
            "difficulty": meta["difficulty"],
        })
    return {"wards": result}

@app.post("/api/session/start")
def start_session(req: StartSessionRequest):
    if req.ward not in WARDS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid ward name '{req.ward}'. Available wards: {list(WARDS.keys())}"
        )
    
    session_id = str(uuid.uuid4())
    sim = PatientSimulator()
    patient = sim.start_session(req.ward)
    sessions[session_id] = sim

    return {
        "session_id": session_id,
        "patient": {
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender,
            "ward": patient.ward,
            "symptoms": patient.symptoms,
            "history": patient.history,
            "medications": patient.medications,
            "vitals": patient.vitals,
        },
        "created_at": time.time()
    }

@app.post("/api/session/ask")
def ask_patient(req: AskQuestionRequest):
    sim = sessions.get(req.session_id)
    if not sim or not sim.patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or expired. Please start a new patient consultation session."
        )
    
    question = req.question.strip()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty."
        )

    start_t = time.time()
    answer = sim.ask(question, api_key=req.api_key)
    elapsed_ms = round((time.time() - start_t) * 1000, 2)

    return {
        "session_id": req.session_id,
        "question": question,
        "answer": answer,
        "elapsed_ms": elapsed_ms,
        "turn_count": len(sim.conversation)
    }

@app.post("/api/session/diagnose")
def submit_diagnosis(req: SubmitDiagnosisRequest):
    sim = sessions.get(req.session_id)
    if not sim or not sim.patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or expired."
        )
    
    user_dx = req.diagnosis.strip().lower()
    true_dx = sim.patient.disease.lower()
    
    # Calculate simple fuzzy match / accuracy score
    words_user = set(user_dx.split())
    words_true = set(true_dx.split())
    common_words = words_user.intersection(words_true)
    
    # Exclude trivial words
    stop_words = {"the", "a", "an", "of", "and", "in", "or", "disease", "syndrome", "acute", "chronic"}
    filtered_common = common_words - stop_words
    filtered_true = words_true - stop_words
    
    if user_dx == true_dx or (filtered_true and filtered_common == filtered_true):
        accuracy = 100
        verdict = "Exact Match - Outstanding Diagnosis!"
        color = "#10B981" # Emerald
    elif len(filtered_common) > 0:
        accuracy = 75
        verdict = "Partial Match - Good Diagnostic Impression"
        color = "#F59E0B" # Amber
    else:
        accuracy = 30
        verdict = "Incorrect Diagnosis - Review Clinical Symptoms"
        color = "#EF4444" # Red

    return {
        "session_id": req.session_id,
        "user_diagnosis": req.diagnosis,
        "actual_disease": sim.patient.disease,
        "accuracy_score": accuracy,
        "verdict": verdict,
        "color": color,
        "patient_summary": {
            "name": sim.patient.name,
            "ward": sim.patient.ward,
            "symptoms": sim.patient.symptoms,
            "history": sim.patient.history,
            "vitals": sim.patient.vitals,
            "questions_asked": len(sim.conversation)
        },
        "feedback": f"The patient was presenting with symptoms of {sim.patient.disease}. You asked {len(sim.conversation)} question(s) during this consultation session."
    }

@app.get("/api/session/{session_id}")
def get_session(session_id: str):
    sim = sessions.get(session_id)
    if not sim or not sim.patient:
        raise HTTPException(status_code=404, detail="Session not found.")
    return {
        "session_id": session_id,
        "patient": {
            "name": sim.patient.name,
            "age": sim.patient.age,
            "gender": sim.patient.gender,
            "ward": sim.patient.ward,
            "symptoms": sim.patient.symptoms,
            "history": sim.patient.history,
            "medications": sim.patient.medications,
            "vitals": sim.patient.vitals,
        },
        "conversation": sim.conversation
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
