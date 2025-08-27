import { TEXT_CONSTANTS } from '../constants/text';
import { UI_CONSTANTS } from '../constants/ui';
import logoTraffic from '../assets/logo_traffic.svg';

interface AppHeaderProps {
  onToggleSidebar: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: Date | null;
  hasError?: boolean;
  errorMessage?: string;
  onShowAlert?: (type: 'error' | 'warning' | 'info' | 'success', title: string, message: string) => void;
}

export const AppHeader = ({
  onToggleSidebar,
  onRefresh,
  isLoading,
  lastUpdated,
  hasError = false,
  errorMessage,
  onShowAlert
}: AppHeaderProps) => {
  
  // Handle refresh
  const handleRefresh = () => {
    onRefresh();
  };

  // Show error alert when there's an error
  const handleShowErrorDetails = () => {
    if (onShowAlert && errorMessage) {
      onShowAlert('error', 'Data Loading Error', errorMessage);
    }
  };
  return (
    <header className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ${UI_CONSTANTS.HEADER.Z_INDEX}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={TEXT_CONSTANTS[3]}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-3">
              <img 
                src={logoTraffic} 
                alt={TEXT_CONSTANTS[1]} 
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{TEXT_CONSTANTS[1]}</h1>
                <p className="text-blue-100 text-sm hidden sm:block">{TEXT_CONSTANTS[2]}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Status indicator with error state */}
            <div className="hidden sm:flex flex-col items-end text-blue-100 text-xs space-y-1">
              <div className="flex items-center space-x-2">
                {hasError ? (
                  <>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <button
                      onClick={handleShowErrorDetails}
                      className="hover:text-white transition-colors underline cursor-pointer"
                    >
                      Data Error - Click for details
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{TEXT_CONSTANTS[4]}</span>
                  </>
                )}
              </div>
              {lastUpdated && !hasError && (
                <span className="opacity-75">
                  {TEXT_CONSTANTS[5]} {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              {hasError && errorMessage && (
                <span className="text-red-200 opacity-90 text-xs max-w-xs truncate">
                  {errorMessage}
                </span>
              )}
            </div>
            
            {/* Refresh button with enhanced functionality */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 
                backdrop-blur-sm border border-white/20
                ${hasError 
                  ? 'bg-red-500/20 hover:bg-red-500/30 border-red-400/30' 
                  : 'bg-white/10 hover:bg-white/20'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              title={hasError ? 'Retry loading data' : 'Refresh traffic data'}
            >
              <svg 
                className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">
                {hasError ? 'Retry' : TEXT_CONSTANTS[6]}
              </span>
            </button>
            
            {/* Mobile error indicator */}
            {hasError && (
              <button
                onClick={handleShowErrorDetails}
                className="sm:hidden p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-400/30 transition-colors"
                title="View error details"
              >
                <svg className="w-5 h-5 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
