import type { Route } from "./+types/home";
import { StatePreferenceApp } from "../components/StatePreferenceApp";

export function meta({}: Route.MetaArgs) {
  const title = "US States Living Preference Map";
  const description =
    "Create and share your own US state livability map. Mark states you'd love to live in, those you wouldn't, and the ones you're unsure about. See stats and fun facts for each state.";
  const imageUrl = "/welcome/logo-dark.svg";
  const url = "https://statesidlivein.com"; // Replace with your actual domain

  return [
    { title },
    { name: "description", content: description },
    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },

    // Twitter
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:url", content: url },
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
    { property: "twitter:image", content: imageUrl },
  ];
}

export default function Home() {
  return <StatePreferenceApp />;
}
