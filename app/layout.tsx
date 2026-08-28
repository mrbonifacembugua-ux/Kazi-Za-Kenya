import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kazi za Kenya",
  description: "Find work. Get things done.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <style>{`
          /* Landing page: reserve these areas for future use. */
          .topbar .actions .btn.primary,
          .panel .post-button {
            display: none !important;
          }
        `}</style>
      </body>
    </html>
  );
}
