"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const COUNTRY_DEFAULTS: Record<string, { area: string; city: string; country: string }> = {
  KE: { area: "Nairobi, Kenya", city: "Nairobi", country: "Kenya" },
  UG: { area: "Kampala, Uganda", city: "Kampala", country: "Uganda" },
  TZ: { area: "Dar es Salaam, Tanzania", city: "Dar es Salaam", country: "Tanzania" },
  RW: { area: "Kigali, Rwanda", city: "Kigali", country: "Rwanda" },
  BI: { area: "Bujumbura, Burundi", city: "Bujumbura", country: "Burundi" },
  ET: { area: "Addis Ababa, Ethiopia", city: "Addis Ababa", country: "Ethiopia" },
  SO: { area: "Mogadishu, Somalia", city: "Mogadishu", country: "Somalia" },
  DJ: { area: "Djibouti City, Djibouti", city: "Djibouti City", country: "Djibouti" },
  ER: { area: "Asmara, Eritrea", city: "Asmara", country: "Eritrea" },
  SS: { area: "Juba, South Sudan", city: "Juba", country: "South Sudan" },
  SD: { area: "Khartoum, Sudan", city: "Khartoum", country: "Sudan" },
};

function requestedMarketplaceLocation() {
  try {
    const code = new URLSearchParams(window.location.search).get("country")?.trim().toUpperCase() || "";
    return COUNTRY_DEFAULTS[code] || null;
  } catch {
    return null;
  }
}

export default function GlobalMarketplaceLocation() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let locationApplied = false;
    const requested = requestedMarketplaceLocation();
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

    function setReactInputValue(input: HTMLInputElement, value: string) {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;
      setter?.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

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

        // A country landing page is an explicit user choice. It must win over
        // the old Nairobi MVP default and over any stale Kenya location state.
        if (requested && !locationApplied) {
          setReactInputValue(locationInput, requested.area);
          locationApplied = true;
        } else if (!requested && !locationApplied && locationInput.value.trim() === "Nairobi, Kenya") {
          setReactInputValue(locationInput, "");
          locationApplied = true;
        }
      }

      document.querySelectorAll<HTMLElement>(".modes button").forEach((button) => {
        const text = (button.textContent || "").replace(/\s+/g, " ").trim();
        if (text.includes("Anywhere in Kenya")) {
          button.textContent = requested
            ? `🌐 Anywhere in ${requested.country}`
            : "🌐 Anywhere in the country";
        }
      });

      document.querySelectorAll<HTMLElement>(".nearby small, .note").forEach((node) => {
        const text = node.textContent || "";
        if (text.includes("across Kenya")) {
          node.textContent = text.replace(
            "across Kenya",
            requested ? `across ${requested.country}` : "across the country"
          );
        }
        if (text.includes("Anywhere in Kenya")) {
          node.textContent = text.replace(
            "Anywhere in Kenya",
            requested ? `Anywhere in ${requested.country}` : "Anywhere in the country"
          );
        }
      });

      // The original marketplace page contains a few Nairobi labels in its
      // static MVP shell. Keep those labels aligned with the country route so
      // visitors do not see Nairobi after choosing another country.
      if (requested) {
        document.querySelectorAll<HTMLElement>(".section-title, .profile-meta small").forEach((node) => {
          const text = node.textContent || "";
          if (/around Nairobi/i.test(text)) {
            node.textContent = text.replace(/around Nairobi/gi, `around ${requested.city}`);
          }
          if (/from Nairobi/i.test(text)) {
            node.textContent = text.replace(/from Nairobi/gi, `from ${requested.city}`);
          }
        });
      }
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
