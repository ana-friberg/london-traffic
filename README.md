# London Traffic Live 🚦

A real-time web application for monitoring traffic disruptions across London using the Transport for London (TfL) API. Built with React, TypeScript, and modern web technologies.

## 🌟 Features

### 🗺️ Interactive Map
- **Real-time Markers**: Traffic disruptions displayed as color-coded pins on an interactive London map
- **Severity Indicators**: Visual markers using different colors (Red for Severe, Orange for Moderate, Yellow for Minor)
- **Smart Selection**: Click any card to smoothly center the map and auto-open detailed popups
- **Responsive Design**: Fully responsive map that works on desktop and mobile devices

### 🔍 Advanced Filtering
- **Severity Filters**: Toggle between Severe, Moderate, and Minor disruptions
- **Location Search**: Real-time search by road names, areas, or specific locations
- **Live Updates**: Filters update the map and results instantly
- **Clear All**: One-click reset to view all disruptions

### 📋 Smart Card Interface
- **Expandable Cards**: Click the chevron button to view detailed information
- **Quick Overview**: Collapsed view shows essential information at a glance
- **Extended Details**: Expanded view includes GPS coordinates, status updates, and disruption IDs
- **Visual Feedback**: Selected cards highlight in blue with matching map markers

### 🎨 Modern User Experience
- **Tailwind CSS**: Clean, modern interface with smooth animations
- **Auto-refresh**: Data updates every 30 minutes automatically
- **Loading States**: Professional loading indicators and error handling
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ana-friberg/london-traffic.git
   cd london-traffic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2 for fast development and optimized builds
- **Styling**: Tailwind CSS 3.4.0 for modern, responsive design
- **Mapping**: Leaflet & React-Leaflet for interactive maps
- **API Integration**: Transport for London (TfL) Live Traffic API
- **State Management**: React hooks with custom data fetching
- **Code Quality**: ESLint with TypeScript support

## 📡 API Integration

This application integrates with the official **Transport for London API**:
- **Endpoint**: `https://api.tfl.gov.uk/Road/all/Disruption`
- **Data Source**: Real-time traffic disruption data
- **Update Frequency**: Automatic refresh every 30 minutes
- **Coverage**: All major roads and areas across Greater London

## 🎯 Usage Guide

### Viewing Disruptions
1. **Map Overview**: Start with a full view of London showing all current disruptions
2. **Filter by Severity**: Use checkboxes to show only specific severity levels
3. **Search Locations**: Type in the search box to filter by road names or areas
4. **Select Disruptions**: Click any card to center the map and view details

### Detailed Information
1. **Quick View**: Each card shows location, severity, and summary
2. **Expand Details**: Click the chevron (⌄) button for complete information
3. **Map Integration**: Selected cards automatically center the map with popup details
4. **Reset View**: Use "Clear All" to return to the original state

### Mobile Experience
- **Responsive Sidebar**: Collapsible sidebar on mobile devices
- **Touch-Friendly**: All interactions optimized for touch screens
- **Performance**: Optimized for mobile data usage and battery life

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── TrafficMap.tsx      # Interactive Leaflet map
│   ├── DisruptionList.tsx  # Expandable disruption cards
│   ├── FilterPanel.tsx     # Search and filter controls
│   └── LoadingComponents.tsx # Loading states and error handling
├── hooks/               # Custom React hooks
│   └── useDisruptions.ts   # Data fetching and state management
├── services/            # API integration
│   └── tflApi.ts          # TfL API client and data transformation
├── types/               # TypeScript type definitions
│   └── disruption.ts      # Data models and interfaces
├── utils/               # Utility functions
│   └── leafletFix.ts      # Leaflet icon configuration
└── styles/              # Global styles and CSS
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint code analysis
npm run type-check   # Run TypeScript type checking
```

### Adding Features

The application is built with modularity in mind:
- **Components**: Add new UI components in `src/components/`
- **API Integration**: Extend TfL API calls in `src/services/tflApi.ts`
- **State Management**: Create new hooks in `src/hooks/`
- **Styling**: Use Tailwind classes or extend the theme

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Transport for London** for providing the comprehensive traffic API
- **OpenStreetMap** contributors for the map tiles
- **Leaflet** team for the excellent mapping library
- **React** and **Vite** teams for the development tools

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/ana-friberg/london-traffic/issues) section
2. Create a new issue with detailed information
3. Include browser version, steps to reproduce, and expected behavior

---

**Built with ❤️ for London commuters and traffic enthusiasts**
