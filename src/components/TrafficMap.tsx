import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import type { Disruption } from '../types/disruption';
import { getSeverityConfig, formatStatus, formatCoordinates } from '../utils/disruptionUtils';
import '../utils/leafletFix'; // Fix for Leaflet icons

interface TrafficMapProps {
  disruptions: Disruption[];
  onDisruptionSelect: (disruption: Disruption) => void;
  selectedDisruption?: Disruption | null;
}

// Component to handle map centering when a disruption is selected
const MapController: React.FC<{ 
  selectedDisruption: Disruption | null;
  markerRefs: React.MutableRefObject<{ [key: string]: any }>;
}> = ({ selectedDisruption, markerRefs }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedDisruption?.geography?.coordinates) {
      const [longitude, latitude] = selectedDisruption.geography.coordinates;
      
      // Close any existing popup to prevent interference
      map.closePopup();
      
      // Simple center approach - let Leaflet handle positioning optimally
      map.setView([latitude, longitude], 15, { 
        animate: true,
        duration: 0.8
      });
      
      // Open the popup after animation completes
      setTimeout(() => {
        const marker = markerRefs.current[selectedDisruption.id];
        if (marker) {
          marker.openPopup();
        }
      }, 900); // Match animation duration + buffer
    } else if (selectedDisruption === null) {
      // Reset to original London view when no disruption is selected
      map.closePopup();
      map.setView([51.5074, -0.1278], 11, {
        animate: true,
        duration: 0.8
      });
    }
  }, [selectedDisruption, map, markerRefs]);
  
  return null;
};

// Custom marker icons for different severity levels
const createIcon = (severity: string, isSelected: boolean = false) => {
  const severityConfig = getSeverityConfig(severity);
  
  // Use blue color when selected, otherwise use severity color
  const color = isSelected ? '#3b82f6' : severityConfig.mapColor;
  const size = isSelected ? 28 : 25;
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="${size}" height="${Math.round(size * 1.6)}" viewBox="0 0 ${size} ${Math.round(size * 1.6)}" xmlns="http://www.w3.org/2000/svg">
        <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
          <path d="M${size/2} 1 C${size * 0.22} 1 1 ${size * 0.22} 1 ${size/2} C1 ${size * 0.78} ${size/2} ${Math.round(size * 1.6) - 1} ${size/2} ${Math.round(size * 1.6) - 1} C${size/2} ${Math.round(size * 1.6) - 1} ${size - 1} ${size * 0.78} ${size - 1} ${size/2} C${size - 1} ${size * 0.22} ${size * 0.78} 1 ${size/2} 1 Z" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="${size/2}" cy="${size/2}" r="${size * 0.3}" fill="white" stroke="${color}" stroke-width="1.5"/>
        </g>
      </svg>
    `)}`,
    iconSize: [size, Math.round(size * 1.6)],
    iconAnchor: [size/2, Math.round(size * 1.6)],
    popupAnchor: [0, -Math.round(size * 1.3)]
  });
};

// Center on London
const LONDON_CENTER: LatLngExpression = [51.5074, -0.1278];

export const TrafficMap: React.FC<TrafficMapProps> = ({ 
  disruptions, 
  onDisruptionSelect, 
  selectedDisruption 
}) => {
  const markerRefs = useRef<{ [key: string]: any }>({});

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={LONDON_CENTER}
        zoom={11}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController 
          selectedDisruption={selectedDisruption || null} 
          markerRefs={markerRefs}
        />
        
        {disruptions.map((disruption) => {
          // Only render markers with valid coordinates
          if (!disruption.geography?.coordinates) return null;
          
          const [longitude, latitude] = disruption.geography.coordinates;
          
          // Validate coordinates are within reasonable bounds for London area
          if (latitude < 51.2 || latitude > 51.8 || longitude < -0.8 || longitude > 0.4) {
            return null;
          }

          const isSelected = selectedDisruption?.id === disruption.id;
          
          return (
            <Marker
              key={disruption.id}
              position={[latitude, longitude]}
              icon={createIcon(disruption.severity, isSelected)}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[disruption.id] = ref;
                }
              }}
              eventHandlers={{
                click: () => onDisruptionSelect(disruption)
              }}
            >
              <Popup>
                <div className="min-w-[280px] p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{disruption.location}</h3>
                  <div className="mb-4">
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                        disruption.severity === 'Severe' ? 'bg-red-500' :
                        disruption.severity === 'Moderate' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}
                    >
                      {disruption.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">{disruption.comments}</p>
                  
                  <div className="space-y-3 border-t border-gray-100 pt-3">
                    {disruption.currentUpdate && (
                      <div className="flex items-center bg-blue-50 rounded-lg p-3">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-blue-700 !m-0">{formatStatus(disruption.status)}</p>
                      </div>
                    )}
                    
                    {disruption.geography?.coordinates && (
                      <>
                        <div className="border-t border-gray-200 my-3"></div>
                        <div className="flex items-center text-xs text-gray-500 px-1">
                          <svg className="w-3 h-3 mr-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-mono text-gray-500">{formatCoordinates(disruption.geography.coordinates)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
