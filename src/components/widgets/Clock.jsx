import React from 'react';

const Clock = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock-display">
      <div className="clock-face">🕐</div>
      <div className="clock-time">
        {time.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default Clock;
