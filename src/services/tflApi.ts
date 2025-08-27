/**
 * TfL API Service - Fetches London traffic disruption data
 * Simple, readable implementation with proper error handling
 */
import type { Disruption } from "../types/disruption";
import { TEXT_CONSTANTS } from "../constants/text";

const TFL_API_BASE = "https://api.tfl.gov.uk";

export class TflApiService {
  /**
   * Validates if an API response item contains all required disruption data
   * 
   * This function acts as a type guard to ensure data integrity before processing.
   * It checks for the presence and correct types of all required fields:
   * - Basic fields: id, location, severity, comments, currentUpdate, status
   * - Geography data: coordinates array with valid longitude/latitude numbers
   * 
   * @param item - Raw data item from TfL API response (could be any structure)
   * @returns boolean - true if item has all required fields with correct types
   * 
   * Example usage:
   * - Filters out incomplete API responses
   * - Prevents runtime errors from missing data
   * - Ensures only valid disruptions are processed
   */
  private static hasRequiredData(item: unknown): boolean {
    // First safety check - ensure we have an object to work with
    // Prevents errors when API returns null, undefined, or primitive values
    if (!item || typeof item !== 'object') return false;
    
    // Cast to generic object type for property access
    // This is safe because we've already confirmed it's an object
    const data = item as Record<string, unknown>;
    
    // Comprehensive validation of all required fields
    // Uses double negation (!!) to convert truthy values to boolean
    return !!(
      // Basic string fields - must exist and be truthy (not empty/null/undefined)
      data.id &&
      data.location &&
      data.severity &&
      data.comments &&
      data.currentUpdate &&
      data.status &&
      
      // Geography object validation - required for map functionality
      data.geography &&
      typeof data.geography === 'object' &&
      data.geography !== null &&
      'coordinates' in data.geography &&
      
      // Coordinates array validation - must be array with at least 2 numeric values
      // This ensures we have valid longitude and latitude for map plotting
      Array.isArray((data.geography as any).coordinates) &&
      (data.geography as any).coordinates.length >= 2 &&
      typeof (data.geography as any).coordinates[0] === 'number' &&
      typeof (data.geography as any).coordinates[1] === 'number'
    );
  }

  /**
   * Transforms validated TfL API data into our standardized Disruption format
   * 
   * This function converts raw API response data into our clean, typed Disruption object.
   * It should only be called AFTER hasRequiredData() validation to ensure data safety.
   * 
   * @param item - Validated raw API data (guaranteed to have all required fields)
   * @returns Disruption - Clean, typed object matching our application's data structure
   * 
   * Key transformations:
   * - Extracts only the fields our app needs
   * - Standardizes the geography coordinates format
   * - Provides consistent data structure across the application
   */
  private static toDisruption(item: unknown): Disruption {
    // Safe type assertion - this item has already passed validation in hasRequiredData
    // We know it contains all required fields with correct types
    const data = item as any;
    
    // Create clean Disruption object with only the data we need
    // This eliminates extra API fields and ensures consistent structure
    return {
      id: data.id,                          // Unique identifier for tracking
      location: data.location,              // Human-readable location name
      severity: data.severity,              // Priority level (Severe/Moderate/Minor)
      comments: data.comments,              // Detailed description of the disruption
      currentUpdate: data.currentUpdate,    // Latest status information
      status: data.status,                  // Current state (Active/Inactive)
      geography: {
        // Extract only longitude and latitude coordinates for map display
        // Format: [longitude, latitude] as expected by mapping libraries
        coordinates: [
          data.geography.coordinates[0],    // Longitude (east-west position)
          data.geography.coordinates[1]     // Latitude (north-south position)
        ]
      }
    };
  }

  /**
   * Fetches and processes traffic disruption data from the TfL API
   * 
   * This is the main public method that handles the complete data flow:
   * 1. Makes HTTP request to TfL Road Disruption API
   * 2. Validates the response and handles HTTP errors
   * 3. Filters out incomplete/invalid disruption data
   * 4. Transforms valid data into our standardized format
   * 5. Returns clean array of disruptions ready for use
   * 
   * @returns Promise<Disruption[]> - Array of valid, complete traffic disruptions
   * @throws Error - Network errors, API failures, or data parsing issues
   * 
   * Error handling covers:
   * - Network connectivity issues
   * - HTTP status errors (404, 500, etc.)
   * - Malformed JSON responses
   * - Invalid data structures
   */
  static async getTrafficDisruptions(): Promise<Disruption[]> {
    try {
      // Step 1: Make HTTP request to TfL API
      // Fetches all current road disruptions across London
      const response = await fetch(`${TFL_API_BASE}/Road/all/Disruption`);

      // Step 2: Check if the HTTP request was successful
      // Handles server errors, API downtime, invalid endpoints
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      // Step 3: Parse JSON response data
      // Convert response body to JavaScript array
      const data: unknown[] = await response.json();

      // Log the raw data received from TfL API for debugging
      // console.log("Raw data received from TfL API:", data);
      // console.log("Total items received:", data.length);
      

      // Step 4: Filter and transform the data
      // Process the raw API data into clean, usable disruption objects
      const disruptions = data
        .filter(this.hasRequiredData)    // Remove incomplete/invalid items
        .map(this.toDisruption);         // Transform to our standard format

      // Return the clean, validated disruption data
      return disruptions;

    } catch (error) {
      // Comprehensive error handling for debugging and user experience
      
      // Log detailed error information for developers
      console.error("Failed to fetch disruptions:", error);

      // Provide specific error messages based on error type
      if (error instanceof TypeError) {
        // Network-related errors (no internet, DNS issues, etc.)
        throw new Error("Network error - please check your connection");
      }

      // Fallback error message for any other issues
      // Uses predefined text constant for consistency
      throw new Error(TEXT_CONSTANTS[32] || "Unable to load traffic data");
    }
  }
}