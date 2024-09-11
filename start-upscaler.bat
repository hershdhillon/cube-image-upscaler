@echo off
setlocal enabledelayedexpansion

REM Ensure Docker command is available
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker command not found. Ensuring Docker Desktop is in PATH...
    set "PATH=%PATH%;C:\Program Files\Docker\Docker\resources\bin;C:\ProgramData\DockerDesktop\version-bin"
)

REM Check Docker version
echo Checking Docker version...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Docker command is accessible.
    for /f "tokens=3" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo Docker version: !DOCKER_VERSION!
) else (
    echo Failed to run Docker command. Please ensure Docker Desktop is installed and in PATH.
    goto :end
)

REM Check if Docker Desktop is installed
set "DOCKER_PATH=%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
if not exist "%DOCKER_PATH%" (
    set "DOCKER_PATH=C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if not exist "%DOCKER_PATH%" (
        echo Docker Desktop executable not found in expected locations.
        echo Continuing anyway as Docker command is accessible...
    )
)

REM Check if Docker daemon is responsive
:check_docker
echo Checking if Docker daemon is responsive...
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo Docker daemon is responsive and ready.
    goto :docker_ready
) else (
    echo Docker daemon is not responsive. Attempting to start Docker Desktop...
    if exist "%DOCKER_PATH%" (
        start "" "%DOCKER_PATH%"
    ) else (
        echo Docker Desktop executable not found. Please start Docker Desktop manually.
    )
)

REM Wait for Docker to start
set /a attempts=0
:wait_for_docker
timeout /t 5 /nobreak >nul
set /a attempts+=1
echo Attempt %attempts%: Checking if Docker daemon is responsive...
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo Docker daemon is now responsive and ready.
    goto :docker_ready
) else (
    if %attempts% lss 12 (
        echo Docker daemon is still starting. Waiting...
        goto :wait_for_docker
    ) else (
        echo Docker failed to become responsive after 1 minute. Please check Docker Desktop manually.
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