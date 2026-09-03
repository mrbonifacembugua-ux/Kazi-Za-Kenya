"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

const STORAGE_KEY = "anydaywork-marketplace-country";
type Bounds = [[number, number], [number, number]];
type Point = { latitude: number | null; longitude: number | null };

// Keep the proven Africa bounds as fallbacks. Countries outside this list are
// framed from their existing demo profile/job coordinates instead of leaving
// the map stuck on the previous country.
const COUNTRY_VIEWS: Record<string, { bounds: Bounds }> = {
  KE:{bounds:[[-4.9,33.8],[5.1,41.9]]},UG:{bounds:[[-1.5,29.5],[4.3,35.1]]},TZ:{bounds:[[-11.8,29.3],[-0.8,40.5]]},RW:{bounds:[[-2.9,28.8],[-1.0,30.9]]},BI:{bounds:[[-4.5,28.9],[-2.3,30.9]]},ET:{bounds:[[3.3,32.8],[14.9,48.1]]},SO:{bounds:[[-1.7,40.9],[12.1,51.6]]},DJ:{bounds:[[10.9,41.7],[12.8,43.5]]},ER:{bounds:[[12.3,36.4],[18.1,43.2]]},SS:{bounds:[[3.4,23.4],[12.3,35.9]]},SD:{bounds:[[8.7,21.8],[22.3,38.6]]},EG:{bounds:[[21.7,24.7],[31.8,36.9]]},LY:{bounds:[[19.3,9.3],[33.3,25.2]]},TN:{bounds:[[30.2,7.4],[37.6,11.7]]},DZ:{bounds:[[18.9,-8.7],[37.2,12.0]]},MA:{bounds:[[27.6,-13.2],[35.9,-1.0]]},MR:{bounds:[[14.7,-17.2],[27.4,-4.8]]},ML:{bounds:[[10.1,-12.3],[25.0,4.3]]},NE:{bounds:[[11.7,0.1],[23.6,16.0]]},TD:{bounds:[[7.4,14.2],[23.5,24.0]]},NG:{bounds:[[4.2,2.6],[13.9,14.7]]},
  BJ:{bounds:[[6.2,0.7],[12.5,3.9]]},BF:{bounds:[[9.4,-5.6],[15.1,2.5]]},CI:{bounds:[[4.3,-8.7],[10.8,-2.5]]},GH:{bounds:[[4.5,-3.3],[11.2,1.3]]},GN:{bounds:[[7.1,-15.1],[12.7,-7.6]]},GW:{bounds:[[10.8,-16.8],[12.7,-13.6]]},LR:{bounds:[[4.2,-11.6],[8.6,-7.3]]},SN:{bounds:[[12.3,-17.7],[16.7,-11.3]]},SL:{bounds:[[6.8,-13.4],[10.0,-10.2]]},GM:{bounds:[[13.0,-16.9],[13.9,-13.8]]}
};

function normalizeCountryCode(value: unknown) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "";
}

function selectedCountry() {
  const fromUrl = normalizeCountryCode(new URLSearchParams(window.location.search).get("country"));
  if (fromUrl) return fromUrl;
  try { return normalizeCountryCode(window.localStorage.getItem(STORAGE_KEY)) || "KE"; }
  catch { return "KE"; }
}

function currentMap() {
  const mapEl = document.querySelector<HTMLElement>(".leaflet-container") as any;
  if (!mapEl) return null;
  const w = window as any;
  return w.__kzkMarketplaceMap || mapEl.__kzkMarketplaceMap || mapEl._leaflet_map || null;
}

function validPoints(rows: Point[]) {
  return rows.flatMap(row => {
    if (row.latitude == null || row.longitude == null) return [];
    const lat = Number(row.latitude), lng = Number(row.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];
    return [{ lat, lng }];
  });
}

function boundsFromPoints(points: { lat: number; lng: number }[]): Bounds | null {
  if (!points.length) return null;
  let minLat = points[0].lat, maxLat = points[0].lat;
  let minLng = points[0].lng, maxLng = points[0].lng;
  for (const p of points) {
    minLat = Math.min(minLat, p.lat); maxLat = Math.max(maxLat, p.lat);
    minLng = Math.min(minLng, p.lng); maxLng = Math.max(maxLng, p.lng);
  }
  // Give single-city/small demo sets enough breathing room without forcing a street zoom.
  const latPad = Math.max((maxLat - minLat) * 0.22, 0.8);
  const lngPad = Math.max((maxLng - minLng) * 0.22, 0.8);
  return [[minLat - latPad, minLng - lngPad], [maxLat + latPad, maxLng + lngPad]];
}

export default function MarketplaceRootCountryMapSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    let cancelled = false;
    let mapTimer = 0;
    let requestVersion = 0;

    async function resolveBounds(code: string): Promise<Bounds | null> {
      const fallback = COUNTRY_VIEWS[code]?.bounds || null;
      try {
        const [{ data: profiles }, { data: jobs }] = await Promise.all([
          supabase.from("demo_profiles").select("latitude,longitude").eq("country_code", code),
          supabase.from("demo_jobs").select("latitude,longitude").eq("country_code", code),
        ]);
        const points = validPoints([...(profiles || []), ...(jobs || [])] as Point[]);
        return boundsFromPoints(points) || fallback;
      } catch {
        return fallback;
      }
    }

    async function moveToSelectedCountry() {
      const version = ++requestVersion;
      const code = selectedCountry();
      const bounds = await resolveBounds(code);
      if (cancelled || version !== requestVersion || !bounds) return;

      let attempts = 0;
      const apply = () => {
        if (cancelled || version !== requestVersion) return;
        const map = currentMap();
        if (!map) {
          attempts += 1;
          if (attempts < 40) mapTimer = window.setTimeout(apply, 75);
          return;
        }
        try {
          map.fitBounds(bounds, { padding: [28, 28], animate: false, maxZoom: 7 });
          map.invalidateSize?.();
        } catch {}
      };
      apply();
    }

    void moveToSelectedCountry();
    const onCountryChanged = () => { window.clearTimeout(mapTimer); void moveToSelectedCountry(); };
    window.addEventListener("anydaywork:country-changed", onCountryChanged);
    window.addEventListener("kzk:leaflet-map-ready", onCountryChanged);

    return () => {
      cancelled = true;
      requestVersion += 1;
      window.clearTimeout(mapTimer);
      window.removeEventListener("anydaywork:country-changed", onCountryChanged);
      window.removeEventListener("kzk:leaflet-map-ready", onCountryChanged);
    };
  }, [pathname]);

  return null;
}
