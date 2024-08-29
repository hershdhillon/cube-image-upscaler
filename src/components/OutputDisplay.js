import { useState, useRef, useEffect } from 'react';
import ImageComparisonSlider from './ImageComparisonSlider';
import JsonView from './JsonView';

export default function OutputDisplay({ result, formData, isLoading, onUpscale }) {
    const [activeTab, setActiveTab] = useState('preview');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreenRef = useRef(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const generateUniqueFileName = () => {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 10000);
        const hash = (timestamp + randomNum).toString(36);
        return `upscaled_${hash}.png`;
    };

    const handleDownload = () => {
        if (result && result.output && result.output[0]) {
            const uniqueFileName = generateUniqueFileName();
            const link = document.createElement('a');
            link.href = result.output[0];
            link.download = uniqueFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (fullscreenRef.current.requestFullscreen) {
                fullscreenRef.current.requestFullscreen();
            } else if (fullscreenRef.current.mozRequestFullScreen) {
                fullscreenRef.current.mozRequestFullScreen();
            } else if (fullscreenRef.current.webkitRequestFullscreen) {
                fullscreenRef.current.webkitRequestFullscreen();
            } else if (fullscreenRef.current.msRequestFullscreen) {
                fullscreenRef.current.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    return (
        <div className={`lg:w-2/3 p-6 lg:p-8 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex flex-col flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Output</h2>
                    <button
                        onClick={onUpscale}
                        disabled={isLoading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'Upscale Image'}
                    </button>
                </div>
                <div role="tablist" className="flex border-b">
                    <button
                        role="tab"
                        aria-selected={activeTab === 'preview'}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Preview
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === 'json'}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'json' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('json')}
                    >
                        JSON
                    </button>
                </div>
                <div className={`bg-gray-100 p-4 relative ${isFullscreen ? 'h-screen flex items-center justify-center' : ''}`} ref={fullscreenRef}>
                    {isLoading && (
                        <div className="absolute top-2 right-2 z-10 bg-white p-1">
                            <div className="loader"></div>
                        </div>
                    )}
                    {activeTab === 'preview' ? (
                        <ImageComparisonSlider
                            originalImage={result ? formData.image : null}
                            processedImage={result && result.output ? result.output[0] : null}
                            isFullscreen={isFullscreen}
                        />
                    ) : (
                        <JsonView result={result} />
                    )}
                </div>
                {result && !isFullscreen && (
                    <>
                        <div className="flex flex-col md:flex-row md:flex-wrap gap-6 text-gray-700">
                            <div className="flex flex-col space-y-1">
                                <div className="text-sm text-gray-500">Generated in</div>
                                <div>{result.metrics.predict_time.toFixed(2)} seconds</div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={handleDownload}
                                disabled={!result || !result.output || !result.output[0]}
                            >
                                Download
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}