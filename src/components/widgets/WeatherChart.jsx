import React from 'react';

const WeatherChart = () => (
  <div className="weather-chart">
    <div className="weather-info">
      <div className="weather-current">
        <span className="weather-icon">☀️</span>
        <span className="weather-temp">18°C</span>
      </div>
      <div className="weather-forecast">
        <div className="forecast-item">
          <span>Mon</span>
          <span>🌤️</span>
          <span>16°</span>
        </div>
        <div className="forecast-item">
          <span>Tue</span>
          <span>☁️</span>
          <span>14°</span>
        </div>
        <div className="forecast-item">
          <span>Wed</span>
          <span>🌧️</span>
          <span>12°</span>
        </div>
        <div className="forecast-item">
          <span>Thu</span>
          <span>⛈️</span>
          <span>11°</span>
        </div>
        <div className="forecast-item">
          <span>Fri</span>
          <span>🌤️</span>
          <span>15°</span>
        </div>
      </div>
    </div>
  </div>
);

export default WeatherChart;
