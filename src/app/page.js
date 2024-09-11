import Image from 'next/image';
import UpscalerForm from '../components/UpscalerForm';
import './globals.css';

export default function Home() {
    return (
        <div className="min-h-screen relative bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden">
            <div className="absolute inset-0 bg-subtle-pattern"></div>
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="flex justify-center items-center mb-2">
                        <div className="relative w-12 h-12 mr-4">
                            <Image
                                src="/cube-icon.png"
                                alt="Cube Logo"
                                layout="fill"
                                objectFit="contain"
                                priority
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Image Upscaler</h1>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                        Optimized for environment and landscape images.
                    </p>
                </div>
                <UpscalerForm />
            </div>
        </div>
    );
}