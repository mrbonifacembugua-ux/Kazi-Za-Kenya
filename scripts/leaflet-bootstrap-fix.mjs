import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from "node:fs";

const pageFile = new URL("../app/page.tsx", import.meta.url);
const layoutFile = new URL("../app/layout.tsx", import.meta.url);
const leafletCssFile = new URL("../node_modules/leaflet/dist/leaflet.css", import.meta.url);
const publicDir = new URL("../public/", import.meta.url);
const publicLeafletCss = new URL("../public/leaflet.css", import.meta.url);

let page = readFileSync(pageFile, "utf8");
let layout = readFileSync(layoutFile, "utf8");

// Serve Leaflet's official structural stylesheet as a normal static asset as well as
// bundling it. This avoids CSS chunk/order/hydration problems: the map cannot initialize
// with unpositioned tile panes even if a client CSS chunk is delayed.
mkdirSync(publicDir, { recursive: true });
copyFileSync(leafletCssFile, publicLeafletCss);

if (!layout.includes('href="/leaflet.css"')) {
  const bodyTag = "      <body>";
  if (!layout.includes(bodyTag)) {
    console.error("Root layout body tag was not found.");
    process.exit(1);
  }
  layout = layout.replace(
    bodyTag,
    '      <head><link rel="stylesheet" href="/leaflet.css" /></head>\n' + bodyTag
  );
}

// Keep the package CSS in the Next build too. The static stylesheet above is the
// deterministic first-paint path; this import is a harmless bundled fallback.
if (!layout.includes('import "leaflet/dist/leaflet.css";')) {
  const metadataImport = 'import type { Metadata } from "next";';
  if (!layout.includes(metadataImport)) process.exit(1);
  layout = layout.replace(metadataImport, metadataImport + '\nimport "leaflet/dist/leaflet.css";');
}

// Use the installed package, never a runtime CDN script. This prevents a second
// Leaflet runtime from racing the first one during hydration.
const loaderPattern = /        if \(!\(window as any\)\.L\) \{[\s\S]*?        \}\r?\n\r?\n        if \(cancelled\) return;/;
if (!loaderPattern.test(page)) {
  console.error("Marketplace Leaflet CDN loader was not found.");
  process.exit(1);
}
page = page.replace(loaderPattern,
`        const leafletModule = await import("leaflet");
        if (cancelled) return;
        const bundledLeaflet = (leafletModule as any).default || leafletModule;
        if (!(window as any).L) (window as any).L = { ...bundledLeaflet };
        if (cancelled) return;`);

page = page.replace(
  '"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",',
  '(process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"),'
);

page = page.replace(
  '              maxZoom: 19,\r\n              attribution:',
  '              maxZoom: 19,\r\n              updateWhenIdle: true,\r\n              updateWhenZooming: false,\r\n              keepBuffer: 2,\r\n              attribution:'
).replace(
  '              maxZoom: 19,\n              attribution:',
  '              maxZoom: 19,\n              updateWhenIdle: true,\n              updateWhenZooming: false,\n              keepBuffer: 2,\n              attribution:'
);

// Size correction is intentionally conservative. It fixes genuine responsive layout
// changes without continuously rebuilding the tile grid.
const layerGroupBlock = /          markerLayerRef\.current =\r?\n            L\.layerGroup\(\)\.addTo\(\r?\n              mapRef\.current\r?\n            \);/;
if (!layerGroupBlock.test(page)) {
  console.error("Marketplace marker layer initialization was not found.");
  process.exit(1);
}
page = page.replace(layerGroupBlock,
`          markerLayerRef.current =
            L.layerGroup().addTo(
              mapRef.current
            );

          const settleMapSize = () => {
            const map = mapRef.current;
            if (!map) return;
            try { map.invalidateSize({ pan: false, debounceMoveend: true }); } catch (_) {}
          };

          requestAnimationFrame(() => requestAnimationFrame(settleMapSize));
          window.setTimeout(settleMapSize, 250);

          if (typeof ResizeObserver !== "undefined" && mapElement.current) {
            const observedElement = mapElement.current;
            let resizeFrame = 0;
            const resizeObserver = new ResizeObserver(() => {
              if (resizeFrame) cancelAnimationFrame(resizeFrame);
              resizeFrame = requestAnimationFrame(settleMapSize);
            });
            resizeObserver.observe(observedElement);
            (mapRef.current as any).__anydayResizeObserver = resizeObserver;
          }`);

writeFileSync(pageFile, page, "utf8");
writeFileSync(layoutFile, layout, "utf8");
console.log("Applied deterministic Leaflet CSS, single runtime and responsive sizing safeguards.");
