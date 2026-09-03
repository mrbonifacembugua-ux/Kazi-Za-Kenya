import type { Metadata } from "next";
import Script from "next/script";
import AuthBridge from "./AuthBridge";
import MarketplaceLiveJobs from "./MarketplaceLiveJobs";

export const metadata: Metadata = {
  title: "Kazi za Kenya",
  description: "Find work. Get things done.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Script id="kazi-native-map-handle" strategy="beforeInteractive">{`
          (function () {
            if (window.__kzkNativeMapHookInstalled) return;
            window.__kzkNativeMapHookInstalled = true;
            var currentLeaflet = window.L;
            function wrap(leaflet) {
              if (!leaflet || typeof leaflet.map !== 'function' || leaflet.map.__kzkWrapped) return leaflet;
              var originalMap = leaflet.map;
              function wrappedMap() {
                var map = originalMap.apply(this, arguments);
                window.__kzkMarketplaceMap = map;
                try {
                  if (map && map._container) map._container.__kzkMarketplaceMap = map;
                  window.dispatchEvent(new CustomEvent('kzk:leaflet-map-ready'));
                } catch (e) {}
                return map;
              }
              wrappedMap.__kzkWrapped = true;
              leaflet.map = wrappedMap;
              return leaflet;
            }
            if (currentLeaflet) currentLeaflet = wrap(currentLeaflet);
            try {
              Object.defineProperty(window, 'L', {
                configurable: true,
                get: function () { return currentLeaflet; },
                set: function (value) { currentLeaflet = wrap(value); }
              });
            } catch (e) {
              if (window.L) wrap(window.L);
            }
          })();
        `}</Script>
        {children}
        <AuthBridge />
        <MarketplaceLiveJobs />
        <style>{`
          .topbar .actions .btn.primary,
          .panel .post-button,
          .panel .section-title:has(+ .post-button) { display: none !important; }
          .kzk-map-card-focus { outline: 3px solid rgba(22,128,61,.28) !important; outline-offset: 1px; }
        `}</style>
        <Script id="kazi-marketplace-links" strategy="afterInteractive">{`
          document.addEventListener('click', function (event) {
            var button = event.target && event.target.closest ? event.target.closest('button') : null;
            if (!button) return;
            var text = (button.textContent || '').replace(/\\s+/g, ' ').trim().toLowerCase();
            if (text.indexOf('i need something') !== -1) {
              event.preventDefault(); event.stopPropagation(); window.location.href = '/post-job'; return;
            }
            if (text.indexOf('i offer a service') !== -1) {
              event.preventDefault(); event.stopPropagation(); window.location.href = '/offer-service';
            }
          }, true);
        `}</Script>
      </body>
    </html>
  );
}
