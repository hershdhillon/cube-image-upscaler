import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ImageComparisonSlider({ originalImage, processedImage, isFullscreen }) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);

    // Default images from public folder
    const defaultOriginalImage = "/images/default-original.png";
    const defaultProcessedImage = "/images/default-processed.png";

    const actualOriginalImage = originalImage || defaultOriginalImage;
    const actualProcessedImage = processedImage || defaultProcessedImage;

    useEffect(() => {
        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = document.createElement('img');
                img.onload = () => {
                    setImageDimensions({ width: img.width, height: img.height });
                    resolve(img);
                };
                img.onerror = reject;
                img.src = src;
            });
        };

        Promise.all([loadImage(actualOriginalImage), loadImage(actualProcessedImage)])
            .then(() => setIsLoaded(true))
            .catch((error) => console.error('Error loading images:', error));
    }, [actualOriginalImage, actualProcessedImage]);

    const handleMouseMove = (e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const newSliderPosition = (x / rect.width) * 100;
            setSliderPosition(Math.max(0, Math.min(100, newSliderPosition)));
        }
    };

    const handleTouchMove = (e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const newSliderPosition = (x / rect.width) * 100;
            setSliderPosition(Math.max(0, Math.min(100, newSliderPosition)));
        }
    };

    if (!isLoaded) {
        return <div className="w-full h-64 bg-gray-200 animate-pulse rounded-md"></div>;
    }

    const containerStyle = isFullscreen
        ? {
            width: '90vw',
            height: '90vh',
        }
        : {
            width: '100%',
            height: '0',
            paddingBottom: `${(imageDimensions.height / imageDimensions.width) * 100}%`,
            maxHeight: '80vh',
        };

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden cursor-col-resize"
            style={containerStyle}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            <Image
                src={actualOriginalImage}
                alt="Original"
                fill
                style={{ objectFit: 'cover' }}
                unoptimized={true}
            />
            <div
                className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <Image
                    src={actualProcessedImage}
                    alt="Processed"
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={true}
                />
            </div>
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                style={{ left: `${sliderPosition}%` }}
            ></div>
            <div
                className="absolute top-1/2 w-8 h-8 bg-white rounded-full shadow-lg -ml-4 flex items-center justify-center"
                style={{ left: `${sliderPosition}%`, transform: 'translateY(-50%)' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
            </div>
        </div>
    );
}