"use client";

import { useLayoutEffect } from "react";

const BRAND_HTML =
  '<span class="adw-any">Any</span><span class="adw-day">Day</span><span class="adw-work">Work</span>';

export default function AnyDayWorkBranding() {
  useLayoutEffect(() => {
    document.title = "AnyDayWork — Find work near you. Any day.";

    const applyBranding = () => {
      document.querySelectorAll<HTMLElement>(".brand, .mobileBrandName").forEach((node) => {
        if (node.dataset.anydayworkBranded === "true") return;
        node.innerHTML = BRAND_HTML;
        node.dataset.anydayworkBranded = "true";
        node.setAttribute("aria-label", "AnyDayWork");
      });

      document.querySelectorAll<HTMLElement>(".mobileTagline").forEach((node) => {
        if (node.textContent !== "Find work near you. Any day.") {
          node.textContent = "Find work near you. Any day.";
        }
      });

      document.querySelectorAll<HTMLElement>("[aria-label]").forEach((node) => {
        const label = node.getAttribute("aria-label");
        if (label?.includes("Kazi za Kenya")) {
          node.setAttribute("aria-label", label.replaceAll("Kazi za Kenya", "AnyDayWork"));
        }
      });
    };

    applyBranding();

    let queued = 0;
    const observer = new MutationObserver((mutations) => {
      const relevant = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some((node) => {
          if (!(node instanceof HTMLElement)) return false;
          return node.matches?.(".brand,.mobileBrandName,.mobileTagline") ||
            !!node.querySelector?.(".brand,.mobileBrandName,.mobileTagline");
        })
      );
      if (!relevant) return;
      window.clearTimeout(queued);
      queued = window.setTimeout(applyBranding, 0);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(queued);
      observer.disconnect();
    };
  }, []);

  return (
    <style jsx global>{`
      .brand[data-anydaywork-branded="true"],
      .mobileBrandName[data-anydaywork-branded="true"] {
        display: inline-flex !important;
        align-items: baseline;
        gap: 0 !important;
        letter-spacing: -0.035em;
        font-weight: 800 !important;
        white-space: nowrap;
      }

      .adw-any { color: #111111 !important; }
      .adw-day { color: #e30613 !important; }
      .adw-work { color: #00843d !important; }
    `}</style>
  );
}
