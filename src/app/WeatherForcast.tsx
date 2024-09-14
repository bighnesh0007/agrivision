"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Sun, Cloud, CloudRain, Wind, Thermometer, Droplets, Compass, LetterTextIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherCard from './WeatherCard';
import WeatherCardAstronomy from './Astronomy';
import { useSearchParams } from 'next/navigation';

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    wind_dir: string;
    pressure_mb: number;
    humidity: number;
    feelslike_c: number;
    uv: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}


const translations = {
  en: {
    weatherDashboard: "Weather Dashboard",
    currentWeather: "Current Weather",
    threeDayForecast: "3-Day Forecast",
    feelsLike: "Feels like",
    wind: "Wind",
    humidity: "Humidity",
    pressure: "Pressure",
    error: "Error",
    errorFetching: "Error fetching weather data",
    today: "Today",
    day: "Day",
    temperatureRange: "Temperature Range",
    enterCityName: "Enter city name",
    getWeather: "Get Weather",
  },
  es: {
    "weatherDashboard": "मौसम डैशबोर्ड",
    "currentWeather": "वर्तमान मौसम",
    "threeDayForecast": "3 दिनों का पूर्वानुमान",
    "feelsLike": "ऐसा महसूस होता है",
    "wind": "हवा",
    "humidity": "नमी",
    "pressure": "दबाव",
    "error": "त्रुटि",
    "errorFetching": "मौसम डेटा प्राप्त करने में त्रुटि",
    "today": "आज",
    "day": "दिन",
    "temperatureRange": "तापमान की सीमा",
    "enterCityName": "शहर का नाम दर्ज करें",
    "getWeather": "मौसम प्राप्त करें"
  }
  
};


const WeatherDashboard: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') || 'en';

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(`Error fetching weather data: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="w-12 h-12 text-yellow-400" />;
      case 'partly cloudy':
      case 'cloudy':
      case 'overcast':
        return <Cloud className="w-12 h-12 text-gray-400" />;
      case 'rain':
      case 'light rain':
      case 'heavy rain':
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      default:
        return <Wind className="w-12 h-12 text-gray-600" />;
    }
  };

  let t = translations.en;
  if(currentLang==='en'){
    t  = translations.en;
  }
  else if(currentLang==='es'){
    t = translations.es;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg overflow-hidden bg-white">
        <CardHeader className="bg-blue-500 text-white p-4">
          <CardTitle className="text-2xl font-bold text-center">{t.weatherDashboard}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t.enterCityName || "Enter city name"}
              className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={fetchWeather}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {loading ? 'Loading...' : t.getWeather || 'Get Weather'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 border border-red-400 bg-red-100 text-red-600 rounded-md p-4">
              <AlertTitle className="font-bold">{t.error}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {weather && (
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg mb-4">
                <TabsTrigger value="current" className="py-2 px-4 text-center font-semibold hover:bg-blue-200 rounded-lg transition">
                  {t.currentWeather}
                </TabsTrigger>
                <TabsTrigger value="forecast" className="py-2 px-4 text-center font-semibold hover:bg-blue-200 rounded-lg transition">
                  {t.threeDayForecast}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="current" className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  {weather.location.name}, {weather.location.country}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{weather.location.localtime}</p>
                <div className="flex justify-center items-center mb-4">
                  <img src={weather.current.condition.icon} alt={weather.current.condition.text} className="w-16 h-16" />
                  <span className="text-4xl ml-4">{Math.round(weather.current.temp_c)}°C</span>
                </div>
                <p className="text-lg capitalize mb-4">{weather.current.condition.text}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-center">
                    <Thermometer className="w-5 h-5 mr-2" />
                    <span>{t.feelsLike}: {Math.round(weather.current.feelslike_c)}°C</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Wind className="w-5 h-5 mr-2" />
                    <span>{t.wind}: {weather.current.wind_kph} km/h {weather.current.wind_dir}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Droplets className="w-5 h-5 mr-2" />
                    <span>{t.humidity}: {weather.current.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Compass className="w-5 h-5 mr-2" />
                    <span>{t.pressure}: {weather.current.pressure_mb} mb</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="forecast">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {weather.forecast.forecastday.map((day) => (
                    <Card key={day.date} className="bg-gray-100 rounded-lg shadow-md">
                      <CardContent className="text-center p-4">
                        <p className="font-semibold">
                          {new Date(day.date).toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' })}
                        </p>
                        <img src={day.day.condition.icon} alt={day.day.condition.text} className="w-12 h-12 mx-auto my-2" />
                        <p className="text-sm">{day.day.condition.text}</p>
                        <p className="text-sm">
                          {t.temperatureRange}: {Math.round(day.day.maxtemp_c)}°C / {Math.round(day.day.mintemp_c)}°C
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
       {/* WeatherCard Section */}
       <div className="mt-6 w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <WeatherCard className="bg-green-500 text-white p-4 rounded-lg shadow-md" /> */}
          <div className="bg-white text-green-500 p-4 rounded-lg shadow-md border border-green-500"><WeatherCard /></div>  
          {/* <WeatherCard > */}
        <div className="bg-white text-green-500 p-4 rounded-lg shadow-md border border-green-500"><WeatherCardAstronomy  /></div>  
        </div>
      </div>
    </div>
   
  );
};

export default WeatherDashboard;
