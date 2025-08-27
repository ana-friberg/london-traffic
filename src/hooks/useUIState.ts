import { useState } from 'react';
import type { Disruption, FilterState } from '../types/disruption';
import { TEXT_CONSTANTS } from '../constants/text';

/**
 * Custom React hook for managing UI state in the traffic disruption application
 * 
 * This hook centralizes all UI-related state management including:
 * - Selected disruption for detailed view
 * - Sidebar visibility toggle
 * - User interaction handlers
 * - Filter reset functionality
 * 
 * @param updateFilters - Function to update the filter state (from parent component)
 * @returns Object containing UI state and handler functions
 */
export const useUIState = (updateFilters: (filters: Partial<FilterState>) => void) => {
  // State for tracking which disruption is currently selected for detailed view
  // Used to show disruption details in sidebar or modal
  const [selectedDisruption, setSelectedDisruption] = useState<Disruption | null>(null);
  
  // State for controlling sidebar visibility (open/closed)
  // Allows users to hide/show the sidebar for better map viewing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  /**
   * Handles selection of a specific disruption from the list or map
   * 
   * This function is called when:
   * - User clicks on a disruption item in the list
   * - User clicks on a map marker/pin
   * - User selects a disruption through keyboard navigation
   * 
   * @param disruption - The disruption object that was selected
   * 
   * Effects:
   * - Updates selectedDisruption state
   * - Triggers detailed view display
   * - May scroll to disruption in list
   */
  const handleDisruptionSelect = (disruption: Disruption) => {
    setSelectedDisruption(disruption);
  };

  /**
   * Resets all filters and selections to their default state
   * 
   * This function provides a "Clear All" functionality that:
   * - Clears any selected disruption (hides detail view)
   * - Resets severity filters to show all types (Serious, Moderate, Minimal)
   * - Clears any search query text
   * - Returns the app to its initial state
   * 
   * Triggered by:
   * - "Clear All" button click
   * - Reset functionality in filters
   * - Keyboard shortcut (if implemented)
   */
  const handleClearAll = () => {
    // Clear the currently selected disruption
    setSelectedDisruption(null);
    
    // Reset all filter settings to default values
    updateFilters({
      // Show all severity levels by default (using text constants for consistency)
      severities: new Set([TEXT_CONSTANTS[7], TEXT_CONSTANTS[8], TEXT_CONSTANTS[9]]),
      // Clear any search text
      searchQuery: ''
    });
  };

  /**
   * Toggles the sidebar between open and closed states
   * 
   * This function provides responsive UI behavior:
   * - On mobile: Allows full-screen map viewing
   * - On desktop: Provides more map space when needed
   * - Maintains user preference during session
   * 
   * Triggered by:
   * - Hamburger menu button click
   * - Sidebar toggle button
   * - Keyboard shortcut (ESC key, etc.)
   * - Responsive breakpoint changes
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Return all UI state and handler functions for use by components
  return {
    // Current UI state values
    selectedDisruption,    // Currently selected disruption (null if none selected)
    isSidebarOpen,        // Boolean indicating if sidebar is visible

    // Event handler functions
    handleDisruptionSelect, // Function to select a specific disruption
    handleClearAll,        // Function to reset all filters and selections
    toggleSidebar         // Function to show/hide the sidebar
  };
};
