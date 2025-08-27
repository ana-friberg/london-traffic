import type { Disruption } from '../types/disruption';
import { TEXT_CONSTANTS } from '../constants/text';

const TFL_API_BASE = 'https://api.tfl.gov.uk';

export class TflApiService {
  static async getTrafficDisruptions(): Promise<Disruption[]> {
    try {
      const response = await fetch(`${TFL_API_BASE}/Road/all/Disruption`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the TfL API response to our Disruption interface
      const disruptions = data.map((item: any): Disruption | null => {
        // Extract all required fields
        const id = item.id || `disruption-${Math.random().toString(36).substr(2, 9)}`;
        const location = item.location || item.corridorIds?.[0] || item.description;
        const severity = this.normalizeSeverity(item.severityLevel || item.severity);
        const comments = item.description || item.summary || item.comments;
        const currentUpdate = item.currentUpdate || item.additionalInfo;
        const status = this.normalizeStatus(item.status);
        const geography = this.extractGeography(item);

        // Only return disruption if ALL required fields are present and valid
        if (!id || !location || !severity || !comments || !currentUpdate || !status || !geography) {
          return null; // Skip this disruption
        }

        return {
          id,
          location,
          severity,
          comments,
          currentUpdate,
          status,
          geography
        };
      }).filter((disruption: Disruption | null): disruption is Disruption => disruption !== null);

      return disruptions;
    } catch (error) {
      console.error('Error fetching traffic disruptions:', error);
      throw new Error(TEXT_CONSTANTS[32]);
    }
  }

  private static normalizeSeverity(severity: any): 'Severe' | 'Moderate' | 'Minor' {
    if (typeof severity === 'string') {
      const lower = severity.toLowerCase();
      if (lower.includes('severe') || lower.includes('major') || lower.includes('high')) return TEXT_CONSTANTS[7] as 'Severe';
      if (lower.includes('moderate') || lower.includes('medium')) return TEXT_CONSTANTS[8] as 'Moderate';
      if (lower.includes('minor') || lower.includes('low') || lower.includes('minimal')) return TEXT_CONSTANTS[9] as 'Minor';
    }
    return TEXT_CONSTANTS[9] as 'Minor'; // Default fallback
  }

  private static normalizeStatus(status: any): 'Active' | 'Inactive' {
    if (typeof status === 'string') {
      const lower = status.toLowerCase();
      if (lower.includes('active') || lower.includes('current') || lower.includes('ongoing')) {
        return 'Active';
      }
      if (lower.includes('resolved') || lower.includes('closed') || lower.includes('inactive')) {
        return 'Inactive';
      }
    }
    return 'Active'; // Default to Active for safety
  }

  private static extractGeography(item: any): { coordinates: [number, number] } | undefined {
    // Try multiple possible geography fields from TfL API
    if (item.geography?.coordinates && Array.isArray(item.geography.coordinates) && item.geography.coordinates.length === 2) {
      const [longitude, latitude] = item.geography.coordinates;
      if (typeof longitude === 'number' && typeof latitude === 'number') {
        return { coordinates: [longitude, latitude] as [number, number] };
      }
    }
    
    if (item.point?.coordinates && Array.isArray(item.point.coordinates) && item.point.coordinates.length === 2) {
      const [longitude, latitude] = item.point.coordinates;
      if (typeof longitude === 'number' && typeof latitude === 'number') {
        return { coordinates: [longitude, latitude] as [number, number] };
      }
    }
    
    if (typeof item.lat === 'number' && typeof item.lon === 'number') {
      return { coordinates: [item.lon, item.lat] as [number, number] };
    }
    
    // No valid coordinates found - return undefined to exclude this disruption
    return undefined;
  }
}
