// Reliable current-location marker bridge for the marketplace map.
// It keeps the latest geolocation result even if it arrives before Leaflet/map initialization.

(function installReliableCurrentLocationMarker() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const w = window as any;
  if (w.__kzkReliableLocationMarkerInstalled) return;
  w.__kzkReliableLocationMarkerInstalled = true;

  let latestPosition: GeolocationPosition | null = null;
  let marker: any = null;
  let accuracyCircle: any = null;
  let watchId: number | null = null;
  let retryTimer: number | null = null;

  function getMap() {
    const mapEl = document.querySelector<HTMLElement>(".leaflet-container") as any;
    return w.__kzkMarketplaceMap || mapEl?._leaflet_map || null;
  }

  function ensureStyles() {
    if (document.getElementById("kzk-reliable-location-style")) return;
    const style = document.createElement("style");
    style.id = "kzk-reliable-location-style";
    style.textContent = `
      .kzk-reliable-location-dot {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #2563eb;
        border: 3px solid #fff;
        box-shadow: 0 0 0 4px rgba(37,99,235,.24), 0 2px 8px rgba(0,0,0,.32);
      }
    `;
    document.head.appendChild(style);
  }

  function renderLatest() {
    if (!latestPosition) return false;
    const map = getMap();
    const L = w.L;
    if (!map || !L) return false;

    const lat = Number(latestPosition.coords.latitude);
    const lng = Number(latestPosition.coords.longitude);
    const accuracy = Number(latestPosition.coords.accuracy) || 0;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;

    ensureStyles();
    const ll = [lat, lng];

    if (!marker) {
      const icon = L.divIcon({
        className: "",
        html: '<div class="kzk-reliable-location-dot" aria-label="Your current location"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      marker = L.marker(ll, { icon, interactive: true, zIndexOffset: 10000 }).addTo(map);
      marker.bindTooltip("Your current location", { direction: "top", offset: [0, -10] });
    } else {
      marker.setLatLng(ll);
      if (!map.hasLayer(marker)) marker.addTo(map);
      if (typeof marker.setZIndexOffset === "function") marker.setZIndexOffset(10000);
    }

    if (accuracy > 0 && accuracy < 10000) {
      if (!accuracyCircle) {
        accuracyCircle = L.circle(ll, {
          radius: accuracy,
          color: "#2563eb",
          weight: 1,
          opacity: 0.25,
          fillColor: "#60a5fa",
          fillOpacity: 0.07,
          interactive: false
        }).addTo(map);
      } else {
        accuracyCircle.setLatLng(ll);
        accuracyCircle.setRadius(accuracy);
        if (!map.hasLayer(accuracyCircle)) accuracyCircle.addTo(map);
      }
    }

    return true;
  }

  function scheduleRenderRetry() {
    if (retryTimer !== null) return;
    let tries = 0;
    retryTimer = window.setInterval(() => {
      tries += 1;
      if (renderLatest() || tries >= 80) {
        if (retryTimer !== null) window.clearInterval(retryTimer);
        retryTimer = null;
      }
    }, 250);
  }

  function acceptPosition(position: GeolocationPosition) {
    latestPosition = position;
    if (!renderLatest()) scheduleRenderRetry();
  }

  function requestCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      acceptPosition,
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );
  }

  function startWatch() {
    if (!navigator.geolocation || watchId !== null) return;
    watchId = navigator.geolocation.watchPosition(
      acceptPosition,
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );
  }

  window.addEventListener("kzk:leaflet-map-ready", () => {
    renderLatest();
    scheduleRenderRetry();
  });

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const button = target?.closest?.("button");
    if (!button) return;
    const text = (button.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (text.includes("use my location") || text.includes("refresh my location") || text.includes("finding you")) {
      window.setTimeout(requestCurrentLocation, 0);
    }
  }, true);

  requestCurrentLocation();
  startWatch();
  scheduleRenderRetry();
})();

// Keep the live sidebar portal in sync with the selected marketplace tab.
// The live worker/job components mount imperatively next to React-rendered section titles,
// so an old portal can otherwise remain visible after React switches the underlying section.
(function installMarketplaceSidebarModeSync() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const w = window as any;
  if (w.__kzkSidebarModeSyncInstalled) return;
  w.__kzkSidebarModeSyncInstalled = true;

  function activeMode(): "workers" | "jobs" {
    const active = Array.from(document.querySelectorAll<HTMLElement>(".main-tab"))
      .find((tab) => tab.classList.contains("active"));
    const text = (active?.textContent || "").toLowerCase();
    return text.includes("job") ? "jobs" : "workers";
  }

  function syncSidebar() {
    const mode = activeMode();
    const workersMount = document.getElementById("kzk-live-workers-mount");
    const jobsMount = document.getElementById("kzk-live-jobs-mount");

    if (workersMount) workersMount.style.display = mode === "workers" ? "" : "none";
    if (jobsMount) jobsMount.style.display = mode === "jobs" ? "" : "none";
  }

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target?.closest?.(".main-tab")) return;
    window.setTimeout(syncSidebar, 0);
    window.setTimeout(syncSidebar, 80);
  }, true);

  const observer = new MutationObserver(syncSidebar);
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class"]
  });

  syncSidebar();
})();
