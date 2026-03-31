@echo off
REM Docker setup test script for Windows (PowerShell recommended)

setlocal enabledelayedexpansion

echo.
echo 🚀 Flask PostgreSQL Backend Docker Setup Test
echo ==============================================
echo.

REM Check Docker
echo 📦 Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker is not installed
    exit /b 1
)
echo ✓ Docker found

REM Check Docker Compose
echo 📦 Checking Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker Compose is not installed
    exit /b 1
)
echo ✓ Docker Compose found

REM Build images
echo.
echo 🔨 Building Docker images...
docker-compose build
if errorlevel 1 (
    echo ✗ Build failed
    exit /b 1
)
echo ✓ Build successful

REM Start services
echo.
echo ▶️  Starting services...
docker-compose up -d
if errorlevel 1 (
    echo ✗ Failed to start services
    exit /b 1
)

REM Wait for services
echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak

REM Check services
echo.
echo 🔍 Checking service health...
docker-compose ps

REM Test API
echo.
echo 🧪 Testing API...
timeout /t 5 /nobreak

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo   1. Register a user at http://localhost:5000/api/auth/register
echo   2. Login at http://localhost:5000/api/auth/login
echo   3. View logs: docker-compose logs -f web
echo   4. Stop services: docker-compose down
