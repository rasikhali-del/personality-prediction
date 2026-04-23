@echo off
REM Start Django Development Server

cd /d "e:\Fyp project\personality-prediction\backend"

echo Starting Django Development Server on port 8000...
echo.
echo Server will be available at: http://localhost:8000
echo API will be available at: http://localhost:8000/api
echo Admin panel at: http://localhost:8000/admin
echo.

python manage.py runserver 0.0.0.0:8000

pause
