"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AnyDayWorkStartupGuard() {
  const pathname = usePathname();
  const [ready, setReady] = useState(pathname !== "/");

  useLayoutEffect(() => {
    if (pathname !== "/") {
      setReady(true);
      return;
    }

    // This component persists while navigating between routes. When a user
    // enters the marketplace from a country landing page, force the AnyDayWork
    // guard back on before the browser paints the legacy marketplace markup.
    setReady(false);

    let stopped = false;
    let settleTimer: number | null = null;

    const finish = () => {
      if (stopped) return;
      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (!stopped) setReady(true);
      }, 90);
    };

    const isReady = () => {
      const branded = document.querySelector('[data-anydaywork-branded="true"]');
      const marketplace =
        document.getElementById("anyday-demo-workers-mount") ||
        document.getElementById("anyday-demo-jobs-mount") ||
        document.getElementById("kzk-live-workers-mount") ||
        document.getElementById("kzk-live-jobs-mount");
      const map = document.querySelector(".leaflet-container");
      return Boolean(branded && marketplace && map);
    };

    if (isReady()) {
      finish();
    } else {
      const observer = new MutationObserver(() => {
        if (!isReady()) return;
        observer.disconnect();
        finish();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

      const fallback = window.setTimeout(() => {
        observer.disconnect();
        finish();
      }, 2500);

      return () => {
        stopped = true;
        observer.disconnect();
        window.clearTimeout(fallback);
        if (settleTimer) window.clearTimeout(settleTimer);
      };
    }

    return () => {
      stopped = true;
      if (settleTimer) window.clearTimeout(settleTimer);
    };
  }, [pathname]);

  if (pathname !== "/" || ready) return null;

  return (
    <div className="adw-startup-guard" role="status" aria-label="Loading AnyDayWork">
      <div className="adw-startup-brand" aria-hidden="true">
        <span className="adw-startup-any">Any</span>
        <span className="adw-startup-day">Day</span>
        <span className="adw-startup-work">Work</span>
      </div>
      <div className="adw-startup-tagline">Find work near you. Any day.</div>
      <style jsx global>{`
        .adw-startup-guard {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #ffffff;
          color: #111111;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .adw-startup-brand {
          display: inline-flex;
          align-items: baseline;
          font-size: clamp(30px, 9vw, 46px);
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.045em;
        }
        .adw-startup-any { color: #111111; }
        .adw-startup-day { color: #e30613; }
        .adw-startup-work { color: #00843d; }
        .adw-startup-tagline {
          font-size: 14px;
          font-weight: 600;
          color: #5f6b63;
        }
      `}</style>
    </div>
  );
}
