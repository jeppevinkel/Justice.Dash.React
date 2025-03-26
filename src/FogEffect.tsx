import React, { useEffect, useState } from 'react';
import './FogEffect.css';
import { WeatherData } from './apiClient/apiClient';

interface FogEffectProps {
  active: boolean;
  intensity: number; // 0-100 scale based on humidity
}

const FogEffect: React.FC<FogEffectProps> = ({ active, intensity }) => {
  const [opacity, setOpacity] = useState(0);
  const [patches, setPatches] = useState<Array<{id: number, size: number, position: string, delay: number}>>([]);

  useEffect(() => {
    // Generate random fog patches configuration when component loads
    const generatePatches = () => {
      const positions = [
        'top-left', 'top-right', 'bottom-left', 'bottom-right',
        'top-center', 'left-center', 'right-center', 'bottom-center'
      ];
      
      // Create 8-12 fog patches with varying sizes
      const numPatches = Math.floor(Math.random() * 5) + 8;
      const newPatches = [];
      
      for (let i = 0; i < numPatches; i++) {
        newPatches.push({
          id: i,
          size: Math.floor(Math.random() * 40) + 10, // Size between 10-50%
          position: positions[i % positions.length],
          delay: Math.random() * 5 // Random animation delay
        });
      }
      
      setPatches(newPatches);
    };
    
    generatePatches();
  }, []);

  useEffect(() => {
    if (!active) {
      setOpacity(0);
      return;
    }

    // Calculate fog opacity based on intensity
    const fogOpacity = Math.min(0.6, intensity / 150);
    setOpacity(fogOpacity);
    
  }, [active, intensity]);

  if (!active) return null;

  return (
    <div className="fog-container">
      {patches.map(patch => (
        <div 
          key={patch.id}
          className={`fog-patch fog-position-${patch.position}`}
          style={{
            opacity: opacity,
            width: `${patch.size}%`,
            height: `${patch.size}%`,
            animationDelay: `${patch.delay}s`
          }}
        />
      ))}
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

  // Fog is active when humidity is high (above 80%)
  const fogIntensity = Math.min(100, weather.humidity);
  return <FogEffect active={weather.humidity > 80} intensity={fogIntensity} />;
};

export default FogEffect;