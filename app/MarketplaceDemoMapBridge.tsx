"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

type DemoWorker = {
  id: string;
  full_name: string;
  latitude: number | null;
  longitude: number | null;
  area: string | null;
  country_name: string;
};

function workerMode() {
  const active = Array.from(document.querySelectorAll<HTMLElement>(".main-tab")).find((tab) =>
    tab.classList.contains("active"),
  );
  return !((active?.textContent || "").toLowerCase().includes("job"));
}

function getMap() {
  const mapEl = document.querySelector<HTMLElement>(".leaflet-container") as any;
  if (!mapEl) return { mapEl: null, map: null };

  const w = window as any;
  const map =
    w.__kzkMarketplaceMap ||
    mapEl.__kzkMarketplaceMap ||
    mapEl._leaflet_map ||
    Object.values(w).find(
      (value: any) =>
        value &&
        typeof value === "object" &&
        value._container === mapEl &&
        typeof value.flyTo === "function" &&
        typeof value.addLayer === "function",
    );

  return { mapEl, map };
}

function validPoint(worker: DemoWorker) {
  if (worker.latitude == null || worker.longitude == null) return null;
  const lat = Number(worker.latitude);
  const lng = Number(worker.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

export default function MarketplaceDemoMapBridge() {
  const pathname = usePathname();
  const [workers, setWorkers] = useState<DemoWorker[]>([]);

  useEffect(() => {
    if (pathname !== "/") return;
    let active = true;

    async function load() {
      const { data, error } = await supabase
        .from("demo_profiles")
        .select("id,full_name,latitude,longitude,area,country_name")
        .eq("is_demo", true)
        .eq("profile_kind", "worker")
        .order("sort_order");

      if (!active) return;
      if (error) {
        console.error("Demo worker map profiles failed to load", error);
        return;
      }
      setWorkers((data || []) as DemoWorker[]);
    }

    void load();
    const timer = window.setInterval(load, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [pathname]);

  const byName = useMemo(
    () => new Map(workers.map((worker) => [worker.full_name.trim().toLowerCase(), worker])),
    [workers],
  );

  useEffect(() => {
    if (pathname !== "/" || workers.length === 0) return;
    let cancelled = false;
    let mountedMap: any = null;
    let mountedMapEl: any = null;
    let group: any = null;

    const mountMarkers = () => {
      if (cancelled) return false;
      const { mapEl, map } = getMap();
      const L = (window as any).L;
      if (!mapEl || !map || !L) return false;

      mountedMap = map;
      mountedMapEl = mapEl;

      const previous = mapEl.__anydayDemoWorkerGroup;
      if (previous) {
        try {
          previous.remove?.();
        } catch {}
      }

      group = L.layerGroup();

      workers.forEach((worker) => {
        const point = validPoint(worker);
        if (!point) return;

        const icon = L.divIcon({
          className: "anyday-demo-map-marker",
          html: '<div class="anyday-demo-map-pin">E</div>',
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([point.lat, point.lng], { icon });
        marker.bindTooltip(`${worker.full_name} · EXAMPLE · ${worker.area || worker.country_name}`);
        marker.on("click", () => {
          try {
            map.flyTo([point.lat, point.lng], 15, { animate: true, duration: 1.1 });
          } catch {}
        });
        marker.addTo(group);
      });

      if (workerMode()) group.addTo(map);
      mapEl.__anydayDemoWorkerGroup = group;
      try {
        window.dispatchEvent(new CustomEvent("kzk:marketplace-layer-updated"));
      } catch {}
      return true;
    };

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (mountMarkers() || attempts > 80) window.clearInterval(timer);
    }, 250);
    mountMarkers();

    const syncMode = () => {
      if (!mountedMap || !group) return;
      try {
        if (workerMode()) {
          if (!mountedMap.hasLayer?.(group)) group.addTo(mountedMap);
        } else if (mountedMap.hasLayer?.(group)) {
          group.remove?.();
        }
      } catch {}
    };

    const onClick = () => window.setTimeout(syncMode, 0);
    document.addEventListener("click", onClick, true);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("click", onClick, true);
      try {
        group?.remove?.();
      } catch {}
      if (mountedMapEl?.__anydayDemoWorkerGroup === group) {
        mountedMapEl.__anydayDemoWorkerGroup = null;
      }
    };
  }, [pathname, workers]);

  useEffect(() => {
    if (pathname !== "/" || workers.length === 0) return;

    const zoomToWorkerFromCard = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest?.(".anyday-demo-worker-card") as HTMLElement | null;
      if (!card) return;

      const text = (card.textContent || "").toLowerCase();
      const worker = Array.from(byName.entries()).find(([name]) => text.includes(name))?.[1];
      if (!worker) return;
      const point = validPoint(worker);
      if (!point) return;

      const { map } = getMap();
      if (!map) return;

      try {
        const currentZoom = Number(map.getZoom?.() || 0);
        const destinationZoom = Math.max(14, Math.min(16, currentZoom || 14));
        map.flyTo([point.lat, point.lng], destinationZoom, {
          animate: true,
          duration: 1.25,
        });
      } catch {}
    };

    document.addEventListener("click", zoomToWorkerFromCard, true);
    return () => document.removeEventListener("click", zoomToWorkerFromCard, true);
  }, [pathname, workers, byName]);

  if (pathname !== "/") return null;

  return (
    <style jsx global>{`
      .anyday-demo-map-marker {
        background: transparent !important;
        border: 0 !important;
      }
      .anyday-demo-map-pin {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: #16803d;
        color: #fff;
        border: 3px solid #fff;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.32);
        font: 900 12px/1 system-ui, sans-serif;
      }
    `}</style>
  );
}
