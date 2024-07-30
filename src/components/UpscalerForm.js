'use client';

import { useState } from 'react';
import styles from './UpscalerForm.module.css';

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
        <div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label htmlFor="image">Image URL:</label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="prompt">Prompt:</label>
                    <input
                        type="text"
                        id="prompt"
                        name="prompt"
                        value={formData.prompt}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="seed">Seed:</label>
                    <input
                        type="number"
                        id="seed"
                        name="seed"
                        value={formData.seed}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="dynamic">Dynamic:</label>
                    <input
                        type="number"
                        id="dynamic"
                        name="dynamic"
                        value={formData.dynamic}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="creativity">Creativity:</label>
                    <input
                        type="number"
                        id="creativity"
                        name="creativity"
                        value={formData.creativity}
                        onChange={handleInputChange}
                        step="0.01"
                    />
                </div>
                <div>
                    <label htmlFor="resemblance">Resemblance:</label>
                    <input
                        type="number"
                        id="resemblance"
                        name="resemblance"
                        value={formData.resemblance}
                        onChange={handleInputChange}
                        step="0.01"
                    />
                </div>
                <div>
                    <label htmlFor="scale_factor">Scale Factor:</label>
                    <input
                        type="number"
                        id="scale_factor"
                        name="scale_factor"
                        value={formData.scale_factor}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="num_inference_steps">Inference Steps:</label>
                    <input
                        type="number"
                        id="num_inference_steps"
                        name="num_inference_steps"
                        value={formData.num_inference_steps}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Upscale Image'}
                </button>
            </form>

            {result && (
                <div className={styles.result}>
                    <h2>Result:</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                    {result.output && <img src={result.output} alt="Processed" />}
                </div>
            )}
        </div>
    );
}