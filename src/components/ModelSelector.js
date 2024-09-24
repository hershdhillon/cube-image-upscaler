// components/ModelSelector.js

'use client';
export default function ModelSelector({ models, selectedModel, onSelectModel }) {
    return (
        <div className="mb-6">
            <label htmlFor="model-select" className="block text-sm font-medium text-gray-700">
                Select Upscaler Model
            </label>
            <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
                {models.map((model) => (
                    <option key={model.id} value={model.id}>
                        {model.name}
                    </option>
                ))}
            </select>
        </div>
    );
}