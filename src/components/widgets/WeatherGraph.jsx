import React from 'react';

const WeatherGraph = () => (
  <div className="weather-chart">
    <div className="weather-graph-container">
      <img 
        src="https://www.yr.no/nb/innhold/2-2615876/meteogram.svg" 
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

export default WeatherGraph;
