"use client";

import { useState } from 'react';
import CropRecommendationForm from '@/components/CropRecommendationForm';
import { useSearchParams } from 'next/navigation';
// Define translations
const translations = {
  en: {
    title: "Crop Recommendation System",
    generating: "Generating recommendations...",
    error: "Failed to get crop recommendations. Please try again.",
    result: "Crop Recommendations:",
  },
  es: { // Hindi translations
    title: "फसल सिफारिश प्रणाली",
    generating: "सिफारिशें उत्पन्न की जा रही हैं...",
    error: "फसल सिफारिशें प्राप्त करने में विफल। कृपया पुनः प्रयास करें।",
    result: "फसल सिफारिशें:",
  },
};

export default function Home() {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en"; // Default to 'en' if no lang query is present

  // Get the current language translations
  const t = translations[lang as keyof typeof translations] || translations.en;

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get crop recommendations');
      }

      const data = await response.json();
      setRecommendation(data.recommendation);
    } catch (err) {
      console.error('Error:', err);
      setError(t.error); // Use translated error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1> {/* Translated title */}
      <CropRecommendationForm onSubmit={handleSubmit} lang={lang} />
      
      {loading && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">{t.generating}</p> {/* Translated loading message */}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {recommendation && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{t.result}</h2> {/* Translated result header */}
          <p className="whitespace-pre-wrap">{recommendation.replace(/[*#]/g, ' ').trim()}</p>
        </div>
      )}
    </div>
  );
}
