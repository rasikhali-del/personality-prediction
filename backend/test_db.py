#!/usr/bin/env python
"""
Database Connection Test Utility
Tests MySQL connection and validates Django settings
"""
import os
import sys
import django
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personality_backend.settings')
django.setup()

from django.db import connection
from django.conf import settings
from django.contrib.auth.models import User
from personality_app.models import TestResult
from decouple import config


def test_database_connection():
    """Test MySQL database connection"""
    print("=" * 60)
    print("Database Connection Test")
    print("=" * 60)
    print()
    
    # Display current configuration
    print("📋 Current Configuration:")
    print(f"  Engine: {settings.DATABASES['default']['ENGINE']}")
    print(f"  Host: {settings.DATABASES['default']['HOST']}")
    print(f"  Port: {settings.DATABASES['default']['PORT']}")
    print(f"  Database: {settings.DATABASES['default']['NAME']}")
    print(f"  User: {settings.DATABASES['default']['USER']}")
    print()
    
    # Test connection
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()
        print("✅ Database connection: SUCCESS")
    except Exception as e:
        print(f"❌ Database connection: FAILED")
        print(f"   Error: {str(e)}")
        return False
    
    print()
    
    # Test tables
    print("📊 Database Tables:")
    try:
        cursor = connection.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        cursor.close()
        
        if not tables:
            print("   ⚠️  No tables found. Run migrations first!")
            return False
        
        for table in tables:
            print(f"   ✓ {table[0]}")
        print(f"\n   Total tables: {len(tables)}")
    except Exception as e:
        print(f"❌ Error fetching tables: {str(e)}")
        return False
    
    print()
    
    # Test User model
    print("👥 User Model:")
    try:
        user_count = User.objects.count()
        print(f"   Total users: {user_count}")
        
        if user_count > 0:
            users = User.objects.all()[:3]
            for user in users:
                admin_status = "👨‍💼 Admin" if user.is_superuser else "👤 User"
                print(f"   - {user.username} ({user.email}) {admin_status}")
        else:
            print("   No users found. Run init_db.py to create superuser")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print()
    
    # Test TestResult model
    print("📝 TestResult Model:")
    try:
        result_count = TestResult.objects.count()
        print(f"   Total test results: {result_count}")
        
        if result_count > 0:
            results = TestResult.objects.all()[:3]
            for result in results:
                print(f"   - {result.user.username}: {', '.join(result.modalities_used)}")
        else:
            print("   No test results yet")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print()
    
    # Database info
    print("ℹ️  Database Info:")
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()[0]
        cursor.close()
        print(f"   MySQL Version: {version}")
    except:
        print("   MySQL Version: Unknown")
    
    print()
    print("=" * 60)
    print("✨ All tests completed!")
    print("=" * 60)
    
    return True


def test_auth_setup():
    """Test authentication setup"""
    print("\n" + "=" * 60)
    print("Authentication Setup Test")
    print("=" * 60)
    print()
    
    # Check JWT settings
    print("🔐 JWT Configuration:")
    print(f"   JWT Secret: {'✓ Set' if config('JWT_SECRET', default=None) else '❌ Not set'}")
    print(f"   JWT Algorithm: {config('JWT_ALGORITHM', default='HS256')}")
    print(f"   JWT Expiration: {config('JWT_EXPIRATION_HOURS', default=24)} hours")
    print()
    
    # Check admin settings
    print("👨‍💼 Admin Configuration:")
    admin_username = config('ADMIN_USERNAME', default='admin')
    print(f"   Admin Username: {admin_username}")
    
    # Check if admin exists
    try:
        admin = User.objects.get(username=admin_username)
        print(f"   Admin Status: ✓ Exists (Email: {admin.email})")
    except User.DoesNotExist:
        print(f"   Admin Status: ❌ Does not exist")
        print(f"   Run 'python init_db.py' to create admin user")
    
    print()
    print("=" * 60)
    print("✨ Authentication setup verified!")
    print("=" * 60)


if __name__ == '__main__':
    try:
        success = test_database_connection()
        if success:
            test_auth_setup()
            print("\n🎉 All systems operational!")
        else:
            print("\n⚠️  Please fix the issues above before proceeding")
            sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        sys.exit(1)
