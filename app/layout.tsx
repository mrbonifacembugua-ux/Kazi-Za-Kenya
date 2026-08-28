import type { Metadata } from "next";
import Script from "next/script";

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
          /* Landing page cleanup: keep these spaces free for future use. */
          .topbar .actions .btn.primary,
          .panel .post-button,
          .panel .section-title:has(+ .post-button) {
            display: none !important;
          }
        `}</style>
        <Script id="kazi-job-posting-link" strategy="afterInteractive">{`
          document.addEventListener('click', function (event) {
            var button = event.target && event.target.closest ? event.target.closest('button') : null;
            if (!button) return;
            var text = (button.textContent || '').replace(/\\s+/g, ' ').trim().toLowerCase();
            if (text.indexOf('i need something') !== -1) {
              event.preventDefault();
              event.stopPropagation();
              window.location.href = '/post-job';
            }
          }, true);
        `}</Script>
      </body>
    </html>
  );
}
