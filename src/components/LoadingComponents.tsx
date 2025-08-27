import { TEXT_CONSTANTS } from '../constants/text';

interface LoadingSpinnerProps {
  message?: string;
}

/**
 * LoadingSpinner Component
 * 
 * A full-screen loading indicator that displays while the application is initializing
 * or performing asynchronous operations. Provides visual feedback to users during
 * data loading or processing states.
 * 
 * Features:
 * - Animated lightning bolt icon with pulsing effect
 * - Customizable loading message
 * - Bouncing dots animation for visual engagement
 * - Gradient background for modern aesthetic
 * - Centered card layout with shadow effects
 */

export const LoadingSpinner = ({ 
  message = TEXT_CONSTANTS[22] 
}: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Animated logo/icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">
            {TEXT_CONSTANTS[23]}
          </h3>
          <p className="text-slate-600 text-sm">
            {message}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

/**
 * ErrorMessage Component
 * 
 * A full-screen error display component that shows when the application encounters
 * errors during data loading or API calls. Provides clear error information and
 * recovery options for users.
 * 
 * Features:
 * - Warning triangle icon to indicate error state
 * - Detailed error message display in highlighted box
 * - Optional retry button for recoverable errors
 * - Page refresh button as fallback recovery option
 * - Help text for additional user guidance
 * - Accessible design with proper focus states
 */

export const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Error icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-xl mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Error content */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-semibold text-slate-900">
            {TEXT_CONSTANTS[24]}
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm leading-relaxed">
              {error}
            </p>
          </div>
          <p className="text-slate-600 text-sm">
            {TEXT_CONSTANTS[25]}
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 
                       rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{TEXT_CONSTANTS[26]}</span>
              </div>
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 
                     rounded-xl transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            {TEXT_CONSTANTS[27]}
          </button>
        </div>

        {/* Help text */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            {TEXT_CONSTANTS[28]}
          </p>
        </div>
      </div>
    </div>
  );
};
