import React from "react";

type MapType =
  | "USA"
  | "Canada"
  | "Europe"
  | "Brazil"
  | "France"
  | "Germany"
  | "Great Britain"
  | "Poland"
  | "Japan";

interface CountrySelectorProps {
  selectedMap: MapType;
  onMapSelect: (mapType: MapType) => void;
}

// Define countries/regions organized by popularity and regions
const countryData = {
  // Most Popular (based on common preferences)
  popular: [
    {
      id: "USA" as MapType,
      name: "United States",
      flag: "🇺🇸",
      available: true,
    },
    { id: "Canada" as MapType, name: "Canada", flag: "🇨🇦", available: true },
    { id: "Europe" as MapType, name: "Europe", flag: "🇪🇺", available: true },
  ],

  // Asia-Pacific
  asiaPacific: [
    { id: "Japan" as MapType, name: "Japan", flag: "🇯🇵", available: true },
  ],

  // Americas
  americas: [
    { id: "Brazil" as MapType, name: "Brazil", flag: "🇧🇷", available: true },
  ],

  // Europe
  europe: [
    {
      id: "Great Britain" as MapType,
      name: "Great Britain",
      flag: "🇬🇧",
      available: true,
    },
    { id: "France" as MapType, name: "France", flag: "🇫🇷", available: true },
    { id: "Germany" as MapType, name: "Germany", flag: "🇩🇪", available: true },
    { id: "Poland" as MapType, name: "Poland", flag: "🇵🇱", available: true },
  ],
};

const regionLabels = {
  popular: "🌟 Most Popular",
  asiaPacific: "🌏 Asia-Pacific",
  americas: "🌎 Americas",
  europe: "🇪🇺 Individual European Countries",
};

export function CountrySelector({
  selectedMap,
  onMapSelect,
}: CountrySelectorProps) {
  const renderCountryGroup = (
    countries: typeof countryData.popular,
    title: string
  ) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 px-3">{title}</h3>
      <div className="space-y-1">
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() => onMapSelect(country.id)}
            disabled={!country.available}
            className={`w-full p-3 rounded-lg border transition-all duration-200 text-left flex items-center space-x-3 ${
              selectedMap === country.id
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : country.available
                ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
            }`}
          >
            <span className="text-xl">{country.flag}</span>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{country.name}</div>
              {!country.available && (
                <div className="text-xs text-gray-500">Coming Soon</div>
              )}
            </div>
            {selectedMap === country.id && (
              <div className="text-blue-600 font-medium text-sm">Selected</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 h-fit">
      <h2 className="text-xl font-bold text-gray-900 mb-6 px-3">
        🗺️ Select Region
      </h2>

      {renderCountryGroup(countryData.popular, regionLabels.popular)}
      {renderCountryGroup(countryData.asiaPacific, regionLabels.asiaPacific)}
      {renderCountryGroup(countryData.americas, regionLabels.americas)}
      {renderCountryGroup(countryData.europe, regionLabels.europe)}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 px-3 leading-relaxed">
          Select a region to explore living preferences. Each map shows
          different geographical areas with detailed subdivisions.
        </p>
      </div>
    </div>
  );
}
