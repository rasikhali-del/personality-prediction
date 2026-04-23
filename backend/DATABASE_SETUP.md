# MySQL Database Integration Setup Guide

## Prerequisites

1. **MySQL Server** installed and running
   - Download: https://dev.mysql.com/downloads/mysql/
   - Verify installation: `mysql --version`

2. **Python 3.8+** with pip
3. **Git** for version control

## Step 1: Create MySQL Database

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE personality_prediction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify creation
SHOW DATABASES;

-- Exit
EXIT;
```

## Step 2: Install Dependencies

```bash
# Navigate to backend directory
cd "e:\Fyp project\personality-prediction\backend"

# Install required packages
pip install -r requirements.txt

# If mysqlclient fails on Windows, use this instead:
pip install mysqlclient==2.2.0
# Or use PyMySQL as alternative:
pip install PyMySQL
```

## Step 3: Configure Environment Variables

The `.env` file is already set up with the following configuration:

```properties
# Database Configuration (MySQL)
DB_ENGINE=django.db.backends.mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personality_prediction
DB_USER=root
DB_PASSWORD=Roman@1234
DB_CHARSET=utf8mb4

# Django Settings
DEBUG=True
SECRET_KEY=django-insecure-b22l(%1=yrw!ct-fa9gzcflnmns0@m%j-!krl66)!js#n-i605
ALLOWED_HOSTS=localhost,127.0.0.1,localhost:8000,127.0.0.1:8000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
JWT_REFRESH_EXPIRATION_DAYS=7

# Admin Settings
ADMIN_USERNAME=admin
ADMIN_PASSWORD=AdminSecurePassword@123
ADMIN_EMAIL=admin@personality-prediction.com
```

**Update the following based on your setup:**
- `DB_PASSWORD`: Your MySQL root password
- `JWT_SECRET`: Change to a secure random string for production
- `ADMIN_PASSWORD`: Set a strong password for admin user

## Step 4: Run Migrations

### Option 1: Using the initialization script (Recommended)

```bash
cd "e:\Fyp project\personality-prediction\backend"
python init_db.py
```

This will:
- Run all migrations
- Create the superuser account
- Display login credentials

### Option 2: Manual migration

```bash
# Navigate to backend
cd "e:\Fyp project\personality-prediction\backend"

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

## Step 5: Verify Database Setup

```bash
# Check database tables
python manage.py dbshell

# Inside MySQL shell
SHOW TABLES;
DESCRIBE auth_user;
DESCRIBE personality_app_testresult;
EXIT;
```

## Step 6: Start the Development Server

```bash
python manage.py runserver
```

The server will be available at: `http://localhost:8000`

## Database Schema

### Users Table (Django's auth_user)
```
- id: Primary key
- username: Unique username
- email: User email
- password: Hashed password (using Django's PBKDF2)
- is_staff: Admin access flag
- is_superuser: Superuser flag
- date_joined: Registration timestamp
```

### TestResult Table
```
- id: Primary key
- user_id: Foreign key to auth_user
- text_result: JSON field (text analysis results)
- voice_result: JSON field (voice analysis results)
- face_result: JSON field (facial analysis results)
- fusion_result: JSON field (combined results)
- modalities_used: JSON field (list of modalities used)
- created_at: Timestamp
- updated_at: Last update timestamp
```

## API Endpoints

### Authentication
- **POST** `/api/auth/register/` - Register new user
- **POST** `/api/auth/login/` - Login user (returns JWT tokens)
- **GET** `/api/auth/me/` - Get current user (requires token)

### Test Results
- **POST** `/api/results/save/` - Save test results (requires token)
- **GET** `/api/results/` - Get user's results (requires token)

### Admin
- **GET** `/api/admin/users/` - Get all users (admin only)
- **GET** `/api/admin/users/{user_id}/` - Get user details (admin only)

## Security Best Practices

### ✅ Implemented
- Passwords are hashed using Django's PBKDF2
- JWT tokens for secure API access
- Environment variables for sensitive data
- CORS configuration for frontend
- Permission-based access control

### ⚠️ Production Checklist
- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `DEBUG = False`
- [ ] Update `ALLOWED_HOSTS` for production domain
- [ ] Use HTTPS in production
- [ ] Configure email backend for notifications
- [ ] Set up database backups
- [ ] Use environment-specific settings
- [ ] Enable CSRF protection
- [ ] Configure rate limiting

## Troubleshooting

### MySQL Connection Error
```
Error: Can't connect to MySQL server on 'localhost'
```
**Solution:** Ensure MySQL is running
```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Permission Denied for MySQL User
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:** Update password in `.env` or reset MySQL password

### psycopg2 or mysqlclient Installation Error
**Windows Solution:**
```bash
pip install mysqlclient==2.2.0
# If fails, use PyMySQL instead:
pip install PyMySQL
# Add to settings.py:
import pymysql
pymysql.install_as_MySQLdb()
```

### Migration Error
```
Error: No such table: auth_user
```
**Solution:** Run migrations first
```bash
python manage.py migrate
```

## Admin Dashboard

### Access
- URL: `http://localhost:8000/admin/`
- Username: `admin` (or configured `ADMIN_USERNAME`)
- Password: `AdminSecurePassword@123` (or configured `ADMIN_PASSWORD`)

### Features
- View all registered users
- View test results for each user
- Search users by username/email
- Filter results by date and modalities
- Edit user information
- Delete users (if needed)

## Next Steps

1. ✅ Database is set up with MySQL
2. ✅ Authentication system is configured
3. ✅ Admin dashboard is ready
4. 📱 Update frontend to use real authentication
5. 🧪 Run integration tests
6. 🚀 Deploy to production

## Support

For issues or questions:
1. Check TROUBLESHOOTING.md
2. Review error logs in Django console
3. Check MySQL error log: `/var/log/mysql/error.log`
