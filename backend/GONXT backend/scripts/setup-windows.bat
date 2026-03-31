@echo off
REM GONXT Backend Setup Script for Windows

echo.
echo ====================================
echo   GONXT Backend - Windows Setup
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/4] Creating virtual environment...
if exist venv (
    echo Virtual environment already exists
) else (
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

echo [2/4] Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat
pip install --upgrade pip setuptools wheel >nul 2>&1
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [3/4] Creating .env file...
if exist .env (
    echo .env already exists
) else (
    copy .env.example .env
    echo .env created. Please update DATABASE_URL if needed.
)

echo [4/4] Initializing database...
python -c "from app import create_app, db; app = create_app(); ctx = app.app_context(); ctx.push(); db.create_all(); print('[SUCCESS] Database initialized!')"

echo.
echo ====================================
echo   Setup Complete!
echo ====================================
echo.
echo Next steps:
echo   1. Activate venv:  venv\Scripts\activate.bat
echo   2. Run server:     python run.py
echo   3. API endpoint:   http://localhost:5000
echo.
echo Default admin credentials:
echo   Username: admin
echo   Password: admin@123
echo.
echo For Docker setup, use: docker-compose up -d
echo.
pause
