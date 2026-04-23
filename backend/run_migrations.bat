@echo off
cd /d "e:\Fyp project\personality-prediction\backend"
python manage.py makemigrations
python manage.py migrate
echo Migrations completed!
