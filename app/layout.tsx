import type { Metadata } from "next";
import "./globals.css";
import MapSearchEnhancer from "./components/MapSearchEnhancer";
import UiFixes from "./components/UiFixes";
import LiveJobsEnhancer from "./components/LiveJobsEnhancer";
import LiveProvidersEnhancer from "./components/LiveProvidersEnhancer";

export const metadata: Metadata = {
  title: "Kazi za Kenya",
  description: "Find trusted people nearby to get things done.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />
        <LiveProvidersEnhancer />
        {children}
        <MapSearchEnhancer />
        <UiFixes />
        <LiveJobsEnhancer />
      </body>
    </html>
  );
}
