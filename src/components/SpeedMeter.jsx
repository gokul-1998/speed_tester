import React from 'react';
import SpeedDisplay from './SpeedDisplay';
import QualityIndicator from './QualityIndicator';
import useSpeedMeter from '../hooks/useSpeedMeter';

const SpeedMeter = ({ config }) => {
  const { downloadSpeed, uploadSpeed, quality, isActive, start, stop } = useSpeedMeter(config);

  return (
    <div className="speed-meter">
      <h1 className="title">Network Speed Meter</h1>
      
      <div className="controls">
        <button 
          className={`control-button ${isActive ? 'stop' : 'start'}`}
          onClick={isActive ? stop : start}
        >
          {isActive ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      <div className="speed-container">
        <SpeedDisplay label="Download Speed" speed={downloadSpeed} />
        <SpeedDisplay label="Upload Speed" speed={uploadSpeed} />
      </div>

      <QualityIndicator quality={quality} />
    </div>
  );
};

export default SpeedMeter;
