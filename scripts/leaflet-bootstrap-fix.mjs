import { readFileSync, writeFileSync } from "node:fs";

const pageFile = new URL("../app/page.tsx", import.meta.url);
const layoutFile = new URL("../app/layout.tsx", import.meta.url);

let page = readFileSync(pageFile, "utf8");
let layout = readFileSync(layoutFile, "utf8");

// Load Leaflet structural CSS through BOTH supported Next.js paths. The marketplace
// is a client component, so importing the stylesheet beside that component guarantees
// the tile/pane positioning rules are in the same client bundle. Root layout remains
// a second safe global import. This is intentionally idempotent.
if (!page.includes('import "leaflet/dist/leaflet.css";')) {
  const clientDirective = '"use client";';
  if (!page.includes(clientDirective)) {
    console.error("Marketplace client directive was not found.");
    process.exit(1);
  }
  page = page.replace(
    clientDirective,
    clientDirective + '\n\nimport "leaflet/dist/leaflet.css";'
  );
}

if (!layout.includes('import "leaflet/dist/leaflet.css";')) {
  const metadataImport = 'import type { Metadata } from "next";';
  if (!layout.includes(metadataImport)) {
    console.error("Root layout metadata import was not found.");
    process.exit(1);
  }
  layout = layout.replace(
    metadataImport,
    metadataImport + '\nimport "leaflet/dist/leaflet.css";'
  );
}

// Replace the legacy browser CDN loader with the installed Leaflet package.
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
          (window as any).L = { ...bundledLeaflet };
        }

        if (cancelled) return;`
);

page = page.replace(
  '"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",',
  '(process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"),'
);

page = page.replace(
  '              maxZoom: 19,\r\n              attribution:',
  '              maxZoom: 19,\r\n              updateWhenIdle: true,\r\n              keepBuffer: 2,\r\n              attribution:'
).replace(
  '              maxZoom: 19,\n              attribution:',
  '              maxZoom: 19,\n              updateWhenIdle: true,\n              keepBuffer: 2,\n              attribution:'
);

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

writeFileSync(pageFile, page, "utf8");
writeFileSync(layoutFile, layout, "utf8");
console.log("Applied Leaflet client-bundle CSS, single JS bootstrap and tile safeguards.");
