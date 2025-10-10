import React from 'react';

const StatsDisplay = ({ label = 'Completed:', value = '12', progress = 22 }) => (
  <div className="stats">
    <div className="stat-item">
      <label>{label}</label>
      <span className="stat-value">{value}</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{width: `${progress}%`}}>{progress}%</div>
    </div>
  </div>
);

export default StatsDisplay;
