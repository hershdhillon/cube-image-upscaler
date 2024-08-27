import UpscalerForm from '../components/UpscalerForm';
import './globals.css';

export default function Home() {
    return (
        <div className="min-h-screen relative bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden">
            <div className="absolute inset-0 bg-subtle-pattern"></div>
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Local Image Upscaler</h1>
                <UpscalerForm />
            </div>
        </div>
    );
}