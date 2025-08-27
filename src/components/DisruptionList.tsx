import { useState, type MouseEvent } from 'react';
import type { Disruption } from '../types/disruption';
import { getSeverityConfig, formatStatus, formatCoordinates } from '../utils/disruptionUtils';
import { TEXT_CONSTANTS } from '../constants/text';

interface DisruptionListProps {
  disruptions: Disruption[];
  onDisruptionSelect: (disruption: Disruption) => void;
  selectedDisruption: Disruption | null;
  onShowAlert?: (type: 'error' | 'warning' | 'info' | 'success', title: string, message: string) => void;
}

export const DisruptionList = ({
  disruptions,
  onDisruptionSelect,
  selectedDisruption,
  onShowAlert
}: DisruptionListProps) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (disruptionId: string, event: MouseEvent) => {
    event.stopPropagation(); // Prevent card selection when clicking expand button
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(disruptionId)) {
      newExpanded.delete(disruptionId);
    } else {
      newExpanded.add(disruptionId);
    }
    setExpandedCards(newExpanded);
  };

  // Enhanced disruption selection with alert
  const handleDisruptionSelect = (disruption: Disruption) => {
    onDisruptionSelect(disruption);
    
    // Show selection feedback alert
    if (onShowAlert) {
      onShowAlert(
        'info', 
        'Disruption Selected', 
        `Viewing ${disruption.severity.toLowerCase()} disruption on ${disruption.location}`
      );
    }
  };

  if (disruptions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{TEXT_CONSTANTS[15]}</h3>
          <p className="text-gray-500">{TEXT_CONSTANTS[16]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Fixed header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900">
          {TEXT_CONSTANTS[17]} ({disruptions.length})
        </h2>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {disruptions.map((disruption) => {
            const severityConfig = getSeverityConfig(disruption.severity);
            const isSelected = selectedDisruption?.id === disruption.id;
            const isExpanded = expandedCards.has(disruption.id);
            
            return (
              <div
                key={disruption.id}
                className={`
                  p-4 cursor-pointer transition-all duration-200 border-l-4
                  ${isSelected 
                    ? 'bg-blue-50 border-l-blue-500' 
                    : 'hover:bg-blue-50 border-l-transparent hover:border-l-blue-300'
                  }
                `}
                onClick={() => handleDisruptionSelect(disruption)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 leading-5 flex-1 pr-2">
                    {disruption.location}
                  </h3>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span 
                      className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white
                        ${severityConfig.badgeColor}
                      `}
                    >
                      {severityConfig.icon} {disruption.severity}
                    </span>
                    <button
                      onClick={(e) => toggleCardExpansion(disruption.id, e)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                      aria-label={isExpanded ? TEXT_CONSTANTS[18] : TEXT_CONSTANTS[19]}
                    >
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p className={`text-sm text-gray-600 leading-5 mb-3 ${
                  isExpanded ? '' : 'line-clamp-3'
                }`}>
                  {disruption.comments}
                </p>
                
                {isExpanded && (
                  <div className="space-y-2 mb-3 p-3 bg-gray-50 rounded-lg">
                    {disruption.currentUpdate && (
                      <div className="flex items-start text-xs">
                        <svg className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <span className="font-medium text-gray-700">{TEXT_CONSTANTS[20]}</span>
                          <p className="text-gray-600 mt-1">{formatStatus(disruption.status)}</p>
                        </div>
                      </div>
                    )}
                    
                    {disruption.geography?.coordinates && (
                      <div className="flex items-center text-xs">
                        <svg className="w-3 h-3 mr-2 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-600">
                          {TEXT_CONSTANTS[21]} {formatCoordinates(disruption.geography.coordinates)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {!isExpanded && disruption.currentUpdate && (
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="truncate">{formatStatus(disruption.status)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
