"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pnqmqxeuzcodnxdixnvc.supabase.co",
  "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l"
);

type LivePoint = {
  id: string;
  title: string;
  area: string;
  road: string;
  county: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string;
};

export default function MapSearchEnhancer() {
  useEffect(() => {
    let stopped = false;
    let timer: number | undefined;
    let cleanupPatch: (() => void) | undefined;
    let liveLayer: any = null;
    let lastMode = "";
    let lastSignature = "";
    let rendering = false;

    const known: Record<string, [number, number]> = {
      kilimani: [-1.2928, 36.7877],
      kileleshwa: [-1.2857, 36.777],
      lavington: [-1.2815, 36.769],
      westlands: [-1.2676, 36.807],
      "south b": [-1.3074, 36.831],
      "south c": [-1.305, 36.82],
      kasarani: [-1.2215, 36.897],
      eastleigh: [-1.275, 36.85],
      donholm: [-1.299, 36.891],
      embakasi: [-1.323, 36.902],
      langata: [-1.329, 36.781],
    };

    const geocode = async (
      area: string,
      road: string,
      county: string
    ): Promise<[number, number] | null> => {
      const key = (area || "").toLowerCase().trim();
      if (known[key]) return known[key];

      try {
        const q = [road, area, county || "Nairobi", "Kenya"]
          .filter(Boolean)
          .join(", ");
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ke&q=${encodeURIComponent(q)}`,
          { headers: { Accept: "application/json" } }
        );
        const results = await response.json();
        if (!results?.length) return null;
        const lat = Number(results[0].lat);
        const lng = Number(results[0].lon);
        return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
      } catch {
        return null;
      }
    };

    const capture = (L: any) => {
      if ((window as any).__kaziMapCaptureInstalled) return;
      (window as any).__kaziMapCaptureInstalled = true;
      const originalMap = L.map;
      L.map = function (...args: any[]) {
        const map = originalMap.apply(this, args);
        (window as any).__kaziMap = map;
        return map;
      };
      const originalAddLayer = L.Map.prototype.addLayer;
      L.Map.prototype.addLayer = function (layer: any) {
        const result = originalAddLayer.call(this, layer);
        (window as any).__kaziMap = this;
        return result;
      };
      if (L.Map.addInitHook) {
        L.Map.addInitHook(function (this: any) {
          (window as any).__kaziMap = this;
        });
      }
      cleanupPatch = () => {
        try {
          L.map = originalMap;
          L.Map.prototype.addLayer = originalAddLayer;
          delete (window as any).__kaziMapCaptureInstalled;
        } catch {}
      };
    };

    const providerIcon = (L: any) =>
      L.divIcon({
        className: "kazi-live-provider-marker",
        html: `<div style="width:38px;height:38px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#16803d;border:3px solid white;box-shadow:0 3px 10px #0005;display:grid;place-items:center"><span style="transform:rotate(45deg);font-size:18px">👷</span></div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
      });

    const jobIcon = (L: any) =>
      L.divIcon({
        className: "kazi-live-job-marker",
        html: `<div style="width:38px;height:38px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#b91c1c;border:3px solid white;box-shadow:0 3px 10px #0005;display:grid;place-items:center"><span style="transform:rotate(45deg);font-size:18px">🛠️</span></div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
      });

    const getMode = () => {
      const active = document.querySelector<HTMLElement>(".main-tab.active");
      const text = (active?.textContent || "").toLowerCase();
      return text.includes("find jobs") ? "jobs" : "workers";
    };

    const clearLayer = () => {
      if (liveLayer) {
        liveLayer.clearLayers();
        liveLayer.remove();
        liveLayer = null;
      }
      lastSignature = "";
    };

    const render = async () => {
      if (stopped || rendering) return;
      const L = (window as any).L;
      const map = (window as any).__kaziMap;
      if (!L || !map) return;

      const mode = getMode();
      if (mode !== lastMode) {
        clearLayer();
        lastMode = mode;
      }

      if (!liveLayer) liveLayer = L.layerGroup().addTo(map);
      rendering = true;

      try {
        if (mode === "workers") {
          const { data: profiles, error } = await supabase
            .from("profiles")
            .select("id,full_name,area,road,county,latitude,longitude,is_active,role")
            .eq("role", "provider")
            .eq("is_active", true)
            .limit(100);

          if (error) {
            console.error("Could not load live providers", error);
            return;
          }

          const points: Array<LivePoint & { name: string }> = [];
          for (const p of profiles || []) {
            let coords: [number, number] | null = null;
            if (
              typeof p.latitude === "number" &&
              typeof p.longitude === "number" &&
              Number.isFinite(p.latitude) &&
              Number.isFinite(p.longitude)
            ) {
              coords = [p.latitude, p.longitude];
            } else {
              coords = await geocode(p.area || "", p.road || "", p.county || "Nairobi");
            }
            if (coords) {
              points.push({
                id: p.id,
                title: p.full_name || "Kazi za Kenya provider",
                name: p.full_name || "Kazi za Kenya provider",
                area: p.area || "",
                road: p.road || "",
                county: p.county || "Nairobi",
                latitude: coords[0],
                longitude: coords[1],
              });
            }
          }

          const signature = JSON.stringify(points.map((p) => [p.id, p.latitude, p.longitude]));
          if (signature === lastSignature) return;
          lastSignature = signature;
          liveLayer.clearLayers();

          for (const p of points) {
            const marker = L.marker([p.latitude, p.longitude], {
              icon: providerIcon(L),
              title: p.name,
              zIndexOffset: 1000,
            });
            marker.bindTooltip(
              `<b>${escapeHtml(p.name)}</b><br>📍 ${escapeHtml(p.area || p.county)}<br><small>Click to open profile</small>`,
              { direction: "top", offset: [0, -34] }
            );
            marker.on("click", () => {
              window.location.assign(`/profile/${p.id}`);
            });
            marker.addTo(liveLayer);
          }
        } else {
          const { data: jobs, error } = await supabase
            .from("jobs")
            .select("id,title,description,category,county,area,road,location_text,latitude,longitude,status,created_at,budget_min,budget_max")
            .eq("status", "available")
            .order("created_at", { ascending: false })
            .limit(100);

          if (error) {
            console.error("Could not load live jobs", error);
            return;
          }

          const points: Array<LivePoint & { budget: string }> = [];
          for (const j of jobs || []) {
            let coords: [number, number] | null = null;
            if (
              typeof j.latitude === "number" &&
              typeof j.longitude === "number" &&
              Number.isFinite(j.latitude) &&
              Number.isFinite(j.longitude)
            ) {
              coords = [j.latitude, j.longitude];
            } else {
              coords = await geocode(j.area || "", j.road || "", j.county || "Nairobi");
            }
            if (coords) {
              const budget =
                j.budget_min != null && j.budget_max != null
                  ? `KSh ${Number(j.budget_min).toLocaleString()} - ${Number(j.budget_max).toLocaleString()}`
                  : j.budget_min != null
                    ? `From KSh ${Number(j.budget_min).toLocaleString()}`
                    : "Budget not specified";
              points.push({
                id: j.id,
                title: j.title || "Job needed",
                description: j.description || "",
                area: j.area || "",
                road: j.road || j.location_text || "",
                county: j.county || "Nairobi",
                latitude: coords[0],
                longitude: coords[1],
                budget,
              });
            }
          }

          const signature = JSON.stringify(points.map((p) => [p.id, p.latitude, p.longitude]));
          if (signature === lastSignature) return;
          lastSignature = signature;
          liveLayer.clearLayers();

          for (const p of points) {
            const marker = L.marker([p.latitude, p.longitude], {
              icon: jobIcon(L),
              title: p.title,
              zIndexOffset: 1000,
            });
            marker.bindPopup(
              `<strong>${escapeHtml(p.title)}</strong><br>📍 ${escapeHtml(p.area || p.county)}${p.road ? ` · ${escapeHtml(p.road)}` : ""}<br>💰 ${escapeHtml(p.budget)}<br><small>${escapeHtml(p.description || "Job posted by a user")}</small>`,
              { maxWidth: 320 }
            );
            marker.addTo(liveLayer);
          }
        }
      } finally {
        rendering = false;
      }
    };

    function escapeHtml(value: string) {
      return String(value).replace(/[&<>'"]/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" } as Record<string, string>)[c] || c
      );
    }

    const start = () => {
      const L = (window as any).L;
      if (!L) {
        timer = window.setTimeout(start, 250);
        return;
      }
      capture(L);
      void render();
      timer = window.setInterval(() => void render(), 3000);
    };

    start();
    return () => {
      stopped = true;
      if (timer) window.clearInterval(timer);
      clearLayer();
      cleanupPatch?.();
    };
  }, []);

  return null;
}
