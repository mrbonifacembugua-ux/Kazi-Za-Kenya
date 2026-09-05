import { readFileSync, writeFileSync } from "node:fs";

const instrumentationFile = new URL("../instrumentation-client.ts", import.meta.url);
const pageFile = new URL("../app/page.tsx", import.meta.url);

let instrumentation = readFileSync(instrumentationFile, "utf8");
let page = readFileSync(pageFile, "utf8");

// Keep only Leaflet CSS in instrumentation. Do not publish window.L from a timer:
// the marketplace effect owns map startup and must be the single initializer.
const instrumentationPattern = /import \* as Leaflet from "leaflet";\r?\nimport "leaflet\/dist\/leaflet\.css";[\s\S]*?(?=\/\/ Reliable current-location marker bridge)/;
if (!instrumentationPattern.test(instrumentation)) {
  console.error("Unexpected Leaflet instrumentation source shape.");
  process.exit(1);
}
instrumentation = instrumentation.replace(
  instrumentationPattern,
  'import "leaflet/dist/leaflet.css";\n\n'
);

// Replace the legacy browser CDN loader with the installed Leaflet package.
// This removes the unpkg race entirely and guarantees one initialization path.
const loaderPattern = /        if \(!\(window as any\)\.L\) \{[\s\S]*?        \}\r?\n\r?\n        if \(cancelled\) return;/;
if (!loaderPattern.test(page)) {
  console.error("Marketplace Leaflet CDN loader was not found.");
  process.exit(1);
}
page = page.replace(
  loaderPattern,
`        const leafletModule = await import("leaflet");
        if (cancelled) return;

        const bundledLeaflet = (leafletModule as any).default || leafletModule;
        if (!(window as any).L) {
          // The root layout setter wraps this once with the existing map guards.
          (window as any).L = { ...bundledLeaflet };
        }

        if (cancelled) return;`
);

// Use the canonical OSM endpoint as fallback and make the provider swappable by env.
// A production tile provider can later be configured without rewriting this page.
page = page.replace(
  '"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",',
  '(process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"),'
);

// Reduce unnecessary raster requests while the user is dragging the map.
page = page.replace(
  '              maxZoom: 19,\r\n              attribution:',
  '              maxZoom: 19,\r\n              updateWhenIdle: true,\r\n              keepBuffer: 2,\r\n              attribution:'
).replace(
  '              maxZoom: 19,\n              attribution:',
  '              maxZoom: 19,\n              updateWhenIdle: true,\n              keepBuffer: 2,\n              attribution:'
);

// Recalculate tile geometry after the first browser layout passes. This is the
// Leaflet-supported fix for maps whose container size settles after initialization.
const layerGroupBlock = /          markerLayerRef\.current =\r?\n            L\.layerGroup\(\)\.addTo\(\r?\n              mapRef\.current\r?\n            \);/;
if (!layerGroupBlock.test(page)) {
  console.error("Marketplace marker layer initialization was not found.");
  process.exit(1);
}
page = page.replace(
  layerGroupBlock,
`          markerLayerRef.current =
            L.layerGroup().addTo(
              mapRef.current
            );

          const settleMapSize = () => {
            try {
              mapRef.current?.invalidateSize({
                pan: false,
                debounceMoveend: true,
              });
            } catch (_) {}
          };
          requestAnimationFrame(settleMapSize);
          window.setTimeout(settleMapSize, 120);
          window.setTimeout(settleMapSize, 400);`
);

writeFileSync(instrumentationFile, instrumentation, "utf8");
writeFileSync(pageFile, page, "utf8");
console.log("Applied stable single-owner Leaflet bootstrap and tile safeguards.");
