"use client";

import { useEffect } from "react";

const fallback = { lat: -1.2921, lon: 36.8219, zoom: 12 };

const providerLocations: Record<string, [number, number]> = {
  "John Mwangi": [-1.2928, 36.7877],
  "Mary Wanjiku": [-1.2857, 36.7770],
  "Peter Otieno": [-1.2815, 36.7690],
  "David Kamau": [-1.3074, 36.8310],
  "Grace Akinyi": [-1.2676, 36.8070],
};

const jobLocations: Record<string, [number, number]> = {
  "Kitchen sink is leaking": [-1.2940, 36.7888],
  "TV turns on but has no picture": [-1.2798, 36.7730],
  "Deep cleaning for a 2-bedroom apartment": [-1.2865, 36.7815],
  "Install additional wall sockets": [-1.2670, 36.8105],
};

function loadLeaflet() {
  return new Promise<any>((resolve, reject) => {
    const w = window as any;
    if (w.L) {
      resolve(w.L);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-kazi-leaflet="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).L), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.dataset.kaziLeaflet = "1";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.dataset.kaziLeaflet = "1";
    script.onload = () => resolve((window as any).L);
    script.onerror = () => reject(new Error("Leaflet failed to load"));
    document.head.appendChild(script);
  });
}

export default function MapSearchEnhancer() {
  useEffect(() => {
    let cancelled = false;
    let map: any = null;
    let markerLayer: any = null;
    let mapElement: HTMLDivElement | null = null;
    let observer: MutationObserver | null = null;
    let lastView = "";
    let activeTarget = "";
    let clickCount = 0;

    const markerIcon = (L: any, color: string, symbol: string) =>
      L.divIcon({
        className: "kazi-map-marker-wrap",
        html: `<div class="kazi-map-marker" style="background:${color};border-color:#fff;box-shadow:0 2px 10px #0006"><span>${symbol}</span></div>`,
        iconSize: [38, 46],
        iconAnchor: [19, 42],
      });

    const addMapStyles = () => {
      if (document.getElementById("kazi-interactive-map-style")) return;
      const style = document.createElement("style");
      style.id = "kazi-interactive-map-style";
      style.textContent = `
        .kazi-map-marker-wrap{background:transparent!important;border:0!important}
        .kazi-map-marker{width:38px;height:38px;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center}
        .kazi-map-marker span{transform:rotate(45deg);font-size:17px;line-height:1}
        .kazi-map-legend{position:absolute;right:18px;bottom:18px;z-index:1000;background:#fff;border:1px solid #dce4dc;border-radius:12px;padding:10px 12px;box-shadow:0 4px 18px #0002;font:700 11px Inter,system-ui,sans-serif;color:#314038}
        .kazi-map-legend-row{display:flex;align-items:center;gap:7px;margin:4px 0}
        .kazi-map-dot{width:11px;height:11px;border-radius:50%;display:inline-block}
        .kazi-map-help{font-weight:600;color:#718078;margin-top:7px;padding-top:7px;border-top:1px solid #edf0ed}
      `;
      document.head.appendChild(style);
    };

    const installMap = async () => {
      const host = document.querySelector<HTMLElement>(".map");
      if (!host || cancelled || map) return;

      const oldIframe = host.querySelector("iframe");
      mapElement = document.createElement("div");
      mapElement.id = "kazi-interactive-map";
      mapElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
      if (oldIframe) oldIframe.remove();
      host.appendChild(mapElement);

      addMapStyles();
      const L = await loadLeaflet();
      if (cancelled || !mapElement) return;

      map = L.map(mapElement, { zoomControl: false, scrollWheelZoom: true }).setView([fallback.lat, fallback.lon], fallback.zoom);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      markerLayer = L.layerGroup().addTo(map);

      const legend = document.createElement("div");
      legend.className = "kazi-map-legend";
      legend.innerHTML = `
        <div><b>Kazi za Kenya</b></div>
        <div class="kazi-map-legend-row"><span class="kazi-map-dot" style="background:#16803d"></span> Offering a service</div>
        <div class="kazi-map-legend-row"><span class="kazi-map-dot" style="background:#bb0000"></span> Looking for a worker</div>
        <div class="kazi-map-legend-row"><span class="kazi-map-dot" style="background:#d97706"></span> Service currently taken</div>
        <div class="kazi-map-help">1st click: locate · 2nd: zoom · 3rd: open profile</div>
      `;
      host.appendChild(legend);

      refreshMarkers();
      attachSearch();
      attachCardClicks();
    };

    const locateArea = async (value: string) => {
      if (!map) return;
      const cleaned = value.trim() || "Nairobi, Kenya";
      if (/^nairobi(?:,\s*kenya)?$/i.test(cleaned)) {
        map.flyTo([fallback.lat, fallback.lon], 12, { duration: 0.8 });
        return;
      }

      const known: Record<string, [number, number]> = {
        kilimani: [-1.2928, 36.7877],
        kileleshwa: [-1.2857, 36.7770],
        lavington: [-1.2815, 36.7690],
        "south b": [-1.3074, 36.8310],
        westlands: [-1.2676, 36.8070],
        "ngong road": [-1.2985, 36.7845],
        "yaya centre": [-1.2922, 36.7872],
        "valley arcade": [-1.2795, 36.7745],
        "sarit centre": [-1.2638, 36.8040],
      };
      const key = cleaned.toLowerCase().replace(/,\s*kenya$/i, "").trim();
      if (known[key]) {
        map.flyTo(known[key], 15, { duration: 0.9 });
        return;
      }

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ke&q=${encodeURIComponent(cleaned)}`, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Location search failed");
        const results = await response.json();
        if (cancelled) return;
        if (!results.length) {
          alert(`We could not find "${cleaned}" in Kenya. Try Kilimani, Westlands, Kileleshwa or Lavington.`);
          return;
        }
        map.flyTo([Number(results[0].lat), Number(results[0].lon)], 15, { duration: 0.9 });
      } catch {
        alert("Location search is temporarily unavailable. Please try again.");
      }
    };

    const attachSearch = () => {
      const input = document.querySelector<HTMLInputElement>("#area");
      const button = Array.from(document.querySelectorAll<HTMLButtonElement>(".field button")).find((b) => b.textContent?.trim() === "Search");
      if (!input || !button || button.dataset.kaziMapSearchAttached === "1") return;
      const handler = () => locateArea(input.value);
      button.dataset.kaziMapSearchAttached = "1";
      button.addEventListener("click", handler);
      (button as any).__kaziSearchHandler = handler;
    };

    const getView = () => {
      const active = document.querySelector<HTMLElement>(".tab.active");
      return active?.textContent?.includes("Find jobs") ? "jobs" : "workers";
    };

    const openCard = (name: string, type: "provider" | "job") => {
      const selector = type === "provider" ? ".provider" : ".job-card";
      const cards = Array.from(document.querySelectorAll<HTMLElement>(selector));
      const card = cards.find((el) => el.textContent?.includes(name));
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        (card as HTMLButtonElement).click();
      }
    };

    const handleTargetClick = (key: string, lat: number, lon: number, open: () => void) => {
      if (activeTarget !== key) {
        activeTarget = key;
        clickCount = 0;
      }
      clickCount += 1;
      if (clickCount === 1) {
        map.flyTo([lat, lon], 15, { duration: 0.8 });
      } else if (clickCount === 2) {
        map.flyTo([lat, lon], 17, { duration: 0.8 });
      } else {
        open();
        clickCount = 0;
      }
    };

    const refreshMarkers = () => {
      if (!map || !markerLayer) return;
      const L = (window as any).L;
      markerLayer.clearLayers();
      const view = getView();
      lastView = view;

      if (view === "workers") {
        const providerCards = Array.from(document.querySelectorAll<HTMLElement>(".provider"));
        providerCards.forEach((card) => {
          const text = card.textContent || "";
          const name = Object.keys(providerLocations).find((n) => text.includes(n));
          if (!name) return;
          const coords = providerLocations[name];
          const taken = /TAKEN/.test(text);
          const color = taken ? "#d97706" : "#16803d";
          const icon = markerIcon(L, color, "👷");
          const marker = L.marker(coords, { icon, title: name });
          marker.on("click", () => handleTargetClick(`provider:${name}`, coords[0], coords[1], () => openCard(name, "provider")));
          marker.bindTooltip(`<b>${name}</b><br>${text.match(/TV|House|Plumbing|Moving|Electrical/)?.[0] || "Service"}`, { direction: "top", offset: [0, -32] });
          marker.addTo(markerLayer);
        });
      } else {
        const jobCards = Array.from(document.querySelectorAll<HTMLElement>(".job-card"));
        jobCards.forEach((card) => {
          const text = card.textContent || "";
          const title = Object.keys(jobLocations).find((n) => text.includes(n));
          if (!title) return;
          const coords = jobLocations[title];
          const marker = L.marker(coords, { icon: markerIcon(L, "#bb0000", "🛠️"), title });
          marker.on("click", () => handleTargetClick(`job:${title}`, coords[0], coords[1], () => openCard(title, "job")));
          marker.bindTooltip(`<b>${title}</b><br>Looking for a worker`, { direction: "top", offset: [0, -32] });
          marker.addTo(markerLayer);
        });
      }
    };

    const attachCardClicks = () => {
      const panel = document.querySelector<HTMLElement>(".panel");
      if (!panel || panel.dataset.kaziCardClicksAttached === "1") return;
      panel.dataset.kaziCardClicksAttached = "1";

      panel.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const card = target.closest<HTMLElement>(".provider, .job-card");
        if (!card) return;
        const isProvider = card.classList.contains("provider");
        const text = card.textContent || "";
        const names = isProvider ? Object.keys(providerLocations) : Object.keys(jobLocations);
        const keyName = names.find((name) => text.includes(name));
        if (!keyName) return;
        const coords = isProvider ? providerLocations[keyName] : jobLocations[keyName];
        const key = `${isProvider ? "provider" : "job"}:${keyName}`;
        if (activeTarget !== key) {
          activeTarget = key;
          clickCount = 0;
        }
        clickCount += 1;
        if (clickCount < 3) {
          event.preventDefault();
          event.stopPropagation();
          map.flyTo(coords, clickCount === 1 ? 15 : 17, { duration: 0.8 });
        } else {
          clickCount = 0;
        }
      }, true);
    };

    const watchView = () => {
      if (!map) return;
      const view = getView();
      if (view !== lastView) {
        activeTarget = "";
        clickCount = 0;
        refreshMarkers();
      }
    };

    const start = async () => {
      try {
        await installMap();
        if (cancelled) return;
        observer = new MutationObserver(() => {
          attachSearch();
          attachCardClicks();
          watchView();
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
        window.setInterval(watchView, 700);
      } catch (error) {
        console.error("Kazi za Kenya map could not start", error);
      }
    };

    start();

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (map) map.remove();
      map = null;
    };
  }, []);

  return null;
}
