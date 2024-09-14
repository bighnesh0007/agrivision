"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { Clover } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Define translations
const translations = {
  en: {
    title: "Plant Identifier",
    uploadMessage: "Upload an image to identify the plant:",
    identifying: "Identifying plant...",
    result: "Identification Result:",
    error: "Failed to identify plant. Please try again.",
  },
  es: {
    
        title: "पौधा पहचानकर्ता",
        uploadMessage: "पौधे की पहचान के लिए एक छवि अपलोड करें:",
        identifying: "पौधे की पहचान की जा रही है...",
        result: "पहचान परिणाम:",
        error: "पौधे की पहचान नहीं हो सकी। कृपया पुनः प्रयास करें।"
      
      
  },
};

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en"; // Default to 'en' if no lang query is present

  // Get the current language translations
  const t = translations[lang as keyof typeof translations] || translations.en;

  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/identify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to identify plant");
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error:", error);
      setResult(t.error); // Use translated error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8 flex items-center">
          <Clover className="mr-2" /> {t.title} {/* Translated title */}
        </h1>
      </div>

      <div className="w-full max-w-2xl">
        <p className="mb-4 text-center">{t.uploadMessage}</p> {/* Translated message */}
        <ImageUpload lang={lang} onUpload={handleUpload} />
        {loading && <p className="mt-4 text-center">{t.identifying}</p>} {/* Translated loading message */}
        {result && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{t.result}</h2> {/* Translated result header */}
            <p className="whitespace-pre-wrap">{result.replace(/[*#]/g, ' ').trim()}</p>
          </div>
        )}
      </div>
    </main>
  );
}
