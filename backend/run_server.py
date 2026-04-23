#!/usr/bin/env python
import os
import sys
import django
from django.core.management import execute_from_command_line

os.chdir(r"e:\Fyp project\personality-prediction\backend")
sys.path.insert(0, r"e:\Fyp project\personality-prediction\backend")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personality_backend.settings')
django.setup()

if __name__ == '__main__':
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])
