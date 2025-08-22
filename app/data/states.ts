export interface State {
  id: string;
  name: string;
  path: string;
}

export interface StatePreference {
  stateId: string;
  preference: PreferenceLevel;
}

export type PreferenceLevel =
  | "never"
  | "reluctantly"
  | "neutral"
  | "willing"
  | "absolutely";

export const PREFERENCE_LEVELS: Record<
  PreferenceLevel,
  { label: string; color: string; description: string }
> = {
  never: {
    label: "Never",
    color: "#dc2626", // red-600
    description: "Absolutely would not live here",
  },
  reluctantly: {
    label: "Reluctantly",
    color: "#f59e0b", // amber-500
    description: "Only if I absolutely had to",
  },
  neutral: {
    label: "Neutral",
    color: "#64748b", // slate-500
    description: "No strong feelings either way",
  },
  willing: {
    label: "Willing",
    color: "#22c55e", // green-500
    description: "Would consider living here",
  },
  absolutely: {
    label: "Absolutely",
    color: "#15803d", // green-700
    description: "Would love to live here",
  },
};

export const PREFERENCE_MAP: Record<PreferenceLevel, number> = {
  never: 0,
  reluctantly: 1,
  neutral: 2,
  willing: 3,
  absolutely: 4,
};

export const PREFERENCE_MAP_REVERSE: Record<number, PreferenceLevel> = {
  0: "never",
  1: "reluctantly",
  2: "neutral",
  3: "willing",
  4: "absolutely",
};

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

// US States with accurate SVG path data for interactive map
export const STATE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(stateMap).map(([key, value]) => [value, key])
);

