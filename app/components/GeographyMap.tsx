import React, { useState, forwardRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  PREFERENCE_LEVELS,
  type PreferenceLevel,
  type StatePreference,
} from "../data/states";
import { PreferenceLegend } from "./PreferenceLegend";

interface GeographyMapProps {
  geoUrl: string;
  preferences: StatePreference[];
  selectedPreference: PreferenceLevel | null;
  onGeographyClick: (geoId: string) => void;
  onGeographyHover?: (geoId: string | null) => void;
  projection: string;
  projectionConfig: object;
  getGeographyId: (geo: any) => string;
  getGeographyName: (geo: any) => string;
  width?: number;
  height?: number;
  showDCButton?: boolean;
  exclude?: string[];
}

export const GeographyMap = forwardRef<HTMLDivElement, GeographyMapProps>(
  (
    {
      geoUrl,
      preferences,
      selectedPreference,
      onGeographyClick,
      onGeographyHover,
      projection,
      projectionConfig,
      getGeographyId,
      getGeographyName,
      width = 800,
      height = 600,
      showDCButton = false,
      exclude = [],
    },
    ref
  ) => {
    const [tooltipContent, setTooltipContent] = useState("");
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const getGeographyColor = (geoId: string): string => {
      const preference = preferences.find((p) => p.stateId === geoId);
      if (!preference) return "#9ca3af";
      return PREFERENCE_LEVELS[preference.preference].color;
    };

    const getGeographyOpacity = (geoId: string): number => {
      const preference = preferences.find((p) => p.stateId === geoId);
      return preference ? 1 : 0.9;
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    return (
      <div className="w-full max-w-7xl mx-auto" ref={ref}>
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 pointer-events-none"></div>
          <div className="relative">
            <ComposableMap
              projection={projection}
              projectionConfig={projectionConfig}
              width={width}
              height={height}
              style={{
                width: "100%",
                height: "auto",
                backgroundColor: "#ffffff",
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies
                    .filter((geo) => !exclude.includes(getGeographyId(geo)))
                    .map((geo) => {
                      const geoId = getGeographyId(geo);
                      const geoName = getGeographyName(geo);

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getGeographyColor(geoId)}
                          fillOpacity={getGeographyOpacity(geoId)}
                          stroke="#1f2937"
                          strokeWidth={1}
                          style={{
                            default: {
                              outline: "none",
                              cursor: selectedPreference
                                ? "pointer"
                                : "default",
                              transition: "all 0.2s ease",
                            },
                            hover: {
                              outline: "none",
                              fill: getGeographyColor(geoId),
                              stroke: "#374151",
                              strokeWidth: 1.5,
                              fillOpacity: 1,
                            },
                            pressed: {
                              outline: "none",
                            },
                          }}
                          onClick={() => {
                            if (selectedPreference && geoId) {
                              onGeographyClick(geoId);
                            }
                          }}
                          onMouseEnter={() => {
                            if (onGeographyHover && geoId) {
                              onGeographyHover(geoId);
                              setTooltipContent(geoName || geoId);
                            }
                          }}
                          onMouseLeave={() => {
                            if (onGeographyHover) {
                              onGeographyHover(null);
                              setTooltipContent("");
                            }
                          }}
                        />
                      );
                    })
                }
              </Geographies>
            </ComposableMap>
            {showDCButton && (
              <button
                onClick={() => {
                  if (selectedPreference) {
                    onGeographyClick("DC");
                  }
                }}
                onMouseEnter={() => {
                  onGeographyHover && onGeographyHover("DC");
                  setTooltipContent("District of Columbia");
                }}
                onMouseLeave={() => {
                  onGeographyHover && onGeographyHover(null);
                  setTooltipContent("");
                }}
                className="absolute top-3/5 right-1 -translate-y-1/2 md:top-1/2 md:right-[5%] md:-translate-y-1/2 z-10 px-2 py-1 text-xs md:px-4 md:py-2 md:text-sm font-bold rounded-xl border-2 transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: getGeographyColor("DC"),
                  borderColor: "#1f2937",
                  color: "#ffffff",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                }}
              >
                <span className="md:hidden">DC</span>
                <span className="hidden md:inline">🏛️ DC</span>
              </button>
            )}
          </div>
          <div className="text-center text-xs text-gray-400 mt-2">
            www.statesidliveinmap.com
          </div>
          <PreferenceLegend />
        </div>
      </div>
    );
  }
);
