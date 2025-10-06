# Network Speed Meter

A lightweight React application that continuously measures and displays real-time network speed (download and upload) with a minimalistic UI.

## Features

- **Real-time Speed Measurement**: Continuously measures download and upload speeds
- **Minimalist UI**: Clean, modern interface showing speed metrics
- **Connection Quality Indicator**: Visual indicator showing connection quality (good/moderate/poor)
- **Configurable Parameters**: Customizable update intervals, sliding windows, and packet sizes
- **Client-side Simulation**: Uses Web Crypto API for efficient data generation
- **Responsive Design**: Works on desktop and mobile devices

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gokul-1998/speed_tester.git
cd speed_tester
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode

Run the application in development mode with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

Build the application for production:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## How It Works

### Speed Measurement

The application uses a sliding window approach to calculate network speeds:

1. **Data Generation**: Small data packets are generated using the Web Crypto API
2. **Sliding Window**: Measures data transfer over a configurable time window (default: 1 second)
3. **Speed Calculation**: Converts bytes transferred to Mbps (Megabits per second)
4. **Real-time Updates**: UI updates every second with new measurements

### Configuration Options

The speed meter can be configured with the following options:

- `updateInterval` (ms): How often to update the UI (default: 1000ms)
- `slidingWindow` (ms): Time window for speed calculation (default: 1000ms)
- `packetSize` (bytes): Size of data packets for measurement (default: 1024 bytes)
- `mode`: Measurement mode - 'simulation' (client-side) or 'server' (requires backend)

### Connection Quality

Quality is determined based on average speed:
- **Good**: > 10 Mbps average
- **Moderate**: 1-10 Mbps average
- **Poor**: < 1 Mbps average

## Project Structure

```
speed_tester/
├── index.html              # HTML entry point
├── package.json            # Project dependencies
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx           # Application entry point
│   ├── App.jsx            # Main App component
│   ├── App.css            # Application styles
│   ├── components/
│   │   ├── SpeedMeter.jsx        # Main speed meter component
│   │   ├── SpeedDisplay.jsx      # Speed display component
│   │   └── QualityIndicator.jsx  # Quality indicator component
│   └── hooks/
│       └── useSpeedMeter.js      # Custom hook for speed measurement
└── README.md
```

## Technologies Used

- **React 18+**: Modern React with functional components and hooks
- **Vite**: Fast build tool and development server
- **Web Crypto API**: For efficient random data generation
- **CSS3**: Modern styling with gradients and animations

## Performance

- **Minimal CPU Usage**: Efficient data generation and calculation
- **Low Memory Footprint**: Sliding window prevents memory leaks
- **Non-blocking**: Asynchronous operations don't block UI updates
- **Precise Timing**: Uses `performance.now()` for accurate measurements

## Browser Compatibility

Requires modern browsers with support for:
- ES6+ JavaScript features
- Web Crypto API
- CSS Grid and Flexbox

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.