'use client';

import { useState, useEffect, useRef } from 'react';

export default function ImageComparisonSlider({ originalImage, processedImage }) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        Promise.all([loadImage(originalImage), loadImage(processedImage)])
            .then(() => setIsLoaded(true))
            .catch((error) => console.error('Error loading images:', error));
    }, [originalImage, processedImage]);

    const handleMouseMove = (e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const newSliderPosition = (x / rect.width) * 100;
            setSliderPosition(newSliderPosition);
        }
    };

    const handleTouchMove = (e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const newSliderPosition = (x / rect.width) * 100;
            setSliderPosition(newSliderPosition);
        }
    };

    if (!isLoaded) {
        return <div className="w-full h-64 bg-gray-200 animate-pulse rounded-md"></div>;
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-auto overflow-hidden cursor-col-resize"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            <img src={originalImage} alt="Original" className="w-full h-auto" />
            <div
                className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img src={processedImage} alt="Processed" className="w-full h-auto" />
            </div>
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                style={{ left: `${sliderPosition}%` }}
            ></div>
            <div
                className="absolute top-1/2 w-8 h-8 bg-white rounded-full shadow-lg -ml-4 flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
            </div>
        </div>
    );
}