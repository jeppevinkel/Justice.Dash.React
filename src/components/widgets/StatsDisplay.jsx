import React from 'react';

const StatsDisplay = () => (
  <div className="stats">
    <div className="stat-item">
      <label>Completed Imports:</label>
      <span className="stat-value">64</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{width: '89%'}}>89%</div>
    </div>
  </div>
);

export default StatsDisplay;
