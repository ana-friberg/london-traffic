/**
 * AlertSystem Usage Examples
 * 
 * This file demonstrates how to use the AlertSystem component and useAlerts hook
 * throughout your London Traffic application.
 */

import { useAlerts } from '../components/AlertSystem';

// ============================================================================
// BASIC USAGE EXAMPLES
// ============================================================================

export const ExampleComponent = () => {
  const { 
    alerts, 
    removeAlert, 
    showError, 
    showWarning, 
    showInfo, 
    showSuccess,
    clearAllAlerts 
  } = useAlerts();

  // Example: API Error Handling
  const handleApiError = (error: string) => {
    showError(
      'API Connection Failed',
      `Unable to fetch data from TfL API: ${error}`,
      {
        duration: 0, // Don't auto-dismiss errors
        action: {
          label: 'Retry Connection',
          onClick: () => {
            // Retry API call logic here
            showInfo('Retrying...', 'Attempting to reconnect to TfL API');
          }
        }
      }
    );
  };

  // Example: Network Issues
  const handleNetworkError = () => {
    showWarning(
      'Connection Issues Detected',
      'Your internet connection seems unstable. Data may not be up to date.',
      {
        duration: 8000, // Show for 8 seconds
        action: {
          label: 'Check Connection',
          onClick: () => window.open('https://www.google.com', '_blank')
        }
      }
    );
  };

  // Example: Data Validation Errors
  const handleDataValidationError = (invalidFields: string[]) => {
    showError(
      'Invalid Traffic Data Received',
      `The following data fields are invalid: ${invalidFields.join(', ')}. This may affect map accuracy.`,
      {
        duration: 0,
        action: {
          label: 'Report Issue',
          onClick: () => {
            // Open GitHub issues or contact form
            window.open('https://github.com/ana-friberg/london-traffic/issues/new', '_blank');
          }
        }
      }
    );
  };

  // Example: Success Notifications
  const handleSuccessfulDataLoad = (disruptionCount: number) => {
    showSuccess(
      'Traffic Data Updated',
      `Successfully loaded ${disruptionCount} current disruptions across London`,
      {
        duration: 4000
      }
    );
  };

  // Example: Filter Notifications
  const handleFilterApplied = (filterType: string, count: number) => {
    showInfo(
      'Filter Applied',
      `Showing ${count} disruptions matching your ${filterType} filter`,
      {
        duration: 3000
      }
    );
  };

  // Example: Geolocation Errors
  const handleGeolocationError = () => {
    showWarning(
      'Location Access Denied',
      'Enable location services to center the map on your current position.',
      {
        duration: 6000,
        action: {
          label: 'Enable Location',
          onClick: () => {
            // Request geolocation permission
            navigator.geolocation.getCurrentPosition(() => {
              showSuccess('Location Found', 'Map centered on your location');
            });
          }
        }
      }
    );
  };

  // Example: Maintenance Notifications
  const handleMaintenanceNotice = () => {
    showInfo(
      'Scheduled Maintenance',
      'TfL API maintenance is scheduled for tonight 2:00-4:00 AM. Data may be temporarily unavailable.',
      {
        duration: 0, // Keep visible until dismissed
        action: {
          label: 'Learn More',
          onClick: () => window.open('https://tfl.gov.uk', '_blank')
        }
      }
    );
  };

  return null; // This is just for examples
};

// ============================================================================
// INTEGRATION PATTERNS
// ============================================================================

/**
 * Pattern 1: Error Boundary Integration
 * Use with React Error Boundaries to catch unexpected errors
 */
export const useErrorBoundaryAlerts = () => {
  const { showError } = useAlerts();

  return {
    handleError: (error: Error, errorInfo: any) => {
      showError(
        'Application Error',
        `An unexpected error occurred: ${error.message}`,
        {
          duration: 0,
          action: {
            label: 'Report Bug',
            onClick: () => {
              // Send error report
              console.error('Error reported:', error, errorInfo);
            }
          }
        }
      );
    }
  };
};

/**
 * Pattern 2: API Response Validation
 * Validate API responses and show appropriate alerts
 */
export const useApiValidationAlerts = () => {
  const { showError, showWarning, showSuccess } = useAlerts();

  return {
    validateApiResponse: (data: any, expectedFields: string[]) => {
      const missingFields = expectedFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        showWarning(
          'Incomplete Data Received',
          `Some traffic data may be missing: ${missingFields.join(', ')}`,
          { duration: 5000 }
        );
        return false;
      }

      showSuccess('Data Validation Passed', 'All traffic data is complete and valid');
      return true;
    }
  };
};

/**
 * Pattern 3: Progressive Enhancement
 * Notify users about feature availability
 */
export const useFeatureAlerts = () => {
  const { showInfo, showWarning } = useAlerts();

  return {
    notifyFeatureUnavailable: (featureName: string, reason: string) => {
      showWarning(
        `${featureName} Unavailable`,
        reason,
        {
          duration: 6000,
          action: {
            label: 'Learn More',
            onClick: () => {
              // Link to documentation or help
            }
          }
        }
      );
    },

    notifyBetaFeature: (featureName: string) => {
      showInfo(
        'Beta Feature',
        `${featureName} is currently in beta. Please report any issues you encounter.`,
        {
          duration: 8000,
          action: {
            label: 'Provide Feedback',
            onClick: () => {
              // Open feedback form
            }
          }
        }
      );
    }
  };
};

// ============================================================================
// COMMON ALERT CONFIGURATIONS
// ============================================================================

export const ALERT_CONFIGS = {
  // Critical errors that require immediate attention
  CRITICAL_ERROR: {
    type: 'error' as const,
    duration: 0, // Never auto-dismiss
  },

  // Network or API issues
  NETWORK_WARNING: {
    type: 'warning' as const,
    duration: 8000,
  },

  // User action confirmations
  SUCCESS_CONFIRMATION: {
    type: 'success' as const,
    duration: 4000,
  },

  // General information
  INFO_NOTIFICATION: {
    type: 'info' as const,
    duration: 5000,
  },

  // Quick status updates
  QUICK_UPDATE: {
    type: 'info' as const,
    duration: 2000,
  }
};

// ============================================================================
// ACCESSIBILITY CONSIDERATIONS
// ============================================================================

/**
 * Screen Reader Announcements
 * Important alerts should also be announced to screen readers
 */
export const useAccessibleAlerts = () => {
  const { showError, showSuccess, showInfo, showWarning } = useAlerts();

  const announceToScreenReader = (message: string) => {
    // Create temporary element for screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only'; // Screen reader only
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return {
    showAccessibleError: (title: string, message: string, options?: any) => {
      showError(title, message, options);
      announceToScreenReader(`Error: ${title}. ${message}`);
    },

    showAccessibleSuccess: (title: string, message: string, options?: any) => {
      showSuccess(title, message, options);
      announceToScreenReader(`Success: ${title}. ${message}`);
    },

    showAccessibleInfo: (title: string, message: string, options?: any) => {
      showInfo(title, message, options);
      announceToScreenReader(`Information: ${title}. ${message}`);
    },

    showAccessibleWarning: (title: string, message: string, options?: any) => {
      showWarning(title, message, options);
      announceToScreenReader(`Warning: ${title}. ${message}`);
    }
  };
};
