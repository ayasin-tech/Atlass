import React, { useState } from 'react';
import { UploadIcon } from '../constants';

interface FileUploadProps {
    onUpload: (files: FileList) => void;
    isLoading: boolean;
    error: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isLoading, error }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            onUpload(files);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onUpload(files);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-2xl p-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Unit Plan Viewer</h1>
                <p className="text-lg text-gray-600 mb-8">Upload one or more unit plan images to get started.</p>

                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`relative block w-full border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300`}
                >
                    <div className="flex flex-col items-center">
                        <UploadIcon />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                            {isLoading ? 'Processing files...' : 'Drag & drop files here'}
                        </span>
                        <span className="text-xs text-gray-500">or</span>
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>click to browse</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} disabled={isLoading} />
                        </label>
                    </div>
                </div>
                
                {isLoading && (
                    <div className="mt-4 flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
                        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600" style={{animationDelay: '0.4s'}}></div>
                        <p className="text-gray-600">Analyzing documents with AI. Please wait...</p>
                    </div>
                )}
                
                {error && (
                    <div className="mt-4 text-red-600 bg-red-100 border border-red-400 rounded-md p-3">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};