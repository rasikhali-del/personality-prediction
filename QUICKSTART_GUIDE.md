# 🚀 Quick Start Guide - AI Personality Prediction System

## Prerequisites ✅
- Python 3.13+
- Node.js/npm
- MySQL Server running
- Port 8000 (backend) and 5173 (frontend) available

## 📋 Step 1: Start MySQL Server

**Windows:**
```bash
# Option 1: Using Services
# Services > MySQL80 > Start

# Option 2: Using Command Line
net start MySQL80
```

**macOS/Linux:**
```bash
brew services start mysql
# or
sudo systemctl start mysql
```

## 🔧 Step 2: Setup Backend

### 2.1 Install Dependencies
```bash
cd "e:\Fyp project\personality-prediction\backend"
pip install -r requirements.txt
```

### 2.2 Apply Migrations
```bash
python manage.py migrate
```

### 2.3 Create Superuser (Admin)
```bash
python manage.py createsuperuser
# Username: admin
# Email: admin@example.com
# Password: Your secure password
```

### 2.4 Start Django Server
**Option A: Using batch file (Windows)**
```bash
start_django_server.bat
```

**Option B: Manual**
```bash
python manage.py runserver
# Server will run on http://localhost:8000
```

**Output should show:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

## 🎨 Step 3: Setup Frontend

### 3.1 Install Dependencies
```bash
cd "e:\Fyp project\personality-prediction\frontend"
npm install
```

### 3.2 Create Environment Files
File: `.env.local`
```
VITE_API_URL=http://localhost:8000/api
VITE_ENVIRONMENT=development
```

### 3.3 Start Frontend Dev Server
```bash
npm run dev
# Frontend will run on http://localhost:5173
```

**Output should show:**
```
  ➜  Local:   http://localhost:5173/
```

## ✅ Verification

### Backend API Test
```bash
curl http://localhost:8000/api/health/
# Should return: {"status":"healthy","service":"personality-prediction-backend",...}
```

### Frontend Health Check
Open browser: http://localhost:5173
- You should see the homepage
- "Start Test" button should work
- Login/Register modal should appear

## 🔐 Default Admin Credentials

```
Username: admin
Email: admin@example.com
Password: AdminSecurePassword@123  (or what you set)
```

Access admin panel: http://localhost:8000/admin

## 📊 Database Info

**Database Name:** `personality_prediction`
**User:** `root`
**Password:** `Roman@1234` (as per .env)
**Host:** `localhost`
**Port:** `3306`

### View Database Tables
```bash
mysql -u root -pRoman@1234 personality_prediction
SHOW TABLES;
```

## 🐛 Troubleshooting

### Issue: `ERR_CONNECTION_REFUSED` on port 8000
**Solution:** Django server is not running
```bash
cd "e:\Fyp project\personality-prediction\backend"
python manage.py runserver
```

### Issue: `ModuleNotFoundError: No module named 'MySQLdb'`
**Solution:** Install MySQL client
```bash
pip install mysqlclient
```

### Issue: Database doesn't exist
**Solution:** Create database
```bash
mysql -u root -pRoman@1234
CREATE DATABASE personality_prediction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Issue: Port 8000 already in use
**Solution:** Use different port
```bash
python manage.py runserver 8001
# Then update VITE_API_URL to http://localhost:8001/api
```

### Issue: CORS errors
**Solution:** Ensure frontend URL is in CORS_ALLOWED_ORIGINS in `.env`

## 📁 Project Structure

```
personality-prediction/
├── backend/              # Django REST API
│   ├── manage.py        # Django management
│   ├── .env             # Environment variables
│   ├── requirements.txt  # Python dependencies
│   └── personality_app/
│       ├── auth_views.py    # Authentication endpoints
│       ├── models.py        # Database models
│       ├── serializers.py   # API serializers
│       └── views.py         # API views
│
└── frontend/            # React + Vite frontend
    ├── package.json     # Node dependencies
    ├── vite.config.ts   # Vite configuration
    ├── .env.local       # Frontend environment
    └── src/
        ├── pages/       # Page components
        ├── components/  # UI components
        └── services/    # API services
```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | User login |
| GET | `/api/auth/me/` | Get current user |
| POST | `/api/results/save/` | Save test results |
| GET | `/api/results/` | Get user results |
| POST | `/api/predict/text/` | Analyze text |
| POST | `/api/predict/voice/` | Analyze voice |
| POST | `/api/predict/face/` | Analyze face |
| POST | `/api/predict/multimodal/` | Multimodal analysis |
| GET | `/api/health/` | Health check |

## 🚀 Next Steps

1. ✅ Start both servers (backend + frontend)
2. ✅ Create user account or login
3. ✅ Take personality test
4. ✅ View results
5. ✅ Access admin dashboard

---

**Need Help?** Check:
- `DATABASE_SETUP.md` - Database configuration
- `MYSQL_INTEGRATION_GUIDE.md` - MySQL setup
- `README.md` - Project documentation
