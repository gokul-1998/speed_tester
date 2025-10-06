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

  // Simulate download by fetching data (like game network speed tests)
  const simulateDownload = async () => {
    try {
      const startTime = performance.now();
      
      // Simulate multiple chunks to get realistic throughput
      // Games typically transfer multiple packets continuously
      const numChunks = 10; // Transfer 10 chunks per measurement
      const chunkSize = 65536; // Max 64KB per crypto call
      let totalBytes = 0;
      
      for (let i = 0; i < numChunks; i++) {
        const randomData = new Uint8Array(chunkSize);
        crypto.getRandomValues(randomData);
        
        // Create a blob URL to simulate data transfer
        const blob = new Blob([randomData]);
        const blobUrl = URL.createObjectURL(blob);
        
        // Simulate realistic network behavior per chunk
        // Based on typical broadband speeds (50-200 Mbps download)
        const networkLatency = 2 + Math.random() * 5; // 2-7ms latency per chunk
        const baseSpeed = (50 + Math.random() * 150) * 1024 * 1024 / 8; // 50-200 Mbps in bytes/sec
        const transferTime = (chunkSize / baseSpeed) * 1000; // Time to transfer at this speed
        const chunkDelay = networkLatency + transferTime + (Math.random() * 3); // Add jitter
        
        await new Promise(resolve => setTimeout(resolve, chunkDelay));
        
        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
        
        totalBytes += chunkSize;
      }
      
      const endTime = performance.now();
      
      // Add data point with actual bytes transferred
      const duration = endTime - startTime;
      downloadDataRef.current.push({
        timestamp: endTime,
        bytes: totalBytes,
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

  // Simulate upload by creating data (like game network speed tests)
  const simulateUpload = async () => {
    try {
      const startTime = performance.now();
      
      // Simulate multiple chunks to get realistic throughput
      // Upload typically uses fewer/smaller packets than download
      const numChunks = 8; // Transfer 8 chunks per measurement
      const chunkSize = 65536; // Max 64KB per crypto call
      let totalBytes = 0;
      
      for (let i = 0; i < numChunks; i++) {
        const uploadData = new Uint8Array(chunkSize);
        crypto.getRandomValues(uploadData);
        
        // Create a blob to simulate upload
        const blob = new Blob([uploadData]);
        const blobUrl = URL.createObjectURL(blob);
        
        // Simulate realistic upload behavior per chunk
        // Upload is typically slower than download (20-100 Mbps)
        const networkLatency = 3 + Math.random() * 7; // 3-10ms latency per chunk
        const baseSpeed = (20 + Math.random() * 80) * 1024 * 1024 / 8; // 20-100 Mbps in bytes/sec
        const transferTime = (chunkSize / baseSpeed) * 1000; // Time to transfer at this speed
        const chunkDelay = networkLatency + transferTime + (Math.random() * 4); // Add jitter
        
        await new Promise(resolve => setTimeout(resolve, chunkDelay));
        
        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
        
        totalBytes += chunkSize;
      }
      
      const endTime = performance.now();
      
      // Add data point
      const duration = endTime - startTime;
      uploadDataRef.current.push({
        timestamp: endTime,
        bytes: totalBytes,
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
