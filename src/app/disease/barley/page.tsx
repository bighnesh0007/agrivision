'use client';

import React, { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { useSearchParams } from 'next/navigation';
const translations =  {
    en: {
      title: 'Barley Disease Detection',
      analyzing: 'Analyzing image...',
      error: 'Failed to detect barley disease. Please try again.',
      detectionResult: 'Detection Result:',
    },
    es: {
        title: 'जौ की बीमारी का पता लगाना',
        analyzing: 'चित्र का विश्लेषण किया जा रहा है...',
        error: 'जौ की बीमारी का पता लगाने में विफल। कृपया पुनः प्रयास करें।',
        detectionResult: 'पता लगाने का परिणाम:',
    },
    // Add more languages here
  };
  

export default function PotatoDiseaseDetection() {
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') as 'en' | 'es' || 'en'; // Default to 'en'
    const t = translations[lang];

    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (file: File) => {
        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/disease/barley", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to detect barley disease");
            }

            const data = await response.json();
            setResult(data.result);
        } catch (err) {
            console.error("Error:", err);
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
            <ImageUpload  lang={lang} onUpload={handleUpload} />
            
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
                    <h2 className="text-2xl font-semibold mb-4">{t.detectionResult}</h2>
                    <p className="whitespace-pre-wrap">{result.replace(/[*#]/g, ' ').trim()}</p>
                </div>
            )}
        </div>
    );
}
