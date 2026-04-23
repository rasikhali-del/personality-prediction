# 🔐 MySQL Authentication Integration Guide

## Overview

This guide walks you through integrating MySQL database with the AI Personality Prediction system for secure authentication and data storage.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)             │
│              User Authentication & Test Interface            │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Django Backend (REST API)                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │          Authentication & Authorization                  │ │
│  │         (Login/Register/JWT Token Management)            │ │
│  └────────────────────┬────────────────────────────────────┘ │
│  ┌────────────────────▼────────────────────────────────────┐ │
│  │         Data Models & Serializers                        │ │
│  │    (User, TestResult, Admin Dashboard)                  │ │
│  └────────────────────┬────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────────────────┘
                     │ SQL
                     ▼
        ┌────────────────────────────┐
        │   MySQL Database           │
        │  (personality_prediction)  │
        │  - Users Table             │
        │  - Test Results Table      │
        │  - Modality Results        │
        └────────────────────────────┘
```

## Quick Start (5 Minutes)

### 1. Prerequisites
```bash
# Ensure you have:
- Python 3.8+
- MySQL Server running
- Git (optional)
```

### 2. Install Dependencies
```bash
cd "e:\Fyp project\personality-prediction\backend"
pip install -r requirements.txt
```

### 3. Run Setup Script
```bash
# Windows
setup_database.bat

# Linux/macOS
bash setup_database.sh (create this from the .bat file)
```

### 4. Start Server
```bash
python manage.py runserver
```

✅ **Done!** Backend is running at `http://localhost:8000`

## Detailed Setup Steps

### Step 1: MySQL Server Setup

**Windows:**
```bash
# Start MySQL
net start MySQL80

# Connect to MySQL
mysql -u root -p
```

**macOS:**
```bash
brew services start mysql
mysql -u root
```

**Linux:**
```bash
sudo systemctl start mysql
mysql -u root -p
```

### Step 2: Database Creation

```sql
-- Create database
CREATE DATABASE personality_prediction 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES;
```

### Step 3: Configure .env

Edit `.env` file in the backend directory:

```properties
# Database
DB_ENGINE=django.db.backends.mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personality_prediction
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_CHARSET=utf8mb4

# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION_HOURS=24

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password
ADMIN_EMAIL=admin@personality-prediction.com
```

### Step 4: Run Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Or use init_db.py to automate
python init_db.py
```

### Step 5: Test Connection

```bash
# Test database connection
python test_db.py

# You should see:
# ✅ Database connection: SUCCESS
# ✓ auth_user
# ✓ personality_app_testresult
# ✓ Total users: 1
```

## Database Schema

### Users Table (auth_user)
```sql
CREATE TABLE auth_user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(150) UNIQUE NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  password VARCHAR(128) NOT NULL,  -- Hashed with PBKDF2
  is_staff BOOLEAN DEFAULT FALSE,
  is_superuser BOOLEAN DEFAULT FALSE,
  first_name VARCHAR(150),
  last_name VARCHAR(150),
  is_active BOOLEAN DEFAULT TRUE,
  date_joined DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

### Test Results Table
```sql
CREATE TABLE personality_app_testresult (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  text_result JSON,
  voice_result JSON,
  face_result JSON,
  fusion_result JSON,
  modalities_used JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirm_password": "SecurePass123"
}

Response:
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "is_staff": false,
    "is_superuser": false,
    "date_joined": "2024-01-01T10:00:00Z"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### Login User
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response:
{
  "user": { ... },
  "tokens": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me/
Authorization: Bearer <access_token>

Response:
{
  "user": { ... }
}
```

### Test Results

#### Save Test Result
```http
POST /api/results/save/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "text_result": { "openness": 0.8, ... },
  "voice_result": { "openness": 0.75, ... },
  "face_result": { "openness": 0.82, ... },
  "fusion_result": { "openness": 0.79, ... }
}

Response:
{
  "id": 1,
  "user": { ... },
  "text_result": { ... },
  "voice_result": { ... },
  "face_result": { ... },
  "fusion_result": { ... },
  "modalities_used": ["text", "voice", "face"],
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

#### Get User Results
```http
GET /api/results/?page=1&page_size=10
Authorization: Bearer <access_token>

Response:
{
  "results": [ ... ],
  "total": 5,
  "page": 1,
  "page_size": 10,
  "pages": 1
}
```

### Admin Endpoints

#### Get All Users
```http
GET /api/admin/users/?search=john&page=1&page_size=10
Authorization: Bearer <admin_token>

Response:
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "total_tests": 5,
      "date_joined": "2024-01-01T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

