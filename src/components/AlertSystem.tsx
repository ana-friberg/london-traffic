import { useState, useEffect } from 'react';

export type AlertType = 'error' | 'warning' | 'info' | 'success';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  duration?: number; // Auto-dismiss after this many milliseconds (0 = no auto-dismiss)
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AlertSystemProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

interface AlertItemProps {
  alert: Alert;
  onDismiss: (id: string) => void;
}

/**
 * AlertItem Component
 * 
 * Renders individual alert notifications with:
 * - Type-specific styling and icons
 * - Auto-dismiss functionality with progress bar
 * - Manual dismiss button
 * - Optional action button
 * - Smooth animations for enter/exit
 */
const AlertItem = ({ alert, onDismiss }: AlertItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  // Configuration for different alert types
  const alertConfig = {
    error: {
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      progressColor: 'bg-red-500'
    },
    warning: {
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      progressColor: 'bg-yellow-500'
    },
    info: {
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      progressColor: 'bg-blue-500'
    },
    success: {
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      progressColor: 'bg-green-500'
    }
  };

  const config = alertConfig[alert.type];

  // Handle auto-dismiss functionality
  useEffect(() => {
    setIsVisible(true);

    if (alert.duration && alert.duration > 0) {
      const startTime = Date.now();
      const duration = alert.duration; // Cache duration to avoid TypeScript issues
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const progressPercent = (remaining / duration) * 100;
        
        setProgress(progressPercent);

        if (remaining <= 0) {
          setIsVisible(false);
          setTimeout(() => onDismiss(alert.id), 300); // Wait for exit animation
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [alert.duration, alert.id, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(alert.id), 300); // Wait for exit animation
  };

  return (
    <div className={`
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      mb-4 max-w-md w-full
    `}>
      <div className={`
        ${config.bgColor} border rounded-xl shadow-lg overflow-hidden
        backdrop-blur-sm relative
      `}>
        {/* Progress bar for auto-dismiss */}
        {alert.duration && alert.duration > 0 && (
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full">
            <div 
              className={`h-full ${config.progressColor} transition-all duration-75`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Alert icon */}
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              {config.icon}
            </div>

            {/* Alert content */}
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-semibold ${config.textColor} mb-1`}>
                {alert.title}
              </h4>
              <p className={`text-sm ${config.textColor} opacity-90 leading-relaxed`}>
                {alert.message}
              </p>

              {/* Action button */}
              {alert.action && (
                <button
                  onClick={alert.action.onClick}
                  className={`
                    mt-3 text-sm font-medium ${config.textColor} 
                    hover:underline focus:outline-none focus:underline
                  `}
                >
                  {alert.action.label}
                </button>
              )}
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className={`
                flex-shrink-0 ${config.textColor} hover:opacity-70 
                focus:outline-none focus:opacity-70 transition-opacity
              `}
              aria-label="Dismiss notification"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * AlertSystem Component
 * 
 * A comprehensive notification system for displaying various types of alerts:
 * 
 * Features:
 * - Multiple alert types (error, warning, info, success)
 * - Auto-dismiss with customizable duration
 * - Manual dismiss functionality
 * - Optional action buttons
 * - Smooth animations for enter/exit
 * - Progress bars for auto-dismiss alerts
 * - Responsive design
 * - Stack management (newest on top)
 * 
 * Usage:
 * - Position fixed at top-right of screen
 * - Handles multiple alerts in a stack
 * - Accessible with proper ARIA labels
 * - Touch-friendly dismiss buttons
 */
export const AlertSystem = ({ alerts, onDismiss }: AlertSystemProps) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

/**
 * Hook for managing alerts
 * 
 * Provides functions to add, remove, and manage alerts.
 * Handles ID generation and alert lifecycle.
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alertData: Omit<Alert, 'id'>) => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAlert: Alert = {
      ...alertData,
      id,
      duration: alertData.duration ?? 5000 // Default 5 seconds
    };

    setAlerts(prev => [newAlert, ...prev]); // Add to beginning (newest on top)
    return id;
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // Convenience methods for different alert types
  const showError = (title: string, message: string, options?: Partial<Alert>) => {
    return addAlert({ type: 'error', title, message, duration: 0, ...options });
  };

  const showWarning = (title: string, message: string, options?: Partial<Alert>) => {
    return addAlert({ type: 'warning', title, message, ...options });
  };

  const showInfo = (title: string, message: string, options?: Partial<Alert>) => {
    return addAlert({ type: 'info', title, message, ...options });
  };

  const showSuccess = (title: string, message: string, options?: Partial<Alert>) => {
    return addAlert({ type: 'success', title, message, ...options });
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAllAlerts,
    showError,
    showWarning,
    showInfo,
    showSuccess
  };
};
