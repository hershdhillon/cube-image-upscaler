'use client';

import { useEffect } from 'react';

export default function VideoPreview({ result, isLoading, originalVideo, onNewVideoUpload }) {
    const exampleOriginal = '/videos/sora-glass-short.mp4';
    const exampleUpscaled = '/videos/sora-glass-short-out.mp4';

    useEffect(() => {
        if (originalVideo && originalVideo !== exampleOriginal) {
            onNewVideoUpload();
        }
    }, [originalVideo, onNewVideoUpload]);

    const currentOriginal = originalVideo || exampleOriginal;
    const currentUpscaled = originalVideo ? result?.output : exampleUpscaled;

    return (
        <div className="flex flex-col space-y-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">Original Video</h3>
                <video
                    key={currentOriginal}
                    src={currentOriginal}
                    controls
                    muted
                    className="w-full h-auto"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Upscaled Video</h3>
                {currentUpscaled ? (
                    <video
                        key={currentUpscaled}
                        src={currentUpscaled}
                        controls
                        muted
                        className="w-full h-auto"
                    >
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        {isLoading ? 'Processing video...' : 'Upscaled video will appear here'}
                    </div>
                )}
            </div>
            {result?.error && (
                <div className="text-red-500 mt-4">
                    <p>Error: {result.error}</p>
                </div>
            )}
        </div>
    );
}