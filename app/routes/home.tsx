import type { Route } from "./+types/home";
import { StatePreferenceApp } from "../components/StatePreferenceApp";

export function meta({}: Route.MetaArgs) {
  const title = "Global Living Preference Map - USA, Canada, Europe & Japan";
  const description =
    "Create and share your interactive living preference map across 4 regions: USA (50 states + DC), Canada (13 provinces), Europe (30+ countries), and Japan (47 prefectures). Mark places you'd love to live, avoid, or are unsure about. Perfect for planning relocations, travel, or exploring global livability.";
  const keywords =
    "living preference map, global livability, USA states map, Canada provinces, Europe countries, Japan prefectures, where to live, best places to live, state rankings, relocate, move abroad, interactive map, preference tool, travel planning, livability rankings";
  const imageUrl = "https://statesidliveinmap.com/social-share-image.png";
  const url = "https://statesidliveinmap.com";

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { rel: "canonical", href: url },
    { name: "theme-color", content: "#3b82f6" },
    { name: "author", content: "@ahammer__" },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },

    // Language and region
    { name: "language", content: "en" },
    { name: "geo.region", content: "US" },

    // App-specific
    { name: "application-name", content: "Global Living Preference Map" },
    { name: "apple-mobile-web-app-title", content: "Living Preference Map" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { name: "mobile-web-app-capable", content: "yes" },

    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    {
      property: "og:title",
      content: "Global Living Preference Map - USA, Canada, Europe & Japan",
    },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content:
        "Interactive global living preference map showing USA, Canada, Europe, and Japan",
    },
    { property: "og:site_name", content: "States I'd Live In Map" },
    { property: "og:locale", content: "en_US" },

    // Twitter
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:url", content: url },
    {
      property: "twitter:title",
      content: "Global Living Preference Map - USA, Canada, Europe & Japan",
    },
    { property: "twitter:description", content: description },
    { property: "twitter:image", content: imageUrl },
    {
      property: "twitter:image:alt",
      content: "Interactive global living preference map",
    },
    { property: "twitter:creator", content: "@ahammer__" },
    { property: "twitter:site", content: "@ahammer__" },
  ];
}

export default function Home() {
  return <StatePreferenceApp />;
}
