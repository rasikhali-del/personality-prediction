from django.contrib import admin
from .models import TestResult


@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'modalities_used', 'created_at')
    list_filter = ('created_at', 'modalities_used')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('User Info', {
            'fields': ('user',)
        }),
        ('Test Results', {
            'fields': ('text_result', 'voice_result', 'face_result', 'fusion_result')
        }),
        ('Metadata', {
            'fields': ('modalities_used', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )