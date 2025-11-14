import React, { useState } from 'react';
import Header from './components/Header';
import PPMGenerator from './components/PPMGenerator';
import ChatWindow from './components/ChatWindow';
import ImageUploadAnalyzer from './components/ImageUploadAnalyzer';
import { SectionType } from './types';

const App: React.FC = () => {
  // State to manage which section of the application is currently active.
  const [activeSection, setActiveSection] = useState<SectionType>('ppm');

  // Function to render the active component based on `activeSection` state.
  const renderSection = () => {
    switch (activeSection) {
      case 'ppm':
        return <PPMGenerator />;
      case 'chat':
        return <ChatWindow />;
      case 'image':
        return <ImageUploadAnalyzer />;
      default:
        // Default to PPM Generator if somehow an unknown section is active.
        return <PPMGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header component for navigation and branding */}
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      
      {/* Main content area, which dynamically renders the active section */}
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {renderSection()}
      </main>
      
      {/* Footer component */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} PPM Generator & AI Assistant by HARMAJI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;