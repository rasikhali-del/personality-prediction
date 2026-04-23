#!/usr/bin/env python
"""
Quick database verification and migration script
"""
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personality_backend.settings')
sys.path.insert(0, r'e:\Fyp project\personality-prediction\backend')

django.setup()

from django.db import connection
from django.core.management import call_command

print("=" * 60)
print("🔍 DATABASE VERIFICATION & SETUP")
print("=" * 60)

# Check connection
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    print("✅ Database connected successfully!")
    print(f"   Database: {connection.settings_dict['NAME']}")
    print(f"   Host: {connection.settings_dict['HOST']}")
    print(f"   User: {connection.settings_dict['USER']}")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    sys.exit(1)

# Run migrations
print("\n📦 Running migrations...")
try:
    call_command('migrate', verbosity=1)
    print("✅ Migrations completed!")
except Exception as e:
    print(f"❌ Migration failed: {e}")
    sys.exit(1)

# Check tables
print("\n📊 Checking tables...")
from django.apps import apps
from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("SHOW TABLES;")
    tables = cursor.fetchall()
    print(f"✅ Found {len(tables)} tables:")
    for table in tables:
        print(f"   - {table[0]}")

print("\n" + "=" * 60)
print("🎉 Setup complete! You can now run the server.")
print("=" * 60)
