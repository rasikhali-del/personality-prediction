from django.urls import path
from .views import (
    predict_personality, 
    predict_face_only, 
    predict_voice_only,
    predict_multimodal,
    health_check
)

urlpatterns = [
    # Main prediction endpoints
    path('predict/', predict_personality, name='predict_personality'),
    path('predict/text/', predict_personality, name='predict_text'),  # Added text endpoint
    path('predict/multimodal/', predict_multimodal, name='predict_multimodal'),
    path('predict/face/', predict_face_only, name='predict_face'),
    path('predict/voice/', predict_voice_only, name='predict_voice'),
    
    # Utility endpoints
    path('health/', health_check, name='health_check'),
]
