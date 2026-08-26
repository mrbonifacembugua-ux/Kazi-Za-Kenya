"use client";

import { useLayoutEffect } from "react";

declare global {
  interface Window {
    L?: any;
    __kaziMap?: any;
    __kaziMapHooked?: boolean;
  }
}

/**
 * Keep a reference to the Leaflet map for the other map helpers.
 *
 * IMPORTANT: this component deliberately does NOT intercept worker-card
 * clicks. The worker card in app/page.tsx already has the real React
 * onClick that opens the profile. Intercepting that click was the reason
 * users had to click repeatedly before the profile appeared.
 */
export default function MapController() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const hookMap = () => {
      if (!window.L || window.__kaziMapHooked) return;

      const originalMap = window.L.map;
      if (typeof originalMap !== "function") return;

      window.__kaziMapHooked = true;
      window.L.map = function (...args: any[]) {
        const map = originalMap.apply(this, args);
        window.__kaziMap = map;
        return map;
      };
    };

    hookMap();

    const observer = new MutationObserver(hookMap);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    const timer = window.setInterval(() => {
      hookMap();
      if (window.__kaziMapHooked) window.clearInterval(timer);
    }, 50);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
