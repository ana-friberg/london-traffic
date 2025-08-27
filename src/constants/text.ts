// Text constants for the London Traffic Live application
export const TEXT_CONSTANTS = {
  // App Main
  1: "London Traffic Live",
  2: "Real-time traffic disruptions across London", 
  3: "Toggle sidebar",
  4: "Auto-refresh: 30 min",
  5: "Last updated:",
  6: "Refresh", 
  7: "Serious",
  8: "Moderate",
  9: "Minimal",
  
  // Filter Panel
  10: "Filters",
  11: "Clear All",
  12: "Search Locations",
  13: "Search by road name or location...",
  14: "Severity Levels",
  
  // Disruption List
  15: "No Disruptions Found",
  16: "No traffic disruptions match your current filters.",
  17: "Traffic Disruptions",
  18: "Collapse details",
  19: "Expand details", 
  20: "Status:",
  21: "Coordinates:",
  
  // Loading Components
  22: "Loading traffic disruptions...",
  23: "Getting Latest Traffic Data",
  24: "Oops! Something went wrong",
  25: "This might be a temporary issue. Please check your internet connection and try again.",
  26: "Try Again",
  27: "Refresh Page",
  28: "If the problem persists, please check the TfL API status or try again later.",
  
  // TFL API Service
  29: "Unknown location",
  30: "No description available",
  31: "No current update",
  32: "Failed to fetch traffic disruptions. Please try again later.",
  
  // Utils
  33: "Currently Active",
  34: "Resolved"
} as const;

// Type for accessing text constants
export type TextConstantKey = keyof typeof TEXT_CONSTANTS;
