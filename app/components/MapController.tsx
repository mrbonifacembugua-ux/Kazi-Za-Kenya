"use client";

import { useLayoutEffect } from "react";

declare global {
  interface Window {
    L?: any;
    __kaziMap?: any;
    __kaziMapHooked?: boolean;
  }
}

type WorkerPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

const workers: WorkerPoint[] = [
  { id: "john", name: "John Mwangi", lat: -1.2921, lng: 36.7854 },
  { id: "mary", name: "Mary Wanjiku", lat: -1.2874, lng: 36.7811 },
  { id: "peter", name: "Peter Otieno", lat: -1.2778, lng: 36.7759 },
  { id: "david", name: "David Kamau", lat: -1.3098, lng: 36.8281 },
  { id: "grace", name: "Grace Akinyi", lat: -1.2646, lng: 36.8042 },
];

function hookLeafletMap() {
  if (typeof window === "undefined" || !window.L || window.__kaziMapHooked) return;

  const L = window.L;
  const originalMap = L.map;
  if (typeof originalMap !== "function") return;

  window.__kaziMapHooked = true;
  L.map = function (...args: any[]) {
    const map = originalMap.apply(this, args);
    window.__kaziMap = map;
    return map;
  };
}

function installHookWhenLeafletAppears() {
  hookLeafletMap();
  if (typeof document === "undefined") return () => {};

  const observer = new MutationObserver(() => hookLeafletMap());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const timer = window.setInterval(() => {
    hookLeafletMap();
    if (window.__kaziMapHooked) {
      window.clearInterval(timer);
    }
  }, 50);

  return () => {
    observer.disconnect();
    window.clearInterval(timer);
  };
}

export default function MapController() {
  useLayoutEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const stopHookWatcher = installHookWhenLeafletAppears();
    const clickCounts = new Map<string, number>();
    const resetTimers = new Map<string, number>();
    let disposed = false;

    const resetCount = (id: string) => {
      clickCounts.delete(id);
      const timer = resetTimers.get(id);
      if (timer) window.clearTimeout(timer);
      resetTimers.delete(id);
    };

    const armReset = (id: string) => {
      const oldTimer = resetTimers.get(id);
      if (oldTimer) window.clearTimeout(oldTimer);
      resetTimers.set(
        id,
        window.setTimeout(() => {
          clickCounts.delete(id);
          resetTimers.delete(id);
        }, 5000)
      );
    };

    const onCardClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest("button.person") as HTMLButtonElement | null;
      const map = window.__kaziMap;
      if (!card || !map || disposed) return;

      const name = card.querySelector(".person-main b")?.textContent?.trim() || "";
      const point = workers.find((worker) => worker.name === name);
      if (!point) return;

      const count = (clickCounts.get(point.id) || 0) + 1;

      if (count < 3) {
        event.preventDefault();
        event.stopImmediatePropagation();
        clickCounts.set(point.id, count);
        armReset(point.id);

        const zoom = count === 1 ? 15 : 18;
        map.setView([point.lat, point.lng], zoom, { animate: true });
        return;
      }

      resetCount(point.id);
      event.preventDefault();
      event.stopImmediatePropagation();

      // Let the page's existing React onClick open the worker profile.
      document.removeEventListener("click", onCardClick, true);
      card.click();
      window.setTimeout(() => {
        if (!disposed) document.addEventListener("click", onCardClick, true);
      }, 0);
    };

    document.addEventListener("click", onCardClick, true);

    return () => {
      disposed = true;
      stopHookWatcher();
      resetTimers.forEach((timer) => window.clearTimeout(timer));
      document.removeEventListener("click", onCardClick, true);
    };
  }, []);

  return null;
}
