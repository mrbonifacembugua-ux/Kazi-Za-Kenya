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

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      let current = walker.nextNode();

      while (current) {
        const parent = current.parentElement;
        if (
          parent &&
          !["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName) &&
          current.textContent?.includes("Kazi za Kenya")
        ) {
          textNodes.push(current as Text);
        }
        current = walker.nextNode();
      }

      textNodes.forEach((node) => {
        node.textContent = node.textContent?.replaceAll("Kazi za Kenya", "AnyDayWork") ?? "";
      });
    };

    // Run before paint so the legacy name is never visually exposed during
    // client-side navigation from the country landing pages.
    applyBranding();
    const observer = new MutationObserver(applyBranding);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
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

      .adw-any {
        color: #111111 !important;
      }

      .adw-day {
        color: #e30613 !important;
      }

      .adw-work {
        color: #00843d !important;
      }
    `}</style>
  );
}
