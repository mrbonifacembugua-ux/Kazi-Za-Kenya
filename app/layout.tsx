import type { Metadata } from "next";
import MapSearchEnhancer from "./components/MapSearchEnhancer";
import ThreeClickWorkerNavigation from "./components/ThreeClickWorkerNavigation";

export const metadata: Metadata = {
  title: "Kazi za Kenya",
  description: "Find trusted people nearby to get things done.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <MapSearchEnhancer />
        <ThreeClickWorkerNavigation />
      </body>
    </html>
  );
}
