import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  PREFERENCE_LEVELS,
  type PreferenceLevel,
  type StatePreference,
} from "../data/states";
import { PreferenceLegend } from "./PreferenceLegend";

// US States TopoJSON URL - clean, simple version
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

interface AccurateUSMapProps {
  preferences: StatePreference[];
  selectedPreference: PreferenceLevel | null;
  onStateClick: (stateId: string) => void;
  onStateHover?: (stateId: string | null) => void;
}

export function AccurateUSMap({
  preferences,
  selectedPreference,
  onStateClick,
  onStateHover,
}: AccurateUSMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getStateColor = (stateId: string): string => {
    const preference = preferences.find((p) => p.stateId === stateId);
    if (!preference) return "#9ca3af"; // gray-400 for unselected states - much more visible
    return PREFERENCE_LEVELS[preference.preference].color;
  };

  const getStateOpacity = (stateId: string): number => {
    const preference = preferences.find((p) => p.stateId === stateId);
    return preference ? 1 : 0.9; // Less transparent for unselected states
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div
        className="bg-white rounded-xl shadow-2xl p-2 border border-gray-100 relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {tooltipContent && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 bg-gray-900 text-white text-sm rounded-md px-3 py-1.5"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              marginTop: -40,
            }}
          >
            {tooltipContent}
          </div>
        )}
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 pointer-events-none"></div>
        <div className="relative">
          <ComposableMap
            projection="geoAlbersUsa"
            width={1200} // Increased
            height={700} // Increased
            projectionConfig={{
              scale: 1300, // Increased
              center: [0, 0],
            }}
            style={{
              width: "100%",
              height: "auto",
              backgroundColor: "#ffffff", // Changed to white
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateId =
                    geo.properties.name ||
                    geo.properties.NAME ||
                    geo.properties.STATE_NAME ||
                    geo.properties.STUSPS || // Added STUSPS
                    geo.id;
                  const stateAbbr =
                    stateId?.length === 2
                      ? stateId
                      : getStateAbbreviation(stateId);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStateColor(stateAbbr)}
                      fillOpacity={getStateOpacity(stateAbbr)}
                      stroke="#1f2937" // Darker stroke
                      strokeWidth={1} // Thicker stroke
                      style={{
                        default: {
                          outline: "none",
                          cursor: selectedPreference ? "pointer" : "default",
                          transition: "all 0.2s ease", // More subtle transition
                        },
                        hover: {
                          outline: "none",
                          fill: getStateColor(stateAbbr),
                          stroke: "#374151", // More subtle hover stroke
                          strokeWidth: 1.5, // More subtle hover stroke width
                          fillOpacity: 1,
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                      onClick={() => {
                        if (selectedPreference && stateAbbr) {
                          onStateClick(stateAbbr);
                        }
                      }}
                      onMouseEnter={() => {
                        if (onStateHover && stateAbbr) {
                          onStateHover(stateAbbr);
                          setTooltipContent(
                            STATE_NAMES[stateAbbr] || stateAbbr
                          );
                        }
                      }}
                      onMouseLeave={() => {
                        if (onStateHover) {
                          onStateHover(null);
                          setTooltipContent("");
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* DC Button - positioned over the map - animations toned down */}
          <button
            onClick={() => {
              if (selectedPreference) {
                onStateClick("DC");
              }
            }}
            onMouseEnter={() => {
              onStateHover && onStateHover("DC");
              setTooltipContent("District of Columbia");
            }}
            onMouseLeave={() => {
              onStateHover && onStateHover(null);
              setTooltipContent("");
            }}
            className="absolute top-3/5 right-4 -translate-y-1/2 md:top-1/2 md:right-[10%] md:-translate-y-1/2 z-10 px-2 py-1 text-xs md:px-4 md:py-2 md:text-sm font-bold rounded-xl border-2 transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: getStateColor("DC"),
              borderColor: "#1f2937",
              color: "#ffffff",
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            <span className="md:hidden">DC</span>
            <span className="hidden md:inline">🏛️ DC</span>
          </button>
        </div>
        <div className="text-center text-xs text-gray-400 mt-2">
          www.statesidliveinmap.com
        </div>
        <PreferenceLegend />
      </div>
    </div>
  );
}

// Helper function to convert full state names to abbreviations
function getStateAbbreviation(fullName: string): string {
  const stateMap: Record<string, string> = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
    "District of Columbia": "DC",
    "Washington, D.C.": "DC",
    "Washington DC": "DC",
    "D.C.": "DC",
  };

  return stateMap[fullName] || fullName;
}
