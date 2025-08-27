import { useEffect, useRef, type RefObject } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import type { LatLngExpression } from "leaflet";
import type { Disruption } from "../types/disruption";
import {
  getSeverityConfig,
  formatStatus,
  formatCoordinates,
} from "../utils/disruptionUtils";
import "../utils/leafletFix"; // Fix for Leaflet icons

/**
 * Props interface for the TrafficMap component
 * Defines the data and callback functions needed for map functionality
 */
interface TrafficMapProps {
  disruptions: Disruption[]; // Array of disruptions to display as markers
  onDisruptionSelect: (disruption: Disruption) => void; // Callback when user clicks a marker
  selectedDisruption?: Disruption | null; // Currently selected disruption (for highlighting)
}

/**
 * MapController Component - Handles map navigation and popup management
 *
 * This component manages automatic map centering and popup display when disruptions are selected.
 * It runs inside the MapContainer context to access the map instance.
 *
 * Key functions:
 * - Centers map on selected disruption
 * - Opens popup for selected marker
 * - Resets view when no disruption is selected
 * - Handles smooth animations between locations
 */
const MapController = ({
  selectedDisruption,
  markerRefs,
}: {
  selectedDisruption: Disruption | null;
  markerRefs: RefObject<{ [key: string]: any }>;
}) => {
  const map = useMap(); // Access the Leaflet map instance

  useEffect(() => {
    // Handle when a specific disruption is selected
    if (selectedDisruption?.geography?.coordinates) {
      const [longitude, latitude] = selectedDisruption.geography.coordinates;

      // Close any existing popup to prevent interference with new selection
      map.closePopup();

      // Center map on the selected disruption with smooth animation
      // Zoom level 15 provides good detail for street-level view
      map.setView([latitude, longitude], 15, {
        animate: true, // Enable smooth panning animation
        duration: 0.8, // Animation duration in seconds
      });

      // Open the popup after map animation completes
      // Timeout ensures map has finished moving before popup appears
      setTimeout(() => {
        const marker = markerRefs.current?.[selectedDisruption.id];
        if (marker) {
          marker.openPopup(); // Show detailed disruption information
        }
      }, 900); // Slightly longer than animation duration
    } else if (selectedDisruption === null) {
      // Reset to default London overview when no disruption is selected
      map.closePopup(); // Hide any open popups
      map.setView([51.5074, -0.1278], 11, {
        // London center coordinates
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedDisruption, map, markerRefs]); // Re-run when selection changes

  return null; // This component doesn't render anything visual
};

/**
 * Creates custom map marker icons based on disruption severity
 *
 * Generates SVG-based markers with different colors and sizes:
 * - Red for severe disruptions
 * - Orange for moderate disruptions
 * - Yellow for minor disruptions
 * - Blue highlighting for selected markers
 *
 * @param severity - Disruption severity level (Serious/Moderate/Minimal)
 * @param isSelected - Whether this marker is currently selected
 * @returns Leaflet Icon instance for the marker
 */
const createIcon = (severity: string, isSelected: boolean = false) => {
  const severityConfig = getSeverityConfig(severity); // Get color config for severity

  // Use blue highlight when selected, otherwise use severity-based color
  const color = isSelected ? "#3b82f6" : severityConfig.mapColor;
  const size = isSelected ? 28 : 25; // Larger size for selected markers

  // Create SVG icon with drop shadow and custom styling
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="${size}" height="${Math.round(
      size * 1.6
    )}" viewBox="0 0 ${size} ${Math.round(
      size * 1.6
    )}" xmlns="http://www.w3.org/2000/svg">
        <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
          <path d="M${size / 2} 1 C${size * 0.22} 1 1 ${size * 0.22} 1 ${
      size / 2
    } C1 ${size * 0.78} ${size / 2} ${Math.round(size * 1.6) - 1} ${size / 2} ${
      Math.round(size * 1.6) - 1
    } C${size / 2} ${Math.round(size * 1.6) - 1} ${size - 1} ${size * 0.78} ${
      size - 1
    } ${size / 2} C${size - 1} ${size * 0.22} ${size * 0.78} 1 ${
      size / 2
    } 1 Z" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="${size / 2}" cy="${size / 2}" r="${
      size * 0.3
    }" fill="white" stroke="${color}" stroke-width="1.5"/>
        </g>
      </svg>
    `)}`,
    iconSize: [size, Math.round(size * 1.6)], // Icon dimensions
    iconAnchor: [size / 2, Math.round(size * 1.6)], // Point that corresponds to marker position
    popupAnchor: [0, -Math.round(size * 1.3)], // Popup position relative to icon
  });
};

// Default map center coordinates (London city center)
const LONDON_CENTER: LatLngExpression = [51.5074, -0.1278];

