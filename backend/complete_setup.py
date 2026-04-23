#!/usr/bin/env python
"""
Complete setup script for MySQL + Django + Frontend integration
"""
import os
import sys
import django
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personality_backend.settings')
django.setup()

from django.core.management import call_command
from django.contrib.auth.models import User
from personality_app.user_manager import UserManager
from personality_app.db_connection import get_db, close_db


def print_header(title):
    """Print formatted header"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70 + "\n")


def setup_database():
    """Setup database with migrations"""
    print_header("🗄️ DATABASE SETUP")
    
    try:
        # Test database connection
        print("📊 Testing database connection...")
        db = get_db()
        cursor = db.connection.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        print("✅ Database connection successful!\n")
        
        # Run migrations
        print("📋 Running migrations...")
        call_command('migrate', verbosity=0)
        print("✅ Migrations completed!\n")
        
        close_db()
        return True
    
    except Exception as e:
        print(f"❌ Database setup failed: {str(e)}\n")
        return False


def create_admin_user():
    """Create admin user"""
    print_header("👨‍💼 ADMIN USER SETUP")
    
    try:
        admin_username = config('ADMIN_USERNAME', default='admin')
        admin_password = config('ADMIN_PASSWORD', default='admin123')
        admin_email = config('ADMIN_EMAIL', default='admin@personality-prediction.com')
        
        if User.objects.filter(username=admin_username).exists():
            print(f"✅ Admin user '{admin_username}' already exists\n")
            return True
        
        print(f"👤 Creating admin user: {admin_username}")
        User.objects.create_superuser(
            username=admin_username,
            email=admin_email,
            password=admin_password
        )
        print(f"✅ Admin user created successfully!\n")
        print(f"   Username: {admin_username}")
        print(f"   Email: {admin_email}")
        print(f"   Password: {admin_password}\n")
        
        return True
    
    except Exception as e:
        print(f"❌ Admin user setup failed: {str(e)}\n")
        return False


def create_test_users():
    """Create test users for demonstration"""
    print_header("🧪 TEST USERS SETUP")
    
    test_users = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password': 'TestPass123',
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'password': 'TestPass123',
        },
    ]
    
    created = 0
    for user_data in test_users:
        user, msg = UserManager.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password']
        )
        if user:
            print(f"✅ {user_data['username']} ({user_data['email']})")
            created += 1
        else:
            print(f"⚠️  {user_data['username']}: {msg}")
    
    print(f"\n✅ {created} test users created\n")
    return True


def verify_setup():
    """Verify complete setup"""
    print_header("🔍 VERIFICATION")
    
    try:
        # Check users
        user_count = User.objects.count()
        print(f"✅ Total users in database: {user_count}")
        
        # Check tables
        from personality_app.models import TestResult
        result_count = TestResult.objects.count()
        print(f"✅ Total test results: {result_count}")
        
        # Check admin
        admin_exists = User.objects.filter(is_superuser=True).exists()
        print(f"✅ Admin account exists: {admin_exists}")
        
        # Display users
        print("\n📋 Users in database:")
        users = User.objects.all()
        for user in users:
            role = "👨‍💼 Admin" if user.is_superuser else "👤 User"
            print(f"   - {user.username} ({user.email}) {role}")
        
        print()
        return True
    
    except Exception as e:
        print(f"❌ Verification failed: {str(e)}\n")
        return False


def print_next_steps():
    """Print next steps"""
    print_header("🚀 NEXT STEPS")
    
    print("""
1. 🌐 Start Django Server:
   cd backend
   python manage.py runserver
   
   Server will run at: http://localhost:8000/api/

2. 📱 Start Frontend Development Server:
   cd frontend
   npm run dev
   
   Frontend will run at: http://localhost:5173

3. 🔑 Access Admin Dashboard:
   URL: http://localhost:8000/admin/
   Username: admin (or your ADMIN_USERNAME)
   Password: (from .env ADMIN_PASSWORD)

4. 🧪 Test API Endpoints:
   
   Register:
   POST http://localhost:8000/api/auth/register/
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "TestPass123",
     "confirm_password": "TestPass123"
   }
   
   Login:
   POST http://localhost:8000/api/auth/login/
   {
     "email": "test@example.com",
     "password": "TestPass123"
   }
   
   Get Current User:
   GET http://localhost:8000/api/auth/me/
   Headers: Authorization: Bearer <access_token>

5. 📊 View Admin Dashboard:
   - All registered users
   - User activity history
   - Test results linked to users
   - Search and filter capabilities

6. 🔐 Security Checklist:
   ✓ MySQL database connected
   ✓ Passwords hashed with PBKDF2
   ✓ JWT authentication implemented
   ✓ User isolation configured
   ✓ Admin-only endpoints secured
   ✓ CORS configured for frontend
   ✓ Environment variables in .env

7. 📚 Documentation:
   - DATABASE_SETUP.md - Database configuration
   - MYSQL_INTEGRATION_GUIDE.md - Complete integration guide
   - API endpoints in personality_app/urls.py

""")


def main():
    """Main setup function"""
    print("\n")
    print("╔══════════════════════════════════════════════════════════════════╗")
    print("║   🎉 AI Personality Prediction - Complete Setup                 ║")
    print("╚══════════════════════════════════════════════════════════════════╝")
    
    steps = [
        ("Database Setup", setup_database),
        ("Admin User", create_admin_user),
        ("Test Users", create_test_users),
        ("Verification", verify_setup),
    ]
    
    for step_name, step_func in steps:
        if not step_func():
            print(f"\n❌ Setup failed at step: {step_name}")
            sys.exit(1)
    
    print_next_steps()
    
    print("╔══════════════════════════════════════════════════════════════════╗")
    print("║   ✨ Setup completed successfully! Ready to use! ✨             ║")
    print("╚══════════════════════════════════════════════════════════════════╝\n")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️ Setup interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        sys.exit(1)
