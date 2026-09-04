import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pnqmqxeuzcodnxdixnvc.supabase.co";
const supabasePublishableKey = "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l";
const COUNTRY_STORAGE_KEY = "anydaywork-marketplace-country";

function selectedCountryCode() {
  if (typeof window === "undefined") return "";
  try {
    const query = new URLSearchParams(window.location.search).get("country");
    const value = (query || window.localStorage.getItem(COUNTRY_STORAGE_KEY) || "").trim().toUpperCase();
    return /^[A-Z]{2}$/.test(value) ? value : "";
  } catch { return ""; }
}

const client = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Keep the existing app API, but make country selection apply to the real live marketplace too.
const originalRpc = client.rpc.bind(client);
(client as any).rpc = (fn: string, args?: Record<string, unknown>, options?: unknown) => {
  const country = selectedCountryCode();
  if (country && (fn === "get_public_marketplace_workers" || fn === "get_public_marketplace_jobs")) {
    return (originalRpc as any)(fn, { ...(args || {}), p_country_code: country }, options);
  }
  return (originalRpc as any)(fn, args, options);
};

// Correct old Kenya-only form payloads without changing the forms' approved layout.
const originalFrom = client.from.bind(client);
(client as any).from = (relation: string) => {
  const builder: any = originalFrom(relation as any);
  if (relation !== "jobs" && relation !== "profiles") return builder;
  return new Proxy(builder, {
    get(target, prop, receiver) {
      if (relation === "jobs" && prop === "insert") {
        return (values: any, options?: any) => {
          const country = selectedCountryCode();
          const patch = (row: any) => country ? { ...row, country_code: country, county: row.county === "Nairobi" && country !== "KE" ? null : row.county } : row;
          return target.insert(Array.isArray(values) ? values.map(patch) : patch(values), options);
        };
      }
      if (relation === "profiles" && prop === "update") {
        return (values: any, options?: any) => {
          const country = selectedCountryCode();
          const patch = country && values && values.country_code === "KE" ? { ...values, country_code: country } : values;
          return target.update(patch, options);
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  });
};

// Old forms still send KE to the geocoder. Replace only that legacy country hint in the browser.
if (typeof window !== "undefined" && !(window as any).__anydayworkCountryFetchInstalled) {
  (window as any).__anydayworkCountryFetchInstalled = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const country = selectedCountryCode();
      if (country && url.includes("/api/geocode-area") && init?.body && typeof init.body === "string") {
        const body = JSON.parse(init.body);
        if (!body.countryCode || body.countryCode === "KE") {
          body.countryCode = country;
          if (country !== "KE" && body.region === "Nairobi") delete body.region;
          init = { ...init, body: JSON.stringify(body) };
        }
      }
    } catch {}
    return originalFetch(input, init);
  };
}

export const supabase = client;
