"use client";

import { useEffect } from "react";

export default function UiFixes() {
  useEffect(() => {
    let stopped = false;

    const ensureMap = () => {
      if (stopped || window.location.pathname !== "/") return;

      const content = document.querySelector(".content") as HTMLElement | null;
      const mapElement = document.querySelector("#map, .map") as HTMLElement | null;
      if (!content || !mapElement) return;

      const contentHeight = content.clientHeight || window.innerHeight - 68;
      mapElement.style.display = "block";
      mapElement.style.visibility = "visible";
      mapElement.style.opacity = "1";
      mapElement.style.width = "100%";
      mapElement.style.height = `${Math.max(contentHeight, 280)}px`;
      mapElement.style.minHeight = "280px";

      const L = (window as any).L;
      if (!L) return;

      const existingMap = (window as any).__kaziMap;
      if (existingMap) {
        requestAnimationFrame(() => existingMap.invalidateSize({ pan: false, animate: false }));
        return;
      }

      if ((mapElement as any)._leaflet_id) return;

      try {
        const map = L.map(mapElement).setView([-1.2921, 36.8219], 12);
        L.control.zoom({ position: "bottomright" }).addTo(map);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);
        (window as any).__kaziMap = map;
        requestAnimationFrame(() => map.invalidateSize({ pan: false, animate: false }));
      } catch (error) {
        console.error("Kazi map fallback initialization failed:", error);
      }
    };

    const wireButtons = () => {
      document.querySelectorAll("button").forEach((button) => {
        const text = (button.textContent || "").replace(/\s+/g, " ").trim();
        const isNeed = text === "➕ I need something" || text === "I need something";
        const isOffer = text === "🛠️ I offer a service" || text === "I offer a service";

        if ((isNeed || isOffer) && !(button as HTMLElement).dataset.kzWired) {
          (button as HTMLElement).dataset.kzWired = "1";
          (button as HTMLButtonElement).onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            window.location.assign(isNeed ? "/need-service" : "/offer-service");
          };
        }
      });
    };

    const run = () => {
      ensureMap();
      wireButtons();
    };

    run();
    const observer = new MutationObserver(run);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", run);

    const timers = [100, 300, 700, 1200, 2000].map((delay) => window.setTimeout(run, delay));

    return () => {
      stopped = true;
      observer.disconnect();
      window.removeEventListener("resize", run);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  return null;
}
