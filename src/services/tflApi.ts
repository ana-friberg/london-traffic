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
      return data.map((item: any): Disruption => ({
        id: item.id || `disruption-${Math.random().toString(36).substr(2, 9)}`,
        location: item.location || item.corridorIds?.[0] || item.description || TEXT_CONSTANTS[29],
        severity: this.normalizeSeverity(item.severityLevel || item.severity),
        comments: item.description || item.summary || item.comments || TEXT_CONSTANTS[30],
        currentUpdate: item.currentUpdate || item.additionalInfo || TEXT_CONSTANTS[31],
        status: this.normalizeStatus(item.status),
        geography: this.extractGeography(item)
      }));
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

  private static extractGeography(item: any) {
    // Try multiple possible geography fields from TfL API
    if (item.geography?.coordinates) {
      return { coordinates: item.geography.coordinates };
    }
    if (item.point?.coordinates) {
      return { coordinates: item.point.coordinates };
    }
    if (item.lat && item.lon) {
      return { coordinates: [item.lon, item.lat] };
    }
    // Generate approximate London coordinates for testing
    if (item.location || item.description) {
      // Return a random location within London bounds for demo purposes
      const londonBounds = {
        north: 51.7,
        south: 51.3,
        east: 0.3,
        west: -0.6
      };
      return {
        coordinates: [
          londonBounds.west + Math.random() * (londonBounds.east - londonBounds.west),
          londonBounds.south + Math.random() * (londonBounds.north - londonBounds.south)
        ]
      };
    }
    return undefined;
  }
}
