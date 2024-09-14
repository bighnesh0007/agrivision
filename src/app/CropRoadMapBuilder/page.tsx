'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload'; // Assuming you have a drag-and-drop ImageUpload component

const translations = {
  en: {
    title: "Crop Roadmap Builder",
    switchToForm: "Switch to Form Input",
    switchToImageUpload: "Switch to Image Upload",
    cropType: "Crop Type:",
    region: "Region/Location:",
    soilType: "Soil Type:",
    season: "Season:",
    sowingDate: "Sowing Date:",
    expectedHarvestDate: "Expected Harvest Date:",
    generateRoadmap: "Generate Roadmap",
    processing: "Processing...",
    resultTitle: "Result:",
    errorMessage: "Failed to generate crop roadmap. Please check the console for more details.",
  },
  es: {
    title: "फसल रोडमैप बिल्डर",
    switchToForm: "फॉर्म इनपुट पर स्विच करें",
    switchToImageUpload: "इमेज अपलोड पर स्विच करें",
    cropType: "फसल प्रकार:",
    region: "क्षेत्र/स्थान:",
    soilType: "मिट्टी की किस्म:",
    season: "मौसम:",
    sowingDate: "बीजाई की तिथि:",
    expectedHarvestDate: "अपेक्षित फसल कटाई की तारीख:",
    generateRoadmap: "रोडमैप जनरेट करें",
    processing: "प्रोसेसिंग...",
    resultTitle: "परिणाम:",
    errorMessage: "फसल रोडमैप जनरेट करने में विफल। कृपया अधिक विवरण के लिए कंसोल की जाँच करें।",
  }
};

export default function CropRoadmapBuilder() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false); // Toggle between form and image upload
  const [formData, setFormData] = useState({
    cropType: '',
    region: '',
    soilType: '',
    season: '',
    sowingDate: '',
    expectedHarvestDate: '',
  });

  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en'; // Default to 'en' (English)
  const t = translations[lang as keyof typeof translations] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Submitting form data:", formData);
      
      const response = await fetch("/api/crop-road-map/generate-form", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      setResult(data.result);
    } catch (err) {
      console.error("Error details:", err);
      setError(t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/crop-road-map/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image data");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to analyze image data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <div className="mb-6">
        <button
          onClick={() => setShowImageUpload(!showImageUpload)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {showImageUpload ? t.switchToForm : t.switchToImageUpload}
        </button>
      </div>

      {showImageUpload ? (
        <ImageUpload lang={lang} onUpload={handleUpload} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cropType" className="block mb-1">{t.cropType}</label>
            <input
              type="text"
              id="cropType"
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="region" className="block mb-1">{t.region}</label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="soilType" className="block mb-1">{t.soilType}</label>
            <input
              type="text"
              id="soilType"
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="season" className="block mb-1">{t.season}</label>
            <input
              type="text"
              id="season"
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="sowingDate" className="block mb-1">{t.sowingDate}</label>
            <input
              type="date"
              id="sowingDate"
              name="sowingDate"
              value={formData.sowingDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="expectedHarvestDate" className="block mb-1">{t.expectedHarvestDate}</label>
            <input
              type="date"
              id="expectedHarvestDate"
              name="expectedHarvestDate"
              value={formData.expectedHarvestDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {t.generateRoadmap}
          </button>
        </form>
      )}

      {loading && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">{t.processing}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{t.resultTitle}</h2>
          <p className="whitespace-pre-wrap">{result.replace(/[*#]/g, ' ').trim()}</p>
        </div>
      )}
    </div>
  );
}
