from django.db import models
from django.contrib.auth.models import User


class TestResult(models.Model):
    """Stores complete test results for a user"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_results')
    
    # Individual modality results (stored as JSON)
    text_result = models.JSONField(null=True, blank=True)
    voice_result = models.JSONField(null=True, blank=True)
    face_result = models.JSONField(null=True, blank=True)
    
    # Final fused result
    fusion_result = models.JSONField(null=True, blank=True)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Test type/modalities used
    modalities_used = models.JSONField(default=list)  # ['text', 'voice', 'face']
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Test Results'
    
    def __str__(self):
        return f"{self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
