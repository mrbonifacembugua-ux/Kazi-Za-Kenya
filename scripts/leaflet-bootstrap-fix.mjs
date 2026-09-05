import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../instrumentation-client.ts", import.meta.url);
let source = readFileSync(file, "utf8");

const oldBlock = `import * as Leaflet from "leaflet";\nimport "leaflet/dist/leaflet.css";\n\n// Leaflet used to be downloaded from unpkg in the marketplace component at runtime.\n// Make a mutable local copy available before React hydrates so the existing map code\n// can initialize even when an external CDN is unavailable. The root layout's map\n// bridge intentionally wraps window.L, so assigning here also preserves those guards.\nif (typeof window !== "undefined") {\n  const w = window as any;\n  if (!w.L) w.L = { ...Leaflet };\n}\n\n`;

const newBlock = `import * as Leaflet from "leaflet";\nimport "leaflet/dist/leaflet.css";\n\n// Keep Leaflet bundled with AnyDayWork, but do not expose it before React hydrates.\n// The marketplace page already initializes the map after mount. Exposing window.L too\n// early caused several country/map synchronizers to start at once and fight over the\n// same map, which produced scattered tiles and a frozen UI.\nif (typeof window !== "undefined") {\n  const w = window as any;\n  const installBundledLeaflet = () => {\n    if (w.__adwBundledLeafletInstalled) return;\n    w.__adwBundledLeafletInstalled = true;\n    if (!w.L) w.L = { ...Leaflet };\n\n    // If the legacy marketplace effect is waiting for its Leaflet script load,\n    // resolve that wait with the bundled copy instead of starting a second map.\n    const legacyScript = document.querySelector('script[src*="unpkg.com/leaflet@1.9.4/dist/leaflet.js"]') as HTMLScriptElement | null;\n    if (legacyScript && typeof legacyScript.onload === "function") {\n      try { legacyScript.onload(new Event("load") as any); } catch (_) {}\n    }\n  };\n\n  // Let React mount and the marketplace effect create its expected script element first.\n  window.setTimeout(installBundledLeaflet, 80);\n}\n\n`;

if (!source.includes(oldBlock)) {
  console.error("Leaflet bootstrap block was not found; refusing to patch an unexpected source shape.");
  process.exit(1);
}

source = source.replace(oldBlock, newBlock);
writeFileSync(file, source);
console.log("Applied deferred bundled Leaflet bootstrap.");
