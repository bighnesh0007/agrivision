'use client';

import React, { useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Droplets, Moon, Sunrise, Sunset } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { format, addDays, isBefore, isAfter } from 'date-fns';
import clsx from 'clsx';

// Translation data
const translations = {
  en: {
    city: "City",
    date: "Date",
    pickDate: "Pick a date",
    sunrise: "Sunrise",
    sunset: "Sunset",
    moonrise: "Moonrise",
    moonset: "Moonset",
    moonPhase: "Moon Phase",
    moonIllumination: "Moon Illumination",
    loading: "Loading...",
    getAstronomyData: "Get Astronomy Data",
    astronomyForecast: "Astronomy Forecast",
    errorFetchingData: "Failed to fetch weather data",
    invalidData: "Invalid weather data structure",
  },
  es: {
    "city": "शहर",
    "date": "तारीख",
    "pickDate": "तारीख चुनें",
    "sunrise": "सूर्योदय",
    "sunset": "सूर्यास्त",
    "moonrise": "चंद्रमा की उगाई",
    "moonset": "चंद्रमा की अस्त",
    "moonPhase": "चंद्रमा की स्थिति",
    "moonIllumination": "चंद्रमा की रोशनी",
    "loading": "लोड हो रहा है...",
    "getAstronomyData": "खगोलशास्त्र डेटा प्राप्त करें",
    "astronomyForecast": "खगोलशास्त्र पूर्वानुमान",
    "errorFetchingData": "मौसम डेटा प्राप्त नहीं किया जा सका",
    "invalidData": "मौसम डेटा संरचना अवैध है"
  }
  
};

interface WeatherData {
  location: {
    name: string;
    country: string;
    date: string;
  };
  astronomy: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: number;
  };
}
interface  className {
  className?: string;
}
const WeatherCardAstronomy: React.FC = () => {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  const t = translations[lang as keyof typeof translations] || translations.en;

  const [city, setCity] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !date) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    const today = new Date();
    const minValidDate = addDays(today, 14);
    const maxValidDate = addDays(today, 300);
    let inputDate = new Date(date);

    if (isBefore(inputDate, minValidDate)) {
      inputDate = minValidDate;
    } else if (isAfter(inputDate, maxValidDate)) {
      inputDate = maxValidDate;
    }

    try {
      const response = await fetch(`/api/astronomy?city=${encodeURIComponent(city)}&date=${format(inputDate, 'yyyy-MM-dd')}&lang=${lang}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t.errorFetchingData);
      }

      const data: WeatherData = await response.json();

      if (!data.astronomy || !data.location) {
        throw new Error(t.invalidData);
      }

      setWeather(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderWeatherInfo = () => {
    if (!weather) return null;

    const { sunrise, sunset, moonrise, moonset, moon_phase, moon_illumination } = weather.astronomy;

    return (
      <div className="mt-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">{weather.location.name}, {weather.location.country}</h3>
          <p className="text-sm text-gray-500">{format(new Date(weather.location.date), 'PPpp')}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Sunrise className="w-5 h-5 text-orange-500" />
            <span className="text-sm">{t.sunrise}: <strong>{sunrise}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Sunset className="w-5 h-5 text-red-500" />
            <span className="text-sm">{t.sunset}: <strong>{sunset}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Moon className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">{t.moonrise}: <strong>{moonrise}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Moon className="w-5 h-5 text-gray-500" />
            <span className="text-sm">{t.moonset}: <strong>{moonset}</strong></span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          <span className="text-sm">{t.moonPhase}: <strong>{moon_phase}</strong></span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-blue-600" />
            <span>{t.moonIllumination}: {moon_illumination}%</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{t.moonIllumination}</p>
            <Progress value={moon_illumination} className="h-2" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={clsx("w-full max-w-md mx-auto")}>
      <CardHeader>
        <CardTitle>{t.astronomyForecast}</CardTitle>
        
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">{t.city}</label>
            <Input
              id="city"
              value={city}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
              placeholder={t.city}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.date}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>{t.pickDate}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={(value: Date | undefined) => setDate(value || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.loading : t.getAstronomyData}
          </Button>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {renderWeatherInfo()}
      </CardContent>
    </Card>
  );
};

export default WeatherCardAstronomy;