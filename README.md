# London Traffic Live 🚦

A real-time web application for monitoring traffic disruptions across London using the Transport for London (TfL) API. Built with modern React, TypeScript, and cutting-edge web technologies for optimal performance and user experience.

## 🌟 Features

### 🗺️ Interactive Map
- **Real-time Markers**: Traffic disruptions displayed as color-coded pins on an interactive London map
- **Severity Indicators**: Visual markers using different colors (🚨 Red for Severe, ⚠️ Orange for Moderate, ⚡ Yellow for Minor)
- **Smart Selection**: Click any card to smoothly center the map and auto-open detailed popups
- **Responsive Design**: Fully responsive map that works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Fluid transitions and hover effects for enhanced user experience

### 🔍 Advanced Filtering System
- **Multi-Severity Filters**: Toggle between Severe, Moderate, and Minor disruptions with visual count indicators
- **Real-time Text Search**: Instant search by road names, areas, or specific locations with auto-suggestions
- **Live Filter Updates**: Results update instantly as you type or change filter selections
- **Smart Clear Functions**: Individual filter clearing or one-click reset to view all disruptions
- **Filter State Persistence**: Maintains your filter preferences during the session

### 📋 Smart Card Interface
- **Expandable Information Cards**: Click the chevron button to reveal detailed disruption information
- **Quick Overview Mode**: Collapsed view shows essential information at a glance for fast scanning
- **Extended Details View**: Expanded cards include GPS coordinates, current status, disruption IDs, and timestamps
- **Visual Selection Feedback**: Selected cards highlight with matching map markers for easy correlation
- **Touch-Optimized Interactions**: Smooth animations and touch-friendly controls for mobile users

### 🎨 Modern User Experience
- **Tailwind CSS Design**: Clean, modern interface with smooth animations and micro-interactions
- **Auto-refresh Capability**: Data updates every 30 minutes automatically with manual refresh option
- **Professional Loading States**: Elegant loading indicators, error handling, and retry mechanisms
- **Full Accessibility Support**: WCAG compliant with proper ARIA labels, keyboard navigation, and screen reader support
- **Performance Optimized**: Lazy loading, code splitting, and efficient re-rendering for smooth performance
- **Cross-Browser Compatible**: Works flawlessly on Chrome, Firefox, Safari, and Edge

### 📊 Real-time Statistics
- **Live Disruption Counts**: Real-time counters showing current disruptions by severity level
- **Interactive Stats Overlay**: Floating statistics panel on the map with color-coded indicators
- **Filter Impact Visualization**: See how many disruptions match your current filter criteria
- **Last Updated Timestamps**: Clear indication of when data was last refreshed

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (Recommended: 20.x LTS)
- **npm 9+** or **yarn 1.22+** package manager
- Modern web browser with ES2020 support

### Quick Start Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ana-friberg/london-traffic.git
   cd london-traffic
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Type check without building
npm run type-check

# Lint code for quality
npm run lint
```

## 🛠️ Technology Stack

### Frontend & Core
- **React 19.1.1** with **TypeScript 5.x** - Modern React with full type safety
- **Vite 7.1.2** - Lightning-fast development server and optimized production builds
- **Tailwind CSS 3.4.0** - Utility-first CSS framework for rapid, responsive design

### Mapping & Geospatial
- **Leaflet & React-Leaflet** - Industry-leading interactive mapping library
- **OpenStreetMap Tiles** - High-quality, open-source map tiles
- **Custom Marker System** - Color-coded disruption indicators with smooth animations

### Data & State Management
- **Custom React Hooks** - Efficient state management with useDisruptions, useUIState
- **Transport for London API** - Official real-time traffic data integration
- **Immutable State Updates** - Predictable state changes with proper React patterns

### Development & Quality
- **ESLint** with TypeScript rules - Code quality and consistency enforcement
- **Modern ES2020+** features - Async/await, optional chaining, nullish coalescing
- **Component-based Architecture** - Modular, reusable, and maintainable codebase
- **Custom Utility Functions** - Disruption processing, coordinate formatting, and data transformation

## 📡 API Integration & Data Flow

This application integrates seamlessly with the **Transport for London API**:

### API Details
- **Primary Endpoint**: `https://api.tfl.gov.uk/Road/all/Disruption`
- **Data Format**: Real-time JSON traffic disruption data
- **Update Frequency**: Automatic refresh every 30 minutes with manual refresh capability
- **Coverage Area**: All major roads, motorways, and areas across Greater London
- **Rate Limiting**: Respectful API usage with built-in throttling

