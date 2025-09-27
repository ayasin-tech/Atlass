import React, { useState } from 'react';

interface ApiKeyInputProps {
    onSubmit: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onSubmit(apiKey.trim());
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Unit Plan Viewer</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Please enter your Google Gemini API key to continue.
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="api-key" className="sr-only">
                            Gemini API Key
                        </label>
                        <input
                            id="api-key"
                            name="api-key"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="Enter your Gemini API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                     <p className="text-xs text-gray-500">
                        You can get your API key from{' '}
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-500">
                           Google AI Studio
                        </a>. Your key is stored locally in your browser and is not shared.
                    </p>

                    <div>
                        <button
                            type="submit"
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Save and Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
