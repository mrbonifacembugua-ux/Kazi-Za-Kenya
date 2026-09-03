"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

type DemoProfile = {
  id: string;
  full_name: string;
  country_code: string;
  country_name: string;
  area: string | null;
  avatar_url: string | null;
  occupation: string | null;
  years_experience: number | null;
  profile_kind: "worker" | "employer";
};

const STORAGE_KEY = "anydaywork-marketplace-country";

function selectedCountry() {
  try {
    return (window.localStorage.getItem(STORAGE_KEY) || "KE").toUpperCase();
  } catch {
    return "KE";
  }
}

export default function MarketplaceCountryDemoProfiles() {
  const pathname = usePathname();
  const [countryCode, setCountryCode] = useState("KE");
  const [profiles, setProfiles] = useState<DemoProfile[]>([]);
  const [mount, setMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    setCountryCode(selectedCountry());

    const onCountry = (event: Event) => {
      const code = String((event as CustomEvent<{ countryCode?: string }>).detail?.countryCode || "").toUpperCase();
      if (/^[A-Z]{2}$/.test(code)) setCountryCode(code);
    };

    window.addEventListener("anydaywork:country-changed", onCountry as EventListener);
    return () => window.removeEventListener("anydaywork:country-changed", onCountry as EventListener);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    let cancelled = false;
    let tries = 0;

    const timer = window.setInterval(() => {
      tries += 1;
      const title = Array.from(document.querySelectorAll<HTMLElement>(".section-title"))
        .find((node) => (node.textContent || "").toLowerCase().includes("people who can help"));
      if (title?.parentElement) {
        let host = document.getElementById("anyday-country-demo-profiles-mount") as HTMLElement | null;
        if (!host) {
          host = document.createElement("div");
          host.id = "anyday-country-demo-profiles-mount";
          title.insertAdjacentElement("afterend", host);
        }
        if (!cancelled) setMount(host);
        window.clearInterval(timer);
      } else if (tries >= 40) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/" || !countryCode) return;
    let active = true;

    async function load() {
      const { data, error } = await supabase
        .from("demo_profiles")
        .select("id,full_name,country_code,country_name,area,avatar_url,occupation,years_experience,profile_kind")
        .eq("is_demo", true)
        .eq("profile_kind", "worker")
        .eq("country_code", countryCode)
        .order("sort_order");

      if (!active || error) return;
      setProfiles((data || []) as DemoProfile[]);
    }

    void load();
    return () => { active = false; };
  }, [pathname, countryCode]);

  useEffect(() => {
    if (pathname !== "/") return;
    const coreCards = Array.from(document.querySelectorAll<HTMLElement>(".provider"));
    const liveMount = document.getElementById("kzk-live-workers-mount") as HTMLElement | null;

    if (countryCode !== "KE") {
      coreCards.forEach((card) => { card.style.display = "none"; });
      if (liveMount) liveMount.style.display = "none";
    } else {
      coreCards.forEach((card) => card.style.removeProperty("display"));
      if (liveMount) liveMount.style.removeProperty("display");
    }

    return () => {
      coreCards.forEach((card) => card.style.removeProperty("display"));
      if (liveMount) liveMount.style.removeProperty("display");
    };
  }, [pathname, countryCode]);

  if (pathname !== "/" || !mount || countryCode === "KE") return null;

  return createPortal(
    <div className="anyday-country-demo-profiles">
      {profiles.length === 0 ? (
        <div className="anyday-country-demo-note">No example worker profiles are available for this country yet.</div>
      ) : profiles.map((profile) => (
        <button
          key={profile.id}
          className="anyday-country-demo-card"
          type="button"
          onClick={() => { window.location.href = `/profile/demo/${profile.id}`; }}
        >
          {profile.avatar_url ? <img src={profile.avatar_url} alt="Example worker profile" /> : <div className="avatar">👤</div>}
          <div className="main">
            <div className="name"><b>{profile.full_name}</b><span>EXAMPLE</span></div>
            <p>{profile.occupation || "Service provider"}</p>
            <small>📍 {[profile.area, profile.country_name].filter(Boolean).join(", ")}</small>
            <footer>{profile.years_experience != null ? `${profile.years_experience} years experience` : "Example profile"}</footer>
          </div>
        </button>
      ))}
      <style jsx global>{`
        #anyday-country-demo-profiles-mount{width:100%}
        .anyday-country-demo-profiles{display:grid;gap:10px;margin:0 0 10px}
        .anyday-country-demo-note{padding:12px;border:1px solid #dce4dc;border-radius:12px;background:#fff;color:#657168;font-size:12px}
        .anyday-country-demo-card{display:flex;align-items:center;gap:12px;width:100%;padding:11px;border:1px solid #dce4dc;border-radius:14px;background:#fff;text-align:left;font-family:inherit;cursor:pointer}
        .anyday-country-demo-card img,.anyday-country-demo-card .avatar{width:64px;height:64px;border-radius:50%;object-fit:cover;flex:0 0 64px;background:#eef5ef}
        .anyday-country-demo-card .avatar{display:grid;place-items:center;font-size:28px}
        .anyday-country-demo-card .main{min-width:0;flex:1}
        .anyday-country-demo-card .name{display:flex;justify-content:space-between;gap:8px;align-items:center}
        .anyday-country-demo-card .name b{font-size:13px}
        .anyday-country-demo-card .name span{font-size:9px;font-weight:900;color:#8a5b00;background:#fff3cd;border-radius:999px;padding:3px 6px}
        .anyday-country-demo-card p{margin:4px 0;color:#52645a;font-size:11px;font-weight:650}
        .anyday-country-demo-card small,.anyday-country-demo-card footer{display:block;color:#77847c;font-size:9px}
        .anyday-country-demo-card footer{margin-top:6px;color:#176f3a;font-weight:700}
      `}</style>
    </div>,
    mount
  );
}
