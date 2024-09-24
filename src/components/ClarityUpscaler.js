// components/ClarityUpscaler.js

'use client';

import { useState, useEffect } from 'react';
import InputForm from './InputForm';
import OutputDisplay from './OutputDisplay';

export default function ClarityUpscaler() {
    const [formData, setFormData] = useState({
        image: '',
        prompt: "masterpiece, the best quality, highres, <lora:more_details:0.5> <lora:SDXLrender_v2.0:1>",
        dynamic: 6,
        sd_model: 'juggernaut_reborn.safetensors [338b85bc4f]',
        creativity: 0.35,
        resemblance: 0.6,
        scale_factor: 2,
        negative_prompt: '(worst quality, low quality, normal quality:2)',
        num_inference_steps: 20,
        seed: 1337,
    });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setResult(null);
    }, [formData.image]);

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
                body: JSON.stringify({ ...newFormData, model: 'clarity' }),
            });
            const data = await response.json();
            if (response.ok) {
                if (data.id) {
                    await pollPrediction(data.id);
                } else {
                    setResult(data);
                    setIsLoading(false);
                }
            } else {
                throw new Error(data.error || 'Failed to start upscaling process');
            }
        } catch (error) {
            console.error('Error:', error);
            setResult({error: error.message || 'An error occurred while processing the image'});
            setIsLoading(false);
        }
    };

    const pollPrediction = async (predictionId) => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/upscale?id=${predictionId}`);
                const prediction = await response.json();
                if (response.status === 200) {
                    if (prediction.status === 'succeeded') {
                        clearInterval(pollInterval);
                        setResult(prediction);
                        setIsLoading(false);
                    } else if (prediction.status === 'failed') {
                        clearInterval(pollInterval);
                        throw new Error('Upscaling process failed');
                    }
                    // If it's still processing, continue polling
                } else {
                    throw new Error('Failed to fetch upscaling status');
                }
            } catch (error) {
                clearInterval(pollInterval);
                console.error('Polling error:', error);
                setResult({error: error.message || 'An error occurred while fetching the upscaling result'});
                setIsLoading(false);
            }
        }, 1000); // Poll every second
    };

    return (
        <div className="min-h-screen sm:p-2 lg:p-4">
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