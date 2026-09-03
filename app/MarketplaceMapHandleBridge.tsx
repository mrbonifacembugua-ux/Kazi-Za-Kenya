"use client";

import { useLayoutEffect } from "react";

export default function MarketplaceMapHandleBridge() {
  useLayoutEffect(() => {
    const w = window as any;
    if (w.__anydayMapHandleBridgeInstalled) return;
    w.__anydayMapHandleBridgeInstalled = true;

    let currentLeaflet = w.L;

    const wrapLeaflet = (leaflet: any) => {
      if (!leaflet || typeof leaflet.map !== "function" || leaflet.map.__anydayHandleWrapped) {
        return leaflet;
      }

      const originalMap = leaflet.map;
      const wrappedMap = function (this: any, ...args: any[]) {
        const map = originalMap.apply(this, args);
        w.__kzkMarketplaceMap = map;
        try {
          if (map?._container) map._container._leaflet_map = map;
          window.dispatchEvent(new CustomEvent("kzk:leaflet-map-ready", { detail: map }));
        } catch {}
        return map;
      };

      wrappedMap.__anydayHandleWrapped = true;
      leaflet.map = wrappedMap;
      return leaflet;
    };

    if (currentLeaflet) currentLeaflet = wrapLeaflet(currentLeaflet);

    try {
      Object.defineProperty(w, "L", {
        configurable: true,
        get() {
          return currentLeaflet;
        },
        set(value) {
          currentLeaflet = wrapLeaflet(value);
        },
      });
    } catch {
      if (w.L) wrapLeaflet(w.L);
    }

    return () => {
      // Keep the map handle available for the life of this page. We intentionally
      // do not restore window.L here because the original marketplace owns Leaflet.
    };
  }, []);

  return null;
}
