"use client";

import { useLayoutEffect } from "react";

const BRAND_HTML =
  '<span class="adw-any">Any</span><span class="adw-day">Day</span><span class="adw-work">Work</span>';
const LEGACY_BRAND = /Kazi\s+za\s+Kenya/gi;

function replaceLegacy(value: string | null) {
  return value ? value.replace(LEGACY_BRAND, "AnyDayWork") : value;
}

export default function AnyDayWorkBranding() {
  useLayoutEffect(() => {
    document.title = "AnyDayWork — Find work near you. Any day.";

    const brandNode = (node: HTMLElement) => {
      if (node.dataset.anydayworkBranded === "true") return;
      node.innerHTML = BRAND_HTML;
      node.dataset.anydayworkBranded = "true";
      node.setAttribute("aria-label", "AnyDayWork");
    };

    const replaceTextIn = (root: ParentNode) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();
      while (current) {
        const parent = current.parentElement;
        if (
          parent &&
          !["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName) &&
          current.textContent &&
          LEGACY_BRAND.test(current.textContent)
        ) {
          LEGACY_BRAND.lastIndex = 0;
          current.textContent = current.textContent.replace(LEGACY_BRAND, "AnyDayWork");
        }
        LEGACY_BRAND.lastIndex = 0;
        current = walker.nextNode();
      }
    };

    const updateAttributes = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>("[aria-label],[title],[alt],[placeholder]").forEach((node) => {
        for (const attr of ["aria-label", "title", "alt", "placeholder"]) {
          const value = node.getAttribute(attr);
          const next = replaceLegacy(value);
          if (value && next !== value && next) node.setAttribute(attr, next);
        }
      });
    };

    const updateNode = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(".brand, .mobileBrandName")) brandNode(root);
      root.querySelectorAll<HTMLElement>(".brand, .mobileBrandName").forEach(brandNode);

      root.querySelectorAll<HTMLElement>(".mobileTagline").forEach((node) => {
        if (node.textContent !== "Find work near you. Any day.") node.textContent = "Find work near you. Any day.";
      });

      replaceTextIn(root);
      updateAttributes(root);
    };

    updateNode(document);

    // Dynamic account/job/message pages insert content after hydration. Inspect only
    // newly inserted subtrees so old branding cannot reappear without creating a
    // high-frequency observer loop on the marketplace/map.
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((added) => {
          if (added instanceof HTMLElement) updateNode(added);
          else if (added.nodeType === Node.TEXT_NODE && added.parentElement) updateNode(added.parentElement);
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
