import React, { useEffect, useState } from 'react';
import './FogEffect.css';
import { WeatherData } from './apiClient/apiClient';

interface FogEffectProps {
  active: boolean;
  intensity: number; // 0-100 scale based on humidity
}

const FogEffect: React.FC<FogEffectProps> = ({ active, intensity }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (!active) {
      setOpacity(0);
      return;
    }

    // Calculate fog opacity based on intensity
    // Max opacity 0.5 to ensure the UI remains visible
    const fogOpacity = Math.min(0.5, intensity / 200);
    setOpacity(fogOpacity);
    
  }, [active, intensity]);

  if (!active) return null;

  return (
    <div 
      className="fog-container"
      style={{ opacity }}
    >
      <div className="fog-layer fog-layer-1"></div>
      <div className="fog-layer fog-layer-2"></div>
      <div className="fog-layer fog-layer-3"></div>
    </div>
  );
};

export const FogEffectContainer: React.FC = () => {
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

  // Fog is active when humidity is very high (above 80%)
  const fogIntensity = Math.min(100, weather.humidity);
  return <FogEffect active={weather.humidity > 80} intensity={fogIntensity} />;
};

export default FogEffect;