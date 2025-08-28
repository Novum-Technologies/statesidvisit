import React from "react";
import { PREFERENCE_LEVELS, type PreferenceLevel } from "../data/states";

interface PreferenceSelectorProps {
  selectedPreference: PreferenceLevel | null;
  onPreferenceSelect: (preference: PreferenceLevel | null) => void;
}

export function PreferenceSelector({
  selectedPreference,
  onPreferenceSelect,
}: PreferenceSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            Living Preference:
          </h2>
          <p className="text-sm text-gray-600 hidden sm:block">
            Select level (1-5 keys), then click regions
          </p>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(
              Object.entries(PREFERENCE_LEVELS) as [
                PreferenceLevel,
                (typeof PREFERENCE_LEVELS)[PreferenceLevel]
              ][]
            ).map(([level, config], index) => (
              <button
                key={level}
                onClick={() => onPreferenceSelect(level)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-center relative ${
                  selectedPreference === level
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="absolute top-1 right-1 text-xs text-gray-400 font-mono">
                  {index + 1}
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: config.color }}
                  />
                  <div className="font-medium text-sm text-gray-800">
                    {config.label}
                  </div>
                  {selectedPreference === level && (
                    <div className="text-xs text-blue-600 font-medium">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedPreference && (
          <div className="flex-shrink-0 hidden lg:block">
            <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                🎯 Click regions to mark as "
                {PREFERENCE_LEVELS[selectedPreference].label}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
