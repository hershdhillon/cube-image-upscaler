import { useState } from 'react';

export default function InputForm({ formData, setFormData, onSubmit, isLoading }) {
    const [imagePreview, setImagePreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (name === 'image' && type === 'file') {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData({ ...formData, [name]: reader.result });
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const sdModelOptions = [
        { value: "juggernaut_reborn.safetensors [338b85bc4f]", label: "juggernaut_reborn" },
        { value: "epicrealism_naturalSinRC1VAE.safetensors [84d76a0328]", label: "epicrealism_naturalSinRC1VAE" },
        { value: "flat2DAnimerge_v45Sharp.safetensors", label: "flat2DAnimerge_v45Sharp" },
    ];

    const getInfoLabel = (key) => {
        const infoLabels = {
            scale_factor: "Default: 2",
            dynamic: "Default: 6 • Range: 3-9",
            creativity: "Default: 0.35 • Range: 0.3-0.9",
            resemblance: "Default: 0.6 • Range: 0.3-1.6",
            num_inference_steps: "Default: 18",
        };
        return infoLabels[key] || "";
    };

    return (
        <div className="lg:w-1/3 p-6 lg:p-8 bg-gray-50">
            <form id="upscaler-form" onSubmit={handleSubmit} className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                    <div key={key}>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            {getInfoLabel(key) &&
                                <span className="text-xs text-gray-500 ml-1">{getInfoLabel(key)}</span>}
                        </label>
                        {key === 'negative_prompt' ? (
                            <textarea
                                id={key}
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        ) : key === 'sd_model' ? (
                            <select
                                id={key}
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {sdModelOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : key === 'image' ? (
                            <div>
                                <input
                                    type="file"
                                    id={`${key}_file`}
                                    name={key}
                                    onChange={handleInputChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <input
                                    type="text"
                                    id={key}
                                    name={key}
                                    value={value}
                                    onChange={handleInputChange}
                                    placeholder="Enter image URL or upload a file"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <label
                                    htmlFor={`${key}_file`}
                                    className="mt-2 inline-block px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                                >
                                    Upload Image
                                </label>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="mt-2 max-w-full h-auto" />
                                )}
                            </div>
                        ) : (
                            <input
                                type={typeof value === 'number' ? 'number' : 'text'}
                                id={key}
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                                step={typeof value === 'number' && key !== 'seed' ? '0.01' : '1'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        )}
                    </div>
                ))}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'Upscale Image'}
                    </button>
                </div>
            </form>
        </div>
    );
}