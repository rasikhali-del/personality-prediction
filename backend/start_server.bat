@echo off
cd /d "e:\Fyp project\personality-prediction\backend"
python manage.py migrate
echo.
echo Starting Django server...
python manage.py runserver 0.0.0.0:8000
pause
