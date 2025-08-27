// Main application component - orchestrates data flow and layout
import { AppHeader } from './components/AppHeader';
import { Sidebar } from './components/Sidebar';
import { MapSection } from './components/MapSection';
import { LoadingSpinner, ErrorMessage } from './components/LoadingComponents';
import { AlertSystem, useAlerts } from './components/AlertSystem';
import { useDisruptions } from './hooks/useDisruptions';
import { useUIState } from './hooks/useUIState';
import { useEffect } from 'react';

function App() {
  // Initialize alert system
  const { 
    alerts, 
    removeAlert, 
    showError, 
    showWarning, 
    showInfo, 
    showSuccess 
  } = useAlerts();

  // Show alert function for components
  const handleShowAlert = (
    type: 'error' | 'warning' | 'info' | 'success', 
    title: string, 
    message: string
  ) => {
    switch (type) {
      case 'error':
        showError(title, message);
        break;
      case 'warning':
        showWarning(title, message);
        break;
      case 'info':
        showInfo(title, message);
        break;
      case 'success':
        showSuccess(title, message);
        break;
    }
  };

  // Fetch traffic data and manage filters
  const { 
    disruptions, 
    loadingState, 
    filters, 
    updateFilters, 
    refreshData, 
    lastUpdated,
    disruptionCounts 
  } = useDisruptions(handleShowAlert);
  
  // Handle sidebar and selection state
  const {
    selectedDisruption,
    isSidebarOpen,
    handleDisruptionSelect,
    handleClearAll,
    toggleSidebar
  } = useUIState(updateFilters);

  // Handle data loading errors and show alerts
  useEffect(() => {
    if (loadingState.error) {
      showError(
        'Data Loading Failed',
        'Unable to fetch traffic disruption data. Please check your connection and try again.',
        {
          duration: 0, // Don't auto-dismiss errors
          action: {
            label: 'Retry Now',
            onClick: () => {
              refreshData();
              showInfo('Retrying...', 'Attempting to reload traffic data');
            }
          }
        }
      );
    }
  }, [loadingState.error, showError, showInfo, refreshData]);

  // Show success message when data loads successfully after an error
  useEffect(() => {
    if (disruptions.length > 0 && !loadingState.isLoading && !loadingState.error) {
      // Only show success if we previously had an error (simple state check)
      const hasErrorAlerts = alerts.some(alert => alert.type === 'error');
      if (hasErrorAlerts) {
        showSuccess(
          'Data Loaded Successfully',
          `Found ${disruptions.length} traffic disruptions across London`
        );
      }
    }
  }, [disruptions.length, loadingState.isLoading, loadingState.error, alerts, showSuccess]);

  // Handle refresh
  const handleRefreshWithAlert = () => {
    refreshData();
  };

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
      {/* Alert System - positioned fixed at top-right */}
      <AlertSystem alerts={alerts} onDismiss={removeAlert} />
      
      {/* Header: logo, refresh button, status indicators */}
      <AppHeader 
        onToggleSidebar={toggleSidebar}
        onRefresh={handleRefreshWithAlert}
        isLoading={loadingState.isLoading}
        lastUpdated={lastUpdated}
        hasError={!!loadingState.error}
        errorMessage={loadingState.error || undefined}
        onShowAlert={handleShowAlert}
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
          onShowAlert={handleShowAlert}
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
