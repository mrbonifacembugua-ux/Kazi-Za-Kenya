"use client";

import { useEffect } from "react";

const fallback = { lat: -1.2921, lon: 36.8219, zoom: 12 };

function mapUrl(lat: number, lon: number, zoom = 13) {
  const span = zoom >= 14 ? 0.055 : zoom >= 13 ? 0.09 : 0.18;
  const bbox = `${lon - span},${lat - span},${lon + span},${lat + span}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lon}`;
}

export default function MapSearchEnhancer() {
  useEffect(() => {
    let cancelled = false;
    let attached = false;

    const applyMap = (lat: number, lon: number, zoom = 13) => {
      const iframe = document.querySelector<HTMLIFrameElement>(".map iframe");
      if (iframe) iframe.src = mapUrl(lat, lon, zoom);
    };

    const searchArea = async () => {
      const input = document.querySelector<HTMLInputElement>("#area");
      const value = input?.value.trim() || "Nairobi, Kenya";
      if (!value) return;
      if (value.toLowerCase() === "nairobi" || value.toLowerCase() === "nairobi, kenya") {
        applyMap(fallback.lat, fallback.lon, fallback.zoom);
        return;
      }
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ke&q=${encodeURIComponent(value)}`, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Location search failed");
        const results = await response.json();
        if (cancelled) return;
        if (!results.length) {
          alert(`We could not find "${value}" in Kenya. Try a Nairobi area such as Kilimani, Westlands or Lavington.`);
          return;
        }
        applyMap(Number(results[0].lat), Number(results[0].lon), 14);
      } catch {
        alert("Location search is temporarily unavailable. Please try again.");
      }
    };

    const attach = () => {
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".field button"));
      const areaInput = document.querySelector<HTMLInputElement>("#area");
      const searchButton = buttons.find((button) => button.textContent?.trim() === "Search");
      if (!areaInput || !searchButton) return;
      if (attached && searchButton.dataset.mapSearchAttached === "1") return;
      searchButton.dataset.mapSearchAttached = "1";
      searchButton.addEventListener("click", searchArea);
      attached = true;
      applyMap(fallback.lat, fallback.lon, fallback.zoom);
    };

    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });
    attach();
    return () => {
      cancelled = true;
      observer.disconnect();
      const button = Array.from(document.querySelectorAll<HTMLButtonElement>(".field button")).find((b) => b.dataset.mapSearchAttached === "1");
      if (button) button.removeEventListener("click", searchArea);
    };
  }, []);

  return null;
}
