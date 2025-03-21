import React, { useEffect, useState } from 'react';
import './WindEffect.css';
import { WeatherData } from './apiClient/apiClient';

interface WindEffectProps {
  active: boolean;
  intensity: number; // 0-100 scale based on humidity
}

const WindEffect: React.FC<WindEffectProps> = ({ active, intensity }) => {
  const [leafElements, setLeafElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!active) {
      setLeafElements([]);
      return;
    }

    // Calculate number of leaves based on intensity
    const elementCount = Math.min(15, Math.max(5, Math.floor(intensity / 10)));
    
    // Create leaf elements
    const newLeaves = Array.from({ length: elementCount }).map((_, index) => {
      const left = `${Math.random() * 100}%`;
      const animationDuration = `${Math.random() * 5 + 3}s`;
      const delay = `${Math.random() * 4}s`;
      const size = `${Math.random() * 15 + 10}px`;
      const rotation = `${Math.random() * 360}deg`;
      
      return (
        <div
          key={index}
          className="leaf"
          style={{
            left,
            animationDuration,
            animationDelay: delay,
            width: size,
            height: size,
            transform: `rotate(${rotation})`,
          }}
        />
      );
    });

    setLeafElements(newLeaves);

    // Clean up function
    return () => {
      setLeafElements([]);
    };
  }, [active, intensity]);

  if (!active) return null;

  return <div className="wind-container">{leafElements}</div>;
};

export const WindEffectContainer: React.FC = () => {
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

  // Use humidity as a proxy for wind intensity
  const windIntensity = Math.min(100, weather.humidity);
  
  // Wind effect is active when humidity is above 60%
  return <WindEffect active={weather.humidity > 60} intensity={windIntensity} />;
};

export default WindEffect;