### Data Processing Pipeline
1. **Fetch**: Retrieve latest disruption data from TfL API
2. **Transform**: Process raw API data into application-friendly format
3. **Filter**: Apply user-selected severity and search filters
4. **Render**: Update map markers and disruption cards in real-time
5. **Cache**: Efficient caching to minimize API calls and improve performance

## 🎯 Usage Guide

### Getting Started with the Application
1. **Initial Load**: Application displays all current London traffic disruptions on an interactive map
2. **Explore Disruptions**: Browse disruptions using the sidebar cards or by clicking map markers
3. **Apply Filters**: Use severity checkboxes and search functionality to narrow down results
4. **View Details**: Click the expand button (⌄) on any card to see comprehensive disruption information

### Advanced Filtering Techniques
1. **Severity Filtering**: 
   - 🚨 **Severe**: Major road closures, significant delays
   - ⚠️ **Moderate**: Lane restrictions, moderate delays  
   - ⚡ **Minor**: Minor works, slight delays
2. **Location Search**: Type road names, postcodes, or area names for instant filtering
3. **Combined Filters**: Use multiple severity levels and search terms simultaneously
4. **Reset Options**: Clear individual filters or use "Clear All" for a fresh start

### Map Interaction Features
1. **Marker Selection**: Click any map marker to view disruption popup details
2. **Auto-centering**: Select a card to automatically center and zoom the map
3. **Zoom Controls**: Use mouse wheel or zoom buttons for detailed area inspection
4. **Pan Navigation**: Drag to explore different areas of London

### Mobile-Optimized Experience
- **Collapsible Sidebar**: Tap the menu button to show/hide the sidebar on mobile
- **Touch Gestures**: Pinch to zoom, swipe to pan, tap to select
- **Responsive Layout**: Automatically adapts to screen size for optimal viewing
- **Fast Loading**: Optimized for mobile data usage and quick load times

## 📁 Project Structure

```
src/
├── components/              # React UI Components
│   ├── TrafficMap.tsx          # Interactive Leaflet map with markers
│   ├── DisruptionList.tsx      # Expandable disruption cards with details
│   ├── FilterPanel.tsx         # Search and severity filter controls
│   ├── Sidebar.tsx             # Responsive sidebar container
│   ├── MapSection.tsx          # Map container with statistics overlay
│   ├── AppHeader.tsx           # Application header with navigation
│   └── LoadingComponents.tsx   # Loading states and error handling
├── hooks/                   # Custom React Hooks
│   ├── useDisruptions.ts       # TfL API data fetching and state management
│   └── useUIState.ts           # UI state management (sidebar, filters)
├── services/                # External Service Integration
│   └── tflApi.ts              # TfL API client and data transformation
├── types/                   # TypeScript Type Definitions
│   └── disruption.ts          # Disruption data models and filter interfaces
├── utils/                   # Utility Functions
│   ├── disruptionUtils.ts     # Data processing and formatting utilities
│   └── leafletFix.ts          # Leaflet icon configuration fixes
├── constants/               # Application Constants
│   ├── text.ts                # Text constants and translations
│   └── ui.ts                  # UI styling constants and breakpoints
└── assets/                  # Static Assets
    └── logo_traffic.svg       # Application logo and icons
```

### Component Architecture
- **Atomic Design**: Components are built using atomic design principles
- **Props Interface**: Each component has well-defined TypeScript interfaces
- **Separation of Concerns**: UI logic separated from business logic
- **Reusability**: Components designed for reuse and easy testing

## 🔧 Development

### Available Scripts

```bash
# Development Commands
npm run dev          # Start development server with hot reload
npm run build        # Create optimized production build
npm run preview      # Preview production build locally

# Code Quality & Testing
npm run lint         # Run ESLint code analysis and style checking
npm run lint:fix     # Auto-fix linting issues where possible
npm run type-check   # Run TypeScript type checking without compilation

# Utility Commands  
npm run clean        # Clean build artifacts and node_modules
npm run analyze      # Analyze bundle size and dependencies
```

### Development Workflow

1. **Setup Development Environment**
   ```bash
   git clone https://github.com/ana-friberg/london-traffic.git
   cd london-traffic
   npm install
   npm run dev
   ```

2. **Code Quality Standards**
   - **TypeScript**: Strict type checking enabled
   - **ESLint**: Enforced code style and best practices
   - **Prettier**: Consistent code formatting (recommended)
   - **Modern React**: Hooks, functional components, and latest patterns

