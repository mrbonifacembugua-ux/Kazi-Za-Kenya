"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

type DemoProfileCountry = {
  id: string;
  full_name: string;
  profile_kind: "worker" | "employer";
  country_code: string;
};

type DemoJobCountry = {
  id: string;
  title: string;
  country_code: string;
};

const STORAGE_KEY = "anydaywork-marketplace-country";

function normalizedCode(value: unknown) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "KE";
}

function tooltipText(layer: any) {
  try {
    const tooltip = layer?.getTooltip?.();
    return String(tooltip?.getContent?.() || "").trim();
  } catch {
    return "";
  }
}

export default function MarketplaceDemoCountryGuard() {
  const pathname = usePathname();
  const [countryCode, setCountryCode] = useState("KE");
  const [profiles, setProfiles] = useState<DemoProfileCountry[]>([]);
  const [jobs, setJobs] = useState<DemoJobCountry[]>([]);

  useEffect(() => {
    if (pathname !== "/") return;

    try { setCountryCode(normalizedCode(window.localStorage.getItem(STORAGE_KEY))); } catch {}

    const onCountry = (event: Event) => {
      const detail = (event as CustomEvent<{ countryCode?: string }>).detail;
      setCountryCode(normalizedCode(detail?.countryCode));
    };

    window.addEventListener("anydaywork:country-changed", onCountry as EventListener);
    return () => window.removeEventListener("anydaywork:country-changed", onCountry as EventListener);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    let active = true;

    async function load() {
      const [profileResult, jobResult] = await Promise.all([
        supabase
          .from("demo_profiles")
          .select("id,full_name,profile_kind,country_code")
          .eq("is_demo", true),
        supabase
          .from("demo_jobs")
          .select("id,title,country_code")
          .eq("is_demo", true),
      ]);
      if (!active) return;
      if (!profileResult.error) setProfiles((profileResult.data || []) as DemoProfileCountry[]);
      if (!jobResult.error) setJobs((jobResult.data || []) as DemoJobCountry[]);
    }

    void load();
    const timer = window.setInterval(load, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [pathname]);

  const workerCountryById = useMemo(
    () => new Map(profiles.filter(profile => profile.profile_kind === "worker").map(profile => [profile.id, normalizedCode(profile.country_code)])),
    [profiles]
  );
  const jobCountryById = useMemo(
    () => new Map(jobs.map(job => [job.id, normalizedCode(job.country_code)])),
    [jobs]
  );
  const workerCountryByName = useMemo(
    () => new Map(profiles.filter(profile => profile.profile_kind === "worker").map(profile => [profile.full_name.trim().toLowerCase(), normalizedCode(profile.country_code)])),
    [profiles]
  );
  const jobCountryByTitle = useMemo(
    () => new Map(jobs.map(job => [job.title.trim().toLowerCase(), normalizedCode(job.country_code)])),
    [jobs]
  );

  useEffect(() => {
    if (pathname !== "/") return;
    let stopped = false;
    let scheduled = 0;

    function applyCardFilter() {
      document.querySelectorAll<HTMLElement>(".anyday-demo-worker-card[data-demo-id]").forEach(card => {
        const code = workerCountryById.get(card.dataset.demoId || "");
        card.style.display = code === countryCode ? "block" : "none";
      });
      document.querySelectorAll<HTMLElement>(".anyday-demo-job-card[data-demo-id]").forEach(card => {
        const code = jobCountryById.get(card.dataset.demoId || "");
        card.style.display = code === countryCode ? "block" : "none";
      });
    }

    function filterGroup(group: any, kind: "worker" | "job") {
      if (!group || typeof group.getLayers !== "function") return;
      if (!group.__anydayCountryAllLayers) group.__anydayCountryAllLayers = group.getLayers().slice();
      const allLayers: any[] = group.__anydayCountryAllLayers || [];
      try { group.clearLayers(); } catch { return; }

      allLayers.forEach(layer => {
        const text = tooltipText(layer).toLowerCase();
        const identity = text.split(" · ")[0]?.trim() || "";
        const code = kind === "worker" ? workerCountryByName.get(identity) : jobCountryByTitle.get(identity);
        if (code === countryCode) {
          try { group.addLayer(layer); } catch {}
        }
      });
    }

    function applyMapFilter() {
      const mapEl = document.querySelector<HTMLElement>(".leaflet-container") as any;
      if (!mapEl) return;
      filterGroup(mapEl.__anydayDemoWorkerGroup, "worker");
      filterGroup(mapEl.__anydayDemoJobGroup, "job");
    }

    function apply() {
      if (stopped) return;
      applyCardFilter();
      applyMapFilter();
    }

    function schedule() {
      window.clearTimeout(scheduled);
      scheduled = window.setTimeout(apply, 20);
    }

    apply();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("kzk:marketplace-layer-updated", schedule);
    window.addEventListener("anydaywork:country-changed", schedule);
    const timer = window.setInterval(apply, 1000);

    return () => {
      stopped = true;
      window.clearTimeout(scheduled);
      window.clearInterval(timer);
      observer.disconnect();
      window.removeEventListener("kzk:marketplace-layer-updated", schedule);
      window.removeEventListener("anydaywork:country-changed", schedule);
    };
  }, [pathname, countryCode, workerCountryById, jobCountryById, workerCountryByName, jobCountryByTitle]);

  return null;
}
