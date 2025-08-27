// TypeScript type definitions for London Traffic Live application
// Ensures type safety and consistent data structures across components

// Core traffic disruption data model from TfL API
export interface Disruption {
  id: string;                                    // Unique identifier
  location: string;                              // Road/area name
  severity: 'Serious' | 'Moderate' | 'Minimal';   // Priority level
  comments: string;                              // Description text
  currentUpdate: string;                         // Latest status info
  status: 'Active' | 'Inactive';               // Current state
  geography: {                                  // Optional map coordinates
    coordinates: [number, number];              // [longitude, latitude]
  };
}

// User filter preferences for disruption list
export interface FilterState {
  severities: Set<string>;                       // Selected severity levels
  searchQuery: string;                           // Location search text
}

// API request state management
export interface LoadingState {
  isLoading: boolean;                            // Show spinner flag
  error: string | null;                          // Error message or null
}
