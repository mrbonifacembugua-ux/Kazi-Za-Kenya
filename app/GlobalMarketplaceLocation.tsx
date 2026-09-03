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
  EG: { area: "Cairo, Egypt", city: "Cairo", country: "Egypt" },
  LY: { area: "Tripoli, Libya", city: "Tripoli", country: "Libya" },
  TN: { area: "Tunis, Tunisia", city: "Tunis", country: "Tunisia" },
  DZ: { area: "Algiers, Algeria", city: "Algiers", country: "Algeria" },
  MA: { area: "Casablanca, Morocco", city: "Casablanca", country: "Morocco" },
  MR: { area: "Nouakchott, Mauritania", city: "Nouakchott", country: "Mauritania" },
  ML: { area: "Bamako, Mali", city: "Bamako", country: "Mali" },
  NE: { area: "Niamey, Niger", city: "Niamey", country: "Niger" },
  TD: { area: "N'Djamena, Chad", city: "N'Djamena", country: "Chad" },
  NG: { area: "Lagos, Nigeria", city: "Lagos", country: "Nigeria" },
};

function normalizeCountryCode(value: unknown) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "";
}

function fallbackLocation(code: string) {
  if (!code) return null;
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
    return { area: name, city: name, country: name };
  } catch {
    return { area: code, city: code, country: code };
  }
}

function locationForCode(code: string) {
  return COUNTRY_DEFAULTS[code] || fallbackLocation(code);
}

function requestedCountryCode() {
  try {
    const fromUrl = normalizeCountryCode(new URLSearchParams(window.location.search).get("country"));
    if (fromUrl) return fromUrl;
    return normalizeCountryCode(window.localStorage.getItem("anydaywork-marketplace-country"));
  } catch {
    return "";
  }
}

export default function GlobalMarketplaceLocation() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let locationAppliedFor = "";
    let requestedCode = requestedCountryCode();
    let requested = locationForCode(requestedCode);
    const nativeFetch = window.fetch.bind(window);

    const globalFetch: typeof window.fetch = async (input, init) => {
      let nextInput: RequestInfo | URL = input;
      let nextInit = init;

      try {
        const rawUrl = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        const url = new URL(rawUrl, window.location.origin);

        if (url.hostname === "nominatim.openstreetmap.org" && url.pathname.includes("/search")) {
          const originalQuery = url.searchParams.get("q") || "";
          const globalQuery = originalQuery.replace(/,\s*Nairobi\s*,\s*Kenya\s*$/i, "").trim();
          if (globalQuery && globalQuery !== originalQuery) {
            url.searchParams.set("q", globalQuery);
            url.searchParams.set("addressdetails", "1");
            url.searchParams.set("limit", "5");
            nextInput = input instanceof Request ? new Request(url.toString(), input) : url.toString();
          }
        }

        if (
          url.origin === window.location.origin &&
          url.pathname === "/api/geocode-area" &&
          (nextInit?.method || "GET").toUpperCase() === "POST" &&
          typeof nextInit?.body === "string"
        ) {
          const body = JSON.parse(nextInit.body) as Record<string, unknown>;
          if (body.countryCode === "KE" && requestedCode && requestedCode !== "KE") {
            body.countryCode = requestedCode;
            nextInit = { ...nextInit, body: JSON.stringify(body) };
          }
        }
      } catch {}

      return nativeFetch(nextInput, nextInit);
    };

    window.fetch = globalFetch;

    function setReactInputValue(input: HTMLInputElement, value: string) {
      if (input.value === value) return;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function setText(node: HTMLElement, value: string) {
      if ((node.textContent || "") !== value) node.textContent = value;
    }

    function setRequestedCountryInput() {
      if (!requested || !requestedCode || requestedCode === "KE") return;
      const locationInput = document.querySelector<HTMLInputElement>(".location-search-field input");
      if (!locationInput || locationAppliedFor === requestedCode) return;
      setReactInputValue(locationInput, requested.area);
      locationAppliedFor = requestedCode;
    }

    function applyGlobalCopy() {
      const locationInput = document.querySelector<HTMLInputElement>(".location-search-field input");
      if (locationInput) {
        if (locationInput.placeholder !== "Enter your location") locationInput.placeholder = "Enter your location";
        if (locationInput.getAttribute("aria-label") !== "Enter your location") locationInput.setAttribute("aria-label", "Enter your location");
        const title = "Enter a town, city, neighbourhood or area. Add the country when a place name could be ambiguous.";
        if (locationInput.getAttribute("title") !== title) locationInput.setAttribute("title", title);

        if (!requested && !locationAppliedFor && locationInput.value.trim() === "Nairobi, Kenya") {
          setReactInputValue(locationInput, "");
          locationAppliedFor = "NONE";
        }
      }

      if (requested) setRequestedCountryInput();

      document.querySelectorAll<HTMLElement>(".modes button").forEach((button) => {
        const text = (button.textContent || "").replace(/\s+/g, " ").trim();
        if (text.includes("Anywhere in Kenya")) {
          const next = requested ? `🌐 Anywhere in ${requested.country}` : "🌐 Anywhere in the country";
          setText(button, next);
        }
      });

      document.querySelectorAll<HTMLElement>(".nearby small, .note").forEach((node) => {
        const text = node.textContent || "";
        let next = text;
        if (next.includes("across Kenya")) next = next.replace("across Kenya", requested ? `across ${requested.country}` : "across the country");
        if (next.includes("Anywhere in Kenya")) next = next.replace("Anywhere in Kenya", requested ? `Anywhere in ${requested.country}` : "Anywhere in the country");
        setText(node, next);
      });

      if (requested) {
        document.querySelectorAll<HTMLElement>(".section-title, .profile-meta small").forEach((node) => {
          const text = node.textContent || "";
          let next = text;
          if (/around Nairobi/i.test(next)) next = next.replace(/around Nairobi/gi, `around ${requested.city}`);
          if (/from Nairobi/i.test(next)) next = next.replace(/from Nairobi/gi, `from ${requested.city}`);
          setText(node, next);
        });
      }
    }

    function onCountryChanged(event: Event) {
      const code = normalizeCountryCode((event as CustomEvent<{ countryCode?: string }>).detail?.countryCode);
      if (!code) return;
      requestedCode = code;
      requested = locationForCode(code);
      locationAppliedFor = "";
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("country", code);
        window.history.replaceState(window.history.state, "", url.toString());
      } catch {}
      applyGlobalCopy();
    }

    applyGlobalCopy();
    let scheduled = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(scheduled);
      scheduled = window.setTimeout(applyGlobalCopy, 20);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("anydaywork:country-changed", onCountryChanged as EventListener);

    return () => {
      window.clearTimeout(scheduled);
      observer.disconnect();
      window.removeEventListener("anydaywork:country-changed", onCountryChanged as EventListener);
      if (window.fetch === globalFetch) window.fetch = nativeFetch;
    };
  }, [pathname]);

  return null;
}
