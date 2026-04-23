@echo off
REM Start AI Personality Prediction System - Backend & Frontend

color 0A
cls

echo ================================
echo. AI Personality Prediction System
echo. Starting Backend ^& Frontend Servers
echo ================================
echo.

set BackendPath=e:\Fyp project\personality-prediction\backend
set FrontendPath=e:\Fyp project\personality-prediction\frontend

echo [1/2] Starting Django Backend Server...
echo       Location: %BackendPath%
echo       URL: http://localhost:8000
echo.

start "Django Backend" cmd /k "cd /d "%BackendPath%" && python manage.py runserver"

timeout /t 2 /nobreak

echo [2/2] Starting React Frontend Server...
echo       Location: %FrontendPath%
echo       URL: http://localhost:5173
echo.

start "React Frontend" cmd /k "cd /d "%FrontendPath%" && npm run dev"

timeout /t 2 /nobreak

cls
echo ================================
echo. SERVERS STARTED SUCCESSFULLY!
echo ================================
echo.
echo Backend API:     http://localhost:8000
echo Frontend:        http://localhost:5173
echo Admin Panel:     http://localhost:8000/admin
echo.
echo Default Credentials:
echo   Username: admin
echo   Password: AdminSecurePassword@123
echo.
echo Open browser and go to: http://localhost:5173
echo.
pause
