import { useState, useMemo } from 'react';
import { TrafficMap } from './components/TrafficMap';
import { FilterPanel } from './components/FilterPanel';
import { DisruptionList } from './components/DisruptionList';
import { LoadingSpinner, ErrorMessage } from './components/LoadingComponents';
import { useDisruptions } from './hooks/useDisruptions';
import type { Disruption } from './types/disruption';

function App() {
  const { disruptions, loadingState, filters, updateFilters, refreshData, lastUpdated } = useDisruptions();
  const [selectedDisruption, setSelectedDisruption] = useState<Disruption | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Calculate disruption counts for the filter panel
  const disruptionCounts = useMemo(() => {
    const allDisruptions = disruptions;
    return {
      severe: allDisruptions.filter(d => d.severity === 'Severe').length,
      moderate: allDisruptions.filter(d => d.severity === 'Moderate').length,
      minor: allDisruptions.filter(d => d.severity === 'Minor').length,
      total: allDisruptions.length
    };
  }, [disruptions]);

  const handleDisruptionSelect = (disruption: Disruption) => {
    setSelectedDisruption(disruption);
  };

  const handleClearAll = () => {
    // Reset both filters and selected disruption
    setSelectedDisruption(null);
    updateFilters({
      severities: new Set(['Severe', 'Moderate', 'Minor']),
      searchQuery: ''
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loadingState.isLoading) {
    return <LoadingSpinner />;
  }

  if (loadingState.error) {
    return <ErrorMessage error={loadingState.error} onRetry={refreshData} />;
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">London Traffic Live</h1>
                <p className="text-blue-100 text-sm hidden sm:block">Real-time traffic disruptions across London</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end text-blue-100 text-xs space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Auto-refresh: 30 min</span>
                </div>
                {lastUpdated && (
                  <span className="opacity-75">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
              
              <button
                onClick={refreshData}
                disabled={loadingState.isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                         disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all
                         duration-200 backdrop-blur-sm border border-white/20"
              >
                <svg 
                  className={`w-5 h-5 ${loadingState.isLoading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative inset-y-0 left-0 z-20 w-80 xl:w-96
          bg-white shadow-xl lg:shadow-none
          transition-transform duration-300 ease-in-out
          flex flex-col border-r border-slate-200
          mt-16 lg:mt-0 sidebar-container
        `}>
          {/* Mobile overlay */}
          {isSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-10 -mt-16"
              onClick={toggleSidebar}
            />
          )}
          
          <div className="relative z-20 flex-1 flex flex-col bg-white h-full overflow-hidden">
            <FilterPanel
              filters={filters}
              onFiltersChange={updateFilters}
              onClearAll={handleClearAll}
              disruptionCounts={disruptionCounts}
            />
            <DisruptionList
              disruptions={disruptions}
              onDisruptionSelect={handleDisruptionSelect}
              selectedDisruption={selectedDisruption}
            />
          </div>
        </aside>

        {/* Map Section */}
        <section className="flex-1 relative">
          <TrafficMap
            disruptions={disruptions}
            onDisruptionSelect={handleDisruptionSelect}
            selectedDisruption={selectedDisruption}
          />
          
          {/* Stats overlay */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">{disruptionCounts.severe} Severe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">{disruptionCounts.moderate} Moderate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">{disruptionCounts.minor} Minor</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
