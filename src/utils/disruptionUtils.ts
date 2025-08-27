// Shared utilities for disruption display
import { TEXT_CONSTANTS } from '../constants/text';

/**
 * Returns color configuration for disruption severity levels
 * Used for consistent styling across sidebar, map markers, and badges
 */
export const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case TEXT_CONSTANTS[7]: // 'Severe'
      return {
        bgColor: 'bg-red-100 hover:bg-red-200 border-red-200',
        textColor: 'text-red-800',
        badgeColor: 'bg-red-500',
        mapColor: '#dc2626ff'
      };
    case TEXT_CONSTANTS[8]: // 'Moderate'
      return {
        bgColor: 'bg-orange-100 hover:bg-orange-200 border-orange-200',
        textColor: 'text-orange-800',
        badgeColor: 'bg-orange-500',
        mapColor: '#ea580cff'
      };
    case TEXT_CONSTANTS[9]: // 'Minor'
      return {
        bgColor: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200',
        textColor: 'text-yellow-800',
        badgeColor: 'bg-yellow-500',
        mapColor: '#eab308ff'
      };
    default:
      // Fallback for unknown severity levels
      return {
        bgColor: 'bg-gray-100 hover:bg-gray-200 border-gray-200',
        textColor: 'text-gray-800',
        badgeColor: 'bg-gray-500',
        mapColor: '#6b7280',
        icon: 'ℹ️'
      };
  }
};

/**
 * Converts raw status values to localized display text
 * Centralizes status formatting logic
 */
export const formatStatus = (status: string): string => {
  switch (status) {
    case 'Active':
      return TEXT_CONSTANTS[33]; // "Currently Active"
    case 'Inactive':
      return TEXT_CONSTANTS[34]; // "Resolved"
    default:
      return status; // Pass through unknown statuses
  }
};

/**
 * Formats coordinate arrays into readable lat,lng strings
 * Used in disruption details and tooltips
 */
export const formatCoordinates = (coordinates: [number, number]): string => {
  const [longitude, latitude] = coordinates;
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
};
