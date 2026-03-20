@echo off
REM FlicksByNick Email Setup - Quick Start Script (Windows)
REM Run this to get started faster!

echo.
echo ╔════════════════════════════════════════════╗
echo ║  FlicksByNick Email Setup - Quick Start    ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Download from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%
echo.

REM Navigate to server folder
cd server
if errorlevel 1 (
    echo ❌ Could not find server folder!
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

echo.
echo ✅ Dependencies installed!
echo.

REM Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo 📋 Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo 📝 Edit server\.env and add your Gmail credentials:
    echo    EMAIL_USER=your-email@gmail.com
    echo    EMAIL_PASSWORD=your-app-password
    echo.
    echo 🔑 Get your Gmail App Password at:
    echo    https://myaccount.google.com/apppasswords
    echo.
    echo Press any key once you've updated .env...
    pause
)

echo.
echo ╔════════════════════════════════════════════╗
echo ║  ✅ Ready to start the server!             ║
echo ╚════════════════════════════════════════════╝
echo.
echo Run: npm start
echo.
pause
