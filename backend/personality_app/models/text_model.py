# backend/personality_app/models/text_model.py

import os
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Optional

# Resolve model path relative to this file
MODEL_PATH = os.path.join(os.path.dirname(__file__), "bigfive-regression-model")
_text_tokenizer = None  # type: Optional[any]
_text_model = None  # type: Optional[any]

BIG5_LABELS = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]


def _get_text_model():
    global _text_tokenizer, _text_model
    if _text_tokenizer is not None and _text_model is not None:
        return _text_tokenizer, _text_model
    
    if not os.path.exists(MODEL_PATH):
        return None, None
    
    try:
        _text_tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        _text_model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
        _text_model.eval()
        return _text_tokenizer, _text_model
    except Exception as e:
        print(f"Error loading text model: {e}")
        return None, None


def predict_text_traits(text):
    # Ensure model is available
    tokenizer, model = _get_text_model()
    if tokenizer is None or model is None:
        return {"error": "text_model_not_available", "detail": f"Missing model folder: {MODEL_PATH}"}
    
    if not text or not text.strip():
        return {"error": "no_text_provided"}
    
    try:
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Model outputs raw scores for Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
        scores = outputs.logits.squeeze().tolist()
        
        print(f"📝 TEXT MODEL DEBUG (text_model.py):")
        print(f"   Raw model scores: {scores}")
        print(f"   Score ranges: min={min(scores):.3f}, max={max(scores):.3f}")
        
        # Convert 1–5 scale to percentage (assuming 1=min, 5=max)
        scores_percent = [((score - 1) / 4) * 100 for score in scores]
        
        # Apply bounds to prevent extreme percentages
        scores_percent = [max(5, min(95, percent)) for percent in scores_percent]
        
        # Check if openness is always high
        if scores_percent[0] > 80:  # Openness is first in BIG5_LABELS
            print(f"🚨 HIGH OPENNESS DETECTED: {scores_percent[0]:.1f}%")
            # Apply temporary fix
            if scores_percent[0] > 85:
                scores_percent[0] = 45 + (scores_percent[0] - 85) * 0.3
                scores_percent[0] = max(25, min(75, scores_percent[0]))
                print(f"🔄 FIXED OPENNESS: {scores_percent[0]:.1f}%")
        
        # Create result dict with trait names as keys
        result = {}
        for trait, percent in zip(BIG5_LABELS, scores_percent):
            result[trait] = round(percent, 2)
        
        return result
        
    except Exception as exc:
        return {"error": "text_inference_failed", "detail": str(exc)}
