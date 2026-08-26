"use client";

import { useEffect } from "react";

export default function ThreeClickWorkerNavigation() {
  useEffect(() => {
    const counts = new Map<string, number>();
    let lastKey = "";
    let resetTimer: number | undefined;

    const reset = () => {
      counts.clear();
      lastKey = "";
    };

    const handle = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const card = target.closest<HTMLElement>(".card:not(.jobCard)");
      const workerPin = target.closest<HTMLElement>(".pin.green");
      if (!card && !workerPin) return;

      const key = card
        ? `card:${(card.textContent || "").replace(/\s+/g, " ").trim().slice(0, 160)}`
        : `pin:${workerPin?.getAttribute("title") || workerPin?.textContent || "worker"}`;

      if (key !== lastKey) {
        counts.clear();
        lastKey = key;
      }

      const next = (counts.get(key) || 0) + 1;
      counts.set(key, next);

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(reset, 5000);

      if (next < 3) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        counts.set(key, 0);
      }
    };

    document.addEventListener("click", handle, true);

    return () => {
      document.removeEventListener("click", handle, true);
      window.clearTimeout(resetTimer);
    };
  }, []);

  return null;
}
