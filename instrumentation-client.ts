import * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet used to be downloaded from unpkg in the marketplace component at runtime.
// Make a mutable local copy available before React hydrates so the existing map code
// can initialize even when an external CDN is unavailable. The root layout's map
// bridge intentionally wraps window.L, so assigning here also preserves those guards.
if (typeof window !== "undefined") {
  const w = window as any;
  if (!w.L) w.L = { ...Leaflet };
}

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

// Mobile-first polish: keep the marketplace map dominant and make the login
// form reflow instead of stretching its desktop percentage-positioned artwork.
(function installMobileExperienceStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("kzk-mobile-experience-style")) return;

  const style = document.createElement("style");
  style.id = "kzk-mobile-experience-style";
  style.textContent = `
    @media (max-width: 800px) {
      /* Marketplace: preserve most of the phone viewport for map navigation. */
      .app .topbar {
        height: 56px !important;
        padding: 0 10px !important;
        gap: 8px !important;
      }
      .app .brand { font-size: 16px !important; }
      .app .search { height: 40px !important; padding: 0 10px !important; }
      .app .panel {
        left: 8px !important;
        right: 8px !important;
        bottom: 8px !important;
        top: auto !important;
        width: auto !important;
        max-height: 38% !important;
        padding: 10px !important;
        border-radius: 15px !important;
        overflow-y: auto !important;
        overscroll-behavior: contain;
      }
      .app .panel .hero h1 {
        font-size: 18px !important;
        margin-bottom: 3px !important;
      }
      .app .panel .hero p { display: none !important; }
      .app .main-tabs { margin-bottom: 7px !important; }
      .app .main-tab { padding: 8px 6px !important; }
      .app .choice { margin-bottom: 8px !important; gap: 6px !important; }
      .app .choice button { padding: 9px 6px !important; }
      .app .field { min-height: 40px !important; margin-bottom: 6px !important; }
      .app .chips {
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        margin: 5px 0 8px !important;
        padding-bottom: 2px;
      }
      .app .chip { flex: 0 0 auto; padding: 6px 9px !important; }
      .app .section-title { margin: 9px 0 6px !important; }

      /* Login: replace desktop coordinate layout with a true phone-sized card. */
      body:has(.page .stage .overlay) { overflow-y: auto !important; }
      .page:has(.stage .overlay),
      .page:has(.stage .overlay) .stage {
        width: 100% !important;
        min-height: 100dvh !important;
        height: auto !important;
        overflow: visible !important;
      }
      .page:has(.stage .overlay) .stage {
        position: relative !important;
        padding: 150px 14px 24px !important;
      }
      .page:has(.stage .overlay) .bg {
        position: fixed !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        object-position: center top !important;
      }
      .page:has(.stage .overlay) .cover,
      .page:has(.stage .overlay) .lineBox,
      .page:has(.stage .overlay) .sep,
      .page:has(.stage .overlay) .subtitleText,
      .page:has(.stage .overlay) .label,
      .page:has(.stage .overlay) .buttonText,
      .page:has(.stage .overlay) .orText,
      .page:has(.stage .overlay) .createGroup,
      .page:has(.stage .overlay) .backText,
      .page:has(.stage .overlay) .svgIcon { display: none !important; }

      .page:has(.stage .overlay) .overlay {
        position: relative !important;
        inset: auto !important;
        width: min(100%, 410px) !important;
        margin: 0 auto !important;
        min-height: 0 !important;
        padding: 92px 16px 18px !important;
        border-radius: 22px !important;
        background: rgba(255,255,255,.97) !important;
        box-shadow: 0 14px 40px rgba(0,0,0,.18) !important;
        display: grid !important;
        grid-template-columns: 1fr auto !important;
        gap: 12px 10px !important;
      }
      .page:has(.stage .overlay) .overlay::before {
        content: "Welcome back\\A Log in to Kazi za Kenya";
        white-space: pre-line;
        position: absolute;
        top: 22px;
        left: 16px;
        right: 16px;
        text-align: center;
        color: #17221b;
        font: 800 25px/1.25 Inter, system-ui, sans-serif;
      }
      .page:has(.stage .overlay) .overlay::after {
        content: "";
        position: absolute;
        top: 57px;
        left: 50%;
        width: 58px;
        height: 3px;
        transform: translateX(-50%);
        border-radius: 99px;
        background: #16803d;
      }
      .page:has(.stage .overlay) .field {
        position: static !important;
        grid-column: 1 / -1 !important;
        width: 100% !important;
        height: 54px !important;
        border: 2px solid rgba(214,25,31,.88) !important;
        border-radius: 13px !important;
        background: #fff !important;
        padding: 0 15px !important;
        font-size: 16px !important;
        color: #222 !important;
      }
      .page:has(.stage .overlay) .field::placeholder { color: #555 !important; }
      .page:has(.stage .overlay) .eye { display: none !important; }
      .page:has(.stage .overlay) .remember {
        position: static !important;
        grid-column: 1 !important;
        width: auto !important;
        height: 44px !important;
        font-size: 13px !important;
        align-self: center;
      }
      .page:has(.stage .overlay) .remember .checkbox {
        width: 18px !important;
        height: 18px !important;
        aspect-ratio: auto !important;
      }
      .page:has(.stage .overlay) .rememberText { margin-left: 7px !important; }
      .page:has(.stage .overlay) .forgot {
        position: static !important;
        grid-column: 2 !important;
        width: auto !important;
        height: 44px !important;
        font-size: 13px !important;
        padding: 0 4px !important;
      }
      .page:has(.stage .overlay) .login,
      .page:has(.stage .overlay) .create,
      .page:has(.stage .overlay) .back {
        position: relative !important;
        inset: auto !important;
        grid-column: 1 / -1 !important;
        width: 100% !important;
        height: 54px !important;
        border-radius: 12px !important;
      }
      .page:has(.stage .overlay) .login {
        background: #e30609 !important;
        color: #fff !important;
      }
      .page:has(.stage .overlay) .login::before {
        content: "Log in →";
        font-size: 17px;
        font-weight: 800;
      }
      .page:has(.stage .overlay) .create {
        border: 2px solid #16803d !important;
        background: #fff !important;
        color: #16803d !important;
      }
      .page:has(.stage .overlay) .create::before {
        content: "Create new account";
        font-size: 16px;
        font-weight: 800;
      }
      .page:has(.stage .overlay) .back {
        height: 42px !important;
        color: #c91217 !important;
      }
      .page:has(.stage .overlay) .back::before {
        content: "← Back to Kazi za Kenya";
        font-size: 13px;
        font-weight: 700;
      }
    }

    @media (max-width: 420px) {
      .app .panel { max-height: 36% !important; }
      .page:has(.stage .overlay) .stage { padding-top: 132px !important; }
      .page:has(.stage .overlay) .overlay { padding-left: 14px !important; padding-right: 14px !important; }
      .page:has(.stage .overlay) .overlay::before { font-size: 23px; }
    }
  `;
  document.head.appendChild(style);
})();