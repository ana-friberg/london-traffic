import React from 'react';
import type { FilterState } from '../types/disruption';

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

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onClearAll,
  disruptionCounts
}) => {
  const handleSeverityChange = (severity: string, checked: boolean) => {
    const newSeverities = new Set(filters.severities);
    if (checked) {
      newSeverities.add(severity);
    } else {
      newSeverities.delete(severity);
    }
    onFiltersChange({ severities: newSeverities });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ searchQuery: event.target.value });
  };

  const selectOnlySeverity = (severity: string) => {
    onFiltersChange({ severities: new Set([severity]) });
  };

  const severityData = [
    { 
      key: 'Severe', 
      count: disruptionCounts.severe, 
      color: 'bg-red-500', 
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      icon: '🚨'
    },
    { 
      key: 'Moderate', 
      count: disruptionCounts.moderate, 
      color: 'bg-orange-500', 
      bgColor: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-700',
      icon: '⚠️'
    },
    { 
      key: 'Minor', 
      count: disruptionCounts.minor, 
      color: 'bg-yellow-500', 
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700',
      icon: '⚡'
    },
  ];

  return (
    <div className="bg-slate-50 border-b border-slate-200 p-6 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        </div>
        
        <button
          onClick={onClearAll}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 
                   bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200
                   transition-all duration-200 hover:shadow-sm"
        >
          Clear All
        </button>
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <label htmlFor="search-input" className="block text-sm font-medium text-slate-700 mb-3">
          Search Locations
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="search-input"
            type="text"
            placeholder="Search by road name, area, or description..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-slate-400 text-slate-900 bg-white
                     transition-all duration-200 shadow-sm hover:shadow-md"
          />
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

      {/* Severity Filters */}
      <div className="mb-2">
        <h4 className="text-sm font-medium text-slate-700 mb-4">Severity Levels</h4>
        <div className="space-y-3">
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
                <label className="flex items-center space-x-3 cursor-pointer flex-1">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.severities.has(key)}
                      onChange={(e) => handleSeverityChange(key, e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                      ${filters.severities.has(key) 
                        ? `${color} border-transparent` 
                        : 'border-slate-300 bg-white hover:border-slate-400'}
                    `}>
                      {filters.severities.has(key) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-lg">{icon}</span>
                    <span className={`font-medium ${filters.severities.has(key) ? textColor : 'text-slate-700'}`}>
                      {key}
                    </span>
                  </div>
                  
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
