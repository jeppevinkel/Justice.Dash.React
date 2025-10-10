import React, { useState, useEffect } from 'react';

const WeatherGraph = () => {
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  useEffect(() => {
    // Refresh the image every 10 minutes (600000ms) by updating the timestamp
    const interval = setInterval(() => {
      setImageTimestamp(Date.now());
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="weather-chart">
      <div className="weather-graph-container">
        <img 
          src={`https://www.yr.no/nb/innhold/2-2615876/meteogram.svg?t=${imageTimestamp}`}
          alt="Weather meteogram from yr.no"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      </div>
    </div>
  );
};

export default WeatherGraph;
