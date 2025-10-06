import React from 'react';

const QualityIndicator = ({ quality }) => {
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'good':
        return '#4caf50';
      case 'moderate':
        return '#ff9800';
      case 'poor':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <div className="quality-indicator">
      <div className="quality-label">Connection Quality</div>
      <div 
        className="quality-status"
        style={{ color: getQualityColor(quality) }}
      >
        {quality.toUpperCase()}
      </div>
    </div>
  );
};

export default QualityIndicator;
