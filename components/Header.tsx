import React from 'react';
import { SectionType } from '../types';

interface HeaderProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const tabs: { id: SectionType; label: string }[] = [
    { id: 'ppm', label: 'PPM Generator' },
    { id: 'chat', label: 'AI Chat' },
    { id: 'image', label: 'Image Analyzer' },
  ];

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl font-extrabold text-blue-800">PPM Generator & AI Assistant</h1>
          <p className="text-md text-gray-600">Oleh: HARMAJI</p>
        </div>
        <nav className="flex space-x-2 sm:space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSectionChange(tab.id)}
              className={`py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200
                ${activeSection === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-200 hover:text-blue-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;