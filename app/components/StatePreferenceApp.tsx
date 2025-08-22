import React, { useState, useCallback, useEffect, useRef } from "react";
import { GeographyMap } from "./GeographyMap";
import { PreferenceSelector } from "./PreferenceSelector";
import { PreferenceStats } from "./PreferenceStats";
import { toPng } from "html-to-image";
import {
  PREFERENCE_MAP,
  PREFERENCE_MAP_REVERSE,
  type PreferenceLevel,
  type StatePreference,
} from "../data/states";
import {
  CANADA_PROVINCE_NAMES,
} from "../data/canadaData";
import { EU_COUNTRY_NAMES } from "../data/euData";
import { STATE_NAMES } from "../data/states";
import LZString from "lz-string";
import { feature } from "topojson-client";

type MapType = "USA" | "Canada" | "Europe";

type MapConfig = {
  geoUrl: string;
  projection: string;
  projectionConfig: any;
  getGeographyId: (geo: any) => any;
  getGeographyName: (geo: any) => any;
  exclude?: string[];
};

export function StatePreferenceApp() {
  const [allPreferences, setAllPreferences] = useState<
    Record<MapType, StatePreference[]>
  >({
    USA: [],
    Canada: [],
    Europe: [],
  });
  const [selectedPreference, setSelectedPreference] =
    useState<PreferenceLevel | null>("never");
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [selectedMap, setSelectedMap] = useState<MapType>("USA");
  const mapRef = useRef<HTMLDivElement>(null);
  const [totalGeographies, setTotalGeographies] = useState(0);

  const preferences = allPreferences[selectedMap];

  // Map Configurations
  const mapConfigs: Record<MapType, MapConfig> = {
    USA: {
      geoUrl: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
      projection: "geoAlbersUsa",
      projectionConfig: {
        scale: 1000,
        center: [-96, 38],
      },
      getGeographyId: (geo: any) =>
        geo.properties.STUSPS ||
        geo.properties.name ||
        geo.id,
      getGeographyName: (geo: any) => geo.properties.name,
      exclude: [],
    },
    Canada: {
      geoUrl: "/maps/canada.topo.json",
      projection: "geoConicConformal",
      projectionConfig: {
        rotate: [95, 0],
        center: [0, 60],
        parallels: [50, 80],
        scale: 800,
      },
      getGeographyId: (geo: any) => geo.id,
      getGeographyName: (geo: any) => geo.properties.name,
      exclude: [],
    },
    Europe: {
      geoUrl: "/maps/eu.topo.json",
      projection: "geoAzimuthalEqualArea",
      projectionConfig: {
        rotate: [-20, -52, 0],
        scale: 950,
      },
      getGeographyId: (geo: any) => geo.id,
      getGeographyName: (geo: any) => geo.properties.name,
      exclude: ["IL", "MC", "SM", "AD", "LI", "MT", "VA"],
    },
  };

  const currentMapConfig = mapConfigs[selectedMap];

  useEffect(() => {
    fetch(currentMapConfig.geoUrl)
      .then((res) => res.json())
      .then((data) => {
        const features = feature(
          data,
          data.objects[Object.keys(data.objects)[0]]
        ).features;
        const filteredFeatures = features.filter(
          (f) => !(currentMapConfig.exclude || []).includes(currentMapConfig.getGeographyId(f))
        );
        setTotalGeographies(filteredFeatures.length);
      });
  }, [selectedMap, currentMapConfig]);

  // Encode preferences to URL parameter
  const encodePreferencesToURL = (prefs: StatePreference[]): string => {
    if (prefs.length === 0) return "";
    return prefs
      .map((p) => `${p.stateId},${PREFERENCE_MAP[p.preference]}`)
      .join("-");
  };

  const encodeAllPreferencesToURL = (
    allPrefs: Record<MapType, StatePreference[]>
  ) => {
    const json = JSON.stringify(allPrefs);
    return LZString.compressToEncodedURIComponent(json);
  };

  // Decode preferences from URL parameter
  const decodePreferencesFromURL = (encoded: string): StatePreference[] => {
    try {
      if (!encoded) return [];
      return encoded.split("-").map((item) => {
        const parts = item.split(",");
        const stateId = parts[0];
        const preferenceNum = parseInt(parts[1], 10);
        return {
          stateId,
          preference: PREFERENCE_MAP_REVERSE[preferenceNum],
        };
      });
    } catch (error) {
      console.warn("Failed to decode preferences from URL:", error);
      return [];
    }
  };

  // Load preferences from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mapFromUrl = urlParams.get("map") as MapType;

    if (mapFromUrl && ["USA", "Canada", "Europe"].includes(mapFromUrl)) {
      setSelectedMap(mapFromUrl);
    }

    const compressedPrefs = urlParams.get("prefs");
    if (compressedPrefs) {
      try {
        const json = LZString.decompressFromEncodedURIComponent(compressedPrefs);
        const newAllPreferences = JSON.parse(json);
        setAllPreferences(newAllPreferences);
        return;
      } catch (e) {
        console.error("Failed to decode preferences from URL", e);
      }
    }

    // Backwards compatibility for old URL format
    const newAllPreferences: Record<MapType, StatePreference[]> = {
      USA: [],
      Canada: [],
      Europe: [],
    };

    for (const mapType of ["USA", "Canada", "Europe"] as MapType[]) {
      const key = `prefs${mapType}`;
      const encoded = urlParams.get(key);
      if (encoded) {
        newAllPreferences[mapType] = decodePreferencesFromURL(encoded);
      }
    }

    // Backwards compatibility for old URL format
    const oldEncoded = urlParams.get("prefs");
    if (oldEncoded && !urlParams.has("prefsUSA")) {
      newAllPreferences[mapFromUrl || "USA"] =
        decodePreferencesFromURL(oldEncoded);
    }

    setAllPreferences(newAllPreferences);
  }, []);

  // Update URL when preferences change
  /*
  useEffect(() => {
    const encoded = encodePreferencesToURL(preferences);
    const url = new URL(window.location.href);

    if (encoded) {
      url.searchParams.set("prefs", encoded);
    } else {
      url.searchParams.delete("prefs");
    }

    // Update URL without page reload
    window.history.replaceState({}, "", url.toString());
  }, [preferences]);
  */

  const handleStateClick = useCallback(
    (stateId: string) => {
      if (!selectedPreference) {
        // If no preference is selected, show a hint
        return;
      }

      setAllPreferences((prevAll) => {
        const prevForMap = prevAll[selectedMap];
        const existingIndex = prevForMap.findIndex((p) => p.stateId === stateId);

        let newForMap: StatePreference[];

        if (existingIndex >= 0) {
          // If clicking with the same preference, remove it
          if (prevForMap[existingIndex].preference === selectedPreference) {
            newForMap = prevForMap.filter((_, index) => index !== existingIndex);
          } else {
            // Otherwise update the preference
            const updated = [...prevForMap];
            updated[existingIndex] = { stateId, preference: selectedPreference };
            newForMap = updated;
          }
        } else {
          // Add new preference
          newForMap = [...prevForMap, { stateId, preference: selectedPreference }];
        }
        return {
          ...prevAll,
          [selectedMap]: newForMap,
        };
      });
    },
    [selectedPreference, selectedMap]
  );

  const handlePreferenceSelect = useCallback(
    (preference: PreferenceLevel | null) => {
      setSelectedPreference(preference);
    },
    []
  );

  const handleStateHover = useCallback((stateId: string | null) => {
    setHoveredState(stateId);
  }, []);

  const handleExportImage = useCallback(() => {
    if (mapRef.current === null) {
      return;
    }

    toPng(mapRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-states-map.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Failed to export image:", err);
      });
  }, [mapRef]);

  const clearAllPreferences = () => {
    setAllPreferences({
      USA: [],
      Canada: [],
      Europe: [],
    });
    setSelectedPreference(null);
  };

  // Share functionality
  const handleShare = async () => {
    const encodedString = encodeAllPreferencesToURL(allPreferences);
    const url = new URL(window.location.origin);
    url.searchParams.set("prefs", encodedString);
    url.searchParams.set("map", selectedMap);

    const shareUrl = url.toString();

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 3000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-1 sm:p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-4 -left-4 w-96 h-96 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🗺️ US States Living Preference Map
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore your preferences for living in different places. Select a
            preference level and click on states/countries to color-code your ideal
            places to live.
          </p>
        </div>

        {/* Map Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md p-1 flex space-x-1">
            {(["USA", "Canada", "Europe"] as MapType[]).map((mapType) => (
              <button
                key={mapType}
                onClick={() => setSelectedMap(mapType)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedMap === mapType
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {mapType}
              </button>
            ))}
          </div>
        </div>

        {/* Main content grid - Two columns for maximum map space */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left sidebar - Controls only */}
          <div className="xl:col-span-1 space-y-6">
            <PreferenceSelector
              selectedPreference={selectedPreference}
              onPreferenceSelect={handlePreferenceSelect}
            />

            {/* Action buttons - Desktop */}
            {preferences.length > 0 && (
              <div className="hidden xl:block space-y-2">
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium relative"
                >
                  🔗 Share Your Map
                  {showShareSuccess && (
                    <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={handleExportImage}
                  className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
                >
                  🖼️ Export Image
                </button>
                <button
                  onClick={clearAllPreferences}
                  className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                >
                  🗑️ Clear All Preferences
                </button>
              </div>
            )}
          </div>

          {/* Right side - Large Map and Stats */}
          <div className="xl:col-span-3">
            <GeographyMap
              ref={mapRef}
              geoUrl={currentMapConfig.geoUrl}
              preferences={preferences}
              selectedPreference={selectedPreference}
              onGeographyClick={handleStateClick}
              onGeographyHover={handleStateHover}
              projection={currentMapConfig.projection}
              projectionConfig={currentMapConfig.projectionConfig}
              getGeographyId={currentMapConfig.getGeographyId}
              getGeographyName={currentMapConfig.getGeographyName}
              showDCButton={selectedMap === "USA"}
              exclude={currentMapConfig.exclude}
            />

            {/* Instructions */}
            <div className="mt-4 text-center text-gray-600 hidden md:block">
              {selectedPreference && (
                <p>Click on states to mark them as "{selectedPreference}"</p>
              )}
            </div>

            {/* Stats under the map */}
            <div className="mt-6">
              <PreferenceStats
                preferences={preferences}
                hoveredState={hoveredState}
                totalGeographies={totalGeographies}
                mapType={selectedMap}
              />
            </div>

            {/* Action buttons - Mobile */}
            {preferences.length > 0 && (
              <div className="xl:hidden mt-6 space-y-2">
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium relative"
                >
                  🔗 Share Your Map
                  {showShareSuccess && (
                    <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={handleExportImage}
                  className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
                >
                  🖼️ Export Image
                </button>
                <button
                  onClick={clearAllPreferences}
                  className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                >
                  🗑️ Clear All Preferences
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Interactive US States Map • Built with React Router & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}

