import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Disruption, FilterState, LoadingState } from '../types/disruption';
import { TflApiService } from '../services/tflApi';
import { TEXT_CONSTANTS } from '../constants/text';
import { TIMING_CONSTANTS } from '../constants/ui';
import { useErrorHandler } from './useErrorHandler';

/**
 * Pure function to filter disruptions based on user criteria
 * 
 * This function applies multiple filters to the disruption list:
 * - Status filter: Only shows active disruptions
 * - Severity filter: Shows only selected severity levels
 * - Search filter: Matches location names against search query
 * 
 * @param disruptions - Complete list of disruptions from API
 * @param filters - User's current filter preferences
 * @returns Filtered array of disruptions matching all criteria
 */
const filterDisruptions = (disruptions: Disruption[], filters: FilterState): Disruption[] => {
  return disruptions.filter(disruption => {
    // Only show active disruptions - hide resolved/inactive ones
    if (disruption.status !== 'Active') return false;
    
    // Filter by severity level - check if user has selected this severity
    if (!filters.severities.has(disruption.severity)) return false;
    
    // Filter by search query - case-insensitive location search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return disruption.location.toLowerCase().includes(query);
    }
    
    return true;
  });
};

/**
 * Pure function to calculate disruption counts by severity level
 * 
 * Provides summary statistics for the UI dashboard:
 * - Count of severe disruptions (highest priority)
 * - Count of moderate disruptions (medium priority)
 * - Count of minor disruptions (low priority)
 * - Total count of all disruptions
 * 
 * @param disruptions - Complete list of disruptions to count
 * @returns Object with counts for each severity level plus total
 */
const calculateCounts = (disruptions: Disruption[]) => ({
  severe: disruptions.filter(d => d.severity === TEXT_CONSTANTS[7]).length,
  moderate: disruptions.filter(d => d.severity === TEXT_CONSTANTS[8]).length,
  minor: disruptions.filter(d => d.severity === TEXT_CONSTANTS[9]).length,
  total: disruptions.length
});

/**
 * Custom React hook for managing traffic disruption data and state
 * 
 * This hook centralizes all disruption-related functionality:
 * - Fetches data from TfL API on mount and at regular intervals
 * - Manages loading states and error handling
 * - Provides filtering capabilities for users
 * - Tracks when data was last updated
 * - Handles manual refresh requests
 * - Supports alert notifications for data events
 * 
 * @param onShowAlert - Optional callback for showing alerts to users
 * @returns Object containing disruption data, loading states, and control functions
 */
