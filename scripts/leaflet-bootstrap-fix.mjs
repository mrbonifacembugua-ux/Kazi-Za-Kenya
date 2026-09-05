import { readFileSync, writeFileSync } from "node:fs";

const pageFile = new URL("../app/page.tsx", import.meta.url);
const layoutFile = new URL("../app/layout.tsx", import.meta.url);

let page = readFileSync(pageFile, "utf8");
let layout = readFileSync(layoutFile, "utf8");

// Leaflet's structural CSS must exist before the map is measured. Keep one import
// with the client marketplace and one at the root so Next emits it deterministically.
if (!page.includes('import "leaflet/dist/leaflet.css";')) {
  const clientDirective = '"use client";';
  if (!page.includes(clientDirective)) process.exit(1);
  page = page.replace(clientDirective, clientDirective + '\n\nimport "leaflet/dist/leaflet.css";');
}
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

          // The marketplace is responsive and the left panel changes the usable map
          // rectangle after first paint. Observe the REAL map element instead of guessing
          // with a permanent timer. After every genuine size change, let Leaflet recompute
          // its pixel origin and redraw only its tile layers.
          const settleMapSize = () => {
            const map = mapRef.current;
            if (!map) return;
            try {
              map.invalidateSize({ pan: false, debounceMoveend: true });
              map.eachLayer?.((layer: any) => {
                if (layer && typeof layer.redraw === "function" && layer.getTileUrl) {
                  layer.redraw();
                }
              });
            } catch (_) {}
          };

          requestAnimationFrame(() => requestAnimationFrame(settleMapSize));
          window.setTimeout(settleMapSize, 180);
          window.setTimeout(settleMapSize, 650);

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
console.log("Applied stable Leaflet CSS, single runtime, ResizeObserver and tile redraw safeguards.");
