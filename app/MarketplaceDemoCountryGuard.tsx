"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

type DemoProfileCountry = {
  id: string;
  full_name: string;
  profile_kind: "worker" | "employer";
  country_code: string;
  country_name: string;
  area: string | null;
  occupation: string | null;
};

type DemoJobCountry = {
  id: string;
  title: string;
  country_code: string;
  country_name: string;
  area: string | null;
  category: string | null;
};

const STORAGE_KEY = "anydaywork-marketplace-country";

function normalizedCode(value: unknown) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "KE";
}

function clean(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function profileMatches(profile: DemoProfileCountry | undefined, query: string) {
  if (!profile || !query) return false;
  return [profile.full_name, profile.occupation, profile.area, profile.country_name]
    .filter(Boolean)
    .some(value => clean(value).includes(query));
}

function jobMatches(job: DemoJobCountry | undefined, query: string) {
  if (!job || !query) return false;
  return [job.title, job.category, job.area, job.country_name]
    .filter(Boolean)
    .some(value => clean(value).includes(query));
}

function setVisible(element: HTMLElement, visible: boolean) {
  const next = visible ? "block" : "none";
  if (element.style.display !== next) element.style.setProperty("display", next, "important");
}

export default function MarketplaceDemoCountryGuard() {
  const pathname = usePathname();
  const [countryCode, setCountryCode] = useState("KE");
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<DemoProfileCountry[]>([]);
  const [jobs, setJobs] = useState<DemoJobCountry[]>([]);

  useEffect(() => {
    if (pathname !== "/") return;

    try {
      const fromUrl = new URLSearchParams(window.location.search).get("country");
      setCountryCode(normalizedCode(fromUrl || window.localStorage.getItem(STORAGE_KEY)));
    } catch {}

    const onCountry = (event: Event) => {
      const detail = (event as CustomEvent<{ countryCode?: string }>).detail;
      setCountryCode(normalizedCode(detail?.countryCode));
    };

    const onInput = (event: Event) => {
      const input = event.target as HTMLInputElement | null;
      if (!input || input.tagName !== "INPUT") return;
      const placeholder = clean(input.placeholder);
      if (placeholder.includes("search") || placeholder.includes("service") || placeholder.includes("what do you need")) {
        setQuery(clean(input.value));
      }
    };

    window.addEventListener("anydaywork:country-changed", onCountry as EventListener);
    document.addEventListener("input", onInput, true);
    return () => {
      window.removeEventListener("anydaywork:country-changed", onCountry as EventListener);
      document.removeEventListener("input", onInput, true);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    let active = true;

    async function load() {
      const [profileResult, jobResult] = await Promise.all([
        supabase
          .from("demo_profiles")
          .select("id,full_name,profile_kind,country_code,country_name,area,occupation")
          .eq("is_demo", true)
          .eq("country_code", countryCode),
        supabase
          .from("demo_jobs")
          .select("id,title,country_code,country_name,area,category")
          .eq("is_demo", true)
          .eq("country_code", countryCode),
      ]);
      if (!active) return;
      if (!profileResult.error) setProfiles((profileResult.data || []) as DemoProfileCountry[]);
      if (!jobResult.error) setJobs((jobResult.data || []) as DemoJobCountry[]);
    }

    void load();
    return () => { active = false; };
  }, [pathname, countryCode]);

  const workerById = useMemo(
    () => new Map(profiles.filter(profile => profile.profile_kind === "worker").map(profile => [profile.id, profile])),
    [profiles]
  );
  const jobById = useMemo(() => new Map(jobs.map(job => [job.id, job])), [jobs]);

  useEffect(() => {
    if (pathname !== "/") return;
    let stopped = false;
    let scheduled = 0;
    let observer: MutationObserver | null = null;

    const workerVisible = (profile: DemoProfileCountry | undefined) => {
      if (!profile) return false;
      if (query) return profileMatches(profile, query);
      return normalizedCode(profile.country_code) === countryCode;
    };

    const jobVisible = (job: DemoJobCountry | undefined) => {
      if (!job) return false;
      if (query) return jobMatches(job, query);
      return normalizedCode(job.country_code) === countryCode;
    };

    function applyCardFilter() {
      const regionalWorkersPresent = !!document.querySelector("#anyday-south-workers-mount .anyday-south-card");
      const regionalJobsPresent = !!document.querySelector("#anyday-south-jobs-mount .anyday-south-card");

      // The five original worker cards and five original job cards in app/page.tsx
      // are Kenya seed content (Nairobi locations and KSh pricing). They must never
      // leak into another country's marketplace. Keep them untouched in Kenya and
      // hide only those legacy base cards everywhere else.
      const showOriginalKenyaSeeds = countryCode === "KE";
      document.querySelectorAll<HTMLElement>(".panel .provider").forEach(card => {
        setVisible(card, showOriginalKenyaSeeds);
      });
      document.querySelectorAll<HTMLElement>(".panel .job-card").forEach(card => {
        setVisible(card, showOriginalKenyaSeeds);
      });

      document.querySelectorAll<HTMLElement>(".anyday-demo-worker-card[data-demo-id]").forEach(card => {
        const profile = workerById.get(card.dataset.demoId || "");
        setVisible(card, !regionalWorkersPresent && workerVisible(profile));
        const nextOrder = profile && normalizedCode(profile.country_code) === countryCode ? "0" : "1";
        if (card.style.order !== nextOrder) card.style.setProperty("order", nextOrder);
      });
      document.querySelectorAll<HTMLElement>(".anyday-demo-job-card[data-demo-id]").forEach(card => {
        const job = jobById.get(card.dataset.demoId || "");
        setVisible(card, !regionalJobsPresent && jobVisible(job));
        const nextOrder = job && normalizedCode(job.country_code) === countryCode ? "0" : "1";
        if (card.style.order !== nextOrder) card.style.setProperty("order", nextOrder);
      });
    }

    function apply() {
      if (!stopped) applyCardFilter();
    }

    function schedule() {
      window.clearTimeout(scheduled);
      scheduled = window.setTimeout(apply, 40);
    }

    apply();
    observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("anydaywork:country-changed", schedule);
    document.addEventListener("click", schedule, true);

    return () => {
      stopped = true;
      window.clearTimeout(scheduled);
      observer?.disconnect();
      window.removeEventListener("anydaywork:country-changed", schedule);
      document.removeEventListener("click", schedule, true);
    };
  }, [pathname, countryCode, query, workerById, jobById]);

  return null;
}
