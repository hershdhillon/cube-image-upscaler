import { useState } from 'react';
import ImagePreview from './ImagePreview';
import JsonView from './JsonView';

export default function OutputDisplay({ result, formData, isLoading }) {
    const [activeTab, setActiveTab] = useState('preview');

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

    return (
        <div className="lg:w-2/3 p-6 lg:p-8">
            <div className="flex flex-col flex-1 space-y-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Output</h2>
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
                <div className="bg-gray-100  p-4 relative">
                    {isLoading && (
                        <div className="absolute top-2 right-2 z-10  p-1">
                            <div className="loader"></div>
                        </div>
                    )}
                    {activeTab === 'preview' ? (
                        <ImagePreview result={result} formData={formData} />
                    ) : (
                        <JsonView result={result} />
                    )}
                </div>
                {result && (
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