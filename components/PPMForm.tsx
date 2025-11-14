import React, { useState } from 'react';
import { PPMFormInputs } from '../types';

interface PPMFormProps {
  onSubmit: (inputs: PPMFormInputs) => void;
  isLoading: boolean;
}

const PPMForm: React.FC<PPMFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PPMFormInputs>({
    namaMadrasah: 'Madrasah Aliyah Negeri 1',
    namaGuru: 'Harmaji',
    mapel: 'Pendidikan Agama Islam',
    fase: 'Fase E',
    kelas: 'X',
    semester: 'Ganjil',
    alokasiWaktu: '90 menit',
    capaianPembelajaran: '', // Changed to empty
    tujuanPembelajaran: '',  // Changed to empty
    materiPembelajaran: '',  // Changed to empty
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Input Data PPM</h2>
      
      {Object.keys(formData).map((key) => {
        // Humanize the key for the label
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        const fieldName = key as keyof PPMFormInputs; // Type assertion

        // Conditional rendering for textarea vs. input for better UX
        return (
          <div key={key}>
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
              {/* Custom labels for certain fields */}
              {fieldName === 'namaMadrasah' ? 'Nama Madrasah' :
               fieldName === 'namaGuru' ? 'Nama Guru' :
               fieldName === 'mapel' ? 'Mata Pelajaran' :
               fieldName === 'alokasiWaktu' ? 'Alokasi Waktu' :
               fieldName === 'capaianPembelajaran' ? 'Capaian Pembelajaran' :
               fieldName === 'tujuanPembelajaran' ? 'Tujuan Pembelajaran' :
               fieldName === 'materiPembelajaran' ? 'Materi Pembelajaran' :
               label}
            </label>
            {fieldName === 'capaianPembelajaran' || fieldName === 'tujuanPembelajaran' || fieldName === 'materiPembelajaran' ? (
              <textarea
                id={fieldName}
                name={fieldName}
                value={formData[fieldName]}
                onChange={handleChange}
                rows={3}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 resize-y"
              />
            ) : fieldName === 'alokasiWaktu' ? (
              <input
                type="text"
                id={fieldName}
                name={fieldName}
                value={formData[fieldName]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="Contoh: 90 menit"
              />
            ) : (
              <input
                type="text"
                id={fieldName}
                name={fieldName}
                value={formData[fieldName]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-md text-white font-semibold transition-colors duration-300
          ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isLoading ? 'Generating PPM...' : 'Generate PPM'}
      </button>
    </form>
  );
};

export default PPMForm;