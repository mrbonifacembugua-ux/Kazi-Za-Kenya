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

    const requestedCountry = normalizeCountryCode(
      new URLSearchParams(window.location.search).get("country")
    );

    if (requestedCountry) {
      announceCountry(requestedCountry);
      return;
    }

    try {
      announceCountry(window.localStorage.getItem(STORAGE_KEY) || "KE");
    } catch {
      announceCountry("KE");
    }
  }, [pathname]);

  return null;
}
