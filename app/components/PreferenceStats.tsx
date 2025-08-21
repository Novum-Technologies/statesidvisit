import React from "react";
import {
  PREFERENCE_LEVELS,
  type StatePreference,
  type PreferenceLevel,
} from "../data/states";
import { US_STATE_DATA } from "../data/stateData";

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

interface PreferenceStatsProps {
  preferences: StatePreference[];
  hoveredState: string | null;
}

export function PreferenceStats({
  preferences,
  hoveredState,
}: PreferenceStatsProps) {
  const getStateCounts = () => {
    const counts: Record<PreferenceLevel, number> = {
      never: 0,
      reluctantly: 0,
      neutral: 0,
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
  const totalUSStates = 51; // Total US states + DC
  const progressPercentage = Math.round((totalStates / totalUSStates) * 100);

  // Milestone calculations
  const getMilestone = () => {
    if (totalStates === 0) return null;
    if (totalStates === 1) return { emoji: "🎯", text: "First state rated!" };
    if (totalStates === 5) return { emoji: "🚀", text: "Getting started!" };
    if (totalStates === 10) return { emoji: "🔥", text: "On a roll!" };
    if (totalStates === 25) return { emoji: "⭐", text: "Halfway hero!" };
    if (totalStates === 40) return { emoji: "🏆", text: "Almost there!" };
    if (totalStates === 51) return { emoji: "🎉", text: "Perfect completion!" };
    return null;
  };

  const currentMilestone = getMilestone();

  const getHoveredStateInfo = () => {
    if (!hoveredState) return null;
    const state = { id: hoveredState, name: STATE_NAMES[hoveredState] };
    const preference = preferences.find((p) => p.stateId === hoveredState);
    return { state, preference };
  };

  const hoveredInfo = getHoveredStateInfo();

  const getQuickStats = () => {
    const absolutelyStates = preferences
      .filter((p) => p.preference === "absolutely")
      .map((p) => p.stateId);

    if (absolutelyStates.length === 0) return null;

    const redStates = absolutelyStates.filter(
      (id) => US_STATE_DATA[id]?.politicalLeaning === "red"
    ).length;
    const blueStates = absolutelyStates.filter(
      (id) => US_STATE_DATA[id]?.politicalLeaning === "blue"
    ).length;
    const majorCityStates = absolutelyStates.filter(
      (id) => US_STATE_DATA[id]?.hasMajorCity
    ).length;

    const totalUSPopulation = Object.values(US_STATE_DATA).reduce(
      (sum, state) => sum + state.population,
      0
    );

    const absolutelyPopulation = absolutelyStates.reduce(
      (sum, stateId) => sum + (US_STATE_DATA[stateId]?.population || 0),
      0
    );

    const populationPercentage =
      totalUSPopulation > 0
        ? (absolutelyPopulation / totalUSPopulation) * 100
        : 0;

    return {
      redStates,
      blueStates,
      majorCityStates,
      populationPercentage,
    };
  };

  const quickStats = getQuickStats();

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
              {totalStates}/{totalUSStates} states & DC
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

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span>States Rated</span>
            <span>
              {totalStates} of {totalUSStates}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(totalStates / totalUSStates) * 100}%` }}
            />
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
                  <span className="text-gray-700 text-sm">{count} states</span>
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

        {/* Fun facts */}
        {totalStates > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">📊 Quick Stats</h3>
            <div className="text-sm text-gray-800 space-y-1">
              {quickStats && (
                <>
                  <div>
                    Politically, your 'Absolutely' states are{" "}
                    <span className="font-bold text-red-600">
                      {quickStats.redStates} red
                    </span>{" "}
                    and{" "}
                    <span className="font-bold text-blue-600">
                      {quickStats.blueStates} blue
                    </span>
                    .
                  </div>
                  <div>
                    {quickStats.majorCityStates} of them have a major city.
                  </div>
                  {quickStats.populationPercentage > 0 && (
                    <div>
                      They represent{" "}
                      <span className="font-bold">
                        {quickStats.populationPercentage.toFixed(1)}%
                      </span>{" "}
                      of the U.S. population.
                    </div>
                  )}
                </>
              )}
              {counts.absolutely > 0 && (
                <div>
                  💚 You'd love to live in {counts.absolutely} state
                  {counts.absolutely !== 1 ? "s" : ""}
                </div>
              )}
              {counts.never > 0 && (
                <div>
                  ❌ You'd never live in {counts.never} state
                  {counts.never !== 1 ? "s" : ""}
                </div>
              )}
              {totalStates === totalUSStates && (
                <div>🎉 You've rated all 50 states and DC!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
