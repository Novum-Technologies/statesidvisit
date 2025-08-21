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
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Select Your Living Preference
      </h2>
      <p className="text-gray-700 mb-6">
        Choose a preference level, then click on states to apply it. Click a
        preference again to deselect.
      </p>

      <div className="space-y-3">
        {(
          Object.entries(PREFERENCE_LEVELS) as [
            PreferenceLevel,
            (typeof PREFERENCE_LEVELS)[PreferenceLevel],
          ][]
        ).map(([level, config]) => (
          <button
            key={level}
            onClick={() => onPreferenceSelect(level)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedPreference === level
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: config.color }}
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  {config.label}
                </div>
                <div className="text-sm text-gray-700">
                  {config.description}
                </div>
              </div>
              {selectedPreference === level && (
                <div className="text-blue-600 font-medium">Selected</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedPreference && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 hidden sm:block">
          <p className="text-blue-800 font-medium">
            🎯 Click on any state to mark it as "
            {PREFERENCE_LEVELS[selectedPreference].label}"
          </p>
        </div>
      )}
    </div>
  );
}
