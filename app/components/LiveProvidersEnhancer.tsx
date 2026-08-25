"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://pnqmqxeuzcodnxdixnvc.supabase.co", "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l");
const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80";

export default function LiveProvidersEnhancer() {
  useEffect(() => {
    let stopped = false;
    let timer: number | undefined;
    let markerLayer: any = null;

    const known: Record<string, [number, number]> = {
      kilimani: [-1.2928, 36.7877], kileleshwa: [-1.2857, 36.777], lavington: [-1.2815, 36.769], westlands: [-1.2676, 36.807],
      "south b": [-1.3074, 36.831], "south c": [-1.305, 36.82], kasarani: [-1.2215, 36.897], eastleigh: [-1.275, 36.85],
      donholm: [-1.299, 36.891], embakasi: [-1.323, 36.902], langata: [-1.329, 36.781], "lang'ata": [-1.329, 36.781]
    };

    const escapeHtml = (value: string) => value.replace(/[&<>\"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c] || c));
    const geocode = async (area: string, road: string, county: string): Promise<[number, number] | null> => {
      const key = (area || "").toLowerCase().trim();
      if (known[key]) return known[key];
      try {
        const q = encodeURIComponent([road, area, county || "Nairobi", "Kenya"].filter(Boolean).join(", "));
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ke&q=${q}`, { headers: { Accept: "application/json" } });
        const a = await r.json();
        return a?.length ? [Number(a[0].lat), Number(a[0].lon)] : null;
      } catch { return null; }
    };

    const installCapture = (L: any) => {
      if ((window as any).__kaziProviderMapCapture) return;
      (window as any).__kaziProviderMapCapture = true;
      const originalMap = L.map;
      L.map = function (...args: any[]) { const map = originalMap.apply(this, args); (window as any).__kaziMap = map; return map; };
      const originalAddLayer = L.Map.prototype.addLayer;
      L.Map.prototype.addLayer = function (layer: any) { const result = originalAddLayer.call(this, layer); (window as any).__kaziMap = this; return result; };
    };

    async function render() {
      if (stopped || window.location.pathname !== "/") return;
      const L = (window as any).L;
      if (!L) { timer = window.setTimeout(render, 250); return; }
      installCapture(L);
      const map = (window as any).__kaziMap;
      if (!map) return;
      const active = document.querySelector<HTMLElement>(".main-tab.active")?.textContent || "";
      if (!active.includes("Find a worker")) { markerLayer?.clearLayers(); document.querySelector(".live-providers-from-db")?.remove(); return; }

      const { data: profiles, error } = await supabase.from("profiles").select("id,full_name,phone,area,road,county,latitude,longitude,is_active,role,profile_photo_url,verification_status,created_at").eq("role", "provider").eq("is_active", true).order("created_at", { ascending: false }).limit(100);
      if (error || !profiles || stopped) return;
      const ids = profiles.map((p: any) => p.id);
      const [{ data: services }, { data: photos }] = await Promise.all([
        supabase.from("services").select("id,provider_id,title,description,price_from,price_to,availability_status,created_at").in("provider_id", ids).order("created_at", { ascending: false }),
        supabase.from("portfolio_items").select("provider_id,photo_url,moderation_status,created_at").in("provider_id", ids).eq("moderation_status", "approved").order("created_at", { ascending: true })
      ]);
      if (stopped) return;
      const serviceMap = new Map<string, any>(); (services || []).forEach((s: any) => { if (!serviceMap.has(s.provider_id)) serviceMap.set(s.provider_id, s); });
      const photoMap = new Map<string, string[]>(); (photos || []).forEach((p: any) => { if (p.photo_url) photoMap.set(p.provider_id, [...(photoMap.get(p.provider_id) || []), p.photo_url]); });
      const live: any[] = [];
      for (const p of profiles as any[]) {
        const s = serviceMap.get(p.id); if (!s) continue;
        let coords: [number, number] | null = null;
        if (Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude))) coords = [Number(p.latitude), Number(p.longitude)];
        else coords = await geocode(p.area || "", p.road || "", p.county || "Nairobi");
        if (coords) live.push({ p, s, coords, photos: photoMap.get(p.id) || [] });
      }
      if (stopped) return;

      if (!markerLayer) markerLayer = L.layerGroup().addTo(map); markerLayer.clearLayers();
      const icon = L.divIcon({ className: "kazi-live-provider-marker", html: `<div style="width:38px;height:38px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#16803d;border:3px solid white;box-shadow:0 3px 10px #0005;display:grid;place-items:center"><span style="transform:rotate(45deg);font-size:18px">👷</span></div>`, iconSize: [38, 38], iconAnchor: [19, 38] });
      live.forEach(({ p, coords }) => {
        const marker = L.marker(coords, { icon, title: p.full_name || "Kazi za Kenya provider", zIndexOffset: 1000 });
        marker.bindTooltip(`<b>${escapeHtml(p.full_name || "Kazi za Kenya provider")}</b><br>📍 ${escapeHtml(p.area || p.county || "Kenya")}<br><small>Click to open profile</small>`, { direction: "top", offset: [0, -34] });
        marker.on("click", () => { window.location.href = `/profile/${p.id}`; }); marker.addTo(markerLayer);
      });

      const panel = document.querySelector(".panel");
      const heading = Array.from(panel?.querySelectorAll(".section-title") || []).find((el) => (el.textContent || "").includes("People who can help around Nairobi"));
      if (!panel || !heading) return;
      let box = panel.querySelector(".live-providers-from-db") as HTMLElement | null;
      if (!box) { box = document.createElement("div"); box.className = "live-providers-from-db"; heading.insertAdjacentElement("afterend", box); }
      box.innerHTML = live.map(({ p, s, photos }) => {
        const name = escapeHtml(p.full_name || "Kazi za Kenya provider"), service = escapeHtml(s.title || "Service provider"), area = escapeHtml(p.area || p.county || "Kenya"), road = escapeHtml(p.road || ""), photo = escapeHtml(p.profile_photo_url || photos[0] || FALLBACK_PHOTO);
        const price = s.price_from != null ? `From KSh ${Number(s.price_from).toLocaleString()}` : "Price on request";
        const status = String(s.availability_status || "available").toLowerCase() === "available" ? "AVAILABLE" : "TAKEN";
        return `<button type="button" class="provider live-provider-card" data-provider-id="${p.id}"><div class="provider-top"><div class="avatar photo-avatar"><img src="${photo}" alt="${name}"/></div><div class="provider-info"><div class="pname">${name}</div><div class="meta">${service}</div><div class="location">📍 ${area}${road ? ` · ${road}` : ""}</div></div><div class="status ${status === "AVAILABLE" ? "available" : "taken"}">● ${status}</div></div><div class="provider-bottom"><span>✓ Live profile</span><b>${escapeHtml(price)}</b></div><div class="trusted">✓ ${photos.length} proof-of-work photos · View profile</div></button>`;
      }).join("");
      box.querySelectorAll<HTMLElement>("[data-provider-id]").forEach(card => { card.onclick = () => { const id = card.dataset.providerId; if (id) window.location.href = `/profile/${id}`; }; });
    }

    void render(); timer = window.setInterval(() => void render(), 3000);
    return () => { stopped = true; if (timer) window.clearInterval(timer); markerLayer?.clearLayers(); };
  }, []);
  return null;
}
