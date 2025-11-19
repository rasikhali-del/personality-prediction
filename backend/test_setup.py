#!/usr/bin/env python3
"""
Test script to verify backend setup and AI models
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personality_backend.settings')
django.setup()

def test_models():
    """Test if AI models can be loaded"""
    print("🔍 Testing AI Models...")
    
    try:
        # Test text model
        from personality_app.models.text_model import predict_text_traits
        text_result = predict_text_traits("I am a friendly and outgoing person who loves meeting new people.")
        print(f"✅ Text Model: {text_result}")
    except Exception as e:
        print(f"❌ Text Model Error: {e}")
    
    try:
        # Test facial model  
        from personality_app.models.facetest import _get_emotion_model
        face_model = _get_emotion_model()
        if face_model:
            print("✅ Facial Model: Loaded successfully")
        else:
            print("❌ Facial Model: Failed to load")
    except Exception as e:
        print(f"❌ Facial Model Error: {e}")
    
    try:
        # Test voice model
        from personality_app.models.voice_model import _get_voice_model
        voice_model = _get_voice_model()
        if voice_model:
            print("✅ Voice Model: Loaded successfully")
        else:
            print("❌ Voice Model: Failed to load")
    except Exception as e:
        print(f"❌ Voice Model Error: {e}")

def test_database():
    """Test database connection"""
    print("\n🗄️ Testing Database...")
    
    try:
        from personality_app.models import PersonalityTest
        count = PersonalityTest.objects.count()
        print(f"✅ Database: Connected ({count} personality tests)")
    except Exception as e:
        print(f"❌ Database Error: {e}")

def test_fusion():
    """Test multimodal fusion"""
    print("\n🔗 Testing Multimodal Fusion...")
    
    try:
        from personality_app.models.fusion import fuse_all
        
        # Mock results
        text_result = {
            'openness': 0.7,
            'conscientiousness': 0.6,
            'extraversion': 0.8,
            'agreeableness': 0.9,
            'neuroticism': 0.3
        }
        
        voice_result = {
            'openness': 0.6,
            'conscientiousness': 0.7,
            'extraversion': 0.7,
            'agreeableness': 0.8,
            'neuroticism': 0.4
        }
        
        face_result = {
            'openness': 0.8,
            'conscientiousness': 0.5,
            'extraversion': 0.9,
            'agreeableness': 0.7,
            'neuroticism': 0.2
        }
        
        fusion_result = fuse_all(text_result, voice_result, face_result)
        print(f"✅ Fusion: {fusion_result}")
        
    except Exception as e:
        print(f"❌ Fusion Error: {e}")

def main():
    print("🚀 Personality Prediction Backend Test\n")
    
    test_models()
    test_database() 
    test_fusion()
    
    print("\n✨ Backend test completed!")

if __name__ == "__main__":
    main()
