import React, { useEffect, useState } from 'react';
import { WeatherData } from './apiClient/apiClient';
import RainEffect from './RainEffect';
import WindEffect from './WindEffect';
import FogEffect from './FogEffect';
import SunshineEffect from './SunshineEffect';

export const WeatherEffects: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Fetch initially
    fetchWeather();

    // Set up interval to fetch every minute
    const interval = setInterval(fetchWeather, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!weather) return null;

  // Rain/Snow effect
  const rainIntensity = Math.min(100, weather.rainAmount * 10); // Scale rainAmount to 0-100
  const isSnow = weather.temperature < 0; // Show snow if temperature is below 0°C
  
  // Wind effect (based on humidity as a proxy)
  const windIntensity = Math.min(100, weather.humidity);
  
  // Fog effect (based on high humidity, scaled down for less intrusiveness)
  const fogIntensity = Math.min(85, weather.humidity * 0.85);
  
  // Sunshine effect (based on temperature when it's not raining)
  const sunIntensity = Math.min(100, (weather.temperature - 15) * 10); // Scale from 15-25°C to 0-100

  return (
    <>
      <RainEffect 
        active={weather.isRaining} 
        intensity={rainIntensity}
        isSnow={isSnow}
      />
      
      <WindEffect 
        active={weather.humidity > 60} 
        intensity={windIntensity}
      />
      
      <FogEffect 
        active={weather.humidity > 85} 
        intensity={fogIntensity}
      />
      
      <SunshineEffect 
        active={!weather.isRaining && weather.temperature > 15} 
        intensity={sunIntensity}
      />
    </>
  );
};

export default WeatherEffects;