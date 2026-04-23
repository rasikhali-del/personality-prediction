# 🔧 Setup & Troubleshooting Guide

## ERROR: `ERR_CONNECTION_REFUSED` on Port 8000

This error means the Django backend server is **NOT RUNNING**.

### ✅ Solution: Start Django Backend Server

#### **Option 1: Windows Batch File (EASIEST) 🎯**
```bash
# Navigate to backend folder and run:
cd "e:\Fyp project\personality-prediction\backend"
start_django_server.bat
```

A new command window will open with Django server running.

#### **Option 2: Manual Command**
```bash
cd "e:\Fyp project\personality-prediction\backend"
python manage.py runserver
```

**You should see:**
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
April 23, 2026 - 10:30:00
Django version 5.2.4, using settings 'personality_backend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

#### **Option 3: Start Both Frontend & Backend Together**

**Windows:**
```bash
cd "e:\Fyp project\personality-prediction"
start_all.bat
```

This will open TWO command windows:
1. Django Backend (port 8000)
2. React Frontend (port 5173)

**PowerShell:**
```powershell
cd "e:\Fyp project\personality-prediction"
powershell -ExecutionPolicy Bypass -File start_all.ps1
```

---

## 🔍 Verification Steps

### 1️⃣ Check Backend is Running
Open browser and visit: **http://localhost:8000/api/health/**

You should see JSON response:
```json
{
  "status": "healthy",
  "service": "personality-prediction-backend",
  "version": "1.0.0",
  "models_available": {
    "text": "bigfive-regression-model",
    "voice": "SpeechEmotionModel",
    "face": "_mini_XCEPTION"
  }
}
```

### 2️⃣ Check Frontend is Running
Open browser and visit: **http://localhost:5173/**

You should see the AI Personality homepage with "Start Test" button.

### 3️⃣ Test Login
1. Click "Start Test" button
2. "Login/Sign Up" modal should appear
3. Fill in credentials and try to login
4. Should NOT see `ERR_CONNECTION_REFUSED` error

---

## 🚀 Complete Startup Procedure

### Step 1: Ensure MySQL is Running
```bash
# Windows - Check if MySQL service is running
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Step 2: Start Backend
```bash
cd "e:\Fyp project\personality-prediction\backend"
python manage.py runserver

# Wait for: "Starting development server at http://127.0.0.1:8000/"
```

### Step 3: Start Frontend (in NEW terminal)
```bash
cd "e:\Fyp project\personality-prediction\frontend"
npm run dev

# Wait for: "Local: http://localhost:5173/"
```

### Step 4: Open Browser
```
http://localhost:5173
```

---

## ❌ Common Errors & Solutions

### Error: `ModuleNotFoundError: No module named 'MySQLdb'`
**Fix:**
```bash
pip install mysqlclient
```

### Error: `Connection refused - MySQL`
**Fix:**
```bash
# Start MySQL service
net start MySQL80

# Or verify it's running
mysql -u root -pRoman@1234 -e "SELECT 1;"
```

### Error: Database `personality_prediction` doesn't exist
**Fix:**
```bash
mysql -u root -pRoman@1234 -e "CREATE DATABASE personality_prediction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Error: Port 8000 already in use
**Fix - Option A:** Kill process on port 8000
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

**Fix - Option B:** Use different port
```bash
python manage.py runserver 8001
# Then update .env.local in frontend:
# VITE_API_URL=http://localhost:8001/api
```

### Error: Port 5173 already in use
**Fix:**
```bash
cd frontend
npm run dev -- --port 5174
```

### Error: `CORS error` in browser console
**Fix:** Add frontend URL to `.env`
```
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## 📊 Quick Status Check

### Backend Health
```bash
curl http://localhost:8000/api/health/
```

### Frontend Health
Open: `http://localhost:5173` in browser

### Database Health
```bash
mysql -u root -pRoman@1234 personality_prediction -e "SELECT COUNT(*) as user_count FROM auth_user;"
```

---

## 🔐 Database Access

### Connect to MySQL
```bash
mysql -u root -pRoman@1234 personality_prediction
```

### Useful Queries
```sql
-- Check users
SELECT id, username, email, is_staff, is_superuser FROM auth_user;

-- Check test results
SELECT id, user_id, created_at, modalities_used FROM personality_app_testresult;

-- Check tables
SHOW TABLES;

-- Exit
EXIT;
```

---

## 📁 Key Files to Check

| File | Purpose | Edit if |
|------|---------|---------|
| `backend/.env` | Backend config | Database or port changes |
| `frontend/.env.local` | Frontend config | Backend URL or port changes |
| `backend/manage.py` | Django command runner | Running migrations, etc. |
| `frontend/package.json` | Frontend dependencies | Need new packages |

---

## 🎯 Full Setup from Scratch

If you want to completely reset everything:

```bash
# 1. Delete old database
mysql -u root -pRoman@1234 -e "DROP DATABASE IF EXISTS personality_prediction;"

# 2. Create fresh database
mysql -u root -pRoman@1234 -e "CREATE DATABASE personality_prediction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 3. Apply migrations
cd "e:\Fyp project\personality-prediction\backend"
python manage.py migrate

# 4. Create superuser
python manage.py createsuperuser

# 5. Start server
python manage.py runserver

# 6. In new terminal, start frontend
cd "e:\Fyp project\personality-prediction\frontend"
npm run dev
```

---

## ✅ Once Everything is Working

1. ✅ Backend running on http://localhost:8000
2. ✅ Frontend running on http://localhost:5173
3. ✅ No connection errors
4. ✅ Login/Register working
5. ✅ Ready to test!

---

## 📞 Support

If issues persist:
1. Check `QUICKSTART_GUIDE.md`
2. Check `DATABASE_SETUP.md`
3. Check `MYSQL_INTEGRATION_GUIDE.md`
4. Review browser console for errors (F12)
5. Check backend terminal for 500 errors
