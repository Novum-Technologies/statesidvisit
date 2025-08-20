import React from "react";
import { PREFERENCE_LEVELS, type PreferenceLevel } from "../data/states";

export function PreferenceLegend() {
  return (
    <div className="mt-4 p-4 bg-white/50 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
        Living Preference Legend
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-2 justify-items-center">
        {(
          Object.entries(PREFERENCE_LEVELS) as [
            PreferenceLevel,
            (typeof PREFERENCE_LEVELS)[PreferenceLevel],
          ]
        ).map(([level, config]) => (
          <div
            key={level}
            className="flex items-center space-x-2 justify-start"
          >
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: config.color }}
            />
            <span className="text-xs text-gray-600 font-medium">
              {config.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
