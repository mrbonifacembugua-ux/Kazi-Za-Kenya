"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnyDayWorkStartupGuard() {
  const pathname = usePathname();
  const shieldRef = useRef<HTMLDivElement>(null);
  const isMarketplace = pathname === "/";

  useLayoutEffect(() => {
    if (!isMarketplace) return;

    let frameOne = 0;
    let frameTwo = 0;
    const safetyTimer = window.setTimeout(() => {
      if (shieldRef.current) shieldRef.current.style.display = "none";
    }, 1500);

    // The shield is part of the server-rendered first HTML, so it covers the
    // legacy/default marketplace before the browser can expose it. Two paint
    // frames give the existing marketplace CSS and country boot logic time to
    // take control; nothing in the marketplace itself is changed.
    frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(() => {
        if (shieldRef.current) shieldRef.current.style.display = "none";
      });
    });

    return () => {
      window.clearTimeout(safetyTimer);
      if (frameOne) window.cancelAnimationFrame(frameOne);
      if (frameTwo) window.cancelAnimationFrame(frameTwo);
    };
  }, [isMarketplace]);

  if (!isMarketplace) return null;

  return (
    <div
      ref={shieldRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "#ffffff",
        pointerEvents: "none",
      }}
    />
  );
}
