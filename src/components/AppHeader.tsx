import { TEXT_CONSTANTS } from '../constants/text';
import { UI_CONSTANTS } from '../constants/ui';
import logoTraffic from '../assets/logo_traffic.svg';

interface AppHeaderProps {
  onToggleSidebar: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export const AppHeader = ({
  onToggleSidebar,
  onRefresh,
  isLoading,
  lastUpdated
}: AppHeaderProps) => {
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
            <div className="hidden sm:flex flex-col items-end text-blue-100 text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{TEXT_CONSTANTS[4]}</span>
              </div>
              {lastUpdated && (
                <span className="opacity-75">
                  {TEXT_CONSTANTS[5]} {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                       disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all
                       duration-200 backdrop-blur-sm border border-white/20"
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
              <span className="hidden sm:inline">{TEXT_CONSTANTS[6]}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
