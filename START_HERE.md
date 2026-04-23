# 🚀 STARTUP GUIDE - QUICK FIX

## ⚠️ CRITICAL: Backend Server is NOT Running!

Your error: `POST http://localhost:8000/api/auth/login/ net::ERR_CONNECTION_REFUSED`

**This means Django backend is not running on port 8000**

## ✅ SOLUTION - DO THIS NOW:

### Step 1: Open NEW PowerShell Terminal
- Press `Win + X` then click "Windows PowerShell (Admin)"
- OR: Right-click and open PowerShell in new window

### Step 2: Copy-Paste This Command
```powershell
cd "e:\Fyp project\personality-prediction\backend"; python manage.py runserver 8000
```

Then Press **ENTER**

### Step 3: Wait for Success Message
You should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Step 4: Open ANOTHER PowerShell Terminal (Keep first one running!)
- Press `Win + X` again or open new terminal

### Step 5: Start Frontend
```powershell
cd "e:\Fyp project\personality-prediction\frontend"; npm run dev
```

Then Press **ENTER**

### Step 6: Open Browser
Go to: `http://localhost:5173`

## 🎯 Expected Result
- Backend: Running on `http://localhost:8000` ✅
- Frontend: Running on `http://localhost:5173` ✅
- Login should work now! ✅

---

## ⚡ If Still Not Working:

### Check MySQL is Running:
```powershell
netstat -ano | findstr :3306
```

If nothing shows, MySQL is not running. Start it in Services (Windows).

### Check Database Exists:
```powershell
cd "e:\Fyp project\personality-prediction\backend"; python manage.py shell
```

Then run:
```python
from django.db import connection
print(connection.queries)
```

---

## 🔥 Nuclear Option - Restart Everything:

**Terminal 1:**
```powershell
cd "e:\Fyp project\personality-prediction\backend"
python manage.py migrate
python manage.py runserver 8000
```

**Terminal 2:**
```powershell
cd "e:\Fyp project\personality-prediction\frontend"
npm run dev
```

Done! 🎉
