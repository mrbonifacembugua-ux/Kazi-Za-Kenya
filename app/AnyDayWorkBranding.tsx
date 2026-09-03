"use client";

import { useLayoutEffect } from "react";

const BRAND_HTML =
  '<span class="adw-any">Any</span><span class="adw-day">Day</span><span class="adw-work">Work</span>';

export default function AnyDayWorkBranding() {
  useLayoutEffect(() => {
    document.title = "AnyDayWork — Find work near you. Any day.";

    const brandNode = (node: HTMLElement) => {
      if (node.dataset.anydayworkBranded === "true") return;
      node.innerHTML = BRAND_HTML;
      node.dataset.anydayworkBranded = "true";
      node.setAttribute("aria-label", "AnyDayWork");
    };

    const updateNode = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(".brand, .mobileBrandName").forEach(brandNode);

      root.querySelectorAll<HTMLElement>(".mobileTagline").forEach((node) => {
        if (node.textContent !== "Find work near you. Any day.") node.textContent = "Find work near you. Any day.";
      });

      root.querySelectorAll<HTMLElement>("[aria-label]").forEach((node) => {
        const label = node.getAttribute("aria-label");
        if (label?.includes("Kazi za Kenya")) node.setAttribute("aria-label", label.replaceAll("Kazi za Kenya", "AnyDayWork"));
      });
    };

    const applyInitialBranding = () => {
      updateNode(document);
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();
      while (current) {
        const parent = current.parentElement;
        if (parent && !["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName) && current.textContent?.includes("Kazi za Kenya")) {
          current.textContent = current.textContent.replaceAll("Kazi za Kenya", "AnyDayWork");
        }
        current = walker.nextNode();
      }
    };

    applyInitialBranding();

    // Only inspect nodes that were newly inserted. Observing attributes/text while
    // this component writes them can create an observer feedback loop on the marketplace.
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((added) => {
          if (!(added instanceof HTMLElement)) return;
          if (added.matches(".brand, .mobileBrandName")) brandNode(added);
          updateNode(added);
        });
      }
    });
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

      .adw-any { color: #111111 !important; }
      .adw-day { color: #e30613 !important; }
      .adw-work { color: #00843d !important; }
    `}</style>
  );
}
