'use client';

import { useState } from 'react';
import Image from 'next/image';
import ClarityUpscaler from '../components/ClarityUpscaler';
import NavModelSelector from '../components/NavModelSelector';
import RealEsrganUpscaler from "@/components/RealEsrganUpscaler";
import './globals.css';

export default function Home() {
    const [selectedModel, setSelectedModel] = useState('clarity');

    const models = [
        {
            id: 'clarity',
            name: 'Clarity Upscaler',
            tagline: 'Optimized for environment and landscape images.'
        },
        {
            id: 'real-esrgan',
            name: 'Real-ESRGAN Video Upscaler',
            tagline: 'Real-ESRGAN Video Upscaler and Restorer'
        },
        {
            id: 'ai-enhance',
            name: 'AI Enhancer',
            tagline: 'Perfect for restoring old or damaged photos.'
        },
    ];

    const selectedModelData = models.find(model => model.id === selectedModel);

    return (
        <div className="min-h-screen relative bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden">
            <div className="absolute inset-0 bg-subtle-pattern"></div>
            <NavModelSelector
                models={models}
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
            />
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="flex justify-center items-center mb-2">
                        <div className="relative w-12 h-12 mr-4">
                            <Image
                                src="/cube-icon.png"
                                alt="Cube Logo"
                                width={48}
                                height={48}
                                priority
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Image Upscaler</h1>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                        {selectedModelData.tagline}
                    </p>
                </div>
                {selectedModel === 'clarity' && <ClarityUpscaler />}
                {selectedModel === 'real-esrgan' && <RealEsrganUpscaler />}
                {selectedModel === 'ai-enhance' && <div>AI Enhancer (Coming Soon)</div>}
            </div>
        </div>
    );
}