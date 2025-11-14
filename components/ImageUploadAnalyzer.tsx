import React, { useState, useCallback } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { analyzeImage } from '../services/geminiService';

const ImageUploadAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [analysisPrompt, setAnalysisPrompt] = useState<string>('Jelaskan apa yang Anda lihat dalam gambar ini dan berikan analisis singkat.');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Callback for handling file input changes.
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // Create a URL for image preview
      setAnalysisResult(null); // Clear previous analysis
      setError(null);
    } else {
      setSelectedFile(null);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl); // Clean up the object URL
      }
      setImagePreviewUrl(null);
    }
  }, [imagePreviewUrl]); // Dependency for revoking old URL

  // Callback for triggering image analysis via Gemini API.
  const handleAnalyzeImage = useCallback(async () => {
    if (!selectedFile) {
      setError('Silakan unggah gambar terlebih dahulu.');
      return;
    }
    if (analysisPrompt.trim() === '') {
      setError('Silakan masukkan prompt analisis.');
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null); // Clear previous result
    setError(null);

    try {
      const base64Image = await fileToBase64(selectedFile); // Convert file to Base64
      const mimeType = selectedFile.type;
      const result = await analyzeImage(base64Image, mimeType, analysisPrompt);
      setAnalysisResult(result);
    } catch (err) {
      setError(`Gagal menganalisis gambar: ${(err as Error).message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, analysisPrompt]); // Dependencies for the analysis logic

  // Clean up object URL when component unmounts or selectedFile changes
  React.useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Unggah & Analisis Gambar</h2>
        
        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Gambar
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {imagePreviewUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pratinjau Gambar:</h3>
            <img src={imagePreviewUrl} alt="Preview" className="max-w-full h-auto rounded-lg border border-gray-300 object-contain max-h-[300px]" />
          </div>
        )}

        <div>
          <label htmlFor="analysis-prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Prompt Analisis
          </label>
          <textarea
            id="analysis-prompt"
            value={analysisPrompt}
            onChange={(e) => setAnalysisPrompt(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 resize-y"
            placeholder="Misal: Jelaskan objek-objek di gambar ini..."
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <button
          onClick={handleAnalyzeImage}
          disabled={isLoading || !selectedFile || analysisPrompt.trim() === ''}
          className={`w-full py-3 px-6 rounded-md text-white font-semibold transition-colors duration-300
            ${isLoading || !selectedFile || analysisPrompt.trim() === ''
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isLoading ? 'Menganalisis Gambar...' : 'Analisis Gambar'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hasil Analisis</h2>
        {isLoading && (
          <div className="text-center text-blue-600 flex flex-col items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>Menganalisis...</p>
          </div>
        )}
        {!isLoading && !analysisResult && !error && (
          <p className="text-gray-500 italic min-h-[200px]">Hasil analisis akan muncul di sini.</p>
        )}
        {analysisResult && (
          <div className="prose max-w-none whitespace-pre-wrap">
            {analysisResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadAnalyzer;