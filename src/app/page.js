import UpscalerForm from '../components/UpscalerForm';
import './globals.css';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-center ">Local Image Upscaler</h1>
            <UpscalerForm />
        </div>
    );
}