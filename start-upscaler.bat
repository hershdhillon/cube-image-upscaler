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

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed. Skipping npm install.
)

REM Check if build is necessary
set rebuild=0
if not exist ".next" set rebuild=1
for /f %%i in ('dir /s /b /a:-d src 2^>nul ^| find /c /v ""') do set src_count=%%i
if %src_count% gtr 0 (
    for /f %%i in ('dir /s /b /a:-d src ^| sort /r /b ^| findstr /r "\.js$ \.jsx$ \.ts$ \.tsx$" ^| find /c /v ""') do set src_files=%%i
    for /f %%i in ('dir /s /b /a:-d .next 2^>nul ^| find /c /v ""') do set build_files=%%i
    if !src_files! gtr !build_files! set rebuild=1
)

if %rebuild%==1 (
    echo Building the Next.js app...
    call npm run build
) else (
    echo No changes detected. Skipping build.
)

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