'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Thermometer, Droplet, Sprout, TestTube } from 'lucide-react';

interface FormData {
  temperature: string;
  humidity: string;
  moisture: string;
  soilType: string;
  cropType: string;
  nitrogen: string;
  phosphorous: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
}

// Translations for multilingual support
const translations = {
  en: {
    temperature: 'Temperature (°C):',
    humidity: 'Humidity (%):',
    moisture: 'Moisture (%):',
    soilType: 'Select Soil Type',
    cropType: 'Crop Type',
    nitrogen: 'Nitrogen (kg/ha):',
    phosphorous: 'Phosphorous (kg/ha):',
    getRecommendations: 'Get Fertilizer Recommendations',
  },
  es: {
    
      temperature: 'तापमान (°C):',
      humidity: 'नमी (%):',
      moisture: 'मिट्टी की नमी (%):',
      soilType: 'मिट्टी का प्रकार चुनें',
      cropType: 'फसल का प्रकार',
      nitrogen: 'नाइट्रोजन (किग्रा/हे.):',
      phosphorous: 'फास्फोरस (किग्रा/हे.):',
      getRecommendations: 'उर्वरक अनुशंसाएँ प्राप्त करें',
    
  }
};

const FertilizerRecommendationForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    temperature: '',
    humidity: '',
    moisture: '',
    soilType: '',
    cropType: '',
    nitrogen: '',
    phosphorous: '',
  });

  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en'; // Default to English if no language is specified
  const t = translations[lang as keyof typeof translations] || translations.en; // Get the appropriate translations based on lang

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Thermometer className="text-blue-500" />
        <input
          type="number"
          name="temperature"
          value={formData.temperature}
          onChange={handleChange}
          placeholder={t.temperature}
          className="flex-grow p-2 border rounded"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Droplet className="text-blue-500" />
        <input
          type="number"
          name="humidity"
          value={formData.humidity}
          onChange={handleChange}
          placeholder={t.humidity}
          className="flex-grow p-2 border rounded"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Droplet className="text-blue-500" />
        <input
          type="number"
          name="moisture"
          value={formData.moisture}
          onChange={handleChange}
          placeholder={t.moisture}
          className="flex-grow p-2 border rounded"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Sprout className="text-green-500" />
        <select
          name="soilType"
          value={formData.soilType}
          onChange={handleChange}
          className="flex-grow p-2 border rounded"
          required
        >
          <option value="">{t.soilType}</option>
          <option value="Clay">Clay</option>
          <option value="Sandy">Sandy</option>
          <option value="Loamy">Loamy</option>
          <option value="Silt">Silt</option>
          <option value="Peat">Peat</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <Sprout className="text-green-500" />
        <input
          type="text"
          name="cropType"
          value={formData.cropType}
          onChange={handleChange}
          placeholder={t.cropType}
          className="flex-grow p-2 border rounded"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <TestTube className="text-purple-500" />
        <input
          type="number"
          name="nitrogen"
          value={formData.nitrogen}
          onChange={handleChange}
          placeholder={t.nitrogen}
          className="flex-grow p-2 border rounded"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <TestTube className="text-purple-500" />
        <input
          type="number"
          name="phosphorous"
          value={formData.phosphorous}
          onChange={handleChange}
          placeholder={t.phosphorous}
          className="flex-grow p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        {t.getRecommendations}
      </button>
    </form>
  );
};

export default FertilizerRecommendationForm;
