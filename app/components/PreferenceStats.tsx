import React from "react";
import {
  PREFERENCE_LEVELS,
  type PreferenceLevel,
  type StatePreference,
} from "../data/states";

import { STATE_NAMES } from "../data/states";
import {
  CANADA_PROVINCE_NAMES,
} from "../data/canadaData";
import { EU_COUNTRY_NAMES } from "../data/euData";

const ALL_GEOGRAPHIES: Record<string, string> = {
  ...STATE_NAMES,
  ...CANADA_PROVINCE_NAMES,
  ...EU_COUNTRY_NAMES,
};

interface PreferenceStatsProps {
  preferences: StatePreference[];
  hoveredState: string | null;
  totalGeographies: number;
  mapType: "USA" | "Canada" | "Europe";
}

export function PreferenceStats({
  preferences,
  hoveredState,
  totalGeographies,
  mapType,
}: PreferenceStatsProps) {
  const geographyTypeName = getGeographyTypeName(mapType, totalGeographies);
  const getStateCounts = () => {
    const counts: Record<PreferenceLevel, number> = {
      never: 0,
      reluctantly: 0,
      maybe: 0,
      willing: 0,
      absolutely: 0,
    };

    preferences.forEach((pref) => {
      counts[pref.preference]++;
    });

    return counts;
  };

  const counts = getStateCounts();
  const totalStates = preferences.length;
  const progressPercentage =
    totalGeographies > 0
      ? Math.round((totalStates / totalGeographies) * 100)
      : 0;

  // Milestone calculations
  const getMilestone = () => {
    if (totalStates === 0) return null;
    if (totalStates === 1)
      return { emoji: "🎯", text: `First ${geographyTypeName} rated!` };
    if (totalStates === 5) return { emoji: "🚀", text: "Getting started!" };
    if (totalStates === 10) return { emoji: "🔥", text: "On a roll!" };
    if (totalStates >= totalGeographies / 2 && totalGeographies > 10)
      return { emoji: "⭐", text: "Halfway hero!" };
    if (totalStates >= totalGeographies * 0.8 && totalGeographies > 10)
      return { emoji: "🏆", text: "Almost there!" };
    if (totalStates === totalGeographies && totalGeographies > 0)
      return { emoji: "🎉", text: "Perfect completion!" };
    return null;
  };

  const currentMilestone = getMilestone();

  const getHoveredStateInfo = () => {
    if (!hoveredState) return null;
    const state = { id: hoveredState, name: ALL_GEOGRAPHIES[hoveredState] };
    const preference = preferences.find((p) => p.stateId === hoveredState);
    return { state, preference };
  };

  const hoveredInfo = getHoveredStateInfo();

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/20 pointer-events-none"></div>

      <div className="relative">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Your Preferences Summary
        </h2>

        {/* Progress Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-800">Progress</span>
            <span className="text-sm font-bold text-blue-600">
              {totalStates}/{totalGeographies} {geographyTypeName}
              {mapType === "USA" && " & DC"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-700">
              {progressPercentage}% complete
            </span>
            {currentMilestone && (
              <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm border animate-bounce">
                <span className="text-lg">{currentMilestone.emoji}</span>
                <span className="text-xs font-semibold text-gray-800">
                  {currentMilestone.text}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Preference breakdown */}
        <div className="space-y-3">
          {(
            Object.entries(PREFERENCE_LEVELS) as [
              PreferenceLevel,
              (typeof PREFERENCE_LEVELS)[PreferenceLevel],
            ][]
          ).map(([level, config]) => {
            const count = counts[level];
            const percentage =
              totalStates > 0 ? (count / totalStates) * 100 : 0;

            return (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-gray-800 font-medium">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-sm">
                    {count} {geographyTypeName}
                  </span>
                  {totalStates > 0 && (
                    <span className="text-gray-600 text-sm">
                      ({percentage.toFixed(0)}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const getGeographyTypeName = (
  mapType: "USA" | "Canada" | "Europe",
  count: number
) => {
  if (mapType === "USA") {
    return count === 1 ? "state" : "states";
  }
  if (mapType === "Canada") {
    return count === 1 ? "province" : "provinces";
  }
  if (mapType === "Europe") {
    return count === 1 ? "country" : "countries";
  }
  return "regions";
};
