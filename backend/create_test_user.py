#!/usr/bin/env python
"""Create test user for login"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personality_backend.settings')
sys.path.insert(0, r'e:\Fyp project\personality-prediction\backend')

django.setup()

from django.contrib.auth.models import User

# Delete existing admin if exists
User.objects.filter(username='admin').delete()

# Create new admin user
user = User.objects.create_user(
    username='admin',
    email='admin@test.com',
    password='admin123',
    is_staff=True,
    is_superuser=True
)

print("✅ User created successfully!")
print(f"Username: {user.username}")
print(f"Email: {user.email}")
print("Password: admin123")
print("\nYou can now login with these credentials!")
