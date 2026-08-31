"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "anydaywork-marketplace-country";

function normalizeCountryCode(value: unknown) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "";
}

function announceCountry(countryCode: string) {
  const code = normalizeCountryCode(countryCode);
  if (!code) return;
  try { window.localStorage.setItem(STORAGE_KEY, code); } catch {}
  try {
    window.dispatchEvent(new CustomEvent("anydaywork:country-changed", {
      detail: { countryCode: code },
    }));
  } catch {}
}

export default function MarketplaceCountrySignal() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    try {
      announceCountry(window.localStorage.getItem(STORAGE_KEY) || "KE");
    } catch {
      announceCountry("KE");
    }

    const upstreamFetch = window.fetch;

    const wrappedFetch: typeof window.fetch = async (input, init) => {
      const response = await upstreamFetch(input, init);

      try {
        const rawUrl = typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
        const url = new URL(rawUrl, window.location.origin);

        if (url.origin === window.location.origin && url.pathname === "/api/geocode-area") {
          void response.clone().json().then((data: any) => {
            announceCountry(data?.countryCode);
          }).catch(() => {});
        } else if (url.hostname === "nominatim.openstreetmap.org" && url.pathname.includes("/search")) {
          void response.clone().json().then((data: any) => {
            const first = Array.isArray(data) ? data[0] : null;
            announceCountry(first?.address?.country_code);
          }).catch(() => {});
        }
      } catch {
        // Country detection must never interfere with the location request itself.
      }

      return response;
    };

    window.fetch = wrappedFetch;

    return () => {
      if (window.fetch === wrappedFetch) window.fetch = upstreamFetch;
    };
  }, [pathname]);

  return null;
}
