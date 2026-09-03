import type { Metadata } from "next";
import Script from "next/script";
import "leaflet/dist/leaflet.css";
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
                if (map) {
                  var worldBounds = [[-85, -180], [85, 180]];
                  try {
                    map.setMaxBounds(worldBounds);
                    map.options.maxBoundsViscosity = 1;
                    var applyProfessionalMinZoom = function () {
                      var size = map.getSize ? map.getSize() : { x: 1024, y: 768 };
                      var panel = document.querySelector('.panel');
                      var hiddenWidth = 0;
                      if (panel && panel.getBoundingClientRect) {
                        var panelRect = panel.getBoundingClientRect();
                        var mapRect = map._container && map._container.getBoundingClientRect ? map._container.getBoundingClientRect() : null;
                        if (mapRect) hiddenWidth = Math.max(0, Math.min(size.x - 120, panelRect.right - mapRect.left + 12));
                      }
                      var visibleWidth = Math.max(512, (Number(size.x) || 1024) - hiddenWidth);
                      var visibleHeight = Math.max(360, Number(size.y) || 768);
                      var required = Math.max(visibleWidth, visibleHeight);
                      var minZoom = Math.max(2, Math.ceil(Math.log(required / 256) / Math.LN2));
                      map.setMinZoom(minZoom);
                      if (map.getZoom() < minZoom) map.setZoom(minZoom, { animate: false });
                      try { map.panInsideBounds(worldBounds, { animate: false }); } catch (_) {}
                    };
                    setTimeout(applyProfessionalMinZoom, 0);
                    setTimeout(applyProfessionalMinZoom, 300);
                    map.on('resize', applyProfessionalMinZoom);
                  } catch (_) {}
                }
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
          .kzk-map-card-focus { outline: 3px solid rgba(22,128,61,.28) !important; outline-offset: 1px; }
          .kzk-current-location-dot {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #2563eb;
            border: 3px solid #fff;
            box-shadow: 0 0 0 3px rgba(37,99,235,.22), 0 2px 8px rgba(0,0,0,.3);
          }
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
              return L.divIcon({className:'kzk-cluster-marker',html:'<div style="width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:'+bg+';color:white;border:3px solid white;box-shadow:0 2px 9px rgba(0,0,0,.28);font:800 12px system-ui">'+count+'</div>',iconSize:[38,38],iconAnchor:[19,19]});
            }
            function optimizeGroup(map, mapEl, group, kind) {
              var L = window.L;if (!L || !group || !map) return;
              if (!group.__kzkSourceMarkers) group.__kzkSourceMarkers = group.getLayers().filter(function(layer){return L.Marker && layer instanceof L.Marker;});
              var source=group.__kzkSourceMarkers||[];var oldClusters=group.__kzkClusters||[];oldClusters.forEach(function(m){try{group.removeLayer(m);}catch(_){}});group.__kzkClusters=[];source.forEach(function(m){try{group.removeLayer(m);}catch(_){}});
              var bounds=map.getBounds().pad(0.18);var inside=source.filter(function(m){try{return bounds.contains(m.getLatLng());}catch(_){return false;}});var zoom=map.getZoom();
              if (zoom>=15 || inside.length<12){inside.forEach(function(m){group.addLayer(m);});return;}
              var cell=zoom<=10?85:zoom<=12?72:58;var buckets={};inside.forEach(function(m){var p=map.project(m.getLatLng(),zoom);var key=Math.floor(p.x/cell)+':'+Math.floor(p.y/cell);(buckets[key]||(buckets[key]=[])).push(m);});
              Object.keys(buckets).forEach(function(key){var members=buckets[key];if(members.length===1){group.addLayer(members[0]);return;}var lat=0,lng=0;members.forEach(function(m){var ll=m.getLatLng();lat+=ll.lat;lng+=ll.lng;});var cluster=L.marker([lat/members.length,lng/members.length],{icon:clusterIcon(L,members.length,kind)});cluster.bindTooltip(members.length+(kind==='jobs'?' jobs in this area':' workers in this area'));cluster.on('click',function(){var points=members.map(function(m){return m.getLatLng();});try{map.fitBounds(L.latLngBounds(points),{padding:[35,35],maxZoom:16});}catch(_){map.setView(cluster.getLatLng(),Math.min(16,zoom+2));}});group.addLayer(cluster);group.__kzkClusters.push(cluster);});
            }
            function sync(){var mapEl=document.querySelector('.leaflet-container');var map=window.__kzkMarketplaceMap||(mapEl&&mapEl._leaflet_map);if(!mapEl||!map)return;if(boundMap!==map){if(boundMap){try{boundMap.off('moveend',schedule);boundMap.off('zoomend',schedule);}catch(_){}}boundMap=map;map.on('moveend',schedule);map.on('zoomend',schedule);}var workerGroup=mapEl.__kzkLiveWorkerGroup;var jobGroup=mapEl.__kzkLiveGroup;optimizeGroup(map,mapEl,workerGroup,'workers');optimizeGroup(map,mapEl,jobGroup,'jobs');var mode=currentMode();try{if(workerGroup){if(mode==='workers'){if(!map.hasLayer(workerGroup))workerGroup.addTo(map);}else if(map.hasLayer(workerGroup))map.removeLayer(workerGroup);}if(jobGroup){if(mode==='jobs'){if(!map.hasLayer(jobGroup))jobGroup.addTo(map);}else if(map.hasLayer(jobGroup))map.removeLayer(jobGroup);}}catch(_){}}
            function schedule(){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){raf=0;sync();});}
            document.addEventListener('click',function(event){var button=event.target&&event.target.closest?event.target.closest('.main-tab'):null;if(!button)return;setTimeout(schedule,0);setTimeout(schedule,120);},true);window.addEventListener('kzk:leaflet-map-ready',schedule);window.addEventListener('kzk:marketplace-layer-updated',schedule);setTimeout(schedule,250);
          })();
        `}</Script>
        <Script id="kazi-global-area-search" strategy="afterInteractive">{`
          (function () {
            if (window.__kzkGlobalAreaSearchInstalled) return;
            window.__kzkGlobalAreaSearchInstalled = true;
            var searchMarker=null,markerTimer=0,markerCreatedAt=0;
            function mapInstance(){var mapEl=document.querySelector('.leaflet-container');return window.__kzkMarketplaceMap||(mapEl&&mapEl._leaflet_map)||null;}
            function clearSearchMarker(){if(markerTimer){clearTimeout(markerTimer);markerTimer=0;}if(searchMarker){try{searchMarker.remove();}catch(_){}searchMarker=null;}}
            function installMovementCleanup(map){if(!map||map.__kzkSearchCleanupInstalled)return;map.__kzkSearchCleanupInstalled=true;map.on('movestart',function(){if(searchMarker&&Date.now()-markerCreatedAt>1400)clearSearchMarker();});map.on('zoomstart',function(){if(searchMarker&&Date.now()-markerCreatedAt>1400)clearSearchMarker();});}
            async function runSearch(input){var value=(input&&input.value||'').trim();if(!value)return;var map=mapInstance();var L=window.L;if(!map||!L)return;installMovementCleanup(map);clearSearchMarker();try{var response=await fetch('/api/geocode-area',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({area:value})});var result=await response.json();if(!response.ok||!Number.isFinite(Number(result.latitude))||!Number.isFinite(Number(result.longitude)))return;var lat=Number(result.latitude),lng=Number(result.longitude);map.flyTo([lat,lng],13,{animate:true,duration:0.9});var icon=L.divIcon({className:'',html:'<div class="search-location-pin"><span>📍</span></div>',iconSize:[42,42],iconAnchor:[21,42]});searchMarker=L.marker([lat,lng],{icon:icon}).addTo(map);markerCreatedAt=Date.now();searchMarker.bindPopup('<strong>'+String(result.displayName||value).replace(/[<>]/g,'')+'</strong><br/>Searched area').openPopup();markerTimer=window.setTimeout(clearSearchMarker,9000);}catch(_){}}
            document.addEventListener('click',function(event){var button=event.target&&event.target.closest?event.target.closest('.area-search-button'):null;if(!button)return;var input=document.querySelector('.location-search-field input');if(!input)return;event.preventDefault();event.stopImmediatePropagation();runSearch(input);},true);
            document.addEventListener('keydown',function(event){if(event.key!=='Enter')return;var input=event.target;if(!input||!input.matches||!input.matches('.location-search-field input'))return;event.preventDefault();event.stopImmediatePropagation();runSearch(input);},true);
          })();
        `}</Script>
        <Script id="kazi-live-current-location" strategy="afterInteractive">{`
          (function () {
            if (window.__kzkCurrentLocationInstalled) return;
            window.__kzkCurrentLocationInstalled = true;
            var marker = null;
            var accuracyCircle = null;
            var watchId = null;
            var centeredOnce = false;

            function selectedCountry() {
              try {
                var query = new URLSearchParams(window.location.search).get('country');
                if (query && /^[a-z]{2}$/i.test(query)) return query.toUpperCase();
                var saved = window.localStorage.getItem('anydaywork-marketplace-country');
                if (saved && /^[a-z]{2}$/i.test(saved)) return saved.toUpperCase();
              } catch (_) {}
              return '';
            }

            function getMap() {
              var mapEl = document.querySelector('.leaflet-container');
              return (mapEl && mapEl._leaflet_map) || window.__kzkMarketplaceMap || null;
            }

            function draw(position) {
              if (selectedCountry()) return;
              var map = getMap();
              var L = window.L;
              if (!map || !L || !position || !position.coords) return;
              var lat = Number(position.coords.latitude);
              var lng = Number(position.coords.longitude);
              var accuracy = Number(position.coords.accuracy) || 0;
              if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
              var ll = [lat, lng];
              if (!marker) {
                var icon = L.divIcon({className:'',html:'<div class="kzk-current-location-dot" aria-label="Your current location"></div>',iconSize:[18,18],iconAnchor:[9,9]});
                marker = L.marker(ll,{icon:icon,interactive:true,zIndexOffset:2000}).addTo(map);
                marker.bindTooltip('Your current location',{direction:'top',offset:[0,-10]});
              } else {
                try { marker.setLatLng(ll); } catch (_) {}
                try { if (!map.hasLayer(marker)) marker.addTo(map); } catch (_) {}
              }
              if (accuracy > 0 && accuracy < 10000) {
                if (!accuracyCircle) {
                  accuracyCircle=L.circle(ll,{radius:accuracy,color:'#2563eb',weight:1,opacity:0.28,fillColor:'#60a5fa',fillOpacity:0.08,interactive:false}).addTo(map);
                } else {
                  try { accuracyCircle.setLatLng(ll); accuracyCircle.setRadius(accuracy); } catch (_) {}
                  try { if (!map.hasLayer(accuracyCircle)) accuracyCircle.addTo(map); } catch (_) {}
                }
              }
              if (!centeredOnce) { centeredOnce=true; try { map.setView(ll,Math.max(14,map.getZoom()),{animate:true}); } catch (_) {} }
            }

            function start() {
              if (selectedCountry()) return;
              if (watchId !== null || !navigator.geolocation) return;
              watchId = navigator.geolocation.watchPosition(draw,function(){},{enableHighAccuracy:true,maximumAge:10000,timeout:20000});
            }

            window.addEventListener('kzk:leaflet-map-ready', function () { start(); });
            window.addEventListener('anydaywork:country-changed', function () {
              if (selectedCountry() && watchId !== null && navigator.geolocation) {
                try { navigator.geolocation.clearWatch(watchId); } catch (_) {}
                watchId = null;
              }
            });
            if (getMap()) start(); else setTimeout(start,500);
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
