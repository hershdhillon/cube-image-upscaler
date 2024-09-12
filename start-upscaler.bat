@echo off
setlocal enabledelayedexpansion

REM Change to the directory containing your Next.js app
cd /d "%~dp0"

REM Install dependencies (if needed)
echo Installing dependencies...
call npm install

REM Build the Next.js app
echo Building the Next.js app...
call npm run build

REM Check if the Next.js app is already running on port 3000
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo Next.js app is already running on port 3000.
) else (
    REM Start the Next.js app
    echo Starting the Next.js app...
    start /B npm run start

    :wait_for_nextjs
    timeout /t 2 /nobreak >nul
    netstat -ano | findstr :3000 >nul
    if %errorlevel% neq 0 (
        echo Waiting for Next.js app to start...
        goto :wait_for_nextjs
    )
    echo Next.js app is now running.
)

REM Open Chrome to the app's URL
echo Opening the app in Chrome...
start chrome http://localhost:3000

echo Setup complete. The app should now be running and open in Chrome.

echo Script execution completed.
pause