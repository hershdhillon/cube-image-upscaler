import axios from 'axios';
import { NextResponse } from 'next/server';
import { writeFile, mkdir, access, readdir, unlink, stat } from 'fs/promises';
import path from 'path';
import os from 'os';

const API_URL = 'http://localhost:5005';
const MAX_FILE_AGE = 2 * 60 * 60 * 1000;

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1';
}

const BASE_URL = `http://${getLocalIP()}:3000`;

async function getUniqueFilename(dir, originalFilename) {
    const baseName = path.basename(originalFilename, path.extname(originalFilename));
    const extension = path.extname(originalFilename);
    let uniqueFilename = originalFilename;
    let counter = 1;

    while (true) {
        try {
            await access(path.join(dir, uniqueFilename));
            uniqueFilename = `${baseName}_${counter}${extension}`;
            counter++;
        } catch (error) {
            // File doesn't exist, so this filename is unique
            return uniqueFilename;
        }
    }
}

async function ensureDirectoryExists(dir) {
    try {
        await access(dir);
    } catch {
        await mkdir(dir, { recursive: true });
    }
}

async function downloadFile(fileUrl, outputPath) {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(outputPath, buffer);
}

async function cleanupOldFiles(dir) {
    const now = Date.now();
    const files = await readdir(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = await stat(filePath);
        const fileAge = now - stats.mtime.getTime();

        if (fileAge > MAX_FILE_AGE) {
            await unlink(filePath);
            console.log(`Deleted old file: ${filePath}`);
        }
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const video = formData.get('video');
        const model = formData.get('model');
        const resolution = formData.get('resolution');

        if (!video) {
            return NextResponse.json({ error: 'No video file uploaded' }, { status: 400 });
        }

        // Option 1: Clean up old files in the uploads directory
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await ensureDirectoryExists(uploadsDir);
        await cleanupOldFiles(uploadsDir);

        // Get a unique filename that preserves the original name
        const uniqueFilename = await getUniqueFilename(uploadsDir, video.name);

        // Save the video file in the uploads directory
        const bytes = await video.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadsDir, uniqueFilename);
        await writeFile(filePath, buffer);

        console.log('File saved at:', filePath);

        // Generate the public URL for the video using the local IP
        const publicUrl = `${BASE_URL}/uploads/${uniqueFilename}`;
        console.log('Public URL:', publicUrl);

        // Send the request to the Real-ESRGAN API
        console.log('Sending request to Real-ESRGAN API...');
        const response = await axios.post(`${API_URL}/predictions`, {
            version: "latest",
            input: {
                model: model || "RealESRGAN_x4plus",
                resolution: resolution || "4K",
                video_path: publicUrl
            }
        });

        // Check if the API returned an output URL
        if (!response.data.output) {
            throw new Error('No output URL provided by the Real-ESRGAN API');
        }

        // Use the output URL provided by the API
        const outputUrl = response.data.output;

        // Ensure the results directory exists
        const resultsDir = path.join(process.cwd(), 'results');
        await ensureDirectoryExists(resultsDir);

        // Generate the upscaled filename
        const originalBaseName = path.basename(uniqueFilename, path.extname(uniqueFilename));
        const upscaledFilename = `${originalBaseName}_upscaled${path.extname(uniqueFilename)}`;
        const upscaledFilePath = path.join(resultsDir, upscaledFilename);

        // Download the upscaled video
        await downloadFile(outputUrl, upscaledFilePath);

        response.data.originalVideo = publicUrl;
        response.data.upscaledVideoPath = upscaledFilePath;

        console.log('Response received from Real-ESRGAN API:', response.data);

        // Option 2: Clean up the temporary file
        // await unlink(filePath);

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Detailed error:', error);

        let errorMessage = 'An error occurred while processing the video';
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED') {
                errorMessage = `Unable to connect to the Real-ESRGAN API at ${API_URL}. Please ensure it is running and accessible.`;
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = 'The request to the Real-ESRGAN API timed out. The video might be too large or the processing is taking too long.';
            } else if (error.response) {
                errorMessage = `The Real-ESRGAN API responded with an error: ${error.response.status} ${error.response.statusText}`;
                statusCode = error.response.status;
            } else if (error.request) {
                errorMessage = 'No response was received from the Real-ESRGAN API.';
            }
        } else if (error.message === 'No output URL provided by the Real-ESRGAN API') {
            errorMessage = 'The Real-ESRGAN API did not provide an output URL for the upscaled video.';
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function GET(request) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'Missing prediction ID' }, { status: 400 });
    }

    try {
        const response = await axios.get(`${API_URL}/predictions/${id}`);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching prediction:', error);
        return NextResponse.json({ error: 'An error occurred while fetching the prediction' }, { status: 500 });
    }
}