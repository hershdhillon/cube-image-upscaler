@echo off
setlocal enabledelayedexpansion

REM Check if Docker Desktop is installed
if not exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
    echo Docker Desktop is not installed. Please install Docker Desktop and try again.
    goto :end
)

REM Check if Docker is already running
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo Docker is already running.
) else (
    echo Starting Docker Desktop...
    start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"

    :wait_for_docker
    timeout /t 2 /nobreak >nul
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo Waiting for Docker to start...
        goto :wait_for_docker
    )
    echo Docker is now running.
)

REM Always pull the latest image
echo Pulling the latest Docker image...
docker pull r8.im/philz1337x/clarity-upscaler:latest

REM Check if the container already exists
docker ps -a --filter "name=clarity-upscaler" --format "{{.Names}}" | findstr /i "clarity-upscaler" >nul
if %errorlevel% equ 0 (
    REM Container exists, remove it to ensure we use the latest image
    echo Removing existing container to use the latest image...
    docker rm -f clarity-upscaler
)

REM Create and run new container with the latest image
echo Creating and running new Docker container...
docker run -d --name clarity-upscaler -p 5000:5000 --gpus=all r8.im/philz1337x/clarity-upscaler:latest
if %errorlevel% neq 0 (
    echo Failed to create and start the Docker container. Please check Docker logs for more information.
    goto :end
)

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

REM Open the default browser to the app's URL
echo Opening the app in your default browser...
start http://localhost:3000

echo Setup complete. The app should now be running and open in your browser.

:end
pause