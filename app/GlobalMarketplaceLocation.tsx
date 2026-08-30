"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalMarketplaceLocation() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let neutralized = false;

    function applyGlobalCopy() {
      const locationInput = document.querySelector<HTMLInputElement>(".location-search-field input");
      if (locationInput) {
        locationInput.placeholder = "Enter your location";
        locationInput.setAttribute("aria-label", "Enter your location");

        // Remove the old Nairobi default through React's own input event so
        // the visible field and the page state stay in sync.
        if (!neutralized && locationInput.value.trim() === "Nairobi, Kenya") {
          const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
          )?.set;
          setter?.call(locationInput, "");
          locationInput.dispatchEvent(new Event("input", { bubbles: true }));
          neutralized = true;
        }
      }

      document.querySelectorAll<HTMLElement>(".modes button").forEach((button) => {
        const text = (button.textContent || "").replace(/\s+/g, " ").trim();
        if (text.includes("Anywhere in Kenya")) {
          button.textContent = "🌐 Anywhere in the country";
        }
      });

      document.querySelectorAll<HTMLElement>(".nearby small, .note").forEach((node) => {
        const text = node.textContent || "";
        if (text.includes("across Kenya")) {
          node.textContent = text.replace("across Kenya", "across the country");
        }
        if (text.includes("Anywhere in Kenya")) {
          node.textContent = text.replace("Anywhere in Kenya", "Anywhere in the country");
        }
      });
    }

    applyGlobalCopy();
    const observer = new MutationObserver(applyGlobalCopy);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