#### Get User Details
```http
GET /api/admin/users/1/
Authorization: Bearer <admin_token>

Response:
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "total_tests": 5,
  "results": [ ... ],
  "profile": {
    "age": null,
    "gender": null,
    "total_tests": 5,
    "last_test_date": "2024-01-15T10:00:00Z"
  }
}
```

## Security Best Practices

### ✅ Implemented in This Setup

1. **Password Hashing**
   - Django uses PBKDF2 with SHA256 by default
   - Passwords are never stored in plain text

2. **JWT Authentication**
   - Secure token-based authentication
   - Access tokens expire after 24 hours (configurable)
   - Refresh tokens for getting new access tokens

3. **Environment Variables**
   - Sensitive data in `.env` file
   - Not committed to version control

4. **Database Security**
   - Foreign key constraints
   - User isolation (each user only sees their data)
   - Admin-only endpoints with permission checks

5. **CORS Configuration**
   - Restricted to specified origins
   - Prevents unauthorized cross-domain requests

### ⚠️ Production Security Checklist

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `DEBUG = False`
- [ ] Update `ALLOWED_HOSTS` for your domain
- [ ] Use HTTPS in production
- [ ] Set up database backups
- [ ] Configure SSL/TLS for MySQL connection
- [ ] Use strong passwords for database user
- [ ] Enable database user privileges restrictions
- [ ] Set up rate limiting for API endpoints
- [ ] Enable CSRF protection for forms
- [ ] Use environment-specific settings
- [ ] Set up error logging and monitoring
- [ ] Regularly update dependencies

## Frontend Integration

### AuthContext Usage

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LoginPage() {
  const { login, isLoading } = useAuth();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect to dashboard
    } catch (error) {
      // Show error
    }
  };
}
```

### Protected Routes

```typescript
import { AdminRoute } from '@/components/AdminRoute';

<Route path="/admin/dashboard" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
```

## Troubleshooting

### Issue: "Can't connect to MySQL server"
**Solution:**
```bash
# Start MySQL
net start MySQL80  # Windows
brew services start mysql  # macOS
sudo systemctl start mysql  # Linux

# Verify
mysql -u root -p
```

### Issue: "Access denied for user 'root'"
**Solution:**
1. Check password in `.env` is correct
2. Reset MySQL password:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Issue: "No module named 'mysqlclient'"
**Solution:**
```bash
# Install MySQL driver
pip install mysqlclient==2.2.0

# If fails, use PyMySQL
pip install PyMySQL

# Add to settings.py
import pymysql
pymysql.install_as_MySQLdb()
```

### Issue: "Relation 'auth_user' does not exist"
**Solution:**
```bash
# Run migrations
python manage.py migrate
```

### Issue: "CORS blocked"
**Solution:**
Update `CORS_ALLOWED_ORIGINS` in `.env` with your frontend URL

## Admin Dashboard

### Access
```
URL: http://localhost:8000/admin/
Username: admin (or your ADMIN_USERNAME)
Password: (from .env ADMIN_PASSWORD)
```

### Features
- View all users
- View/edit user details
- View test results for each user
- Search users
- Filter by date and modalities
- View personality traits
- Download reports (optional)

## Performance Tips

1. **Enable Query Caching**
```sql
SET GLOBAL query_cache_size = 268435456;  -- 256MB
```

2. **Index Frequently Queried Columns**
```sql
CREATE INDEX idx_user_id ON personality_app_testresult(user_id);
CREATE INDEX idx_created_at ON personality_app_testresult(created_at);
```

3. **Enable Connection Pooling**
Update requirements: `pip install django-db-pool`

4. **Use Redis for Token Caching**
Update requirements: `pip install django-redis`

## Backup and Recovery

### Backup Database
```bash
# Windows
mysqldump -u root -p personality_prediction > backup.sql

# Linux/macOS
mysqldump -u root -p personality_prediction > backup.sql
```

### Restore Database
```bash
mysql -u root -p personality_prediction < backup.sql
```

### Backup Schedule
```bash
# Daily backup at 2 AM (Windows Task Scheduler or Linux cron)
0 2 * * * mysqldump -u root -p personality_prediction > /backups/backup-$(date +\%Y\%m\%d).sql
```

## Support & Documentation

- Django Docs: https://docs.djangoproject.com/
- MySQL Docs: https://dev.mysql.com/doc/
- DRF Docs: https://www.django-rest-framework.org/
- JWT Docs: https://django-rest-framework-simplejwt.readthedocs.io/

## Next Steps

1. ✅ Database setup complete
2. ✅ Authentication configured
3. 🔄 Update frontend to use real login
4. 📊 Test admin dashboard
5. 🧪 Run end-to-end tests
6. 🚀 Deploy to production

---

**Last Updated:** April 2024
**Status:** Production Ready ✨
