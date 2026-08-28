import type { Metadata } from "next";
import Script from "next/script";
import AuthBridge from "./AuthBridge";
import MarketplaceLiveJobs from "./MarketplaceLiveJobs";
import MarketplaceLiveWorkers from "./MarketplaceLiveWorkers";

export const metadata: Metadata = {
  title: "Kazi za Kenya",
  description: "Find work. Get things done.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Script id="kazi-leaflet-map-bridge" strategy="beforeInteractive">{`
          (function () {
            if (window.__kzkLeafletBridgeInstalled) return;
            window.__kzkLeafletBridgeInstalled = true;

            var currentLeaflet = window.L;
            function wrapLeaflet(value) {
              if (!value || typeof value.map !== 'function' || value.map.__kzkWrapped) return value;
              var originalMap = value.map;
              var wrappedMap = function () {
                var map = originalMap.apply(this, arguments);
                window.__kzkMarketplaceMap = map;
                if (map && map._container) {
                  map._container._leaflet_map = map;
                }
                try {
                  window.dispatchEvent(new CustomEvent('kzk:leaflet-map-ready', { detail: map }));
                } catch (_) {}
                return map;
              };
              wrappedMap.__kzkWrapped = true;
              value.map = wrappedMap;
              return value;
            }

            if (currentLeaflet) currentLeaflet = wrapLeaflet(currentLeaflet);

            try {
              Object.defineProperty(window, 'L', {
                configurable: true,
                get: function () { return currentLeaflet; },
                set: function (value) { currentLeaflet = wrapLeaflet(value); }
              });
            } catch (e) {
              if (window.L) wrapLeaflet(window.L);
            }
          })();
        `}</Script>
        {children}
        <AuthBridge />
        <MarketplaceLiveWorkers />
        <MarketplaceLiveJobs />
        <style>{`
          /* Landing page cleanup: keep these spaces free for future use. */
          .topbar .actions .btn.primary,
          .panel .post-button,
          .panel .section-title:has(+ .post-button) {
            display: none !important;
          }
        `}</style>
        <Script id="kazi-map-mode-sync" strategy="afterInteractive">{`
          (function () {
            if (window.__kzkMapModeSyncInstalled) return;
            window.__kzkMapModeSyncInstalled = true;

            function currentMode() {
              var tabs = Array.prototype.slice.call(document.querySelectorAll('.main-tab'));
              var active = tabs.find(function (tab) { return tab.classList.contains('active'); });
              var text = ((active && active.textContent) || '').toLowerCase();
              return text.indexOf('job') !== -1 ? 'jobs' : 'workers';
            }

            function syncLayers() {
              var mapEl = document.querySelector('.leaflet-container');
              var map = window.__kzkMarketplaceMap || (mapEl && mapEl._leaflet_map);
              if (!mapEl || !map) return;

              var workerGroup = mapEl.__kzkLiveWorkerGroup;
              var jobGroup = mapEl.__kzkLiveGroup;
              var mode = currentMode();

              try {
                if (workerGroup) {
                  if (mode === 'workers') {
                    if (!map.hasLayer(workerGroup)) workerGroup.addTo(map);
                  } else if (map.hasLayer(workerGroup)) {
                    map.removeLayer(workerGroup);
                  }
                }
                if (jobGroup) {
                  if (mode === 'jobs') {
                    if (!map.hasLayer(jobGroup)) jobGroup.addTo(map);
                  } else if (map.hasLayer(jobGroup)) {
                    map.removeLayer(jobGroup);
                  }
                }
              } catch (_) {}
            }

            document.addEventListener('click', function (event) {
              var button = event.target && event.target.closest ? event.target.closest('.main-tab') : null;
              if (!button) return;
              window.setTimeout(syncLayers, 0);
              window.setTimeout(syncLayers, 150);
            }, true);

            window.addEventListener('kzk:leaflet-map-ready', syncLayers);
            window.addEventListener('kzk:marketplace-layer-updated', syncLayers);
            syncLayers();
          })();
        `}</Script>
        <Script id="kazi-marketplace-links" strategy="afterInteractive">{`
          document.addEventListener('click', function (event) {
            var button = event.target && event.target.closest ? event.target.closest('button') : null;
            if (!button) return;
            var text = (button.textContent || '').replace(/\\s+/g, ' ').trim().toLowerCase();

            if (text.indexOf('i need something') !== -1) {
              event.preventDefault();
              event.stopPropagation();
              window.location.href = '/post-job';
              return;
            }

            if (text.indexOf('i offer a service') !== -1) {
              event.preventDefault();
              event.stopPropagation();
              window.location.href = '/offer-service';
            }
          }, true);
        `}</Script>
      </body>
    </html>
  );
}
