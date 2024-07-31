'use client';

import { useState } from 'react';
import ImageComparisonSlider from './ImageComparisonSlider';

export default function UpscalerForm() {
    const [formData, setFormData] = useState({
        seed: 1337,
        image: '',
        prompt: '',
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Image Upscaler</h2>
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
                            <h3 className="text-xl font-semibold mb-4">Output:</h3>
                            {result ? (
                                result.error ? (
                                    <p className="text-red-600">{result.error}</p>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-full h-[60vh] bg-gray-200 rounded-lg overflow-hidden">
                                            <ImageComparisonSlider
                                                originalImage={formData.image}
                                                processedImage={result.output}
                                            />
                                        </div>
                                        <details className="mt-4">
                                            <summary
                                                className="cursor-pointer text-indigo-600 hover:text-indigo-800">Show
                                                JSON Result
                                            </summary>
                                            <pre className="mt-2 p-4 bg-gray-100 rounded-md overflow-x-auto text-sm">
                                            {JSON.stringify(result, null, 2)}
                                        </pre>
                                        </details>
                                    </div>
                                )
                            ) : (
                                <div
                                    className="bg-gray-200 rounded-lg text-gray-500 text-center h-[60vh] flex items-center justify-center">
                                    <div>
                                        <p className="text-lg">Your upscaled image will appear here</p>
                                        <p className="text-sm mt-2">Submit the form to see the result</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}