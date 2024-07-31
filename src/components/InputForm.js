export default function InputForm({ formData, setFormData, onSubmit, isLoading }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    return (
        <div className="lg:w-1/3 p-6 lg:p-8 bg-gray-50">
            <form id="upscaler-form" onSubmit={handleSubmit} className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                    <div key={key}>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
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