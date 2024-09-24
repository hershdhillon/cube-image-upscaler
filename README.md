# Cube Image and Video Upscaler

## Overview
This project is a local image and video upscaling application built with Next.js and Docker-based backends. It provides a user-friendly interface for uploading and upscaling both images and videos, optimized for environment and landscape content.

## Features
- Image and video upload and preview
- Custom upscaling parameters
- Side-by-side comparison of original and upscaled content
- Fullscreen view option
- JSON output view
- Download upscaled images and videos

## Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Docker Desktop
- Windows OS (for the provided start script)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/hershdhillon/cube-upscaler.git
   cd cube-upscaler
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Ensure Docker Desktop is installed and running on your system.

4. Pull the required Docker images:
   ```
   docker pull r8.im/philz1337x/clarity-upscaler:latest
   docker pull r8.im/lucataco/real-esrgan-video:latest
   ```

## Usage

### Using the Start Script

1. Double-click the `start-upscaler.bat` file or run it from the command line:
   ```
   start-upscaler.bat
   ```

   This script will:
   - Install dependencies
   - Build and start the Next.js app
   - Open the application in your default browser

### Manual Start

1. Start Docker Desktop and ensure it's running.

2. Run the Docker containers:
   ```
   docker run -d --name clarity-upscaler -p 5000:5000 --gpus=all r8.im/philz1337x/clarity-upscaler:latest
   docker run -d --name real-esrgan-video -p 5005:5000 --gpus=all r8.im/lucataco/real-esrgan-video:latest
   ```

3. Build the Next.js app:
   ```
   npm run build
   ```

4. Start the Next.js server:
   ```
   npm run start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Running Docker Containers Manually

If you need to run the Docker containers manually or want more control over the process, follow these steps:

1. For the image upscaler:
   ```
   docker run -d -p 5000:5000 --gpus=all r8.im/philz1337x/clarity-upscaler:latest
   ```

2. For the video upscaler:
   ```
   docker run -d -p 5005:5000 --gpus=all r8.im/lucataco/real-esrgan-video:latest
   ```

Make sure to run both containers before starting the Next.js application.

## Development

To run the application in development mode:

```
npm run dev
```

This will start the Next.js development server with hot reloading.

## Key Components

- `UpscalerForm`: Main form component for image and video upload and parameter input
- `OutputDisplay`: Displays the upscaled content and provides download options
- `ImageComparisonSlider`: Allows side-by-side comparison of original and upscaled images
- `VideoPreview`: Handles the preview of upscaled videos with fullscreen option
- `RealEsrganUpscaler`: Component for video upscaling using Real-ESRGAN

## Notes

- Ensure that both Docker containers are running before using the application.
- The image upscaler uses port 5000, while the video upscaler uses port 5005.
- GPU support is required for optimal performance of the upscaling processes.