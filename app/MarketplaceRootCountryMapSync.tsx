"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "anydaywork-marketplace-country";

type Bounds = [[number, number], [number, number]];

const COUNTRY_VIEWS: Record<string, Bounds> = {
  KE:[[-4.9,33.8],[5.1,41.9]], UG:[[-1.5,29.5],[4.3,35.1]], TZ:[[-11.8,29.3],[-0.8,40.5]],
  RW:[[-2.9,28.8],[-1.0,30.9]], BI:[[-4.5,28.9],[-2.3,30.9]], ET:[[3.3,32.8],[14.9,48.1]],
  SO:[[-1.7,40.9],[12.1,51.6]], DJ:[[10.9,41.7],[12.8,43.5]], ER:[[12.3,36.4],[18.1,43.2]],
  SS:[[3.4,23.4],[12.3,35.9]], SD:[[8.7,21.8],[22.3,38.6]], EG:[[21.7,24.7],[31.8,36.9]],
  LY:[[19.3,9.3],[33.3,25.2]], TN:[[30.2,7.4],[37.6,11.7]], DZ:[[18.9,-8.7],[37.2,12.0]],
  MA:[[27.6,-13.2],[35.9,-1.0]], MR:[[14.7,-17.2],[27.4,-4.8]], ML:[[10.1,-12.3],[25.0,4.3]],
  NE:[[11.7,0.1],[23.6,16.0]], TD:[[7.4,14.2],[23.5,24.0]], NG:[[4.2,2.6],[13.9,14.7]],
  BJ:[[6.2,0.7],[12.5,3.9]], BF:[[9.4,-5.6],[15.1,2.5]], CI:[[4.3,-8.7],[10.8,-2.5]],
  GH:[[4.5,-3.3],[11.2,1.3]], GN:[[7.1,-15.1],[12.7,-7.6]], GW:[[10.8,-16.8],[12.7,-13.6]],
  LR:[[4.2,-11.6],[8.6,-7.3]], SN:[[12.3,-17.7],[16.7,-11.3]], SL:[[6.8,-13.4],[10.0,-10.2]],
  GM:[[13.0,-16.9],[13.9,-13.8]],
  CZ:[[48.55,12.09],[51.06,18.87]],
};

const boundsCache = new Map<string, Bounds>();

function normalizeCountryCode(value: unknown) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "";
}

function selectedCountry() {
  const fromUrl = normalizeCountryCode(new URLSearchParams(window.location.search).get("country"));
  if (fromUrl) return fromUrl;
  try {
    return normalizeCountryCode(window.localStorage.getItem(STORAGE_KEY)) || "KE";
  } catch {
    return "KE";
  }
}

function currentMap() {
  const mapEl = document.querySelector<HTMLElement>(".leaflet-container") as any;
  const w = window as any;
  return w.__kzkMarketplaceMap || mapEl?.__kzkMarketplaceMap || mapEl?._leaflet_map || null;
}

function countryName(code: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

async function resolveBounds(code: string): Promise<Bounds | null> {
  if (COUNTRY_VIEWS[code]) return COUNTRY_VIEWS[code];
  if (boundsCache.has(code)) return boundsCache.get(code)!;

  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      limit: "1",
      countrycodes: code.toLowerCase(),
      q: countryName(code),
    });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const rows = await response.json();
    const box = Array.isArray(rows) ? rows[0]?.boundingbox : null;
    if (!Array.isArray(box) || box.length !== 4) return null;

    const south = Number(box[0]);
    const north = Number(box[1]);
    const west = Number(box[2]);
    const east = Number(box[3]);
    if (![south, north, west, east].every(Number.isFinite)) return null;

    const bounds: Bounds = [[south, west], [north, east]];
    boundsCache.set(code, bounds);
    return bounds;
  } catch {
    return null;
  }
}

function clampCountryZoom(map: any, bounds: Bounds) {
  try {
    const nativeZoom = Number(map.getBoundsZoom?.(bounds, false, [18, 18]));
    const maxZoom = 7;
    const minZoom = 3;
    if (Number.isFinite(nativeZoom)) return Math.max(minZoom, Math.min(maxZoom, nativeZoom));
  } catch {}
  return 5;
}

export default function MarketplaceRootCountryMapSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    let timer = 0;
    let attempts = 0;
    let requestVersion = 0;

    const apply = async () => {
      if (cancelled) return;
      const version = ++requestVersion;
      const code = selectedCountry();
      const map = currentMap();

      if (!map) {
        attempts += 1;
        if (attempts < 80) timer = window.setTimeout(() => void apply(), 100);
        return;
      }

      attempts = 0;
      const bounds = await resolveBounds(code);
      if (cancelled || version !== requestVersion || !bounds) return;

      try {
        map.stop?.();
        const centerLat = (bounds[0][0] + bounds[1][0]) / 2;
        const centerLng = (bounds[0][1] + bounds[1][1]) / 2;
        const zoom = clampCountryZoom(map, bounds);
        map.setView?.([centerLat, centerLng], zoom, { animate: false });
        map.invalidateSize?.();
      } catch {}
    };

    void apply();
    const onCountryChanged = () => {
      attempts = 0;
      window.clearTimeout(timer);
      void apply();
    };

    window.addEventListener("anydaywork:country-changed", onCountryChanged);
    window.addEventListener("kzk:leaflet-map-ready", onCountryChanged);

    return () => {
      cancelled = true;
      requestVersion += 1;
      window.clearTimeout(timer);
      window.removeEventListener("anydaywork:country-changed", onCountryChanged);
      window.removeEventListener("kzk:leaflet-map-ready", onCountryChanged);
    };
  }, [pathname]);

  return null;
}
