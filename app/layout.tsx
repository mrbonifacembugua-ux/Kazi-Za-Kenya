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
              if (!value) return value;
              if (typeof value.tileLayer === 'function' && !value.tileLayer.__kzkNoWrapWrapped) {
                var originalTileLayer = value.tileLayer;
                var wrappedTileLayer = function (url, options) {
                  var nextOptions = Object.assign({}, options || {}, { noWrap: true });
                  return originalTileLayer.call(this, url, nextOptions);
                };
                try { Object.assign(wrappedTileLayer, originalTileLayer); } catch (_) {}
                wrappedTileLayer.__kzkNoWrapWrapped = true;
                value.tileLayer = wrappedTileLayer;
              }
              if (typeof value.map !== 'function' || value.map.__kzkWrapped) return value;
              var originalMap = value.map;
              var wrappedMap = function () {
                var map = originalMap.apply(this, arguments);
                window.__kzkMarketplaceMap = map;
                if (map && map._container) map._container._leaflet_map = map;
                try { window.dispatchEvent(new CustomEvent('kzk:leaflet-map-ready', { detail: map })); } catch (_) {}
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
            } catch (e) { if (window.L) wrapLeaflet(window.L); }
          })();
        `}</Script>
        {children}
        <AuthBridge />
        <MarketplaceLiveWorkers />
        <MarketplaceLiveJobs />
        <style>{`
          .topbar .actions .btn.primary,
          .panel .post-button,
          .panel .section-title:has(+ .post-button) { display: none !important; }
        `}</style>
        <Script id="kazi-map-performance" strategy="afterInteractive">{`
          (function () {
            if (window.__kzkMapPerformanceInstalled) return;
            window.__kzkMapPerformanceInstalled = true;
            var boundMap = null;
            var raf = 0;

            function currentMode() {
              var tabs = Array.prototype.slice.call(document.querySelectorAll('.main-tab'));
              var active = tabs.find(function (tab) { return tab.classList.contains('active'); });
              var text = ((active && active.textContent) || '').toLowerCase();
              return text.indexOf('job') !== -1 ? 'jobs' : 'workers';
            }

            function clusterIcon(L, count, kind) {
              var bg = kind === 'jobs' ? '#b91c1c' : '#16803d';
              return L.divIcon({
                className: 'kzk-cluster-marker',
                html: '<div style="width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:'+bg+';color:white;border:3px solid white;box-shadow:0 2px 9px rgba(0,0,0,.28);font:800 12px system-ui">'+count+'</div>',
                iconSize: [38,38], iconAnchor: [19,19]
              });
            }

            function optimizeGroup(map, mapEl, group, kind) {
              var L = window.L;
              if (!L || !group || !map) return;
              if (!group.__kzkSourceMarkers) {
                group.__kzkSourceMarkers = group.getLayers().filter(function (layer) {
                  return L.Marker && layer instanceof L.Marker;
                });
              }
              var source = group.__kzkSourceMarkers || [];
              var oldClusters = group.__kzkClusters || [];
              oldClusters.forEach(function (m) { try { group.removeLayer(m); } catch (_) {} });
              group.__kzkClusters = [];
              source.forEach(function (m) { try { group.removeLayer(m); } catch (_) {} });

              var bounds = map.getBounds().pad(0.18);
              var inside = source.filter(function (m) {
                try { return bounds.contains(m.getLatLng()); } catch (_) { return false; }
              });
              var zoom = map.getZoom();
              if (zoom >= 15 || inside.length < 12) {
                inside.forEach(function (m) { group.addLayer(m); });
                return;
              }

              var cell = zoom <= 10 ? 85 : zoom <= 12 ? 72 : 58;
              var buckets = {};
              inside.forEach(function (m) {
                var p = map.project(m.getLatLng(), zoom);
                var key = Math.floor(p.x/cell)+':'+Math.floor(p.y/cell);
                (buckets[key] || (buckets[key] = [])).push(m);
              });
              Object.keys(buckets).forEach(function (key) {
                var members = buckets[key];
                if (members.length === 1) { group.addLayer(members[0]); return; }
                var lat = 0, lng = 0;
                members.forEach(function (m) { var ll=m.getLatLng(); lat+=ll.lat; lng+=ll.lng; });
                var cluster = L.marker([lat/members.length,lng/members.length], {icon: clusterIcon(L,members.length,kind)});
                cluster.bindTooltip(members.length + (kind === 'jobs' ? ' jobs in this area' : ' workers in this area'));
                cluster.on('click', function () {
                  var points = members.map(function (m) { return m.getLatLng(); });
                  try { map.fitBounds(L.latLngBounds(points), {padding:[35,35], maxZoom:16}); } catch (_) { map.setView(cluster.getLatLng(), Math.min(16,zoom+2)); }
                });
                group.addLayer(cluster);
                group.__kzkClusters.push(cluster);
              });
            }

            function sync() {
              var mapEl = document.querySelector('.leaflet-container');
              var map = window.__kzkMarketplaceMap || (mapEl && mapEl._leaflet_map);
              if (!mapEl || !map) return;
              if (boundMap !== map) {
                if (boundMap) { try { boundMap.off('moveend', schedule); boundMap.off('zoomend', schedule); } catch (_) {} }
                boundMap = map;
                map.on('moveend', schedule);
                map.on('zoomend', schedule);
              }
              var workerGroup = mapEl.__kzkLiveWorkerGroup;
              var jobGroup = mapEl.__kzkLiveGroup;
              optimizeGroup(map,mapEl,workerGroup,'workers');
              optimizeGroup(map,mapEl,jobGroup,'jobs');
              var mode = currentMode();
              try {
                if (workerGroup) {
                  if (mode === 'workers') { if (!map.hasLayer(workerGroup)) workerGroup.addTo(map); }
                  else if (map.hasLayer(workerGroup)) map.removeLayer(workerGroup);
                }
                if (jobGroup) {
                  if (mode === 'jobs') { if (!map.hasLayer(jobGroup)) jobGroup.addTo(map); }
                  else if (map.hasLayer(jobGroup)) map.removeLayer(jobGroup);
                }
              } catch (_) {}
            }

            function schedule() {
              if (raf) cancelAnimationFrame(raf);
              raf = requestAnimationFrame(function () { raf=0; sync(); });
            }

            document.addEventListener('click', function (event) {
              var button = event.target && event.target.closest ? event.target.closest('.main-tab') : null;
              if (!button) return;
              setTimeout(schedule,0);
              setTimeout(schedule,120);
            }, true);
            window.addEventListener('kzk:leaflet-map-ready', schedule);
            window.addEventListener('kzk:marketplace-layer-updated', schedule);
            setTimeout(schedule,250);
          })();
        `}</Script>
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
