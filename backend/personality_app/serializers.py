from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TestResult


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'is_staff', 'is_superuser']


class TestResultSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TestResult
        fields = ['id', 'user', 'text_result', 'voice_result', 'face_result', 
                  'fusion_result', 'modalities_used', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']