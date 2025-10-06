import React, { useState } from 'react';
import SpeedMeter from './components/SpeedMeter';
import './App.css';

function App() {
  const [config, setConfig] = useState({
    updateInterval: 1000,
    slidingWindow: 1000,
    packetSize: 1024,
    mode: 'simulation'
  });

  return (
    <div className="app">
      <SpeedMeter config={config} />
    </div>
  );
}

export default App;
