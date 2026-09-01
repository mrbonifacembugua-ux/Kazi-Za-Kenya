"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

type CountryRow = { country_code: string | null; country_name: string | null };
type Country = { code: string; name: string };

const STORAGE_KEY = "anydaywork-marketplace-country";

function normalizeCode(value: unknown) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "";
}

export default function MarketplaceCountryPicker() {
  const pathname = usePathname();
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selected, setSelected] = useState("KE");

  useEffect(() => {
    if (pathname !== "/") return;

    const requested = normalizeCode(new URLSearchParams(window.location.search).get("country"));
    if (requested) {
      setSelected(requested);
      try { window.localStorage.setItem(STORAGE_KEY, requested); } catch {}
      const timer = window.setTimeout(() => {
        try {
          window.dispatchEvent(new CustomEvent("anydaywork:country-changed", {
            detail: { countryCode: requested },
          }));
        } catch {}
      }, 0);
      return () => window.clearTimeout(timer);
    } else {
      try {
        const stored = normalizeCode(window.localStorage.getItem(STORAGE_KEY));
        if (stored) setSelected(stored);
      } catch {}
    }

    const onCountry = (event: Event) => {
      const code = normalizeCode((event as CustomEvent<{ countryCode?: string }>).detail?.countryCode);
      if (code) setSelected(code);
    };

    window.addEventListener("anydaywork:country-changed", onCountry as EventListener);
    return () => window.removeEventListener("anydaywork:country-changed", onCountry as EventListener);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    let active = true;

    async function loadCountries() {
      const { data, error } = await supabase
        .from("demo_profiles")
        .select("country_code,country_name");

      if (!active || error) return;

      const map = new Map<string, string>();
      ((data || []) as CountryRow[]).forEach((row) => {
        const code = normalizeCode(row.country_code);
        const name = String(row.country_name || "").trim();
        if (code && name && !map.has(code)) map.set(code, name);
      });

      if (!map.has("KE")) map.set("KE", "Kenya");

      setCountries(
        Array.from(map.entries())
          .map(([code, name]) => ({ code, name }))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    }

    void loadCountries();
    const timer = window.setInterval(loadCountries, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    let stopped = false;

    const attach = () => {
      const actions = document.querySelector<HTMLElement>(".app .topbar .actions");
      if (!actions) return;

      let host = document.getElementById("anyday-country-picker-mount") as HTMLElement | null;
      if (!host) {
        host = document.createElement("div");
        host.id = "anyday-country-picker-mount";
        actions.insertBefore(host, actions.firstChild);
      }
      if (!stopped) setMount(host);
    };

    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      stopped = true;
      observer.disconnect();
    };
  }, [pathname]);

  const options = useMemo(() => {
    if (countries.some((country) => country.code === selected)) return countries;
    return [...countries, { code: selected, name: selected }].sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, selected]);

  function changeCountry(code: string) {
    const normalized = normalizeCode(code);
    if (!normalized) return;
    setSelected(normalized);
    try { window.localStorage.setItem(STORAGE_KEY, normalized); } catch {}
    try {
      window.dispatchEvent(new CustomEvent("anydaywork:country-changed", {
        detail: { countryCode: normalized },
      }));
    } catch {}
  }

  if (pathname !== "/" || !mount) return null;

  return createPortal(
    <>
      <label className="anyday-country-picker" title="Choose marketplace country">
        <span aria-hidden="true">🌍</span>
        <select
          value={selected}
          onChange={(event) => changeCountry(event.target.value)}
          aria-label="Marketplace country"
        >
          {options.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </label>
      <style jsx global>{`
        #anyday-country-picker-mount { display:flex; align-items:center; }
        .anyday-country-picker {
          height: 40px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 9px;
          border: 1px solid #d8e2da;
          border-radius: 10px;
          background: #fff;
          color: #17221b;
          font: 600 12px/1 system-ui, sans-serif;
        }
        .anyday-country-picker select {
          width: 142px;
          max-width: 22vw;
          border: 0;
          outline: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          cursor: pointer;
        }
        @media (max-width: 800px) {
          .anyday-country-picker { height: 40px; padding: 0 7px; gap: 4px; }
          .anyday-country-picker select { width: 112px; max-width: 31vw; font-size: 11px; }
        }
        @media (max-width: 380px) {
          .anyday-country-picker select { width: 92px; }
        }
      `}</style>
    </>,
    mount
  );
}