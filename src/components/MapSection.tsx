import { TrafficMap } from "./TrafficMap";
import { UI_CONSTANTS } from "../constants/ui";
import { TEXT_CONSTANTS } from "../constants/text";
import type { Disruption } from "../types/disruption";

interface MapSectionProps {
  disruptions: Disruption[];
  selectedDisruption: Disruption | null;
  onDisruptionSelect: (disruption: Disruption) => void;
  disruptionCounts: {
    severe: number;
    moderate: number;
    minor: number;
    total: number;
  };
}

/**
 * MapSection Component
 * 
 * The main map display area that shows traffic disruptions on an interactive map.
 * This component serves as the primary visual interface for viewing and interacting
 * with traffic disruption data.
 * 
 * Features:
 * - Displays an interactive TrafficMap with disruption markers
 * - Shows a floating stats overlay with real-time disruption counts by severity
 * - Handles disruption selection and highlighting on the map
 * - Responsive design that takes up the remaining space beside the sidebar
 * - Color-coded severity indicators (red=severe, orange=moderate, yellow=minor)
 */
export const MapSection = ({
  disruptions,
  selectedDisruption,
  onDisruptionSelect,
  disruptionCounts,
}: MapSectionProps) => {
  return (
    <section className="flex-1 relative">
      <TrafficMap
        disruptions={disruptions}
        onDisruptionSelect={onDisruptionSelect}
        selectedDisruption={selectedDisruption}
      />
      <div
        className={`absolute top-4 right-4 ${UI_CONSTANTS.STATS_OVERLAY.Z_INDEX}`}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium">
                {disruptionCounts.severe} {TEXT_CONSTANTS[7]}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="font-medium">
                {disruptionCounts.moderate} {TEXT_CONSTANTS[8]}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">
                {disruptionCounts.minor} {TEXT_CONSTANTS[9]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
