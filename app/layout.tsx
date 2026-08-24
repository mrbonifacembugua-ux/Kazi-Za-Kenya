import type { Metadata } from "next";
import "./globals.css";
import MapSearchEnhancer from "./components/MapSearchEnhancer";

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
      </body>
    </html>
  );
}
