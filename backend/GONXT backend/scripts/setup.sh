#!/bin/bash

# GONXT Backend Setup Script for Linux/Mac

echo ""
echo "===================================="
echo "  GONXT Backend - Setup"
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.11+ using:"
    echo "  macOS: brew install python@3.11"
    echo "  Ubuntu: sudo apt-get install python3.11 python3.11-venv"
    exit 1
fi

echo "[1/4] Creating virtual environment..."
if [ -d venv ]; then
    echo "Virtual environment already exists"
else
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment"
        exit 1
    fi
fi

echo "[2/4] Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install --upgrade pip setuptools wheel > /dev/null 2>&1
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo "[3/4] Creating .env file..."
if [ -f .env ]; then
    echo ".env already exists"
else
    cp .env.example .env
    echo ".env created. Please update DATABASE_URL if needed."
fi

echo "[4/4] Initializing database..."
python -c "from app import create_app, db; app = create_app(); ctx = app.app_context(); ctx.push(); db.create_all(); print('[SUCCESS] Database initialized!')"

echo ""
echo "===================================="
echo "   Setup Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "   1. Activate venv:  source venv/bin/activate"
echo "   2. Run server:     python run.py"
echo "   3. API endpoint:   http://localhost:5000"
echo ""
echo "Default admin credentials:"
echo "   Username: admin"
echo "   Password: admin@123"
echo ""
echo "For Docker setup, use: docker-compose up -d"
echo ""
