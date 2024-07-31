'use client';

import { useState } from 'react';
import ImageComparisonSlider from './ImageComparisonSlider';

export default function UpscalerForm() {
    const [formData, setFormData] = useState({
        seed: 1337,
        image: '',
        prompt: 'masterpiece, best quality, highres',
        dynamic: 6,
        sd_model: 'juggernaut_reborn.safetensors [338b85bc4f]',
        creativity: 0.35,
        resemblance: 0.6,
        scale_factor: 2,
        negative_prompt: '(worst quality, low quality, normal quality:2) JuggernautNegative-neg',
        num_inference_steps: 18,
    });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('preview');

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/upscale', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
            setResult({error: 'An error occurred while processing the image'});
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-full mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Form Section */}
                        <div className="lg:w-1/3 p-6 lg:p-8 bg-gray-50">
                            <form id="upscaler-form" onSubmit={handleSubmit} className="space-y-4">
                                {Object.entries(formData).map(([key, value]) => (
                                    <div key={key}>
                                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                                            {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                                        </label>
                                        {key === 'negative_prompt' ? (
                                            <textarea
                                                id={key}
                                                name={key}
                                                value={value}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        ) : (
                                            <input
                                                type={typeof value === 'number' ? 'number' : 'text'}
                                                id={key}
                                                name={key}
                                                value={value}
                                                onChange={handleInputChange}
                                                step={typeof value === 'number' && key !== 'seed' ? '0.01' : '1'}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Processing...' : 'Upscale Image'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Output Section */}
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
                                <div className="bg-gray-100 rounded-lg p-4">
                                    {activeTab === 'preview' ? (
                                        result ? (
                                            <div className="relative group">
                                                <button className="absolute top-4 left-4 z-10 bg-white text-gray-800 px-3 py-1 rounded-md shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Fullscreen
                                                </button>
                                                <ImageComparisonSlider
                                                    originalImage={formData.image}
                                                    processedImage={result.output[0]}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-64 flex items-center justify-center text-gray-500">
                                                <p>Your upscaled image will appear here</p>
                                            </div>
                                        )
                                    ) : (
                                        <pre className="overflow-auto max-h-96 text-sm">
                                            {JSON.stringify(result, null, 2)}
                                        </pre>
                                    )}
                                </div>
                                {result && (
                                    <div className="flex flex-col md:flex-row md:flex-wrap gap-6 text-gray-700">
                                        <div className="flex flex-col space-y-1">
                                            <div className="text-sm text-gray-500">Generated in</div>
                                            <div>{result.metrics.predict_time.toFixed(2)} seconds</div>
                                        </div>
                                    </div>
                                )}
                                {result && (
                                    <div className="flex flex-wrap gap-2">
                                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            Tweak it
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            Share
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            Download
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            Report
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}