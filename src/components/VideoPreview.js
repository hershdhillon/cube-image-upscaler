'use client';

import { useState } from 'react';

export default function VideoPreview({ result, isLoading }) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Processing video...</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Your upscaled video will appear here</p>
            </div>
        );
    }

    if (result.error) {
        return (
            <div className="h-64 flex items-center justify-center text-red-500">
                <p>{result.error}</p>
            </div>
        );
    }

    return (
        <div className={`relative group ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
            <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-10 bg-white text-gray-800 px-3 py-1 rounded-md shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <div className={`flex flex-col ${isFullscreen ? 'h-full' : ''}`}>
                <div className={`flex ${isFullscreen ? 'flex-row h-full' : 'flex-col'}`}>
                    <div className={`${isFullscreen ? 'w-1/2 p-4' : 'mb-4'}`}>
                        <h3 className="text-lg font-semibold mb-2">Original Video</h3>
                        <video
                            src={result.input}
                            controls
                            className="w-full h-auto"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className={`${isFullscreen ? 'w-1/2 p-4' : ''}`}>
                        <h3 className="text-lg font-semibold mb-2">Upscaled Video</h3>
                        <video
                            src={result.output}
                            controls
                            className="w-full h-auto"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>
    );
}