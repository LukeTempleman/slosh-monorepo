@echo off
REM Docker validation and health check script for Windows

setlocal enabledelayedexpansion

color 0A
cls

echo.
echo ========================================
echo Slosh Docker Validation Script
echo ========================================
echo.

REM Check Docker
echo [1/5] Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo X Docker not found
    echo.
    pause
    exit /b 1
)
color 0A
echo OK Docker is installed
echo.

REM Check Docker Compose
echo [2/5] Checking Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo X Docker Compose not found
    echo.
    pause
    exit /b 1
)
color 0A
echo OK Docker Compose is installed
echo.

REM Check services status
echo [3/5] Checking service status...

for /f "tokens=*" %%i in ('docker-compose -f docker-compose.global.yml ps 2^>nul') do (
    echo %%i | find "gonxt_flask" >nul
    if !errorlevel! equ 0 (
        echo %%i | find "Up" >nul
        if !errorlevel! equ 0 (
            color 0A
            echo OK GONXT Flask: Running
        ) else (
            color 0E
            echo WARNING GONXT Flask: Not running
        )
    )
    
    echo %%i | find "manu_flask" >nul
    if !errorlevel! equ 0 (
        echo %%i | find "Up" >nul
        if !errorlevel! equ 0 (
            color 0A
            echo OK Manufacturers Flask: Running
        ) else (
            color 0E
            echo WARNING Manufacturers Flask: Not running
        )
    )
)

echo.

REM Test API endpoints
echo [4/5] Testing API endpoints...

color 0F
powershell -Command "try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { Write-Host 'OK GONXT Backend (http://localhost:5000/api/health)' -ForegroundColor Green } } catch { Write-Host 'X GONXT Backend not responding' -ForegroundColor Red }"

powershell -Command "try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $response = Invoke-WebRequest -Uri 'http://localhost:5001/api/health' -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { Write-Host 'OK Manufacturers Backend (http://localhost:5001/api/health)' -ForegroundColor Green } } catch { Write-Host 'X Manufacturers Backend not responding' -ForegroundColor Red }"

echo.

REM Check files
echo [5/5] Checking required files...

if exist "docker-compose.global.yml" (
    color 0A
    echo OK docker-compose.global.yml
) else (
    color 0C
    echo X docker-compose.global.yml not found
)

if exist "Slosh_Multi_Backend_Collection.postman_collection.json" (
    color 0A
    echo OK Slosh_Multi_Backend_Collection.postman_collection.json
) else (
    color 0C
    echo X Postman collection not found
)

if exist "GONXT backend\.env" (
    color 0A
    echo OK GONXT backend\.env
) else (
    color 0C
    echo X GONXT backend\.env not found
)

if exist "manu backend\.env" (
    color 0A
    echo OK manu backend\.env
) else (
    color 0C
    echo X manu backend\.env not found
)

echo.
color 0A
echo ========================================
echo Validation Complete!
echo ========================================
echo.

echo Services:
echo   - GONXT API: http://localhost:5000
echo   - GONXT PgAdmin: http://localhost:5050
echo   - Manufacturers API: http://localhost:5001
echo   - Manufacturers PgAdmin: http://localhost:5051
echo.

echo Next steps:
echo   1. If services aren't running, execute: setup-docker.bat
echo   2. Import Postman collection: Slosh_Multi_Backend_Collection.postman_collection.json
echo   3. Start testing with GONXT Backend ^> Authentication ^> Register User
echo.

color 0F
pause
