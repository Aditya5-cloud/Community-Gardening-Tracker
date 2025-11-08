@echo off
echo 🌱 Starting Community Garden Tracker...
echo.

echo 📦 Installing server dependencies...
cd ../server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

echo 📦 Installing client dependencies...
cd ../client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo 🚀 Starting the application...
echo.

echo 📋 Starting server on http://localhost:5000...
start "Community Garden Tracker - Server" cmd /k "cd ../server && npm run dev"

echo 📋 Starting client on http://localhost:3000...
start "Community Garden Tracker - Client" cmd /k "cd ../client && npm start"

echo.
echo ✅ Community Garden Tracker is starting up!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo.
echo ⏳ Please wait for both applications to fully load...
echo.
pause 