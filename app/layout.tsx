import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Kazi za Kenya — Find someone nearby", description: "Find work. Get things done. Grow Kenya." };

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
