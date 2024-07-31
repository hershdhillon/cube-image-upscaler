import ImageComparisonSlider from './ImageComparisonSlider';

export default function ImagePreview({ result, formData, onFullscreen, isFullscreen }) {
    if (!result) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Your upscaled image will appear here</p>
            </div>
        );
    }

    return (
        <div className={`relative group ${isFullscreen ? 'h-full w-full' : ''}`}>
            <button
                onClick={onFullscreen}
                className="absolute top-4 left-4 z-10 bg-white text-gray-800 px-3 py-1 rounded-md shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <div className={isFullscreen ? 'h-full w-full flex items-center justify-center' : ''}>
                <ImageComparisonSlider
                    originalImage={formData.image}
                    processedImage={result.output[0]}
                />
            </div>
        </div>
    );
}