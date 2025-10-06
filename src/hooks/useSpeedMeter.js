import { useState, useEffect, useRef } from 'react';

const useSpeedMeter = (config = {}) => {
  const {
    updateInterval = 1000, // Update UI every 1 second
    slidingWindow = 1000,  // Calculate speed over 1 second window
    packetSize = 1024,     // 1KB packets
    mode = 'simulation'    // 'simulation' or 'server'
  } = config;

  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [quality, setQuality] = useState('good');
  const [isActive, setIsActive] = useState(false);

  const downloadDataRef = useRef([]);
  const uploadDataRef = useRef([]);
  const intervalRef = useRef(null);

  // Calculate speed from data points within the sliding window
  const calculateSpeed = (dataPoints, windowMs) => {
    const now = performance.now();
    const cutoffTime = now - windowMs;
    
    // Filter data points within the window
    const recentData = dataPoints.filter(point => point.timestamp > cutoffTime);
    
    // Sum up bytes
    const totalBytes = recentData.reduce((sum, point) => sum + point.bytes, 0);
    
    // Convert to Mbps (bytes per second to megabits per second)
    const bytesPerSecond = totalBytes / (windowMs / 1000);
    const mbps = (bytesPerSecond * 8) / (1024 * 1024);
    
    return mbps;
  };

  // Simulate download by fetching data
  const simulateDownload = async () => {
    try {
      const startTime = performance.now();
      
      // Generate random data to simulate download
      const randomData = new Uint8Array(packetSize);
      crypto.getRandomValues(randomData);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Add data point
      downloadDataRef.current.push({
        timestamp: endTime,
        bytes: packetSize,
        duration
      });

      // Clean old data points
      const cutoffTime = endTime - slidingWindow * 2;
      downloadDataRef.current = downloadDataRef.current.filter(
        point => point.timestamp > cutoffTime
      );
    } catch (error) {
      console.error('Download simulation error:', error);
    }
  };

  // Simulate upload by creating data
  const simulateUpload = async () => {
    try {
      const startTime = performance.now();
      
      // Generate random data to simulate upload
      const randomData = new Uint8Array(packetSize);
      crypto.getRandomValues(randomData);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Add data point
      uploadDataRef.current.push({
        timestamp: endTime,
        bytes: packetSize,
        duration
      });

      // Clean old data points
      const cutoffTime = endTime - slidingWindow * 2;
      uploadDataRef.current = uploadDataRef.current.filter(
        point => point.timestamp > cutoffTime
      );
    } catch (error) {
      console.error('Upload simulation error:', error);
    }
  };

  // Determine connection quality based on speed
  const determineQuality = (downSpeed, upSpeed) => {
    const avgSpeed = (downSpeed + upSpeed) / 2;
    if (avgSpeed > 10) return 'good';
    if (avgSpeed > 1) return 'moderate';
    return 'poor';
  };

  // Main measurement loop
  useEffect(() => {
    if (!isActive) return;

    const measureSpeed = async () => {
      // Perform download and upload simulations
      await Promise.all([simulateDownload(), simulateUpload()]);

      // Calculate speeds
      const downSpeed = calculateSpeed(downloadDataRef.current, slidingWindow);
      const upSpeed = calculateSpeed(uploadDataRef.current, slidingWindow);

      // Update state
      setDownloadSpeed(downSpeed);
      setUploadSpeed(upSpeed);
      setQuality(determineQuality(downSpeed, upSpeed));
    };

    // Run measurement immediately
    measureSpeed();

    // Set up interval for continuous measurement
    intervalRef.current = setInterval(measureSpeed, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, updateInterval, slidingWindow, packetSize]);

  const start = () => setIsActive(true);
  const stop = () => {
    setIsActive(false);
    downloadDataRef.current = [];
    uploadDataRef.current = [];
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setQuality('good');
  };

  return {
    downloadSpeed,
    uploadSpeed,
    quality,
    isActive,
    start,
    stop
  };
};

export default useSpeedMeter;
