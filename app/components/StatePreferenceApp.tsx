import React, { useState, useCallback, useEffect, useRef } from "react";
import { AccurateUSMap } from "./AccurateUSMap";
import { PreferenceSelector } from "./PreferenceSelector";
import { PreferenceStats } from "./PreferenceStats";
import type { StatePreference, PreferenceLevel } from "../data/states";

export function StatePreferenceApp() {
  const [preferences, setPreferences] = useState<StatePreference[]>([]);
  const [selectedPreference, setSelectedPreference] =
    useState<PreferenceLevel | null>("never");
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  // Encode preferences to URL parameter
  const encodePreferencesToURL = (prefs: StatePreference[]): string => {
    if (prefs.length === 0) return "";

    // Create a compact encoding: stateId:preference,stateId:preference
    const encoded = prefs
      .map((pref) => `${pref.stateId}:${pref.preference}`)
      .join(",");

    return btoa(encoded); // Base64 encode for URL safety
  };

  // Decode preferences from URL parameter
  const decodePreferencesFromURL = (encoded: string): StatePreference[] => {
    try {
      if (!encoded) return [];

      const decoded = atob(encoded); // Base64 decode
      return decoded.split(",").map((item) => {
        const [stateId, preference] = item.split(":");
        return { stateId, preference: preference as PreferenceLevel };
      });
    } catch (error) {
      console.warn("Failed to decode preferences from URL:", error);
      return [];
    }
  };

  // Load preferences from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encoded = urlParams.get("prefs");

    if (encoded) {
      const decodedPrefs = decodePreferencesFromURL(encoded);
      if (decodedPrefs.length > 0) {
        setPreferences(decodedPrefs);
      }
    }
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

      setPreferences((prev) => {
        // Check if state already has a preference
        const existingIndex = prev.findIndex((p) => p.stateId === stateId);

        if (existingIndex >= 0) {
          // If clicking with the same preference, remove it
          if (prev[existingIndex].preference === selectedPreference) {
            return prev.filter((_, index) => index !== existingIndex);
          }
          // Otherwise update the preference
          const updated = [...prev];
          updated[existingIndex] = { stateId, preference: selectedPreference };
          return updated;
        } else {
          // Add new preference
          return [...prev, { stateId, preference: selectedPreference }];
        }
      });
    },
    [selectedPreference]
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

  const clearAllPreferences = () => {
    setPreferences([]);
    setSelectedPreference(null);
  };

  // Share functionality
  const handleShare = async () => {
    const encoded = encodePreferencesToURL(preferences);
    const url = new URL(window.location.origin);

    if (encoded) {
      url.searchParams.set("prefs", encoded);
    }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 relative overflow-hidden">
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🗺️ US States Living Preference Map
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore your preferences for living in different US states. Select a
            preference level and click on states to color-code your ideal places
            to live.
          </p>
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
            <AccurateUSMap
              preferences={preferences}
              selectedPreference={selectedPreference}
              onStateClick={handleStateClick}
              onStateHover={handleStateHover}
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
