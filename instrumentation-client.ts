// Development map stability fixes for the Kazi za Kenya marketplace.
// Next.js loads this file automatically in the browser.

function installMapStabilityStyles() {
  if (document.getElementById("kzk-map-stability-styles")) return;

  const style = document.createElement("style");
  style.id = "kzk-map-stability-styles";
  style.textContent = `
    /* Keep the blue browse/current-location circle above ordinary job/worker markers
       so it remains clickable even when several map markers overlap it. */
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
    }

    /* Some browsers expose fractional-pixel gaps between adjacent Leaflet raster
       tiles. A one-pixel overlap removes those visual seams without changing map
       coordinates or interaction. */
    .leaflet-tile-container img.leaflet-tile {
      width: 257px !important;
      height: 257px !important;
      max-width: none !important;
      max-height: none !important;
    }
  `;
  document.head.appendChild(style);
}

if (typeof document !== "undefined") {
  installMapStabilityStyles();
  document.addEventListener("DOMContentLoaded", installMapStabilityStyles, { once: true });
}
