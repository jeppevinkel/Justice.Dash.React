import React, { useEffect, useState } from 'react';
import './SunshineEffect.css';
import { WeatherData } from './apiClient/apiClient';

interface SunshineEffectProps {
  active: boolean;
  intensity: number; // 0-100 scale based on temperature
}

const SunshineEffect: React.FC<SunshineEffectProps> = ({ active, intensity }) => {
  const [glowIntensity, setGlowIntensity] = useState(0);

  useEffect(() => {
    if (!active) {
      setGlowIntensity(0);
      return;
    }

    // Calculate glow intensity based on temperature intensity
    const calculatedIntensity = Math.min(0.9, intensity / 100); // Max 0.9 opacity for better visibility
    setGlowIntensity(calculatedIntensity);
    
  }, [active, intensity]);

  if (!active) return null;

  return (
    <div className="sunshine-container">
      <div 
        className="sun" 
        style={{ 
          opacity: glowIntensity,
          boxShadow: `0 0 ${80 + intensity}px ${50 + intensity / 1.5}px rgba(255, 220, 80, ${glowIntensity})` 
        }}
      ></div>
      <div 
        className="glow-overlay" 
        style={{ opacity: glowIntensity * 0.5 }}
      ></div>
    </div>
  );
};

export const SunshineEffectContainer: React.FC = () => {
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

  // Sun effect is active when it's not raining and temperature is above 15°C
  const sunIntensity = Math.min(100, (weather.temperature - 15) * 10); // Scale from 15-25°C to 0-100
  return (
    <SunshineEffect 
      active={!weather.isRaining && weather.temperature > 15} 
      intensity={sunIntensity}
    />
  );
};

export default SunshineEffect;