3. **Adding New Features**
   - **Components**: Create in `src/components/` with TypeScript interfaces
   - **Hooks**: Add custom hooks in `src/hooks/` for reusable logic
   - **API Integration**: Extend TfL API calls in `src/services/tflApi.ts`
   - **Types**: Define new types in `src/types/` for type safety
   - **Styling**: Use Tailwind classes with semantic component organization

### Architecture Guidelines

- **Component Design**: Each component should have a single responsibility
- **State Management**: Use React hooks for local state, lift state up when needed
- **Type Safety**: All props, state, and functions should be properly typed
- **Performance**: Implement useMemo, useCallback for expensive operations
- **Accessibility**: Include ARIA labels, keyboard navigation, and semantic HTML

### Testing Strategy (Recommended)
```bash
# Add these for comprehensive testing
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
npm install --save-dev @testing-library/user-event msw
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help improve London Traffic Live:

### Getting Started
1. **Fork the repository** on GitHub
2. **Clone your fork** locally: `git clone https://github.com/YOUR_USERNAME/london-traffic.git`
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Install dependencies**: `npm install`
5. **Start development**: `npm run dev`

### Development Guidelines
- **Code Style**: Follow existing TypeScript and React patterns
- **Commit Messages**: Use conventional commits (e.g., `feat:`, `fix:`, `docs:`)
- **Testing**: Ensure all functionality works across different browsers
- **Documentation**: Update README and code comments for new features

### Pull Request Process
1. **Test thoroughly**: Verify your changes work on desktop and mobile
2. **Run quality checks**: `npm run lint` and `npm run type-check`
3. **Write clear description**: Explain what your PR does and why
4. **Include screenshots**: For UI changes, include before/after images
5. **Link issues**: Reference any related GitHub issues

### Types of Contributions Welcome
- 🐛 **Bug fixes** - Help us squash issues
- ✨ **New features** - Enhance the user experience  
- 📝 **Documentation** - Improve guides and code comments
- 🎨 **UI/UX improvements** - Make the interface even better
- 🚀 **Performance** - Optimize loading times and responsiveness
- ♿ **Accessibility** - Improve support for users with disabilities

### Reporting Issues
- Use the **GitHub Issues** template
- Include browser version, OS, and steps to reproduce
- Add screenshots or screen recordings if applicable
- Tag issues appropriately (bug, enhancement, documentation)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ **Commercial use** - Use in commercial projects
- ✅ **Modification** - Modify and distribute
- ✅ **Distribution** - Share with others
- ✅ **Private use** - Use for personal projects
- ❗ **Liability** - No warranty provided
- � **License notice** - Include license in copies

## �🙏 Acknowledgments

### Core Technologies
- **[Transport for London](https://tfl.gov.uk/)** - Providing comprehensive real-time traffic data through their excellent API
- **[OpenStreetMap](https://www.openstreetmap.org/)** - Community-driven mapping data and tiles
- **[Leaflet](https://leafletjs.com/)** - Lightweight, feature-rich mapping library
- **[React Team](https://react.dev/)** - Revolutionary UI library and development tools

### Development Tools
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and developer experience
- **[ESLint](https://eslint.org/)** - Code quality and consistency tools

### Special Thanks
- **London Commuters** - The inspiration behind this project
- **Open Source Community** - For the incredible tools and libraries
- **Beta Testers** - Early users who provided valuable feedback
- **Contributors** - Everyone who has helped improve this project

## 📞 Support & Community

### Getting Help
1. **📖 Documentation**: Check this README and inline code comments
2. **🐛 Issues**: Search [GitHub Issues](https://github.com/ana-friberg/london-traffic/issues) for existing solutions
3. **💬 Discussions**: Start a [GitHub Discussion](https://github.com/ana-friberg/london-traffic/discussions) for questions
4. **🆕 Bug Reports**: Create a [new issue](https://github.com/ana-friberg/london-traffic/issues/new) with detailed information

### Issue Reporting Template
When reporting issues, please include:
- **Browser**: Version and type (Chrome 118, Firefox 119, etc.)
- **Device**: Desktop/Mobile, OS version
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: Visual evidence when applicable
- **Console Errors**: Any error messages in browser console

### Response Times
- 🚨 **Critical bugs**: Within 24 hours
- 🐛 **Regular bugs**: Within 1 week  
- ✨ **Feature requests**: Within 2 weeks
- 📝 **Documentation**: Within 1 week

---

<div align="center">

**Built with ❤️ for London commuters and traffic enthusiasts**

[Report Bug](https://github.com/ana-friberg/london-traffic/issues) • [Request Feature](https://github.com/ana-friberg/london-traffic/issues) • [View Demo](https://london-traffic.vercel.app)

⭐ **Star this project** if you find it useful!

</div>
