'use client';

import { useState } from 'react';
import InputForm from './InputForm';
import OutputDisplay from './OutputDisplay';

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
        negative_prompt: '(worst quality, low quality, normal quality:2)',
        num_inference_steps: 18,
    });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpscale = () => {
        handleSubmit(formData);
    };


    const handleSubmit = async (newFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/upscale', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newFormData),
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
        <div className="min-h-screen bg-blue-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-full mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <InputForm
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                        <OutputDisplay
                            result={result}
                            formData={formData}
                            isLoading={isLoading}
                            onUpscale={handleUpscale}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}