#!/bin/bash

# ============================================================
# MySQL Database Setup Script for Linux/macOS
# ============================================================

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   AI Personality Prediction - MySQL Database Setup       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    echo "   Please install Python 3.8+ from https://www.python.org"
    exit 1
fi

echo -e "${GREEN}✅ Python found:${NC}"
python3 --version
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠️  MySQL is not installed or not in PATH${NC}"
    echo "   macOS: brew install mysql"
    echo "   Linux: sudo apt-get install mysql-server"
    echo "   Or ensure MySQL is in your PATH"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ MySQL found:${NC}"
    mysql --version
    echo ""
fi

# Step 1: Install requirements
echo -e "${YELLOW}📦 Step 1: Installing Python dependencies...${NC}"
if pip3 install -q -r requirements.txt; then
    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
else
    echo -e "${RED}❌ Failed to install requirements${NC}"
    exit 1
fi
echo ""

# Step 2: Run migrations
echo -e "${YELLOW}📊 Step 2: Running database migrations...${NC}"
if python3 manage.py makemigrations; then
    echo -e "${GREEN}✅ Migrations created${NC}"
else
    echo -e "${RED}❌ Failed to create migrations${NC}"
    exit 1
fi

if python3 manage.py migrate; then
    echo -e "${GREEN}✅ Migrations applied${NC}"
else
    echo -e "${RED}❌ Failed to apply migrations${NC}"
    exit 1
fi
echo ""

# Step 3: Initialize database
echo -e "${YELLOW}👤 Step 3: Initializing database with admin user...${NC}"
if python3 init_db.py; then
    echo -e "${GREEN}✅ Database initialized${NC}"
else
    echo -e "${RED}❌ Failed to initialize database${NC}"
    exit 1
fi
echo ""

# Step 4: Test connection
echo -e "${YELLOW}🧪 Step 4: Testing database connection...${NC}"
if python3 manage.py shell -c "from django.db import connection; cursor = connection.cursor(); cursor.execute('SELECT 1'); print('✅ Database connection successful!')"; then
    echo ""
else
    echo -e "${RED}❌ Failed to connect to database${NC}"
    echo "   Please verify:"
    echo "   1. MySQL server is running"
    echo "   2. Database credentials in .env are correct"
    echo "   3. Database 'personality_prediction' exists"
    exit 1
fi
echo ""

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║              🎉 Setup Completed Successfully! 🎉          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Database Information:"
echo "   - Database: personality_prediction"
echo "   - Host: localhost"
echo "   - Port: 3306"
echo ""
echo "🚀 Next Steps:"
echo "   1. Start the development server:"
echo "      python3 manage.py runserver"
echo ""
echo "   2. Access the admin dashboard at:"
echo "      http://localhost:8000/admin/"
echo ""
echo "   3. Frontend should connect to:"
echo "      http://localhost:8000/api/"
echo ""
echo "🔑 Admin Credentials (from .env):"
echo "   - Username: admin (or your ADMIN_USERNAME)"
echo "   - Password: Check .env file"
echo ""
echo "📚 Documentation:"
echo "   - MYSQL_INTEGRATION_GUIDE.md - Complete setup guide"
echo "   - API endpoints are defined in personality_app/urls.py"
echo ""
