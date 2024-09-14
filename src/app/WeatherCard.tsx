import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Droplets, Wind, Sun } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isBefore, isAfter } from 'date-fns';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

interface WeatherData {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        avghumidity: number;
        condition: {
          text: string;
          icon: string;
        };
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moon_phase: string;
      };
    }>;
  };
}

interface WeatherCardProps {
  className?: string;
  
}

const translations = {
  en: {
    city: "City",
    pickDate: "Pick a date",
    getWeather: "Get Weather",
    loading: "Loading...",
    humidity: "Humidity",
    wind: "Wind",
    uvIndex: "UV Index",
    moonPhase: "Moon",
    temperatureRange: "Temperature Range",
    precipitation: "Precipitation",
    sunrise: "Sunrise",
    sunset: "Sunset",
    weatherForecast: "Weather Forecast",
  },
  es: {
    "city": "शहर",
    "pickDate": "तारीख चुनें",
    "getWeather": "मौसम प्राप्त करें",
    "loading": "लोड हो रहा है...",
    "humidity": "नमी",
    "wind": "हवा",
    "uvIndex": "यूवी इंडेक्स",
    "moonPhase": "चंद्रमा",
    "temperatureRange": "तापमान की सीमा",
    "precipitation": "वृष्टि",
    "sunrise": "सूर्योदय",
    "sunset": "सूर्यास्त",
    "weatherForecast": "मौसम पूर्वानुमान"
  }
  
}

const WeatherCard: React.FC<WeatherCardProps>= ({className}) => {
  const [city, setCity] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') || 'en';
  let t =  translations.en;
  if(currentLang==='en'){
    t  = translations.en;
  }
  else if(currentLang==='es'){
    t = translations.es;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !date) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    const today = new Date();
    const minValidDate = addDays(today, 14); // 14 days from today
    const maxValidDate = addDays(today, 300); // 300 days from today

    let inputDate = new Date(date); // Convert selected date to a Date object

    // Check if the date is within the valid range
    if (isBefore(inputDate, minValidDate)) {
      inputDate = minValidDate; // Adjust to the minimum valid date
    } else if (isAfter(inputDate, maxValidDate)) {
      inputDate = maxValidDate; // Adjust to the maximum valid date
    }

    try {
      const response = await fetch(`/api/future?city=${encodeURIComponent(city)}&date=${format(inputDate, 'yyyy-MM-dd')}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }
      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderWeatherInfo = () => {
    if (!weather) return null;
    const dayData = weather.forecast.forecastday[0].day;
    const astroData = weather.forecast.forecastday[0].astro;

    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">
            {weather.location.name}, {weather.location.country}
          </h3>
          <p className="text-sm text-gray-500">{format(new Date(weather.forecast.forecastday[0].date), 'PPpp')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <img src={dayData.condition.icon} alt={dayData.condition.text} className="w-16 h-16" />
          <div>
            <p className="text-3xl font-bold">{dayData.avgtemp_c}°C</p>
            <p className="text-sm text-gray-500">{dayData.condition.text}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Droplets className="w-5 h-5 mr-2" />
            <span>{t.humidity}: {dayData.avghumidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind className="w-5 h-5 mr-2" />
            <span>{t.wind}: {dayData.maxwind_kph} km/h</span>
          </div>
          <div className="flex items-center">
            <Sun className="w-5 h-5 mr-2" />
            <span>{t.uvIndex}: {dayData.uv}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            <span>{t.moonPhase}: {astroData.moon_phase}</span>
          </div>
        </div>
        <div className="space-y-2">
          <p>{t.temperatureRange}: {dayData.mintemp_c}°C - {dayData.maxtemp_c}°C</p>
          <p>{t.precipitation}: {dayData.totalprecip_mm} mm</p>
          <p>{t.sunrise}: {astroData.sunrise} | {t.sunset}: {astroData.sunset}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">{t.uvIndex}</p>
          <Progress value={dayData.uv * 10} className="h-2" />
        </div>
      </div>
    );
  };

  return (
    <Card className={clsx("w-full max-w-md mx-auto", className)}>
      <CardHeader>
        <CardTitle>{t.weatherForecast}</CardTitle>
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
            <label className="text-sm font-medium">{t.pickDate}</label>
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
            {loading ? t.loading : t.getWeather}
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

export default WeatherCard;