export const useDisruptions = (onShowAlert?: (type: 'error' | 'warning' | 'info' | 'success', title: string, message: string) => void) => {
  // Initialize error handler with alert callback  
  const errorHandler = onShowAlert ? useErrorHandler({ onShowAlert }) : null;
  
  // Core data state - stores all disruptions fetched from API
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  
  // Loading and error state management for UI feedback
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,    // Start in loading state
    error: null         // No errors initially
  });
  
  // User filter preferences - controls what disruptions are shown
  const [filters, setFilters] = useState<FilterState>({
    // Show all severity levels by default
    severities: new Set([TEXT_CONSTANTS[7], TEXT_CONSTANTS[8], TEXT_CONSTANTS[9]]),
    searchQuery: ''     // No search filter initially
  });
  
  // Timestamp tracking for showing "last updated" to users
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Ref to track if this is the first data load (prevents notifications on initial load)
  const isInitialLoad = useRef(true);
  
  // Ref to store interval ID for automatic data refresh (enables cleanup)
  const intervalRef = useRef<number | null>(null);

  /**
   * Memoized filtered disruptions for performance optimization
   * 
   * This prevents unnecessary recalculation of filtered results:
   * - Only recalculates when disruptions or filters change
   * - Avoids expensive filtering on every render
   * - Improves performance with large datasets
   */
  const filteredDisruptions = useMemo(() => 
    filterDisruptions(disruptions, filters), 
    [disruptions, filters]
  );

  // Simple counting - calculate directly
  const disruptionCounts = calculateCounts(disruptions);

  /**
   * Main data fetching function with error handling and state management
   * 
   * This function handles the complete data fetch lifecycle:
   * - Sets loading state to show spinner
   * - Calls TfL API service to get fresh data
   * - Checks for new severe disruptions (for notifications)
   * - Updates all relevant state variables
   * - Handles errors gracefully with user-friendly messages
   * 
   * @param isManualRefresh - True if user triggered refresh, false for automatic
   */
  const fetchDisruptions = useCallback(async (isManualRefresh = false) => {
    try {
      // Show loading spinner while fetching
      setLoadingState(prev => ({ ...prev, isLoading: true }));
      
      // Fetch fresh data from TfL API
      const data = await TflApiService.getTrafficDisruptions();
      
      // Check for new severe disruptions (notification logic)
      // Only on automatic updates, not manual refresh or initial load
      if (!isInitialLoad.current && !isManualRefresh) {
        const newSevereCount = data.filter(disruption => 
          disruption.severity === TEXT_CONSTANTS[7] && 
          !disruptions.some(existing => existing.id === disruption.id)
        ).length;
        
        // Log new severe disruptions for user awareness
        if (newSevereCount > 0) {
          console.log(`${newSevereCount} new severe disruption(s) detected`);
          
          // Show alert for new severe disruptions
          if (onShowAlert) {
            onShowAlert(
              'warning',
              'New Severe Disruptions',
              `${newSevereCount} new severe disruption${newSevereCount > 1 ? 's' : ''} detected in London`
            );
          }
        }
      }
      
      // Update all state with fresh data
      setDisruptions(data);                                    // Store new disruption data
      setLastUpdated(new Date());                             // Record when data was fetched
      setLoadingState({ isLoading: false, error: null });    // Clear loading state
      isInitialLoad.current = false;                          // Mark initial load as complete
      
      // Show success alert for initial load or successful refresh after error
      if (onShowAlert && (isInitialLoad.current || isManualRefresh)) {
        onShowAlert(
          'success',
          'Data Updated',
          `Successfully loaded ${data.length} traffic disruptions`
        );
      }
      
    } catch (error) {
      // Handle any errors during fetch process using centralized error handler
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setLoadingState({ 
        isLoading: false, 
        error: errorMessage
      });
      
      // Use specialized error handler if available, fallback to basic alert
      if (errorHandler && error instanceof Error) {
        errorHandler.handleApiError(error, 'traffic data loading');
      } else if (onShowAlert) {
        onShowAlert(
          'error',
          'Data Loading Failed',
          `Unable to fetch traffic data: ${errorMessage}`
        );
      }
    }
  }, [disruptions]); // Depend on current disruptions for new severe disruption detection

  /**
   * Manual refresh function for user-triggered updates
   * 
   * Provides a way for users to manually refresh data:
   * - Bypasses automatic refresh timer
   * - Shows immediate feedback
   * - Doesn't trigger "new disruption" notifications
   */
  const refreshData = useCallback(async () => {
    await fetchDisruptions(true); // Pass true to indicate manual refresh
  }, [fetchDisruptions]);

  /**
   * Filter update function for user preferences
   * 
   * Allows components to update filter settings:
   * - Merges new filters with existing ones
   * - Triggers automatic re-filtering via useMemo
   * - Preserves other filter settings when updating partial filters
   * 
   * @param newFilters - Partial filter object to merge with current filters
   */
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Setup effect for initial data loading and automatic refresh
   * 
   * This effect runs once on component mount and:
   * - Fetches initial disruption data
   * - Sets up automatic refresh interval
   * - Returns cleanup function to prevent memory leaks
   */
  useEffect(() => {
    // Fetch data immediately when component mounts
    fetchDisruptions();

    // Setup automatic refresh every X milliseconds
    intervalRef.current = setInterval(() => {
      fetchDisruptions(); // Automatic refresh (not manual)
    }, TIMING_CONSTANTS.REFRESH_INTERVAL_MS);

    // Cleanup function - runs when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);  // Stop automatic refresh
        intervalRef.current = null;          // Clear reference
      }
    };
  }, []); // Empty dependency array - only run once on mount

  /**
   * Additional cleanup effect for component unmount
   * 
   * Ensures interval is properly cleared even if main effect cleanup fails:
   * - Defensive programming against memory leaks
   * - Runs on component unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Return all data and functions for use by components
  return {
    // Processed data ready for UI consumption
    disruptions: filteredDisruptions,
    loadingState,
    lastUpdated,
    disruptionCounts,
    
    // Actions
    updateFilters,
    refreshData,
    
    // Filter state (if needed by components)
    filters
  };
};
