'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
const translations = 
{
    en: {
      "title": "Soil Quality Analysis",
      "imageAnalysis": "Image-based Analysis",
      "parameterAnalysis": "Parameter-based Analysis",
      "nitrogen": "Nitrogen (ppm):",
      "phosphorus": "Phosphorus (ppm):",
      "potassium": "Potassium (ppm):",
      "analyze": "Analyze",
      "analyzing": "Analyzing soil quality...",
      "resultTitle": "Soil Analysis Result:",
      "errorMessage": "Failed to analyze soil quality. Please try again."
    },
    es: {
      "title": "मिट्टी की गुणवत्ता विश्लेषण",
      "imageAnalysis": "छवि आधारित विश्लेषण",
      "parameterAnalysis": "पैरामीटर आधारित विश्लेषण",
      "nitrogen": "नाइट्रोजन (पीपीएम):",
      "phosphorus": "फॉस्फोरस (पीपीएम):",
      "potassium": "पोटेशियम (पीपीएम):",
      "analyze": "विश्लेषण करें",
      "analyzing": "मिट्टी की गुणवत्ता का विश्लेषण कर रहे हैं...",
      "resultTitle": "मिट्टी विश्लेषण परिणाम:",
      "errorMessage": "मिट्टी की गुणवत्ता का विश्लेषण विफल रहा। कृपया पुनः प्रयास करें।"
    }
  }
  

export default function SoilQualityAnalysis() {
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisType, setAnalysisType] = useState<'image' | 'parameters'>('image');
    const [npkValues, setNpkValues] = useState({ nitrogen: '', phosphorus: '', potassium: '' });

    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en'; // Default to 'en' (English)
     // Get the translation for the current language
     const t = translations[lang as keyof typeof translations] || translations.en;
     console.log(t)
    const handleUpload = async (file: File) => {
        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/soil-analysis/image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(t.errorMessage);
            }

            const data = await response.json();
            setResult(data.result);
        } catch (err) {
            console.error("Error:", err);
            setError(t.errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleParameterAnalysis = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("/api/soil-analysis/parameters", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(npkValues),
            });

            if (!response.ok) {
                throw new Error(t.errorMessage);
            }

            const data = await response.json();
            setResult(data.result);
        } catch (err) {
            console.error("Error:", err);
            setError(t.errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t.title}</h1>

            <div className="mb-6">
                <label className="mr-4">
                    <input
                        type="radio"
                        value="image"
                        checked={analysisType === 'image'}
                        onChange={() => setAnalysisType('image')}
                        className="mr-2"
                    />
                    {t.imageAnalysis}
                </label>
                <label>
                    <input
                        type="radio"
                        value="parameters"
                        checked={analysisType === 'parameters'}
                        onChange={() => setAnalysisType('parameters')}
                        className="mr-2"
                    />
                    {t.parameterAnalysis}
                </label>
            </div>

            {analysisType === 'image' ? (
                <ImageUpload  lang={lang} onUpload={handleUpload} />
            ) : (
                <form onSubmit={handleParameterAnalysis} className="space-y-4">
                    <div>
                        <label htmlFor="nitrogen" className="block mb-1">{t.nitrogen}</label>
                        <input
                            type="number"
                            id="nitrogen"
                            value={npkValues.nitrogen}
                            onChange={(e) => setNpkValues({...npkValues, nitrogen: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phosphorus" className="block mb-1">{t.phosphorus}</label>
                        <input
                            type="number"
                            id="phosphorus"
                            value={npkValues.phosphorus}
                            onChange={(e) => setNpkValues({...npkValues, phosphorus: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="potassium" className="block mb-1">{t.potassium}</label>
                        <input
                            type="number"
                            id="potassium"
                            value={npkValues.potassium}
                            onChange={(e) => setNpkValues({...npkValues, potassium: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        {t.analyze}
                    </button>
                </form>
            )}

            {loading && (
                <div className="mt-4 text-center">
                    <p className="text-lg font-semibold">{t.analyzing}</p>
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
