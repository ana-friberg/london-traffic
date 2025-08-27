import type { FilterState } from '../types/disruption';
import { TEXT_CONSTANTS } from '../constants/text';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClearAll: () => void;
  disruptionCounts: {
    severe: number;
    moderate: number;
    minor: number;
    total: number;
  };
}

/**
 * FilterPanel Component
 * 
 * This component provides filtering functionality for traffic disruptions.
 * It allows users to filter disruptions by:
 * 1. Text search (searches through disruption descriptions and locations)
 * 2. Severity levels (severe, moderate, minor)
 * 
 * How filtering works:
 * - Filters are managed by parent component and passed down as props
 * - When user interacts with filters, this component calls onFiltersChange
 * - Parent component applies filters to disruption data and re-renders
 * - Real-time counts show how many disruptions match current filters
 * 
 * Filter state includes:
 * - searchQuery: string for text-based filtering
 * - severities: Set of selected severity levels
 */

export const FilterPanel = ({
  filters,
  onFiltersChange,
  onClearAll,
  disruptionCounts
}: FilterPanelProps) => {
  /**
   * Handles severity filter changes (checkboxes)
   * 
   * When user checks/unchecks a severity level:
   * 1. Creates a new Set from current severities (immutable update)
   * 2. Adds or removes the severity based on checkbox state
   * 3. Calls parent's onFiltersChange with updated severities
   * 4. Parent re-filters disruptions and updates counts
   * 
   * @param severity - The severity level being toggled (e.g., "Severe", "Moderate")
   * @param checked - Whether the checkbox is now checked or unchecked
   */
  const handleSeverityChange = (severity: string, checked: boolean) => {
    const newSeverities = new Set(filters.severities);
    if (checked) {
      newSeverities.add(severity);
    } else {
      newSeverities.delete(severity);
    }
    onFiltersChange({ severities: newSeverities });
  };

  /**
   * Handles search input changes (text filtering)
   * 
   * When user types in search box:
   * 1. Extracts the input value from the change event
   * 2. Calls parent's onFiltersChange with new search query
   * 3. Parent applies text filter to disruption descriptions/locations
   * 4. Results update in real-time as user types
   * 
   * @param event - React change event from the search input
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ searchQuery: event.target.value });
  };

  /**
   * Severity filter configuration
   * 
   * Defines the visual appearance and data for each severity level:
   * - key: matches severity values from disruption data
   * - count: real-time count of disruptions at this severity level
   * - color: background color for active state and count badges
   * - bgColor: background color when filter is selected
   * - textColor: text color when filter is selected
   * - icon: emoji icon for visual identification
   * 
   * These counts are calculated by parent component after applying current filters
   */
  const severityData = [
    { 
      key: TEXT_CONSTANTS[7], 
      count: disruptionCounts.severe, 
      color: 'bg-red-500', 
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      icon: '🚨'
    },
    { 
      key: TEXT_CONSTANTS[8], 
      count: disruptionCounts.moderate, 
      color: 'bg-orange-500', 
      bgColor: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-700',
      icon: '⚠️'
    },
    { 
      key: TEXT_CONSTANTS[9], 
      count: disruptionCounts.minor, 
      color: 'bg-yellow-500', 
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700',
      icon: '⚡'
    },
  ];

  return (
    <div className="bg-slate-50 border-b border-slate-200 p-6 flex-shrink-0">
      {/* Header section with title and clear all button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {/* Filter icon */}
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{TEXT_CONSTANTS[10]}</h3>
        </div>
        
        {/* Clear all filters button - resets both search and severity filters */}
        <button
          onClick={onClearAll}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 
                   bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200
                   transition-all duration-200 hover:shadow-sm"
        >
          {TEXT_CONSTANTS[11]}
        </button>
      </div>

      {/* Search Filter Section - Allows text-based filtering of disruptions */}
      <div className="mb-6">
        <label htmlFor="search-input" className="block text-sm font-medium text-slate-700 mb-3">
          {TEXT_CONSTANTS[12]}
        </label>
        <div className="relative">
          {/* Search icon positioned at the left of input */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* Search input field - calls handleSearchChange on every keystroke */}
          <input
            id="search-input"
            type="text"
            placeholder={TEXT_CONSTANTS[13]}
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-slate-400 text-slate-900 bg-white
                     transition-all duration-200 shadow-sm hover:shadow-md"
          />
          {/* Clear search button - only shown when there's text in search */}
          {filters.searchQuery && (
            <button
              onClick={() => onFiltersChange({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Severity Filters Section - Checkboxes for each severity level */}
      <div className="mb-2">
        <h4 className="text-sm font-medium text-slate-700 mb-4">{TEXT_CONSTANTS[14]}</h4>
        <div className="space-y-3">
          {/* Map through each severity level and render a checkbox card */}
          {severityData.map(({ key, count, color, bgColor, textColor, icon }) => (
            <div
              key={key}
              className={`
                ${filters.severities.has(key) ? bgColor : 'bg-white border-slate-200'}
                border rounded-xl p-4 transition-all duration-200 hover:shadow-md
                ${filters.severities.has(key) ? 'shadow-sm' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                {/* Clickable label that includes checkbox, icon, and text */}
                <label className="flex items-center space-x-3 cursor-pointer flex-1">
                  {/* Custom styled checkbox (hidden native input + styled div) */}
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.severities.has(key)}
                      onChange={(e) => handleSeverityChange(key, e.target.checked)}
                      className="sr-only"
                    />
                    {/* Visual checkbox representation with conditional styling */}
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                      ${filters.severities.has(key) 
                        ? `${color} border-transparent` 
                        : 'border-slate-300 bg-white hover:border-slate-400'}
                    `}>
                      {/* Checkmark shown only when selected */}
                      {filters.severities.has(key) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  {/* Severity level label with icon and text */}
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-lg">{icon}</span>
                    <span className={`font-medium ${filters.severities.has(key) ? textColor : 'text-slate-700'}`}>
                      {key}
                    </span>
                  </div>
                  
                  {/* Count badge showing number of disruptions at this severity */}
                  <div className="flex items-center space-x-2">
                    <span className={`
                      px-2.5 py-1 rounded-full text-xs font-semibold
                      ${filters.severities.has(key) 
                        ? `${color} text-white` 
                        : 'bg-slate-100 text-slate-600'}
                    `}>
                      {count}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
