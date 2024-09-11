@echo off
setlocal enabledelayedexpansion

REM Check if Docker Desktop is installed
if not exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
    echo Docker Desktop is not installed. Please install Docker Desktop and try again.
    pause
    exit /b 1
)

REM Start Docker Desktop
echo Starting Docker Desktop...
start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"

REM Wait for Docker to start (adjust the timeout as needed)
echo Waiting for Docker to start...
timeout /t 30 /nobreak

REM Check if Docker is running
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop manually and try again.
    pause
    exit /b 1
)

REM Check if the image exists, if not pull it
docker image inspect r8.im/philz1337x/clarity-upscaler > nul 2>&1
if %errorlevel% neq 0 (
    echo Docker image not found. Pulling the image...
    docker pull r8.im/philz1337x/clarity-upscaler
    if %errorlevel% neq 0 (
        echo Failed to pull the Docker image. Please check your internet connection and try again.
        pause
        exit /b 1
    )
)

REM Run the Docker image
echo Running Docker image...
docker run -d -p 5000:5000 --gpus=all r8.im/philz1337x/clarity-upscaler

REM Change to the directory containing your Next.js app
cd /d "%~dp0"

REM Install dependencies (if needed)
echo Installing dependencies...
npm install

REM Build the Next.js app
echo Building the Next.js app...
npm run build

REM Start the Next.js app
echo Starting the Next.js app...
start npm run start

REM Wait for the app to start (adjust the timeout as needed)
timeout /t 10 /nobreak

REM Open the default browser to the app's URL
echo Opening the app in your default browser...
start http://localhost:3000

echo Setup complete. The app should now be running and open in your browser.
pause