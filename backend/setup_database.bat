@echo off
REM =============================================================
REM MySQL Database Setup Script for Windows
REM =============================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║   AI Personality Prediction - MySQL Database Setup       ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo    Please install Python 3.8+ from https://www.python.org
    pause
    exit /b 1
)

REM Check if MySQL is installed
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  MySQL is not installed or not in PATH
    echo    Please install MySQL from https://dev.mysql.com/downloads/mysql/
    echo    Or ensure MySQL is added to your PATH
    pause
    exit /b 1
)

echo ✅ Python found: 
python --version

echo ✅ MySQL found:
mysql --version
echo.

REM Step 1: Install requirements
echo 📦 Step 1: Installing Python dependencies...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install requirements
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully!
echo.

REM Step 2: Run migrations
echo 📊 Step 2: Running database migrations...
python manage.py makemigrations
if errorlevel 1 (
    echo ❌ Failed to create migrations
    pause
    exit /b 1
)

python manage.py migrate
if errorlevel 1 (
    echo ❌ Failed to apply migrations
    pause
    exit /b 1
)
echo ✅ Migrations completed successfully!
echo.

REM Step 3: Initialize database
echo 👤 Step 3: Initializing database with admin user...
python init_db.py
if errorlevel 1 (
    echo ❌ Failed to initialize database
    pause
    exit /b 1
)
echo.

REM Step 4: Test connection
echo 🧪 Step 4: Testing database connection...
python manage.py shell -c "from django.db import connection; cursor = connection.cursor(); cursor.execute('SELECT 1'); print('✅ Database connection successful!')"
if errorlevel 1 (
    echo ❌ Failed to connect to database
    echo    Please verify:
    echo    1. MySQL server is running
    echo    2. Database credentials in .env are correct
    echo    3. Database 'personality_prediction' exists
    pause
    exit /b 1
)
echo.

echo ╔═══════════════════════════════════════════════════════════╗
echo ║              🎉 Setup Completed Successfully! 🎉          ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 📝 Database Information:
echo    - Database: personality_prediction
echo    - Host: localhost
echo    - Port: 3306
echo.
echo 🚀 Next Steps:
echo    1. Start the development server:
echo       python manage.py runserver
echo.
echo    2. Access the admin dashboard at:
echo       http://localhost:8000/admin/
echo.
echo    3. Frontend should connect to:
echo       http://localhost:8000/api/
echo.
echo 🔑 Admin Credentials (from .env):
echo    - Username: admin (or your ADMIN_USERNAME)
echo    - Password: Check .env file
echo.
echo 📚 Documentation:
echo    - DATABASE_SETUP.md - Detailed setup guide
echo    - API endpoints are defined in personality_app/urls.py
echo.

pause
