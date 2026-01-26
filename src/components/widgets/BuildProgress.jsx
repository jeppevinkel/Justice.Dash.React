import React, { useState, useEffect } from 'react';

const BuildProgress = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Building Artifacts");
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const day = now.getDay();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Only show on Thursdays (day 4)
      if (day === 4) {
        // Calculate if we're between 9:30 AM and 9:45 AM
        if (hours === 9 && minutes >= 30 && minutes < 45) {
          setVisible(true);
          setMessage("Building Artifacts");
          // Calculate progress for the first phase (9:30-9:45)
          // 15 minutes = 900 seconds total
          const secondsPassed = minutes * 60 + now.getSeconds() - 30 * 60;
          const progressPercentage = Math.min(100, (secondsPassed / 900) * 100);
          setProgress(progressPercentage);
        } 
        // After 9:45 AM, change the message and show until 11:30 AM
        else if (((hours === 9 && minutes >= 45) || hours === 10 || (hours === 11 && minutes < 30)) && hours < 12) {
          setVisible(true);
          setMessage("Brunsviger deployment igangsat");
          setProgress(100); // Show completed progress bar
        } else {
          setVisible(false);
        }
      } else {
        setVisible(false);
      }
    };
    
    // Initial check
    checkTime();
    
    // Update every second
    const timer = setInterval(checkTime, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="widget widget-build-progress">
      <div className="widget-header">
        <div className="widget-header-left">
          <img src="/dd_icon_rgb.png" alt="" className="widget-logo" />
          <h2>Deployment Status</h2>
        </div>
      </div>
      <div className="widget-content">
        <div className="stats">
          <div className="stat-item">
            <label>{message}</label>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${progress}%`}}>
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildProgress;