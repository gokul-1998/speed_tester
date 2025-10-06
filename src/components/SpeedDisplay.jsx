import React from 'react';

const SpeedDisplay = ({ label, speed, unit = 'Mbps' }) => {
  return (
    <div className="speed-display">
      <div className="speed-label">{label}</div>
      <div className="speed-value">
        {speed.toFixed(2)} <span className="speed-unit">{unit}</span>
      </div>
    </div>
  );
};

export default SpeedDisplay;
