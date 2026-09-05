"use client";

import { useLayoutEffect } from "react";

const COUNTRY_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
  KE: { center: [-1.2921, 36.8219], zoom: 11 },
  UG: { center: [0.3476, 32.5825], zoom: 11 },
  TZ: { center: [-6.7924, 39.2083], zoom: 11 },
  RW: { center: [-1.9441, 30.0619], zoom: 11 },
  BI: { center: [-3.3614, 29.3599], zoom: 11 },
  ET: { center: [8.9806, 38.7578], zoom: 11 },
  SO: { center: [2.0469, 45.3182], zoom: 11 },
  DJ: { center: [11.5721, 43.1456], zoom: 11 },
  ER: { center: [15.3229, 38.9251], zoom: 11 },
  SS: { center: [4.8594, 31.5713], zoom: 11 },
  SD: { center: [15.5007, 32.5599], zoom: 11 },
  EG: { center: [30.0444, 31.2357], zoom: 11 },
  LY: { center: [32.8872, 13.1913], zoom: 11 },
  TN: { center: [36.8065, 10.1815], zoom: 11 },
  DZ: { center: [36.7538, 3.0588], zoom: 11 },
  MA: { center: [33.9716, -6.8498], zoom: 11 },
  MR: { center: [18.0735, -15.9582], zoom: 11 },
  ML: { center: [12.6392, -8.0029], zoom: 11 },
  NE: { center: [13.5116, 2.1254], zoom: 11 },
  TD: { center: [12.1348, 15.0557], zoom: 11 },
  NG: { center: [6.5244, 3.3792], zoom: 11 },
};

function selectedCountryCode() {
  try {
    const query = new URLSearchParams(window.location.search).get("country");
    if (query && /^[a-z]{2}$/i.test(query)) return query.toUpperCase();
    const saved = window.localStorage.getItem("anydaywork-marketplace-country");
    if (saved && /^[a-z]{2}$/i.test(saved)) return saved.toUpperCase();
  } catch {}
  return "";
}

function hideMapUntilCountryReady(code: string) {
  if (!code || code === "KE") return;
  document.documentElement.dataset.anydayCountryMapBooting = "1";
  const styleId = "anyday-country-map-boot-style";
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `html[data-anyday-country-map-booting="1"] #map{visibility:hidden!important}`;
  document.head.appendChild(style);
}

function revealMapWhenCorrect(map: any, target: { center: [number, number]; zoom: number }) {
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    try { map.setView(target.center, target.zoom, { animate: false }); } catch {}
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        delete document.documentElement.dataset.anydayCountryMapBooting;
        try { map.invalidateSize({ animate: false }); } catch {}
      });
    });
  };
  try { map.whenReady(reveal); } catch { reveal(); }
  window.setTimeout(reveal, 1200);
}

function wrapLeafletMap(L: any, target: { center: [number, number]; zoom: number }) {
  if (!L || typeof L.map !== "function" || L.map.__anydayCountryBootWrapped) return;

  const originalMap = L.map;
  const wrappedMap = function (this: any, ...args: any[]) {
    const map = originalMap.apply(this, args);

    if (map && typeof map.setView === "function" && !map.__anydayCountryBootSetViewWrapped) {
      const originalSetView = map.setView.bind(map);
      let firstSetView = true;

      map.setView = function (latlng: any, zoom: any, options: any) {
        if (firstSetView) {
          firstSetView = false;
          const result = originalSetView(target.center, target.zoom, { ...(options || {}), animate: false });
          revealMapWhenCorrect(map, target);
          return result;
        }
        return originalSetView(latlng, zoom, options);
      };

      map.__anydayCountryBootSetViewWrapped = true;
    }

    return map;
  } as any;

  try { Object.assign(wrappedMap, originalMap); } catch {}
  wrappedMap.__anydayCountryBootWrapped = true;
  L.map = wrappedMap;
}

export default function MarketplaceInitialMapCountry() {
  useLayoutEffect(() => {
    if (window.location.pathname !== "/") return;

    const code = selectedCountryCode();
    hideMapUntilCountryReady(code);

    const target = COUNTRY_CENTERS[code];
    if (!target || code === "KE") return;

    const descriptor = Object.getOwnPropertyDescriptor(window, "L");
    const oldGet = descriptor?.get;
    const oldSet = descriptor?.set;
    let localValue = oldGet ? oldGet.call(window) : (window as any).L;

    if (localValue) wrapLeafletMap(localValue, target);

    if (descriptor?.configurable === false) return;

    try {
      Object.defineProperty(window, "L", {
        configurable: true,
        enumerable: descriptor?.enumerable ?? true,
        get() {
          return oldGet ? oldGet.call(window) : localValue;
        },
        set(value) {
          if (oldSet) oldSet.call(window, value);
          else localValue = value;
          const actual = oldGet ? oldGet.call(window) : localValue;
          wrapLeafletMap(actual, target);
        },
      });
    } catch {}
  }, []);

  return null;
}
