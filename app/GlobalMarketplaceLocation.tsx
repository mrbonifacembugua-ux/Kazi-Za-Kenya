"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalMarketplaceLocation() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let neutralized = false;
    const nativeFetch = window.fetch.bind(window);

    // The original MVP area search still appends ", Nairobi, Kenya" to every
    // location. Keep its proven map/pin behavior, but remove that Kenya-only
    // suffix before the request reaches OpenStreetMap. This lets the same UI
    // resolve towns, cities and neighbourhoods worldwide.
    const globalFetch: typeof window.fetch = async (input, init) => {
      let nextInput: RequestInfo | URL = input;
      let nextInit = init;

      try {
        const rawUrl =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url;
        const url = new URL(rawUrl, window.location.origin);

        if (
          url.hostname === "nominatim.openstreetmap.org" &&
          url.pathname.includes("/search")
        ) {
          const originalQuery = url.searchParams.get("q") || "";
          const globalQuery = originalQuery
            .replace(/,\s*Nairobi\s*,\s*Kenya\s*$/i, "")
            .trim();

          if (globalQuery && globalQuery !== originalQuery) {
            url.searchParams.set("q", globalQuery);
            url.searchParams.set("addressdetails", "1");
            url.searchParams.set("limit", "5");

            nextInput =
              input instanceof Request
                ? new Request(url.toString(), input)
                : url.toString();
          }
        }

        // The live-job location picker was also created when the marketplace
        // was Kenya-only and sends countryCode=KE. Remove that legacy bias so
        // a typed place such as "Arusha, Tanzania" or "Lagos, Nigeria" is not
        // forced back into Kenya. The geocode API still supports an explicit
        // country code for future country-aware flows.
        if (
          url.origin === window.location.origin &&
          url.pathname === "/api/geocode-area" &&
          (nextInit?.method || "GET").toUpperCase() === "POST" &&
          typeof nextInit?.body === "string"
        ) {
          const body = JSON.parse(nextInit.body) as Record<string, unknown>;
          if (body.countryCode === "KE") {
            delete body.countryCode;
            nextInit = {
              ...nextInit,
              body: JSON.stringify(body),
            };
          }
        }
      } catch {
        // If a request cannot be inspected, leave it untouched.
      }

      return nativeFetch(nextInput, nextInit);
    };

    window.fetch = globalFetch;

    function applyGlobalCopy() {
      const locationInput = document.querySelector<HTMLInputElement>(
        ".location-search-field input"
      );
      if (locationInput) {
        locationInput.placeholder = "Enter your location";
        locationInput.setAttribute("aria-label", "Enter your location");
        locationInput.setAttribute(
          "title",
          "Enter a town, city, neighbourhood or area. Add the country when a place name could be ambiguous."
        );

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
          node.textContent = text.replace(
            "Anywhere in Kenya",
            "Anywhere in the country"
          );
        }
      });
    }

    applyGlobalCopy();
    const observer = new MutationObserver(applyGlobalCopy);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (window.fetch === globalFetch) window.fetch = nativeFetch;
    };
  }, [pathname]);

  return null;
}
