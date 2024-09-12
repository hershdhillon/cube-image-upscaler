@echo off
setlocal enabledelayedexpansion

REM Change to the directory containing your Next.js app
cd /d "%~dp0"

REM Check if a process is already running on port 3000
set pid=
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    set pid=%%a
)

if defined pid (
    echo Closing existing process on port 3000 (PID: !pid!)
    taskkill /F /PID !pid! 2>nul
    if !errorlevel! equ 0 (
        echo Process successfully terminated.
    ) else (
        echo Failed to terminate process. It may have already closed.
    )
    timeout /t 2 /nobreak >nul
) else (
    echo No process found running on port 3000.
)

REM Install dependencies (if needed)
echo Installing dependencies...
call npm install

REM Build the Next.js app
echo Building the Next.js app...
call npm run build

REM Start the Next.js app
echo Starting the Next.js app...
start /B npm run start

REM Wait for the app to start
:wait_for_nextjs
timeout /t 2 /nobreak >nul
netstat -ano | findstr :3000 >nul
if %errorlevel% neq 0 (
    echo Waiting for Next.js app to start...
    goto :wait_for_nextjs
)
echo Next.js app is now running.

REM Open Chrome to the app's URL
echo Opening the app in Chrome...
start chrome http://localhost:3000

echo Setup complete. The app should now be running and open in Chrome.

echo Script execution completed.
pause