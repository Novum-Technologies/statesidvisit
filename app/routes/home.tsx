import type { Route } from "./+types/home";
import { StatePreferenceApp } from "../components/StatePreferenceApp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "US States Living Preference Map" },
    {
      name: "description",
      content:
        "Interactive map to rate your preferences for living in different US states",
    },
  ];
}

export default function Home() {
  return <StatePreferenceApp />;
}
