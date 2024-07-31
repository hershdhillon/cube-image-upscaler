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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
            setResult({ error: 'An error occurred while processing the image' });
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                        <input
                            type="text"
                            id="prompt"
                            name="prompt"
                            value={formData.prompt}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="seed" className="block text-sm font-medium text-gray-700 mb-1">Seed</label>
                        <input
                            type="number"
                            id="seed"
                            name="seed"
                            value={formData.seed}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="dynamic" className="block text-sm font-medium text-gray-700 mb-1">Dynamic</label>
                        <input
                            type="number"
                            id="dynamic"
                            name="dynamic"
                            value={formData.dynamic}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="creativity" className="block text-sm font-medium text-gray-700 mb-1">Creativity</label>
                        <input
                            type="number"
                            id="creativity"
                            name="creativity"
                            value={formData.creativity}
                            onChange={handleInputChange}
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="resemblance" className="block text-sm font-medium text-gray-700 mb-1">Resemblance</label>
                        <input
                            type="number"
                            id="resemblance"
                            name="resemblance"
                            value={formData.resemblance}
                            onChange={handleInputChange}
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="scale_factor" className="block text-sm font-medium text-gray-700 mb-1">Scale Factor</label>
                        <input
                            type="number"
                            id="scale_factor"
                            name="scale_factor"
                            value={formData.scale_factor}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="num_inference_steps" className="block text-sm font-medium text-gray-700 mb-1">Inference Steps</label>
                        <input
                            type="number"
                            id="num_inference_steps"
                            name="num_inference_steps"
                            value={formData.num_inference_steps}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="negative_prompt" className="block text-sm font-medium text-gray-700 mb-1">Negative Prompt</label>
                    <textarea
                        id="negative_prompt"
                        name="negative_prompt"
                        value={formData.negative_prompt}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'Upscale Image'}
                    </button>
                </div>
            </form>

            {result && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Result:</h3>
                    {result.error ? (
                        <p className="text-red-600">{result.error}</p>
                    ) : (
                        <>
                            <ImageComparisonSlider
                                originalImage={formData.image}
                                processedImage={result.output}
                            />
                            <details className="mt-4">
                                <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800">Show JSON Result</summary>
                                <pre className="mt-2 p-4 bg-gray-100 rounded-md overflow-x-auto">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </details>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}