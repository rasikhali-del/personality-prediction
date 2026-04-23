# 🚀 Complete Startup Guide

## Step 1: Start MySQL Database
Make sure MySQL is running. If not:
```bash
# Windows: Start MySQL service
net start MySQL80

# Or use MySQL Command Line Client
mysql -u root -p
# Password: Roman@1234
```

## Step 2: Start Django Backend Server

**Option A - Using Batch File (Easiest):**
```bash
# Run from explorer or cmd
e:\Fyp project\personality-prediction\backend\start_server.bat
```

**Option B - Manual Start:**
```powershell
cd "e:\Fyp project\personality-prediction\backend"
python manage.py migrate  # Run migrations if needed
python manage.py runserver
```

✅ Backend will run on: `http://localhost:8000/api`

## Step 3: Start Frontend Development Server

```powershell
cd "e:\Fyp project\personality-prediction\frontend"
npm run dev
# or
yarn dev
```

✅ Frontend will run on: `http://localhost:5173`

## Step 4: Test the Application

1. Open browser: `http://localhost:5173`
2. Click "Start Test"
3. You should see **AuthModal** (Login/Signup)
4. Register a new account or login
5. Then proceed with the test

## 🔧 Troubleshooting

### Backend Connection Refused
- ❌ Django server not running → Run `start_server.bat`
- ❌ Wrong port → Check `.env` file, should be `:8000`
- ❌ MySQL not running → Start MySQL service

### Frontend Can't Connect to Backend
- ❌ Check `.env.local` in frontend
- Should have: `VITE_API_URL=http://localhost:8000/api`
- ❌ CORS issue → Check backend `.env` CORS settings

### Database Errors
- ❌ Run: `python manage.py migrate`
- ❌ Check MySQL is running
- ❌ Verify credentials in `.env`

## 📝 Important Files

- **Backend**: `e:\Fyp project\personality-prediction\backend`
- **Frontend**: `e:\Fyp project\personality-prediction\frontend`
- **Backend Config**: `.env` (MySQL + Django)
- **Frontend Config**: `.env.local` (API URL)

## ✅ System Ready When:
1. ✓ Backend running on `:8000`
2. ✓ Frontend running on `:5173`
3. ✓ MySQL database connected
4. ✓ No connection refused errors
5. ✓ AuthModal appears when clicking "Start Test"
