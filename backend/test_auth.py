#!/usr/bin/env python
"""Test authentication endpoint"""
import os
import sys
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personality_backend.settings')
sys.path.insert(0, r'e:\Fyp project\personality-prediction\backend')

django.setup()

from django.contrib.auth.models import User
from django.test import Client

print("=" * 60)
print("🔍 TESTING AUTHENTICATION")
print("=" * 60)

# Check users
print("\n📋 Existing users:")
users = User.objects.all()
for u in users:
    print(f"   - {u.username} ({u.email})")

if not users.exists():
    print("   No users found! Creating test user...")
    user = User.objects.create_user(
        username='admin',
        email='admin@test.com',
        password='admin123'
    )
    print(f"   ✅ Created: {user.username}")

# Test login with Django test client
print("\n🧪 Testing login endpoint...")
client = Client()

response = client.post(
    '/api/auth/login/',
    json.dumps({'email': 'admin@test.com', 'password': 'admin123'}),
    content_type='application/json'
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.content.decode()}")

if response.status_code == 200:
    print("\n✅ Login successful!")
    data = json.loads(response.content)
    print(f"Access Token: {data['tokens']['access'][:50]}...")
else:
    print("\n❌ Login failed!")
    print(f"Error: {response.content.decode()}")

print("\n" + "=" * 60)
