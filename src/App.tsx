// Main application component - orchestrates data flow and layout
import { AppHeader } from './components/AppHeader';
import { Sidebar } from './components/Sidebar';
import { MapSection } from './components/MapSection';
import { LoadingSpinner, ErrorMessage } from './components/LoadingComponents';
import { useDisruptions } from './hooks/useDisruptions';
import { useUIState } from './hooks/useUIState';

function App() {
  // Fetch traffic data and manage filters
  const { 
    disruptions, 
    loadingState, 
    filters, 
    updateFilters, 
    refreshData, 
    lastUpdated,
    disruptionCounts 
  } = useDisruptions();
  
  // Handle sidebar and selection state
  const {
    selectedDisruption,
    isSidebarOpen,
    handleDisruptionSelect,
    handleClearAll,
    toggleSidebar
  } = useUIState(updateFilters);

  // Early return: show loading state
  if (loadingState.isLoading) {
    return <LoadingSpinner />;
  }

  // Early return: show error state with retry option
  if (loadingState.error) {
    return <ErrorMessage error={loadingState.error} onRetry={refreshData} />;
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Header: logo, refresh button, status indicators */}
      <AppHeader 
        onToggleSidebar={toggleSidebar}
        onRefresh={refreshData}
        isLoading={loadingState.isLoading}
        lastUpdated={lastUpdated}
      />
      
      {/* Main layout: sidebar + map */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar: filters and disruption list */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          filters={filters}
          onFiltersChange={updateFilters}
          onClearAll={handleClearAll}
          disruptions={disruptions}
          selectedDisruption={selectedDisruption}
          onDisruptionSelect={handleDisruptionSelect}
          disruptionCounts={disruptionCounts}
        />
        
        {/* Map: interactive display with markers */}
        <MapSection
          disruptions={disruptions}
          selectedDisruption={selectedDisruption}
          onDisruptionSelect={handleDisruptionSelect}
          disruptionCounts={disruptionCounts}
        />
      </main>
    </div>
  );
}

export default App;
