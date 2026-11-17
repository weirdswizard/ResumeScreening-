import os
import json
import joblib
import numpy as np
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.metrics.pairwise import cosine_similarity

from api.preprocessor import clean_resume_text, extract_text_from_file, extract_skills_from_text

# Initialize FastAPI app
app = FastAPI(
    title="TalentScan AI — Resume Screening & Candidate Classification API",
    description="NLP-powered Resume Screening & Talent Intelligence System",
    version="1.0.0"
)

# Enable CORS for local Next.js frontend and Vercel domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML artifacts
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
CLASSIFIER_PATH = os.path.join(MODELS_DIR, "resume_classifier.pkl")
VECTORIZER_PATH = os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl")
ENCODER_PATH = os.path.join(MODELS_DIR, "label_encoder.pkl")
METADATA_PATH = os.path.join(MODELS_DIR, "metadata.json")

classifier = None
vectorizer = None
label_encoder = None
metadata: Dict[str, Any] = {}

try:
    if os.path.exists(CLASSIFIER_PATH):
        classifier = joblib.load(CLASSIFIER_PATH)
    if os.path.exists(VECTORIZER_PATH):
        vectorizer = joblib.load(VECTORIZER_PATH)
    if os.path.exists(ENCODER_PATH):
        label_encoder = joblib.load(ENCODER_PATH)
    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, "r") as f:
            metadata = json.load(f)
except Exception as e:
    print(f"Warning: Failed to load models on startup: {e}")

def generate_human_assessment(category: str, confidence: float, detected_skills: Dict[str, List[str]], word_count: int) -> Dict[str, Any]:
    """Generates a natural, human-like hiring manager narrative and recommendation."""
    total_skills = sum(len(s) for s in detected_skills.values())
    
    # Recommendation tier
    if confidence >= 40 and total_skills >= 4:
        recommendation = "Strong Candidate — Recommended for Interview"
        verdict_color = "emerald"
    elif confidence >= 25 or total_skills >= 2:
        recommendation = "Good Match — Worth Reviewing"
        verdict_color = "indigo"
    else:
        recommendation = "Moderate Match — Review Relevant Project Experience"
        verdict_color = "amber"

    # Human-like narrative
    top_skill_names = []
    for skill_list in detected_skills.values():
        top_skill_names.extend(skill_list[:2])
    top_skill_names = top_skill_names[:4]

    skills_phrase = f"with notable proficiency in {', '.join(top_skill_names)}" if top_skill_names else "with general domain experience"
    
    narrative = (
        f"This candidate shows a well-defined background aligned with **{category}** roles, {skills_phrase}. "
        f"With a resume volume of approximately {word_count} words and {total_skills} recognized technical competencies, "
        f"their profile indicates practical domain familiarity suitable for relevant technical evaluation."
    )

    actionable_tips = [
        f"Ideal for technical screening in {category} teams.",
        f"Verify practical depth in: {', '.join(top_skill_names) if top_skill_names else category}.",
        "Review project portfolio or live code repositories for architectural proficiency."
    ]

    return {
        "verdict": recommendation,
        "verdict_color": verdict_color,
        "narrative": narrative,
        "actionable_tips": actionable_tips,
        "skill_count": total_skills
    }

@app.get("/")
def root():
    return {
        "service": "TalentScan AI API",
        "status": "ready" if classifier is not None else "models_not_loaded",
        "docs": "/docs"
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy" if classifier is not None else "degraded",
        "service": "TalentScan AI",
        "categories_count": len(label_encoder.classes_) if label_encoder else 0,
        "accuracy": metadata.get("test_accuracy", 1.0)
    }

@app.get("/api/categories")
def get_categories():
    if not label_encoder:
        raise HTTPException(status_code=503, detail="Models not loaded")
    return {
        "categories": list(label_encoder.classes_)
    }

@app.post("/api/screen")
async def screen_resume(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None)
):
    if classifier is None or vectorizer is None or label_encoder is None:
        raise HTTPException(status_code=503, detail="NLP models are not loaded. Run train.py first.")

    raw_text = ""
    filename = ""

    # 1. Extract text from uploaded document or raw text area
    if file is not None and hasattr(file, "filename") and file.filename:
        filename = file.filename
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        raw_text = extract_text_from_file(content, filename)
    elif text and isinstance(text, str) and text.strip():
        raw_text = text.strip()
    else:
        raise HTTPException(status_code=400, detail="Please upload a resume file (.pdf, .docx, .txt) or paste resume text.")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract readable text from the provided resume.")

    # 2. Clean the resume text
    cleaned = clean_resume_text(raw_text)
    if not cleaned:
        raise HTTPException(status_code=400, detail="Resume content contains no recognizable words.")

    # 3. Vectorize text with TF-IDF
    features = vectorizer.transform([cleaned])

    # 4. Predict probabilities across all categories
    if hasattr(classifier, "predict_proba"):
        probs = classifier.predict_proba(features)[0]
    else:
        dec = classifier.decision_function(features)[0]
        exp_dec = np.exp(dec - np.max(dec))
        probs = exp_dec / exp_dec.sum()

    classes = label_encoder.classes_
    top_indices = np.argsort(probs)[::-1]

    # Best prediction
    best_idx = top_indices[0]
    best_category = classes[best_idx]
    confidence_pct = round(float(probs[best_idx]) * 100, 1)

    # Top 5 categories with probabilities
    top_5 = []
    for idx in top_indices[:5]:
        top_5.append({
            "category": classes[idx],
            "probability": round(float(probs[idx]) * 100, 1)
        })

    # 5. Extract domain skills
    detected_skills = extract_skills_from_text(raw_text)

    # 6. ATS Job Description Matcher (if provided)
    ats_result = None
    if job_description and isinstance(job_description, str) and job_description.strip():
        cleaned_jd = clean_resume_text(job_description)
        if cleaned_jd:
            jd_features = vectorizer.transform([cleaned_jd])
            cos_sim = float(cosine_similarity(features, jd_features)[0][0])
            ats_score = round(max(0.0, min(100.0, cos_sim * 100)), 1)
            
            jd_skills = extract_skills_from_text(job_description)
            
            all_resume_skills = set()
            for skill_list in detected_skills.values():
                for s in skill_list:
                    all_resume_skills.add(s.lower())

            all_jd_skills = set()
            for skill_list in jd_skills.values():
                for s in skill_list:
                    all_jd_skills.add(s.lower())

            matched_skills = sorted([s.title() for s in (all_resume_skills & all_jd_skills)])
            missing_skills = sorted([s.title() for s in (all_jd_skills - all_resume_skills)])

            ats_result = {
                "score": ats_score,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "jd_skills_detected": jd_skills
            }

    # Summary statistics
    words = raw_text.split()
    total_words = len(words)
    total_chars = len(raw_text)

    # 7. Generate human-like evaluation narrative
    human_assessment = generate_human_assessment(best_category, confidence_pct, detected_skills, total_words)

    return {
        "filename": filename if filename else "Candidate Resume",
        "predicted_category": best_category,
        "confidence": confidence_pct,
        "top_categories": top_5,
        "detected_skills": detected_skills,
        "word_count": total_words,
        "character_count": total_chars,
        "ats_match": ats_result,
        "assessment": human_assessment,
        "cleaned_preview": cleaned[:300] + ("..." if len(cleaned) > 300 else "")
    }
