import { useCallback } from 'react';
import type { AlertType } from '../components/AlertSystem';

interface ErrorHandlerProps {
  onShowAlert: (type: AlertType, title: string, message: string) => void;
}

/**
 * Custom hook for centralized error handling across the application
 * 
 * Provides standardized error handling for different types of errors:
 * - API/Network errors
 * - Geolocation errors  
 * - Browser compatibility issues
 * - Data validation errors
 * - User interaction errors
 */
export const useErrorHandler = ({ onShowAlert }: ErrorHandlerProps) => {

  /**
   * Handle API and network-related errors
   * Shows appropriate alerts based on error type and provides recovery actions
   */
  const handleApiError = useCallback((error: Error, context: string = 'API request') => {
    console.error(`Error during ${context}:`, error);
    const message = error.message.toLowerCase();
    
    // Network connectivity issues
    if (message.includes('network') || message.includes('fetch')) {
      onShowAlert(
        'error',
        'Connection Problem',
        `Unable to connect to traffic data service during ${context}. Please check your internet connection.`,
      );
    }
    // API server errors (5xx)
    else if (message.includes('500') || message.includes('502') || message.includes('503')) {
      onShowAlert(
        'error',
        'Service Temporarily Unavailable',
        `Traffic data service is experiencing issues during ${context}. Please try again in a few minutes.`,
      );
    }
    // API not found errors (404)
    else if (message.includes('404')) {
      onShowAlert(
        'error',
        'Service Not Found',
        `Traffic data service endpoint is not available for ${context}. This may be a temporary issue.`,
      );
    }
    // Rate limiting (429)
    else if (message.includes('429')) {
      onShowAlert(
        'warning',
        'Too Many Requests',
        `Please wait a moment before refreshing the data for ${context} again.`,
      );
    }
    // Generic API errors
    else {
      onShowAlert(
        'error',
        'Data Loading Error',
        `Failed to load traffic data during ${context}: ${error.message}`,
      );
    }
  }, [onShowAlert]);

  /**
   * Handle geolocation-related errors
   * Provides user-friendly messages for location access issues
   */
  const handleGeolocationError = useCallback((error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        onShowAlert(
          'warning',
          'Location Access Denied',
          'Please enable location services to center the map on your position. You can still browse all London traffic disruptions.',
        );
        break;
      case error.POSITION_UNAVAILABLE:
        onShowAlert(
          'warning',
          'Location Unavailable',
          'Your location could not be determined. Make sure location services are enabled and try again.',
        );
        break;
      case error.TIMEOUT:
        onShowAlert(
          'warning',
          'Location Timeout',
          'Location request timed out. You can manually navigate the map or try the location feature again.',
        );
        break;
      default:
        onShowAlert(
          'warning',
          'Location Error',
          'Unable to access your location. The map will show the default London view.',
        );
    }
  }, [onShowAlert]);

  /**
   * Handle browser compatibility issues
   * Alerts users about unsupported features
   */
  const handleBrowserCompatibility = useCallback((feature: string, fallback?: string) => {
    const message = fallback 
      ? `${feature} is not supported in your browser. ${fallback}`
      : `${feature} is not supported in your browser. Some features may not work as expected.`;
      
    onShowAlert(
      'warning',
      'Browser Compatibility',
      message,
    );
  }, [onShowAlert]);

  /**
   * Handle data validation errors
   * Alerts users when received data is invalid or incomplete
   */
  const handleDataValidationError = useCallback((context: string, details?: string) => {
    const message = details 
      ? `${context}: ${details}. Some information may be missing or incorrect.`
      : `${context}. Some traffic data may be incomplete.`;
      
    onShowAlert(
      'warning',
      'Data Quality Issue',
      message,
    );
  }, [onShowAlert]);

  /**
   * Handle user interaction errors
   * For errors that occur during user actions
   */
  const handleUserActionError = useCallback((action: string, error: Error) => {
    onShowAlert(
      'error',
      `Action Failed`,
      `Unable to ${action.toLowerCase()}: ${error.message}`,
    );
  }, [onShowAlert]);

  /**
   * Handle generic application errors
   * Fallback for unexpected errors
   */
  const handleGenericError = useCallback((error: Error, context: string = 'operation') => {
    onShowAlert(
      'error',
      'Unexpected Error',
      `An unexpected error occurred during ${context}: ${error.message}`,
    );
  }, [onShowAlert]);

  /**
   * Success notifications for completed actions
   */
  const showSuccessMessage = useCallback((title: string, message: string) => {
    onShowAlert('success', title, message);
  }, [onShowAlert]);

  /**
   * Info notifications for user guidance
   */
  const showInfoMessage = useCallback((title: string, message: string) => {
    onShowAlert('info', title, message);
  }, [onShowAlert]);

  return {
    handleApiError,
    handleGeolocationError,
    handleBrowserCompatibility,
    handleDataValidationError,
    handleUserActionError,
    handleGenericError,
    showSuccessMessage,
    showInfoMessage
  };
};

/**
 * Higher-order function that wraps async functions with error handling
 * Automatically catches and handles errors from API calls or other async operations
 */
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler: (error: Error) => void,
  context: string = 'operation'
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error in ${context}:`, error);
      errorHandler(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  };
};

/**
 * Utility function to create user-friendly error messages
 * Converts technical errors into readable messages
 */
export const createUserFriendlyErrorMessage = (error: Error, context: string): string => {
  const message = error.message.toLowerCase();
  
  // Network errors
  if (message.includes('network') || message.includes('fetch') || message.includes('cors')) {
    return 'Please check your internet connection and try again.';
  }
  
  // Server errors
  if (message.includes('500') || message.includes('502') || message.includes('503')) {
    return 'The service is temporarily unavailable. Please try again in a few minutes.';
  }
  
  // Not found errors
  if (message.includes('404')) {
    return 'The requested information could not be found.';
  }
  
  // Rate limiting
  if (message.includes('429')) {
    return 'Please wait a moment before trying again.';
  }
  
  // Generic fallback
  return `An error occurred while ${context}. Please try again.`;
};
