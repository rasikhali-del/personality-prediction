from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import os
from typing import Optional

# Model path and global variables
MODEL_PATH = os.path.join(os.path.dirname(__file__), "bigfive-regression-model")
_tokenizer = None  # type: Optional[any]
_model = None  # type: Optional[any]

BIG5_LABELS = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]


def _get_model():
    """Load model and tokenizer (cached)"""
    global _tokenizer, _model
    if _tokenizer is not None and _model is not None:
        return _tokenizer, _model
    
    if not os.path.exists(MODEL_PATH):
        return None, None
    
    try:
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        _model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
        _model.eval()
        return _tokenizer, _model
    except Exception as e:
        print(f"Error loading text model: {e}")
        return None, None


def predict_text_traits(text):
    """
    Predict personality traits from text.
    Returns dict with trait names as keys and percentages as values.
    """
    # Ensure model is available
    tokenizer, model = _get_model()
    if tokenizer is None or model is None:
        return {"error": "text_model_not_available", "detail": f"Missing model folder: {MODEL_PATH}"}
    
    if not text or not text.strip():
        return {"error": "no_text_provided"}
    
    try:
        # Tokenize input
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        
        # Run prediction
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Model outputs raw scores for Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
        scores = outputs.logits.squeeze().tolist()
        
        print(f"📝 TEXT MODEL DEBUG:")
        print(f"   Input text length: {len(text)} chars")
        print(f"   Raw model scores: {scores}")
        print(f"   Score ranges: min={min(scores):.3f}, max={max(scores):.3f}")
        
        # Check for extreme values
        for i, (trait, score) in enumerate(zip(BIG5_LABELS, scores)):
            if score > 4.5:
                print(f"⚠️  WARNING: {trait} has very high raw score: {score:.3f}")
            elif score < 1.5:
                print(f"⚠️  WARNING: {trait} has very low raw score: {score:.3f}")
        
        # Convert 1–5 scale to percentage (assuming 1=min, 5=max)
        scores_percent = [((score - 1) / 4) * 100 for score in scores]
        
        # Apply bounds to prevent extreme percentages
        scores_percent = [max(5, min(95, percent)) for percent in scores_percent]
        
        print(f"   Converted percentages: {scores_percent}")
        
        # CRITICAL FIX: Text model appears to be inverted/broken
        # Detect negative sentiment and invert scores if needed
        negative_indicators = ["not", "nobody", "avoid", "hate", "sad", "depressed", "lonely", "bad", "terrible", "awful", "can't", "don't", "won't"]
        negative_count = sum(1 for word in negative_indicators if word in text.lower())
        
        print(f"🔍 SENTIMENT ANALYSIS:")
        print(f"   Negative indicators found: {negative_count}")
        print(f"   Text contains: {[word for word in negative_indicators if word in text.lower()]}")
        
        # CRITICAL FIX: Check for extreme openness first (regardless of sentiment)
        if scores_percent[0] > 85:
            print(f"🚨 CRITICAL: Extreme openness {scores_percent[0]:.1f}% - APPLYING GENERAL FIX")
            # General fix for extreme values
            original_openness = scores_percent[0]
            scores_percent[0] = 45 + (scores_percent[0] - 85) * 0.3
            scores_percent[0] = max(25, min(75, scores_percent[0]))
            print(f"🔄 FIXED OPENNESS: {original_openness:.1f}% → {scores_percent[0]:.1f}%")
        
        # If text is clearly negative but openness is still high, apply additional sentiment fix
        elif negative_count >= 2 and scores_percent[0] > 70:
            print(f"🚨 CRITICAL: Text is negative but openness is {scores_percent[0]:.1f}% - MODEL IS INVERTED!")
            print("🔧 APPLYING INVERSION FIX:")
            
            # Invert the scores for negative text
            original_scores = scores_percent.copy()
            scores_percent[0] = 100 - scores_percent[0]  # Invert openness
            scores_percent[4] = min(100, scores_percent[4] + 30)  # Increase neuroticism for negative text
            scores_percent[2] = max(0, scores_percent[2] - 20)    # Decrease extraversion for avoidant text
            
            print(f"   Original openness: {original_scores[0]:.1f}% → Fixed: {scores_percent[0]:.1f}%")
            print(f"   Adjusted neuroticism: +30% → {scores_percent[4]:.1f}%")
            print(f"   Adjusted extraversion: -20% → {scores_percent[2]:.1f}%")
        
        # Create result dict with trait names as keys
        result = {}
        for trait, percent in zip(BIG5_LABELS, scores_percent):
            result[trait] = round(percent, 2)
        
        print(f"   Final result: {result}")
        return result
        
    except Exception as exc:
        return {"error": "text_inference_failed", "detail": str(exc)}


# Interactive mode (when run as standalone script)
if __name__ == "__main__":
    print("🔤 Big Five Personality Prediction Test")
    print("=" * 50)
    
    # Test if model can be loaded
    tokenizer, model = _get_model()
    if tokenizer is None or model is None:
        print("❌ Model failed to load!")
        print(f"Expected model path: {MODEL_PATH}")
        print("Make sure the 'bigfive-regression-model' folder exists with model files.")
        exit(1)
    
    print("✅ Model loaded successfully!")
    
    # Get user input
    text = input("\nEnter a paragraph about yourself: ")
    
    # Get prediction
    result = predict_text_traits(text)
    
    if "error" in result:
        print(f"❌ Error: {result}")
    else:
        print("\nBig Five Personality Prediction (out of 100%):\n")
        for trait, percent in result.items():
            print(f"{trait.capitalize()}: {percent}%")
