"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://pnqmqxeuzcodnxdixnvc.supabase.co", "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l");

const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80";
const NAIROBI = { lat: -1.2921, lng: 36.8219 };

export default function LiveProvidersEnhancer() {
  useEffect(() => {
    let stopped = false;
    let timer: number | null = null;
    let markerLayer: any = null;

    async function geocode(area: string, county: string | null) {
      try {
        const q = encodeURIComponent(`${area}, ${county || "Nairobi"}, Kenya`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${q}`, { headers: { Accept: "application/json" } });
        if (!response.ok) return NAIROBI;
        const results = await response.json();
        if (!results?.[0]) return NAIROBI;
        return { lat: Number(results[0].lat), lng: Number(results[0].lon) };
      } catch { return NAIROBI; }
    }

    function escapeHtml(value: string) {
      return value.replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c] || c));
    }

    async function loadProviders() {
      if (window.location.pathname !== "/") return;
      const panel = document.querySelector(".panel");
      const map = (window as any).L;
      const mapElement = document.querySelector("#map") as HTMLElement | null;
      if (!panel || !map || !mapElement) return;
      const leafletMap = (mapElement as any)._leaflet_map || (window as any).__kaziLeafletMap;
      // Find the Leaflet map instance created by the existing page.
      const mapContainer = mapElement as any;
      const instances = mapContainer._leaflet_id ? (map as any)._maps : null;
      void instances;

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id,full_name,phone,county,area,road,bio,latitude,longitude,profile_photo_url,verification_status,is_active,role,created_at")
        .eq("role", "provider")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error || !profiles || stopped) return;

      const ids = profiles.map((p) => p.id);
      const { data: services } = await supabase
        .from("services")
        .select("id,provider_id,title,description,price_from,price_to,availability_status,created_at")
        .in("provider_id", ids)
        .order("created_at", { ascending: false });
      if (stopped) return;

      const serviceMap = new Map<string, any>();
      (services || []).forEach((s) => { if (!serviceMap.has(s.provider_id)) serviceMap.set(s.provider_id, s); });

      const { data: photos } = await supabase
        .from("portfolio_items")
        .select("provider_id,photo_url,moderation_status,created_at")
        .in("provider_id", ids)
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: true });
      if (stopped) return;

      const photoMap = new Map<string, string[]>();
      (photos || []).forEach((p) => {
        if (!p.photo_url) return;
        const a = photoMap.get(p.provider_id) || [];
        a.push(p.photo_url);
        photoMap.set(p.provider_id, a);
      });

      const liveProviders = [] as any[];
      for (const p of profiles) {
        const s = serviceMap.get(p.id);
        if (!s) continue;
        let lat = Number(p.latitude);
        let lng = Number(p.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          const point = await geocode(p.area || "Nairobi", p.county);
          lat = point.lat; lng = point.lng;
        }
        liveProviders.push({ p, s, lat, lng, photos: photoMap.get(p.id) || [] });
      }
      if (stopped) return;

      // Make the existing Leaflet map instance discoverable without changing its UI.
      const mapRoot = document.querySelector("#map") as any;
      const existingMap = mapRoot?._leaflet_map_instance;
      const mapInstance = existingMap || leafletMap;
      if (mapInstance && map) {
        if (!markerLayer) markerLayer = map.layerGroup().addTo(mapInstance);
        markerLayer.clearLayers();
        liveProviders.forEach(({ p, s, lat, lng }) => {
          const icon = map.divIcon({ className: "", html: `<div class="pin" style="background:#16803d" title="${escapeHtml(p.full_name || "Provider")}"><span>🛠️</span></div>`, iconSize: [34, 34], iconAnchor: [17, 34] });
          const marker = map.marker([lat, lng], { icon }).addTo(markerLayer);
          marker.on("click", () => { window.location.href = `/profile/${p.id}`; });
        });
      }

      const heading = Array.from(panel.querySelectorAll(".section-title")).find((el) => (el.textContent || "").includes("People who can help around Nairobi"));
      if (!heading) {
        panel.querySelector(".live-providers-from-db")?.remove();
        return;
      }

      let live = panel.querySelector(".live-providers-from-db") as HTMLElement | null;
      if (!live) {
        live = document.createElement("div");
        live.className = "live-providers-from-db";
        heading.insertAdjacentElement("afterend", live);
      }

      live.innerHTML = liveProviders.map(({ p, s, photos }) => {
        const name = escapeHtml(p.full_name || "Kazi za Kenya provider");
        const service = escapeHtml(s.title || s.category || "Service provider");
        const area = escapeHtml(p.area || p.county || "Kenya");
        const road = escapeHtml(p.road || "");
        const photo = escapeHtml(p.profile_photo_url || photos[0] || FALLBACK_PHOTO);
        const price = s.price_from != null ? `From KSh ${Number(s.price_from).toLocaleString()}` : "Price on request";
        const status = String(s.availability_status || "available").toLowerCase() === "available" ? "AVAILABLE" : "TAKEN";
        return `<button type="button" class="provider live-provider-card" data-provider-id="${p.id}"><div class="provider-top"><div class="avatar photo-avatar"><img src="${photo}" alt="${name}"/></div><div class="provider-info"><div class="pname">${name}</div><div class="meta">${service}</div><div class="location">📍 ${area}${road ? ` · ${road}` : ""}</div></div><div class="status ${status === "AVAILABLE" ? "available" : "taken"}">● ${status}</div></div><div class="provider-bottom"><span>✓ Live profile</span><b>${escapeHtml(price)}</b></div><div class="trusted">✓ ${photos.length} proof-of-work photos · View profile</div></button>`;
      }).join("");

      live.querySelectorAll<HTMLElement>("[data-provider-id]").forEach((card) => {
        card.onclick = () => { const id = card.dataset.providerId; if (id) window.location.href = `/profile/${id}`; };
      });
    }

    void loadProviders();
    timer = window.setInterval(() => void loadProviders(), 5000);
    return () => { stopped = true; if (timer) window.clearInterval(timer); if (markerLayer) markerLayer.clearLayers(); };
  }, []);

  return null;
}
