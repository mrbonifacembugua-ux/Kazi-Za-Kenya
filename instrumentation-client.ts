// Keep the user's blue browse/current-location marker visible and clickable.
// This intentionally does NOT modify Leaflet tile sizing or the basemap.
function installBrowseLocationMarkerStyles() {
  if (document.getElementById("kzk-location-marker-visibility")) return;

  const style = document.createElement("style");
  style.id = "kzk-location-marker-visibility";
  style.textContent = `
    .leaflet-overlay-pane {
      z-index: 650 !important;
      pointer-events: none;
    }

    .leaflet-overlay-pane svg {
      pointer-events: auto;
    }

    .leaflet-overlay-pane .leaflet-interactive {
      pointer-events: auto;
      cursor: pointer;
      stroke: #1677ff !important;
      fill: #1677ff !important;
      stroke-width: 4 !important;
      fill-opacity: 0.95 !important;
      filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.28));
    }
  `;

  document.head.appendChild(style);
}

if (typeof document !== "undefined") {
  installBrowseLocationMarkerStyles();
  document.addEventListener("DOMContentLoaded", installBrowseLocationMarkerStyles, { once: true });
}
