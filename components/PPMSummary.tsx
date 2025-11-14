import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown support
import { marked } from 'marked'; // For converting markdown string to HTML string for export

interface PPMSummaryProps {
  ppmContent: string;
  isLoading: boolean;
  error: string | null;
}

const PPMSummary: React.FC<PPMSummaryProps> = ({ ppmContent, isLoading, error }) => {

  const handleExportToWord = () => {
    if (!ppmContent) return;

    // Convert markdown to HTML using marked
    const htmlContent = marked.parse(ppmContent);

    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const fileName = `PPM_Harmaji_${date}.doc`;

    // Basic HTML structure for a Word document with minimal styling for readability
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Perencanaan Pembelajaran Mendalam</title>
          <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; margin: 20px; color: #333; }
              h1, h2, h3, h4, h5, h6 { color: #2C3E50; margin-top: 1em; margin-bottom: 0.5em; }
              h1 { font-size: 2.2em; border-bottom: 2px solid #3498DB; padding-bottom: 0.3em; }
              h2 { font-size: 1.8em; color: #3498DB; }
              h3 { font-size: 1.4em; color: #2ECC71; }
              p { margin-bottom: 1em; }
              ul, ol { margin-bottom: 1em; margin-left: 20px; }
              li { margin-bottom: 0.5em; }
              strong { font-weight: bold; }
              em { font-style: italic; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
          </style>
      </head>
      <body>
          ${htmlContent}
      </body>
      </html>
    `;

    // Create a Blob and download it
    const blob = new Blob([fullHtml], {
      type: 'application/msword;charset=utf-8',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Clean up the URL object
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center text-blue-600 flex flex-col items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p>Menyiapkan Perencanaan Pembelajaran Mendalam...</p>
        <p className="text-sm text-gray-500 mt-1">Ini mungkin memakan waktu beberapa saat.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md min-h-[200px]">
        <h3 className="font-bold text-lg mb-2">Error Generating PPM</h3>
        <p>{error}</p>
        <p className="text-sm mt-2">Pastikan semua input terisi dengan benar dan API Key Anda valid.</p>
      </div>
    );
  }

  if (!ppmContent) {
    return (
      <div className="p-6 bg-blue-50 rounded-lg shadow-md text-center text-gray-600 flex flex-col items-center justify-center min-h-[200px]">
        <p>PPM yang dihasilkan akan muncul di sini setelah Anda mengisi form dan mengklik 'Generate PPM'.</p>
        <p className="text-sm mt-2">Dapatkan rencana pembelajaran yang terintegrasi dengan pembelajaran mendalam dan nilai-nilai cinta.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md prose max-w-none prose-blue">
      {/* The `prose` class from @tailwindcss/typography plugin provides nice default styling for markdown content */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {ppmContent}
      </ReactMarkdown>
      <button
        onClick={handleExportToWord}
        className="mt-6 w-full py-3 px-6 rounded-md text-white font-semibold transition-colors duration-300 bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Export ke Microsoft Word (.doc)
      </button>
    </div>
  );
};

export default PPMSummary;