export const US_STATES: State[] = [
  {
    id: "AL",
    name: "Alabama",
    path: "M647 393 L649 439 L692 438 L693 393 Z",
  },
  {
    id: "AK",
    name: "Alaska",
    path: "M158 458 L128 458 L128 488 L158 488 Z",
  },
  {
    id: "AZ",
    name: "Arizona",
    path: "M173 296 L173 384 L242 384 L242 296 Z",
  },
  {
    id: "AR",
    name: "Arkansas",
    path: "M545 334 L545 380 L591 380 L591 334 Z",
  },
  {
    id: "CA",
    name: "California",
    path: "M87 201 L87 384 L133 384 L133 201 Z",
  },
  {
    id: "CO",
    name: "Colorado",
    path: "M311 288 L311 357 L380 357 L380 288 Z",
  },
  {
    id: "CT",
    name: "Connecticut",
    path: "M740 230 L763 230 L763 253 L740 253 Z",
  },
  {
    id: "DE",
    name: "Delaware",
    path: "M715 253 L715 287 L726 287 L726 253 Z",
  },
  {
    id: "FL",
    name: "Florida",
    path: "M647 439 L716 508 L693 508 L647 439 Z",
  },
  {
    id: "GA",
    name: "Georgia",
    path: "M647 334 L693 334 L693 393 L647 393 Z",
  },
  {
    id: "HI",
    name: "Hawaii",
    path: "M207 458 L184 458 L184 488 L207 488 Z",
  },
  {
    id: "ID",
    name: "Idaho",
    path: "M242 173 L242 288 L288 288 L288 173 Z",
  },
  {
    id: "IL",
    name: "Illinois",
    path: "M522 253 L522 334 L556 334 L556 253 Z",
  },
  {
    id: "IN",
    name: "Indiana",
    path: "M556 253 L556 334 L590 334 L590 253 Z",
  },
  {
    id: "IA",
    name: "Iowa",
    path: "M449 253 L449 311 L522 311 L522 253 Z",
  },
  {
    id: "KS",
    name: "Kansas",
    path: "M380 311 L380 357 L469 357 L469 311 Z",
  },
  {
    id: "KY",
    name: "Kentucky",
    path: "M590 311 L590 345 L679 345 L679 311 Z",
  },
  {
    id: "LA",
    name: "Louisiana",
    path: "M469 393 L469 439 L545 439 L545 393 Z",
  },
  {
    id: "ME",
    name: "Maine",
    path: "M740 173 L740 230 L774 230 L774 173 Z",
  },
  {
    id: "MD",
    name: "Maryland",
    path: "M679 264 L679 287 L725 287 L725 264 Z",
  },
  {
    id: "MA",
    name: "Massachusetts",
    path: "M717 230 L717 253 L763 253 L763 230 Z",
  },
  {
    id: "MI",
    name: "Michigan",
    path: "M556 196 L556 253 L602 253 L602 196 Z",
  },
  {
    id: "MN",
    name: "Minnesota",
    path: "M449 173 L449 253 L506 253 L506 173 Z",
  },
  {
    id: "MS",
    name: "Mississippi",
    path: "M522 334 L522 393 L568 393 L568 334 Z",
  },
  {
    id: "MO",
    name: "Missouri",
    path: "M469 288 L469 357 L545 357 L545 288 Z",
  },
  {
    id: "MT",
    name: "Montana",
    path: "M311 173 L311 242 L449 242 L449 173 Z",
  },
  {
    id: "NE",
    name: "Nebraska",
    path: "M380 242 L380 311 L469 311 L469 242 Z",
  },
  {
    id: "NV",
    name: "Nevada",
    path: "M173 201 L173 296 L242 296 L242 201 Z",
  },
  {
    id: "NH",
    name: "New Hampshire",
    path: "M717 196 L717 230 L740 230 L740 196 Z",
  },
  {
    id: "NJ",
    name: "New Jersey",
    path: "M694 253 L694 287 L715 287 L715 253 Z",
  },
  {
    id: "NM",
    name: "New Mexico",
    path: "M311 334 L311 403 L380 403 L380 334 Z",
  },
  {
    id: "NY",
    name: "New York",
    path: "M648 196 L648 253 L717 253 L717 196 Z",
  },
  {
    id: "NC",
    name: "North Carolina",
    path: "M648 287 L648 334 L739 334 L739 287 Z",
  },
  {
    id: "ND",
    name: "North Dakota",
    path: "M380 173 L380 242 L449 242 L449 173 Z",
  },
  {
    id: "OH",
    name: "Ohio",
    path: "M590 230 L590 311 L647 311 L647 230 Z",
  },
  {
    id: "OK",
    name: "Oklahoma",
    path: "M380 357 L380 393 L545 393 L545 357 Z",
  },
  {
    id: "OR",
    name: "Oregon",
    path: "M133 201 L133 270 L242 270 L242 201 Z",
  },
  {
    id: "PA",
    name: "Pennsylvania",
    path: "M648 230 L648 287 L739 287 L739 230 Z",
  },
  {
    id: "RI",
    name: "Rhode Island",
    path: "M740 253 L740 264 L751 264 L751 253 Z",
  },
  {
    id: "SC",
    name: "South Carolina",
    path: "M679 334 L679 370 L736 370 L736 334 Z",
  },
  {
    id: "SD",
    name: "South Dakota",
    path: "M380 218 L380 287 L449 287 L449 218 Z",
  },
  {
    id: "TN",
    name: "Tennessee",
    path: "M545 311 L545 345 L647 345 L647 311 Z",
  },
  {
    id: "TX",
    name: "Texas",
    path: "M311 357 L311 439 L469 439 L469 357 Z",
  },
  {
    id: "UT",
    name: "Utah",
    path: "M242 242 L242 337 L311 337 L311 242 Z",
  },
  {
    id: "VT",
    name: "Vermont",
    path: "M694 196 L694 230 L717 230 L717 196 Z",
  },
  {
    id: "VA",
    name: "Virginia",
    path: "M648 264 L648 310 L739 310 L739 264 Z",
  },
  {
    id: "WA",
    name: "Washington",
    path: "M133 127 L133 201 L242 201 L242 127 Z",
  },
  {
    id: "WV",
    name: "West Virginia",
    path: "M624 242 L624 311 L681 311 L681 242 Z",
  },
  {
    id: "WI",
    name: "Wisconsin",
    path: "M506 173 L506 253 L556 253 L556 173 Z",
  },
  {
    id: "WY",
    name: "Wyoming",
    path: "M311 218 L311 288 L380 288 L380 218 Z",
  },
  {
    id: "DC",
    name: "District of Columbia",
    path: "M760 275 L760 285 L770 285 L770 275 Z",
  },
];
