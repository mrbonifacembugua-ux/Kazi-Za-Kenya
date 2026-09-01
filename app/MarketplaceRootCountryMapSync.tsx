"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "anydaywork-marketplace-country";

const COUNTRY_VIEWS: Record<string, { center: [number, number]; zoom: number }> = {
  KE: { center: [-1.2921, 36.8219], zoom: 10 },
  UG: { center: [0.3476, 32.5825], zoom: 10 },
  TZ: { center: [-6.7924, 39.2083], zoom: 10 },
  RW: { center: [-1.9441, 30.0619], zoom: 10 },
  BI: { center: [-3.3614, 29.3599], zoom: 10 },
  ET: { center: [8.9806, 38.7578], zoom: 10 },
  SO: { center: [2.0469, 45.3182], zoom: 10 },
  DJ: { center: [11.5721, 43.1456], zoom: 10 },
  ER: { center: [15.3229, 38.9251], zoom: 10 },
  SS: { center: [4.8594, 31.5713], zoom: 10 },
  SD: { center: [15.5007, 32.5599], zoom: 10 },
  EG: { center: [30.0444, 31.2357], zoom: 10 },
  LY: { center: [32.8872, 13.1913], zoom: 10 },
  TN: { center: [36.8065, 10.1815], zoom: 10 },
  DZ: { center: [36.7538, 3.0588], zoom: 10 },
  MA: { center: [34.0209, -6.8416], zoom: 10 },
  MR: { center: [18.0735, -15.9582], zoom: 10 },
  ML: { center: [12.6392, -8.0029], zoom: 10 },
  NE: { center: [13.5116, 2.1254], zoom: 10 },
  TD: { center: [12.1348, 15.0557], zoom: 10 },
  NG: { center: [6.5244, 3.3792], zoom: 10 },
};

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
  if (!mapEl) return null;
  const w = window as any;
  return w.__kzkMarketplaceMap || mapEl.__kzkMarketplaceMap || mapEl._leaflet_map || null;
}

export default function MarketplaceRootCountryMapSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    let timer = 0;

    const apply = () => {
      if (cancelled) return;
      const code = selectedCountry();
      const view = COUNTRY_VIEWS[code];
      const map = currentMap();
      if (!view || !map) {
        timer = window.setTimeout(apply, 50);
        return;
      }
      try {
        map.setView(view.center, view.zoom, { animate: false });
        map.invalidateSize?.();
      } catch {}
    };

    apply();

    const onCountryChanged = () => apply();
    window.addEventListener("anydaywork:country-changed", onCountryChanged);
    window.addEventListener("kzk:leaflet-map-ready", onCountryChanged);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("anydaywork:country-changed", onCountryChanged);
      window.removeEventListener("kzk:leaflet-map-ready", onCountryChanged);
    };
  }, [pathname]);

  return null;
}
