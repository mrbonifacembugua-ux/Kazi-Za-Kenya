"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    L?: any;
    __kaziMap?: any;
    __kaziMapHooked?: boolean;
  }
}

type Point = { id: string; name: string; lat: number; lng: number; kind: "worker" | "job"; emoji: string; service: string };

const workers: Point[] = [
  { id: "john", name: "John Mwangi", lat: -1.2921, lng: 36.7854, kind: "worker", emoji: "👤", service: "TV & electronics repair" },
  { id: "mary", name: "Mary Wanjiku", lat: -1.2874, lng: 36.7811, kind: "worker", emoji: "👤", service: "House cleaning & laundry" },
  { id: "peter", name: "Peter Otieno", lat: -1.2778, lng: 36.7759, kind: "worker", emoji: "👤", service: "Plumbing & repairs" },
  { id: "david", name: "David Kamau", lat: -1.3098, lng: 36.8281, kind: "worker", emoji: "👤", service: "Moving & house help" },
  { id: "grace", name: "Grace Akinyi", lat: -1.2646, lng: 36.8042, kind: "worker", emoji: "👤", service: "Electrical services" },
];

const jobs: Point[] = [
  { id: "j1", name: "Kitchen sink is leaking", lat: -1.2925, lng: 36.785, kind: "job", emoji: "🔎", service: "Plumbing" },
  { id: "j2", name: "TV has no picture", lat: -1.2768, lng: 36.778, kind: "job", emoji: "🔎", service: "TV repair" },
  { id: "j3", name: "2-bedroom apartment cleaning", lat: -1.276, lng: 36.775, kind: "job", emoji: "🔎", service: "House cleaning" },
];

function markerIcon(L: any, point: Point) {
  const worker = point.kind === "worker";
  const background = worker ? "#0b7a3b" : "#d97706";
  const border = worker ? "#ffffff" : "#fff7ed";
  return L.divIcon({
    className: "kazi-custom-marker",
    html: `<div style="width:42px;height:42px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${background};border:4px solid ${border};box-shadow:0 3px 10px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:19px">${point.emoji}</span></div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
}

export default function MapController() {
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const clickCounts = new Map<string, number>();

    const install = () => {
      if (cancelled || !window.L) return;
      const L = window.L;

      if (!window.__kaziMapHooked) {
        window.__kaziMapHooked = true;
        const originalMap = L.map;
        L.map = function (...args: any[]) {
          const map = originalMap.apply(this, args);
          window.__kaziMap = map;
          return map;
        };
      }

      const draw = () => {
        const map = window.__kaziMap;
        if (!map || !document.getElementById("kazi-map")) return false;
        const layer = L.layerGroup().addTo(map);
        [...workers, ...jobs].forEach(point => {
          const marker = L.marker([point.lat, point.lng], {
            icon: markerIcon(L, point),
            zIndexOffset: point.kind === "job" ? 2200 : 2100,
          }).addTo(layer);
          marker.bindTooltip(`<b>${point.name}</b><br>${point.service}`, { direction: "top", offset: [0, -34] });
          marker.on("click", () => {
            map.setView([point.lat, point.lng], Math.max(map.getZoom(), 16), { animate: true });
          });
        });
        window.setTimeout(() => map.invalidateSize(), 150);
        return true;
      };

      if (draw()) return;
      timer = window.setInterval(() => {
        if (draw() && timer) {
          window.clearInterval(timer);
          timer = undefined;
        }
      }, 150);
    };

    const loadLeaflet = () => {
      if (window.L) {
        install();
        return;
      }
      const existing = document.querySelector("script[data-kazi-map]") as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", install, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.dataset.kaziMap = "1";
      script.onload = install;
      document.body.appendChild(script);
    };

    loadLeaflet();

    const onCardClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest("button.person") as HTMLButtonElement | null;
      if (!card) return;
      const name = card.innerText.split("\n")[0].trim();
      const point = workers.find(p => p.name === name);
      if (!point || !window.__kaziMap) return;

      const count = (clickCounts.get(point.id) || 0) + 1;
      if (count < 3) {
        event.preventDefault();
        event.stopPropagation();
        if (count === 1) {
          window.__kaziMap.setView([point.lat, point.lng], 15, { animate: true });
        } else {
          window.__kaziMap.setView([point.lat, point.lng], 18, { animate: true });
        }
        clickCounts.set(point.id, count);
        window.setTimeout(() => {
          if (clickCounts.get(point.id) === count) clickCounts.delete(point.id);
        }, 5000);
      } else {
        clickCounts.delete(point.id);
      }
    };

    document.addEventListener("click", onCardClick, true);
    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      document.removeEventListener("click", onCardClick, true);
    };
  }, []);

  return null;
}
