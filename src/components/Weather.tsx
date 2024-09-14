import React from 'react';

// Define TypeScript types for weather data
interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface WeatherCurrent {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
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
}

interface WeatherData {
  location: WeatherLocation;
  current: WeatherCurrent;
}

// Component Props
interface WeatherInfoCardProps {
  weather: WeatherData;
}

// WeatherInfoCard component
const WeatherInfoCard: React.FC<WeatherInfoCardProps> = ({ weather }) => {
  return (
    <div className="bg-green-50 p-4 rounded-md  shadow-md text-black w-72 z-50 absolute">
      {/* Location Information */}
      <div className="mb-2">
        <h2 className="text-lg font-bold">{weather.location.name}, {weather.location.region}, {weather.location.country}</h2>
        <p className="text-sm">{weather.location.localtime} (Local Time)</p>
        <p className="text-xs">Lat: {weather.location.lat}, Lon: {weather.location.lon}</p>
        <p className="text-xs">Timezone: {weather.location.tz_id}</p>
      </div>

      {/* Current Weather */}
      <div className="mb-2">
        <h3 className="text-md font-semibold">Current Conditions</h3>
        <div className="flex items-center">
          <img src={weather.current.condition.icon} alt={weather.current.condition.text} className="w-10 h-10" />
          <p className="ml-2">{weather.current.condition.text}</p>
        </div>
        <p>Temperature: {weather.current.temp_c}°C / {weather.current.temp_f}°F</p>
        <p>Feels Like: {weather.current.feelslike_c}°C / {weather.current.feelslike_f}°F</p>
        <p>Humidity: {weather.current.humidity}%</p>
        <p>Wind: {weather.current.wind_kph} kph ({weather.current.wind_dir})</p>
        <p>Pressure: {weather.current.pressure_mb} mb</p>
        <p>Precipitation: {weather.current.precip_mm} mm</p>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-md font-semibold">Additional Info</h3>
        <p>Visibility: {weather.current.vis_km} km / {weather.current.vis_miles} miles</p>
        <p>UV Index: {weather.current.uv}</p>
        <p>Gusts: {weather.current.gust_kph} kph / {weather.current.gust_mph} mph</p>
        <p>Dew Point: {weather.current.dewpoint_c}°C / {weather.current.dewpoint_f}°F</p>
      </div>
    </div>
  );
};

export default WeatherInfoCard;
