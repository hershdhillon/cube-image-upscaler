import axios from 'axios';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

const API_TIMEOUT = 120000;
const API_URL = 'http://localhost:5005';

// Function to get the host IP
function getHostIP() {
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

// Use the host IP instead of localhost
const BASE_URL = `http://${getHostIP()}:3000`;

export async function POST(request) {
    try {
        const formData = await request.formData();
        const video = formData.get('video');
        const model = formData.get('model');
        const resolution = formData.get('resolution');

        if (!video) {
            return NextResponse.json({ error: 'No video file uploaded' }, { status: 400 });
        }

        // Generate a unique filename
        const fileExtension = path.extname(video.name);
        const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;

        // Ensure the public/uploads directory exists
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadsDir, { recursive: true });

        // Save the video file in the public/uploads directory
        const bytes = await video.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadsDir, uniqueFilename);
        await writeFile(filePath, buffer);

        console.log('File saved at:', filePath);

        // Generate the public URL for the video using the host IP
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
        }, {
            timeout: API_TIMEOUT,
        });

        console.log('Response received from Real-ESRGAN API:', response.data);

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
        }

        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}

export async function GET(request) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'Missing prediction ID' }, { status: 400 });
    }

    try {
        const response = await axios.get(`${API_URL}/predictions/${id}`, {
            timeout: API_TIMEOUT,
        });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching prediction:', error);
        return NextResponse.json({ error: 'An error occurred while fetching the prediction' }, { status: 500 });
    }
}