/**
 * TrafficMap Component - Main interactive map displaying London traffic disruptions
 *
 * This component renders a full-featured interactive map with the following capabilities:
 *
 * Core Features:
 * - Displays OpenStreetMap tiles for London area
 * - Shows disruption markers with severity-based colors
 * - Handles marker clicks for disruption selection
 * - Automatic map centering on selected disruptions
 * - Detailed popups with disruption information
 *
 * Data Display:
 * - Each disruption appears as a colored marker on the map
 * - Marker colors indicate severity (red=serious, orange=moderate, yellow=minor)
 * - Selected markers are highlighted in blue and enlarged
 * - Popups show detailed disruption information when clicked
 *
 * User Interactions:
 * - Click markers to select disruptions and view details
 * - Map automatically centers on selected disruptions
 * - Smooth animations for better user experience
 * - Zoom and pan controls for map navigation
 *
 * Performance Optimizations:
 * - Only renders markers with valid coordinates
 * - Validates coordinates are within London area bounds
 * - Efficient marker reference management for popup control
 *
 * @param disruptions - Array of traffic disruptions to display
 * @param onDisruptionSelect - Callback function when user selects a disruption
 * @param selectedDisruption - Currently selected disruption for highlighting
 */
export const TrafficMap = ({
  disruptions,
  onDisruptionSelect,
  selectedDisruption,
}: TrafficMapProps) => {
  // Store references to map markers for programmatic control (popup opening/closing)
  const markerRefs = useRef<{ [key: string]: any }>({});

  return (
    <div className="h-full w-full relative">
      {/* Main map container with London center and appropriate zoom level */}
      <MapContainer
        center={LONDON_CENTER} // Start centered on London
        zoom={11} // City-wide view showing all of London
        className="h-full w-full z-0" // Full size with proper z-index
        scrollWheelZoom={true} // Allow zoom with mouse wheel
      >
        {/* OpenStreetMap tile layer - provides the base map imagery */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map controller handles automatic centering and popup management */}
        <MapController
          selectedDisruption={selectedDisruption || null}
          markerRefs={markerRefs}
        />

        {/* Render markers for each valid disruption */}
        {disruptions.map((disruption) => {
          // Skip disruptions without valid coordinate data
          if (!disruption.geography?.coordinates) return null;

          const [longitude, latitude] = disruption.geography.coordinates;

          // Validate coordinates are within reasonable bounds for London area
          // This prevents markers from appearing in wrong locations due to bad data
          if (
            latitude < 51.2 ||
            latitude > 51.8 ||
            longitude < -0.8 ||
            longitude > 0.4
          ) {
            return null;
          }

          // Check if this disruption is currently selected for highlighting
          const isSelected = selectedDisruption?.id === disruption.id;

          return (
            <Marker
              key={disruption.id} // Unique key for React rendering
              position={[latitude, longitude]} // Marker position on map
              icon={createIcon(disruption.severity, isSelected)} // Custom icon based on severity
              ref={(ref) => {
                // Store marker reference for programmatic popup control
                if (ref && markerRefs.current) {
                  markerRefs.current[disruption.id] = ref;
                }
              }}
              eventHandlers={{
                // Handle marker clicks to select disruptions
                click: () => onDisruptionSelect(disruption),
              }}
            >
              {/* Detailed popup showing disruption information */}
              <Popup>
                <div className="min-w-[280px] p-4">
                  {/* Disruption location as main heading */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {disruption.location}
                  </h3>

                  {/* Severity badge with color coding */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                        disruption.severity === "Serious"
                          ? "bg-red-500"
                          : disruption.severity === "Moderate"
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {disruption.severity}
                    </span>
                  </div>

                  {/* Main disruption description */}
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    {disruption.comments}
                  </p>

                  {/* Additional information section */}
                  <div className="space-y-3 border-t border-gray-100 pt-3">
                    {/* Current status update (if available) */}
                    {disruption.currentUpdate && (
                      <div className="flex items-center bg-blue-50 rounded-lg p-3">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          {/* Info icon */}
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-blue-700 !m-0">
                          {formatStatus(disruption.status)}
                        </p>
                      </div>
                    )}

                    {/* Coordinates display for technical reference */}
                    {disruption.geography?.coordinates && (
                      <>
                        <div className="border-t border-gray-200 my-3"></div>
                        <div className="flex items-center text-xs text-gray-500 px-1">
                          {/* Location pin icon */}
                          <svg
                            className="w-3 h-3 mr-2 flex-shrink-0 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {/* Formatted coordinates for reference */}
                          <span className="font-mono text-gray-500">
                            {formatCoordinates(
                              disruption.geography.coordinates
                            )}
                          </span>
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
