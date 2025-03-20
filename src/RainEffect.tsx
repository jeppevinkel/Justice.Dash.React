import React, { useEffect, useState } from 'react';
import './RainEffect.css';
import { WeatherData } from './apiClient/apiClient';

interface RainEffectProps {
  active: boolean;
  intensity: number; // 0-100 scale based on rainAmount
}

const RainEffect: React.FC<RainEffectProps> = ({ active, intensity }) => {
  const [raindrops, setRaindrops] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!active) {
      setRaindrops([]);
      return;
    }

    // Calculate number of raindrops based on intensity
    const dropCount = Math.min(100, Math.max(20, Math.floor(intensity * 1.5)));
    
    // Create raindrops
    const newRaindrops = Array.from({ length: dropCount }).map((_, index) => {
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

    setRaindrops(newRaindrops);

    // Clean up function
    return () => {
      setRaindrops([]);
    };
  }, [active, intensity]);

  if (!active) return null;

  return <div className="rain-container">{raindrops}</div>;
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

  return (
    <RainEffect 
      active={weather.isRaining} 
      intensity={rainIntensity}
    />
  );
};

export default RainEffect;