import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import type { Disruption } from '../types/disruption';
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
  const getColor = (sev: string) => {
    switch (sev) {
      case 'Severe': return '#dc2626';
      case 'Moderate': return '#ea580c';
      case 'Minor': return '#eab308';
      default: return '#6b7280';
    }
  };
  
  // Use blue color when selected, otherwise use severity color
  const color = isSelected ? '#3b82f6' : getColor(severity);
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
                <div className="min-w-[250px] p-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{disruption.location}</h3>
                  <div className="mb-3">
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                        disruption.severity === 'Severe' ? 'bg-red-500' :
                        disruption.severity === 'Moderate' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}
                    >
                      {disruption.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">{disruption.comments}</p>
                  {disruption.currentUpdate && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Status:</span> {disruption.currentUpdate}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
