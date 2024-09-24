'use client';

import { useEffect } from 'react';

export default function VideoPreview({ result, isLoading }) {
    useEffect(() => {
        console.log('Result updated:', result);
    }, [result]);

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

    console.log('Rendering videos with:', {
        original: result.originalVideo || result.input,
        upscaled: result.output
    });

    return (
        <div className="flex flex-col space-y-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">Original Video</h3>
                <video
                    src={result.originalVideo || result.input}
                    controls
                    muted
                    className="w-full h-auto"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Upscaled Video</h3>
                {result.output ? (
                    <video
                        src={result.output}
                        controls
                        muted
                        className="w-full h-auto"
                    >
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        Upscaled video not available
                    </div>
                )}
            </div>
        </div>
    );
}