# Cube Image Upscaler

## Overview
This project is a local image upscaling application built with Next.js and a Docker-based backend. It provides a user-friendly interface for uploading and upscaling images, optimized for environment and landscape images.

## Features
- Image upload and preview
- Custom upscaling parameters
- Side-by-side comparison of original and upscaled images
- Fullscreen view option
- JSON output view
- Download upscaled images

## Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Docker Desktop
- Windows OS (for the provided start script)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/hershdhillon/cube-image-upscaler.git
   cd cube-image-upscaler
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Ensure Docker Desktop is installed on your system.

## Usage

### Using the Start Script

1. Double-click the `start.bat` file or run it from the command line:
   ```
   start.bat
   ```

   This script will:
    - Start Docker Desktop if it's not running
    - Pull and run the necessary Docker image
    - Install dependencies
    - Build and start the Next.js app
    - Open the application in your default browser

### Manual Start

1. Start Docker Desktop and ensure it's running.

2. Pull and run the Docker image:
   ```
   docker pull r8.im/philz1337x/clarity-upscaler:latest
   docker run -d --name clarity-upscaler -p 5000:5000 --gpus=all r8.im/philz1337x/clarity-upscaler:latest
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

## Development

To run the application in development mode:

```
npm run dev
```

This will start the Next.js development server with hot reloading.

## Project Structure

- `pages/`: Next.js pages
- `components/`: React components
- `public/`: Static assets
- `styles/`: CSS styles
- `api/`: API routes for backend communication

## Key Components

- `UpscalerForm`: Main form component for image upload and parameter input
- `OutputDisplay`: Displays the upscaled image and provides download options
- `ImageComparisonSlider`: Allows side-by-side comparison of original and upscaled images
- `ImagePreview`: Handles the preview of upscaled images with fullscreen option
