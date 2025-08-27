import { useState, useEffect, useRef } from 'react';
import type { Disruption, FilterState, LoadingState } from '../types/disruption';
import { TflApiService } from '../services/tflApi';
import { TEXT_CONSTANTS } from '../constants/text';

export const useDisruptions = () => {
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [filteredDisruptions, setFilteredDisruptions] = useState<Disruption[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null
  });
  const [filters, setFilters] = useState<FilterState>({
    severities: new Set([TEXT_CONSTANTS[7], TEXT_CONSTANTS[8], TEXT_CONSTANTS[9]]),
    searchQuery: ''
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isInitialLoad = useRef(true);

  // Fetch disruptions on component mount and set up 30-minute polling
  useEffect(() => {
    const fetchDisruptions = async (isManualRefresh = false) => {
      try {
        setLoadingState({ isLoading: true, error: null });
        const data = await TflApiService.getTrafficDisruptions();
        
        // Check for new severe disruptions on automatic updates
        if (!isInitialLoad.current && !isManualRefresh) {
          const newSevereDisruptions = data.filter(disruption => 
            disruption.severity === TEXT_CONSTANTS[7] && 
            !disruptions.find(existing => existing.id === disruption.id)
          );
          
          if (newSevereDisruptions.length > 0) {
            // Would show toast here if we had access to toast context
            console.log(`${newSevereDisruptions.length} new severe disruption(s) detected`);
          }
        }
        
        setDisruptions(data);
        setLastUpdated(new Date());
        setLoadingState({ isLoading: false, error: null });
        isInitialLoad.current = false;
      } catch (error) {
        setLoadingState({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
      }
    };

    // Fetch data immediately on mount
    fetchDisruptions();

    // Set up automatic refresh every 30 minutes (30 * 60 * 1000 = 1,800,000 ms)
    const interval = setInterval(fetchDisruptions, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter disruptions whenever filters or data changes
  useEffect(() => {
    let filtered = disruptions.filter(disruption => {
      // Ensure all required fields are present and valid
      if (!disruption.id || !disruption.location || !disruption.severity || 
          !disruption.comments || !disruption.currentUpdate || !disruption.status ||
          !disruption.geography?.coordinates || disruption.geography.coordinates.length !== 2) {
        return false;
      }

      // Filter by severity
      if (!filters.severities.has(disruption.severity)) {
        return false;
      }

      // Filter by search query (location/road name only)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return disruption.location.toLowerCase().includes(query);
      }

      return true;
    });

    // Only show active disruptions
    filtered = filtered.filter(disruption => disruption.status === 'Active');

    setFilteredDisruptions(filtered);
  }, [disruptions, filters]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const refreshData = async () => {
    try {
      setLoadingState({ isLoading: true, error: null });
      const data = await TflApiService.getTrafficDisruptions();
      setDisruptions(data);
      setLastUpdated(new Date());
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  return {
    disruptions: filteredDisruptions,
    loadingState,
    filters,
    updateFilters,
    refreshData,
    lastUpdated
  };
};
