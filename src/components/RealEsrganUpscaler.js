'use client';

import { useState, useEffect, useRef } from 'react';
import VideoPreview from './VideoPreview';

export default function RealEsrganUpscaler() {
    const [formData, setFormData] = useState({
        model: 'RealESRGAN_x4plus',
        resolution: '4k',
        video: null
    });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Set initial result to show example videos
        setResult({
            input: '/videos/sora-glass-short.mp4',
            output: '/videos/sora-glass-short-out.mp4'
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.video) {
            alert('Please select a video file');
            return;
        }
        setIsLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('model', formData.model);
        formDataToSend.append('resolution', formData.resolution);
        formDataToSend.append('video', formData.video);

        try {
            const response = await fetch('/api/upscale-video-esrgan', {
                method: 'POST',
                body: formDataToSend,
            });
            const data = await response.json();
            if (response.ok) {
                if (data.id) {
                    await pollPrediction(data.id);
                } else {
                    setResult(data);
                    setIsLoading(false);
                }
            } else {
                throw new Error(data.error || 'Failed to start upscaling process');
            }
        } catch (error) {
            console.error('Error:', error);
            setResult({error: error.message || 'An error occurred while processing the video'});
            setIsLoading(false);
        }
    };

    const pollPrediction = async (predictionId) => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/upscale-video?id=${predictionId}`);
                const prediction = await response.json();
                if (response.status === 200) {
                    if (prediction.status === 'succeeded') {
                        clearInterval(pollInterval);
                        setResult(prediction);
                        setIsLoading(false);
                    } else if (prediction.status === 'failed') {
                        clearInterval(pollInterval);
                        throw new Error('Upscaling process failed');
                    }
                    // If it's still processing, continue polling
                } else {
                    throw new Error('Failed to fetch upscaling status');
                }
            } catch (error) {
                clearInterval(pollInterval);
                console.error('Polling error:', error);
                setResult({error: error.message || 'An error occurred while fetching the upscaling result'});
                setIsLoading(false);
            }
        }, 1000); // Poll every second
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, video: file });
            setFileName(file.name);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="min-h-screen sm:p-2 lg:p-4">
            <div className="max-w-full mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/3 p-6 lg:p-8">
                            <h2 className="text-2xl font-bold mb-4">Input</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                                    <select
                                        id="model"
                                        value={formData.model}
                                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="RealESRGAN_x4plus">RealESRGAN x4plus</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="resolution" className="block text-sm font-medium text-gray-700">Resolution</label>
                                    <select
                                        id="resolution"
                                        value={formData.resolution}
                                        onChange={(e) => setFormData({...formData, resolution: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="FHD">Full HD</option>
                                        <option value="2k">4K</option>
                                        <option value="4k">4K</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="video" className="block text-sm font-medium text-gray-700">Upload Video</label>
                                    <input
                                        type="file"
                                        id="video"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="video/*"
                                        className="hidden"
                                    />
                                    <div className="mt-1 flex items-center">
                                        <button
                                            type="button"
                                            onClick={triggerFileInput}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Choose File
                                        </button>
                                        <span className="ml-3 text-sm text-gray-500">
                                            {fileName || 'No file chosen'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !formData.video}
                                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : 'Upscale Video'}
                                </button>
                            </form>
                        </div>
                        <div className="lg:w-2/3 p-6 lg:p-8">
                            <h2 className="text-2xl font-bold mb-4">Output</h2>
                            <VideoPreview result={result} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}