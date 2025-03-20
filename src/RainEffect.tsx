import React, { useEffect, useState } from 'react';
import './RainEffect.css';
import { WeatherData } from './apiClient/apiClient';

interface RainEffectProps {
  active: boolean;
  intensity: number; // 0-100 scale based on rainAmount
  isSnow?: boolean; // Flag to indicate if we should show snow instead of rain
}

const RainEffect: React.FC<RainEffectProps> = ({ active, intensity, isSnow = false }) => {
  const [precipitationElements, setPrecipitationElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!active) {
      setPrecipitationElements([]);
      return;
    }

    // Calculate number of drops/flakes based on intensity
    const elementCount = Math.min(100, Math.max(20, Math.floor(intensity * 1.5)));
    
    if (isSnow) {
      // Create snowflakes
      const newSnowflakes = Array.from({ length: elementCount }).map((_, index) => {
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 2 + 2}s`; // Slower for snow
        const delay = `${Math.random() * 3}s`;
        const size = `${Math.random() * 5 + 3}px`; // Bigger for snow
        
        return (
          <div
            key={index}
            className="snow-flake"
            style={{
              left,
              animationDuration,
              animationDelay: delay,
              width: size,
              height: size,
              opacity: Math.random() * 0.3 + 0.7,
            }}
          />
        );
      });

      setPrecipitationElements(newSnowflakes);
    } else {
      // Create raindrops
      const newRaindrops = Array.from({ length: elementCount }).map((_, index) => {
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 0.5 + 0.7}s`;
        const delay = `${Math.random() * 2}s`;
        const size = `${Math.random() * 2 + 1}px`;
        const height = `${Math.random() * 15 + 10}px`;
        
        return (
          <div
            key={index}
            className="rain-drop"
            style={{
              left,
              animationDuration,
              animationDelay: delay,
              width: size,
              height,
            }}
          />
        );
      });

      setPrecipitationElements(newRaindrops);
    }

    // Clean up function
    return () => {
      setPrecipitationElements([]);
    };
  }, [active, intensity, isSnow]);

  if (!active) return null;

  const containerClass = isSnow ? "snow-container" : "rain-container";
  return <div className={containerClass}>{precipitationElements}</div>;
};

export const RainEffectContainer: React.FC = () => {
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

  const rainIntensity = Math.min(100, weather.rainAmount * 10); // Scale rainAmount to 0-100
  const isSnow = weather.temperature < 0; // Show snow if temperature is below 0°C

  return (
    <RainEffect 
      active={weather.isRaining} 
      intensity={rainIntensity}
      isSnow={isSnow}
    />
  );
};

export default RainEffect;