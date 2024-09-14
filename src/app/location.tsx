'use client';

import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number; // Use 0 for night and 1 for day
    condition: {
      text: string;
      icon: string; // URL to the weather icon
      code: number; // Weather condition code
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string; // Cardinal direction of the wind
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
}

import WeatherInfoCard from '@/components/Weather';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
const LocationAccessPrompt: React.FC = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [promptShown, setPromptShown] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  const requestLocation = () => {
    setPromptShown(true); // Show the custom prompt

    setTimeout(() => {
      // After a small delay, actually request location
      setLoading(true);
      setError(null); // Reset error before requesting location

      if (!navigator.geolocation){
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        
        (position) => {
       
          setLocation(position);
         
          fetchWeatherData(position.coords.latitude, position.coords.longitude); // Fetch weather
        
        },
        (error) => {
    
          // Handle error
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              setError('The request to get user location timed out.');
              break;
            default:
              setError('An unknown error occurred.');
          }
          setLoading(false);
        }
      );
    }, 1000); // Adjust delay to your preference
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    console.log(lat,lon)
    try {
      const response = await fetch(`/api/location?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data: WeatherData = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch weather data');
    }
  };

  return (
    
    <div className="p-4  rounded-md  relative">
      
      {/* Button that shows weather data on hover */}
      <button
        onClick={requestLocation}
        disabled={loading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-[5px]   text-black font-semibold py-1 px-3 rounded-full text-sm"
      >
        {loading ? <div className="w-[200px]  bg-green-600 text-white font-semibold py-1 px-3 rounded-full text-sm">Requesting location...</div> : <FontAwesomeIcon icon={faLocationDot} /> }
      </button>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 bg-red-50 text-red-600 rounded-md p-2">
          {error}
        </div>
      )}

      {/* Weather data displayed when button is hovered */}
      {isHovered && weather && !error && (
         <div
         onMouseEnter={() => setIsHovered(true)} // Keep it visible when hovering over the card
         onMouseLeave={() => setIsHovered(false)} // Hide when not hovering over the card
       >
         <WeatherInfoCard weather={weather} />
       </div>
      )}
    </div>
  );
};

  
export default LocationAccessPrompt;
