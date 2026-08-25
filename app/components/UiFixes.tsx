"use client";

import { useEffect } from "react";

export default function UiFixes() {
  useEffect(() => {
    const wire = () => {
      const buttons = Array.from(document.querySelectorAll("button"));

      buttons.forEach((button) => {
        const text = (button.textContent || "").replace(/\s+/g, " ").trim();

        // Keep the duplicate top-right action hidden; the main choice below is the entry point.
        if (button.closest(".actions") && text === "I offer a service") {
          (button as HTMLElement).style.display = "none";
          return;
        }

        // Keep the old bottom posting button hidden so there is only one clear posting entry point.
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

    // The map can be created before the responsive layout has its final dimensions.
    // Target the actual .map element (the home page does not always give it id="map").
    const refreshMapSize = () => {
      const content = document.querySelector(".content") as HTMLElement | null;
      const map = (document.querySelector(".map") || document.getElementById("map")) as HTMLElement | null;
      if (!content || !map) return;

      const height = content.clientHeight;
      const width = content.clientWidth;
      if (height > 0 && width > 0) {
        map.style.width = "100%";
        map.style.height = `${height}px`;
        map.style.minHeight = "280px";

        const kaziMap = (window as any).__kaziMap;
        if (kaziMap && typeof kaziMap.invalidateSize === "function") {
          requestAnimationFrame(() => kaziMap.invalidateSize({ pan: false, animate: false }));
        }
        window.dispatchEvent(new Event("resize"));
      }
    };

    wire();
    const observer = new MutationObserver(wire);
    observer.observe(document.body, { childList: true, subtree: true });

    const resizeObserver = new ResizeObserver(refreshMapSize);
    const content = document.querySelector(".content");
    if (content) resizeObserver.observe(content);

    requestAnimationFrame(() => {
      refreshMapSize();
      requestAnimationFrame(refreshMapSize);
      setTimeout(refreshMapSize, 150);
      setTimeout(refreshMapSize, 500);
      setTimeout(refreshMapSize, 1000);
    });

    window.addEventListener("resize", refreshMapSize);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", refreshMapSize);
    };
  }, []);

  return null;
}
