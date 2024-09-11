@echo off
setlocal enabledelayedexpansion

REM Ensure Docker command is available
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker command not found. Ensuring Docker Desktop is in PATH...
    set "PATH=%PATH%;C:\Program Files\Docker\Docker\resources\bin;C:\ProgramData\DockerDesktop\version-bin"
)

REM Check if Docker Desktop is installed
set "DOCKER_PATH=%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
if not exist "%DOCKER_PATH%" (
    set "DOCKER_PATH=C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if not exist "%DOCKER_PATH%" (
        echo Docker Desktop is not installed or not found in the expected locations. Please install Docker Desktop and try again.
        goto :end
    )
)

REM Check if Docker is already running
:check_docker
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo Docker is already running.
    goto :docker_ready
) else (
    echo Docker is not running. Attempting to start Docker Desktop...
    start "" "%DOCKER_PATH%"
)

REM Wait for Docker to start
set /a attempts=0
:wait_for_docker
timeout /t 5 /nobreak >nul
set /a attempts+=1
echo Attempt %attempts%: Checking if Docker is running...
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo Docker is now running.
    goto :docker_ready
) else (
    if %attempts% lss 12 (
        echo Docker is still starting. Waiting...
        goto :wait_for_docker
    ) else (
        echo Docker failed to start after 1 minute. Please check Docker Desktop manually.
        goto :end
    )
)

:docker_ready
echo Docker is fully operational.

REM Check if the container already exists
docker ps -a --filter "name=clarity-upscaler" --format "{{.Names}}" | findstr /i "clarity-upscaler" >nul
if %errorlevel% equ 0 (
    REM Container exists, check if it's running
    docker ps --filter "name=clarity-upscaler" --format "{{.Names}}" | findstr /i "clarity-upscaler" >nul
    if %errorlevel% equ 0 (
        echo Clarity Upscaler container is already running.
    ) else (
        echo Clarity Upscaler container exists but is not running. Starting it...
        docker start clarity-upscaler
        if %errorlevel% neq 0 (
            echo Failed to start existing container. Please check Docker logs for more information.
            goto :end
        )
    )
) else (
    REM Container doesn't exist, pull image and create new container
    echo Pulling the latest Docker image...
    docker pull r8.im/philz1337x/clarity-upscaler:latest

    echo Creating and running new Docker container...
    docker run -d --name clarity-upscaler -p 5000:5000 --gpus=all r8.im/philz1337x/clarity-upscaler:latest
    if %errorlevel% neq 0 (
        echo Failed to create and start the Docker container. Please check Docker logs for more information.
        goto :end
    )
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
echo Script execution completed.
pause