import UpscalerForm from '../components/UpscalerForm';
import './globals.css';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Local Image Upscaler</h1>
                <UpscalerForm />
            </div>
        </div>
    );
}