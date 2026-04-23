#!/usr/bin/env python
"""
Database initialization script for MySQL setup
Run this after installing requirements and setting up .env
"""
import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personality_backend.settings')
django.setup()

from django.core.management import call_command
from django.contrib.auth.models import User
from decouple import config


def init_database():
    """Initialize the database with migrations and create superuser"""
    print("🔄 Starting database initialization...")
    
    try:
        # Run migrations
        print("\n📊 Running migrations...")
        call_command('migrate')
        print("✅ Migrations completed successfully!")
        
        # Create superuser if it doesn't exist
        admin_username = config('ADMIN_USERNAME', default='admin')
        admin_password = config('ADMIN_PASSWORD', default='admin123')
        admin_email = config('ADMIN_EMAIL', default='admin@personality-prediction.com')
        
        if not User.objects.filter(username=admin_username).exists():
            print(f"\n👤 Creating superuser: {admin_username}")
            User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password=admin_password
            )
            print(f"✅ Superuser '{admin_username}' created successfully!")
            print(f"   Email: {admin_email}")
        else:
            print(f"\n👤 Superuser '{admin_username}' already exists")
        
        print("\n✨ Database initialization completed successfully!")
        print("\n📝 Next steps:")
        print("   1. Start the Django development server: python manage.py runserver")
        print("   2. Access admin panel at: http://localhost:8000/admin/")
        print(f"   3. Login with: {admin_username} / {admin_password}")
        
    except Exception as e:
        print(f"\n❌ Error during database initialization: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    init_database()
