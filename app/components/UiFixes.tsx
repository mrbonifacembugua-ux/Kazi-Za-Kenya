"use client";

import { useEffect } from "react";

export default function UiFixes() {
  useEffect(() => {
    const wire = () => {
      document.querySelectorAll("button").forEach((button) => {
        const text = (button.textContent || "").replace(/\s+/g, " ").trim();

        if (button.closest(".actions") && text === "I offer a service") {
          (button as HTMLElement).style.display = "none";
          return;
        }
        if (button.classList.contains("post-button")) {
          (button as HTMLElement).style.display = "none";
          return;
        }

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

    // Keep the Leaflet map visible and correctly sized on the very first paint.
    // Some browsers calculate the grid before Leaflet has measured its container;
    // clicking the map used to trigger a resize and make it appear. We now force
    // the container to have real dimensions and repeatedly invalidate Leaflet's size.
    const refreshMapSize = () => {
      const content = document.querySelector(".content") as HTMLElement | null;
      const map = (document.querySelector(".map") || document.getElementById("map")) as HTMLElement | null;
      if (!map) return;

      map.style.display = "block";
      map.style.visibility = "visible";
      map.style.opacity = "1";
      map.style.width = "100%";
      map.style.position = "relative";
      map.style.minHeight = window.innerWidth <= 520 ? "240px" : "280px";

      if (content) {
        const height = content.clientHeight;
        if (height > 0) map.style.height = window.innerWidth <= 900 ? "45vh" : `${height}px`;
      }

      const kaziMap = (window as any).__kaziMap;
      if (kaziMap && typeof kaziMap.invalidateSize === "function") {
        requestAnimationFrame(() => kaziMap.invalidateSize({ pan: false, animate: false }));
      }

      // Leaflet's map instance is also sometimes exposed on the container by the
      // original page. Use it if present, without assuming it exists.
      const possibleMap = (map as any)._leafletMap || (map as any).__leafletMap;
      if (possibleMap && typeof possibleMap.invalidateSize === "function") {
        requestAnimationFrame(() => possibleMap.invalidateSize({ pan: false, animate: false }));
      }
    };

    wire();
    const observer = new MutationObserver(() => {
      wire();
      refreshMapSize();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const content = document.querySelector(".content");
    const map = document.querySelector(".map") || document.getElementById("map");
    const resizeObserver = new ResizeObserver(refreshMapSize);
    if (content) resizeObserver.observe(content);
    if (map) resizeObserver.observe(map);

    refreshMapSize();
    requestAnimationFrame(refreshMapSize);
    requestAnimationFrame(() => requestAnimationFrame(refreshMapSize));
    [100, 250, 500, 1000, 2000].forEach((delay) => setTimeout(refreshMapSize, delay));

    window.addEventListener("resize", refreshMapSize);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", refreshMapSize);
    };
  }, []);

  return null;
}
