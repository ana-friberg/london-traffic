import { FilterPanel } from './FilterPanel';
import { DisruptionList } from './DisruptionList';
import { UI_CONSTANTS } from '../constants/ui';
import type { Disruption, FilterState } from '../types/disruption';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClearAll: () => void;
  disruptions: Disruption[];
  selectedDisruption: Disruption | null;
  onDisruptionSelect: (disruption: Disruption) => void;
  disruptionCounts: {
    severe: number;
    moderate: number;
    minor: number;
    total: number;
  };
  onShowAlert?: (type: 'error' | 'warning' | 'info' | 'success', title: string, message: string) => void;
}

/**
 * Sidebar Component
 * 
 * A responsive sidebar that provides filtering and disruption management functionality.
 * Features:
 * - Mobile-responsive design with slide-in/out animation
 * - Contains FilterPanel for disruption filtering by severity and status
 * - Contains DisruptionList for displaying and selecting disruptions
 * - Mobile overlay for better UX on smaller screens
 * - Toggleable visibility controlled by parent component
 */
export const Sidebar = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onClearAll,
  disruptions,
  selectedDisruption,
  onDisruptionSelect,
  disruptionCounts,
  onShowAlert
}: SidebarProps) => {
  return (
    <aside className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed lg:relative inset-y-0 left-0 ${UI_CONSTANTS.SIDEBAR.Z_INDEX} ${UI_CONSTANTS.SIDEBAR.WIDTH}
      bg-white shadow-xl lg:shadow-none
      transition-transform duration-300 ease-in-out
      flex flex-col border-r border-slate-200
      ${UI_CONSTANTS.SIDEBAR.MOBILE_OFFSET} sidebar-container
    `}>
      {/* Mobile overlay - Provides dark background when sidebar is open on mobile */}
      {isOpen && (
        <div 
          className={`lg:hidden fixed inset-0 bg-black/50 ${UI_CONSTANTS.MOBILE_OVERLAY.Z_INDEX} ${UI_CONSTANTS.MOBILE_OVERLAY.OFFSET}`}
          onClick={onToggle}
        />
      )}
      
      {/* Main sidebar content container */}
      <div className={`relative ${UI_CONSTANTS.SIDEBAR.Z_INDEX} flex-1 flex flex-col bg-white h-full overflow-hidden`}>
        {/* Filter controls section - Allows users to filter disruptions by severity and status */}
        <FilterPanel
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClearAll={onClearAll}
          disruptionCounts={disruptionCounts}
          onShowAlert={onShowAlert}
        />
        
        {/* Disruption list section - Displays filtered disruptions and handles selection */}
        <DisruptionList
          disruptions={disruptions}
          onDisruptionSelect={onDisruptionSelect}
          selectedDisruption={selectedDisruption}
          onShowAlert={onShowAlert}
        />
      </div>
    </aside>
  );
};
