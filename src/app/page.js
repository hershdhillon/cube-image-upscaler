import Image from 'next/image';
import UpscalerForm from '../components/UpscalerForm';
import './globals.css';

export default function Home() {
    return (
        <div className="min-h-screen relative bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden">
            <div className="absolute inset-0 bg-subtle-pattern"></div>
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <div className="flex justify-center items-center mb-6">
                    <div className="relative w-8 h-8 mr-4">
                        <Image
                            src="/sidepro-logo.png"
                            alt="SidePro Logo"
                            layout="fill"
                            objectFit="contain"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Image Upscaler</h1>
                </div>
                <UpscalerForm />
            </div>
        </div>
    );
}