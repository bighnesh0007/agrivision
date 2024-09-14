"use client";
import React, { useState } from 'react';

interface FormData {
  soilType: string;
  location: string;
  timeInHand: number;
  rainfall: number;
  temperature: number;
  humidity: number;
}

interface Props {
  onSubmit: (data: FormData) => void;
  lang: string; // Add lang prop to control language
}

// Sample translations for English and another language (e.g., Spanish)
const translations = {
  en: {
    soilType: "Soil Type",
    location: "Location",
    timeInHand: "Time Available (months)",
    rainfall: "Average Rainfall (mm)",
    temperature: "Average Temperature (°C)",
    humidity: "Average Humidity (%)",
    getCropRecommendations: "Get Crop Recommendations",
    selectSoilType: "Select Soil Type",
    clay: "Clay",
    sandy: "Sandy",
    loamy: "Loamy",
    silt: "Silt",
    peat: "Peat",
  },
  es: {
    soilType: "मिट्टी का प्रकार",
    location: "स्थान",
    timeInHand: "उपलब्ध समय (महीने)",
    rainfall: "औसत वर्षा (मिमी)",
    temperature: "औसत तापमान (°C)",
    humidity: "औसत आर्द्रता (%)",
    getCropRecommendations: "फसल की सिफारिशें प्राप्त करें",
    selectSoilType: "मिट्टी का प्रकार चुनें",
    clay: "मिट्टी",
    sandy: "रेतीली",
    loamy: "दोमट",
    silt: "गाद",
    peat: "पीट",
  },
  
  // Add more languages here if needed
};

const CropRecommendationForm: React.FC<Props> = ({ onSubmit, lang }) => {
  const [formData, setFormData] = useState<FormData>({
    soilType: '',
    location: '',
    timeInHand: 0,
    rainfall: 0,
    temperature: 0,
    humidity: 0,
  });

  // Select the translation based on the passed lang prop
  const t = translations[lang as keyof typeof translations] || translations.en;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="soilType" className="block mb-1">{t.soilType}</label>
        <select
          id="soilType"
          name="soilType"
          value={formData.soilType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">{t.selectSoilType}</option>
          <option value="Clay">{t.clay}</option>
          <option value="Sandy">{t.sandy}</option>
          <option value="Loamy">{t.loamy}</option>
          <option value="Silt">{t.silt}</option>
          <option value="Peat">{t.peat}</option>
        </select>
      </div>
      <div>
        <label htmlFor="location" className="block mb-1">{t.location}</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="timeInHand" className="block mb-1">{t.timeInHand}</label>
        <input
          type="number"
          id="timeInHand"
          name="timeInHand"
          value={formData.timeInHand}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          min="1"
        />
      </div>
      <div>
        <label htmlFor="rainfall" className="block mb-1">{t.rainfall}</label>
        <input
          type="number"
          id="rainfall"
          name="rainfall"
          value={formData.rainfall}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          min="0"
        />
      </div>
      <div>
        <label htmlFor="temperature" className="block mb-1">{t.temperature}</label>
        <input
          type="number"
          id="temperature"
          name="temperature"
          value={formData.temperature}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="humidity" className="block mb-1">{t.humidity}</label>
        <input
          type="number"
          id="humidity"
          name="humidity"
          value={formData.humidity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          min="0"
          max="100"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        {t.getCropRecommendations}
      </button>
    </form>
  );
};

export default CropRecommendationForm;
