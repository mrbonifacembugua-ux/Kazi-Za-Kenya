"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

type ExternalWorker = {
  id: string;
  display_name: string | null;
  service_title: string;
  service_category: string | null;
  description: string | null;
  county: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  location_precision: "county" | "town" | "area";
  source_name: string;
  source_url: string;
  source_posted_at: string | null;
  found_at: string;
};

type ExternalJob = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  county: string;
  area: string | null;
  budget_min: number | null;
  budget_max: number | null;
  latitude: number | null;
  longitude: number | null;
  location_precision: "county" | "town" | "area";
  source_name: string;
  source_url: string;
  source_posted_at: string | null;
  found_at: string;
};

function currentMode() {
  const active = Array.from(document.querySelectorAll<HTMLElement>(".main-tab")).find(tab => tab.classList.contains("active"));
  return (active?.textContent || "").toLowerCase().includes("job") ? "jobs" : "workers";
}

function money(value: number | null) {
  return value == null ? null : `KSh ${Number(value).toLocaleString("en-KE")}`;
}

function budgetLabel(job: ExternalJob) {
  const min = money(job.budget_min);
  const max = money(job.budget_max);
  if (min && max) return `${min} - ${max}`;
  if (min) return `From ${min}`;
  if (max) return `Up to ${max}`;
  return "Budget on source listing";
}

function locationLabel(area: string | null, county: string) {
  return area ? `${area}, ${county}` : county;
}

function openSource(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function MarketplaceExternalListings() {
  const pathname = usePathname();
  const [workerMount, setWorkerMount] = useState<HTMLElement | null>(null);
  const [jobMount, setJobMount] = useState<HTMLElement | null>(null);
  const [workers, setWorkers] = useState<ExternalWorker[]>([]);
  const [jobs, setJobs] = useState<ExternalJob[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (pathname !== "/") return;
    let stopped = false;
    let observer: MutationObserver | null = null;

    function ensureMount(afterId: string, mountId: string, setter: (node: HTMLElement) => void) {
      const anchor = document.getElementById(afterId);
      if (!anchor || !anchor.parentElement) return;
      let node = document.getElementById(mountId) as HTMLElement | null;
      if (!node) {
        node = document.createElement("div");
        node.id = mountId;
        anchor.insertAdjacentElement("afterend", node);
      }
      if (!stopped) setter(node);
    }

    function attach() {
      ensureMount("kzk-live-workers-mount", "kzk-external-workers-mount", setWorkerMount);
      ensureMount("kzk-live-jobs-mount", "kzk-external-jobs-mount", setJobMount);
    }

    attach();
    observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    function capture(event: Event) {
      const input = event.target as HTMLInputElement | null;
      if (!input || input.tagName !== "INPUT") return;
      const placeholder = (input.placeholder || "").toLowerCase();
      if (placeholder.includes("search") || placeholder.includes("service") || placeholder.includes("area") || placeholder.includes("what do you need")) {
        setSearch(input.value || "");
      }
    }

    document.addEventListener("input", capture, true);
    return () => {
      stopped = true;
      observer?.disconnect();
      document.removeEventListener("input", capture, true);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    let active = true;

    async function load() {
      const [workerResult, jobResult] = await Promise.all([
        supabase.from("external_workers").select("id,display_name,service_title,service_category,description,county,area,latitude,longitude,location_precision,source_name,source_url,source_posted_at,found_at").order("found_at", { ascending: false }).limit(100),
        supabase.from("external_jobs").select("id,title,description,category,county,area,budget_min,budget_max,latitude,longitude,location_precision,source_name,source_url,source_posted_at,found_at").order("found_at", { ascending: false }).limit(100),
      ]);
      if (!active) return;
      const firstError = workerResult.error || jobResult.error;
      if (firstError) {
        setError(firstError.message);
        return;
      }
      setError("");
      setWorkers((workerResult.data || []) as ExternalWorker[]);
      setJobs((jobResult.data || []) as ExternalJob[]);
    }

    void load();
    const timer = window.setInterval(load, 60000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [pathname]);

  const visibleWorkers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return workers;
    return workers.filter(worker => [worker.display_name, worker.service_title, worker.service_category, worker.description, worker.area, worker.county, worker.source_name].filter(Boolean).join(" ").toLowerCase().includes(q));
  }, [workers, search]);

  const visibleJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(job => [job.title, job.category, job.description, job.area, job.county, job.source_name].filter(Boolean).join(" ").toLowerCase().includes(q));
  }, [jobs, search]);

  useEffect(() => {
    if (pathname !== "/" || error) return;
    const w = window as any;
    let cancelled = false;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries++;
      if (cancelled) return;
      const mapEl = document.querySelector<HTMLElement>(".leaflet-container") as any;
      const L = w.L;
      if (!mapEl || !L) {
        if (tries > 40) window.clearInterval(timer);
        return;
      }
      const map = mapEl.__kzkMarketplaceMap || w.__kzkMarketplaceMap || mapEl._leaflet_map || Object.values(w).find((value: any) => value && typeof value === "object" && value._container === mapEl && typeof value.addLayer === "function");
      if (!map) {
        if (tries > 40) window.clearInterval(timer);
        return;
      }
      window.clearInterval(timer);

      const workerGroup = L.layerGroup();
      visibleWorkers.forEach(worker => {
        if (worker.latitude == null || worker.longitude == null) return;
        const icon = L.divIcon({
          className: "kzk-external-worker-marker",
          html: '<div style="width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#eaf6ed;color:#116a32;border:2px dashed #16803d;box-shadow:0 2px 7px rgba(0,0,0,.18);font-size:13px">↗</div>',
          iconSize: [30, 30], iconAnchor: [15, 15]
        });
        const marker = L.marker([Number(worker.latitude), Number(worker.longitude)], { icon }).addTo(workerGroup);
        marker.bindTooltip(`${worker.service_title} · External listing · ${locationLabel(worker.area, worker.county)}`);
        marker.on("click", () => openSource(worker.source_url));
      });

      const jobGroup = L.layerGroup();
      visibleJobs.forEach(job => {
        if (job.latitude == null || job.longitude == null) return;
        const icon = L.divIcon({
          className: "kzk-external-job-marker",
          html: '<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#fff4f4;border:2px dashed #b91c1c;box-shadow:0 2px 7px rgba(0,0,0,.18)"><div style="transform:rotate(45deg);text-align:center;line-height:24px;font-size:11px;color:#991b1b">↗</div></div>',
          iconSize: [28, 28], iconAnchor: [14, 28]
        });
        const marker = L.marker([Number(job.latitude), Number(job.longitude)], { icon }).addTo(jobGroup);
        marker.bindTooltip(`${job.title} · External job · ${locationLabel(job.area, job.county)}`);
        marker.on("click", () => openSource(job.source_url));
      });

      const previousWorkers = mapEl.__kzkExternalWorkerGroup;
      const previousJobs = mapEl.__kzkExternalJobGroup;
      const mode = currentMode();
      if (mode === "workers") workerGroup.addTo(map);
      if (mode === "jobs") jobGroup.addTo(map);
      mapEl.__kzkExternalWorkerGroup = workerGroup;
      mapEl.__kzkExternalJobGroup = jobGroup;
      previousWorkers?.remove?.();
      previousJobs?.remove?.();
      try { window.dispatchEvent(new CustomEvent("kzk:marketplace-layer-updated")); } catch (_) {}
    }, 200);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [pathname, visibleWorkers, visibleJobs, error]);

  if (pathname !== "/") return null;

  const workerPortal = workerMount ? createPortal(
    <div className="external-listings external-workers">
      {error && <div className="external-note">External listings are temporarily unavailable.</div>}
      {!error && visibleWorkers.map(worker => (
        <article className="external-card" key={worker.id}>
          <div className="external-heading"><span className="external-avatar">🛠</span><div><em>UNCLAIMED PUBLIC LISTING</em><b>{worker.display_name || worker.service_title}</b><p>{worker.display_name ? worker.service_title : (worker.service_category || "Worker available")}</p></div></div>
          <small>📍 {locationLabel(worker.area, worker.county)} · approximate {worker.location_precision} location</small>
          {worker.description && <p className="external-description">{worker.description}</p>}
          <footer><span>Found on {worker.source_name}</span><button type="button" onClick={() => openSource(worker.source_url)}>View original listing ↗</button></footer>
        </article>
      ))}
    </div>, workerMount) : null;

  const jobPortal = jobMount ? createPortal(
    <div className="external-listings external-jobs">
      {!error && visibleJobs.map(job => (
        <article className="external-card external-job" key={job.id}>
          <em>EXTERNAL JOB OPPORTUNITY</em><b>{job.title}</b>
          <small>{job.category || "General work"} · 📍 {locationLabel(job.area, job.county)} · approximate {job.location_precision}</small>
          {job.description && <p className="external-description">{job.description}</p>}
          <div className="external-budget">{budgetLabel(job)}</div>
          <footer><span>Found on {job.source_name}</span><button type="button" onClick={() => openSource(job.source_url)}>View original job ↗</button></footer>
        </article>
      ))}
      <style jsx global>{`
        #kzk-external-workers-mount,#kzk-external-jobs-mount{width:100%}.external-listings{display:grid;gap:10px;margin:10px 0}.external-card{border:1px dashed #9fb9a6;background:#fbfdfb;border-radius:14px;padding:12px;color:#17221b}.external-card em{display:block;color:#7a5b16;font-size:9px;font-style:normal;font-weight:900;letter-spacing:.06em;margin-bottom:5px}.external-card>b,.external-heading b{display:block;font-size:13px}.external-heading{display:flex;gap:10px;align-items:center}.external-avatar{width:44px;height:44px;display:grid;place-items:center;border-radius:50%;background:#eef5ef;flex:0 0 44px}.external-heading p{margin:3px 0 0;color:#52645a;font-size:10px}.external-card>small{display:block;margin-top:7px;color:#758078;font-size:9px}.external-description{font-size:10px;line-height:1.4;color:#52645a;margin:8px 0}.external-budget{margin-top:7px;font-size:10px;font-weight:850;color:#126f36}.external-card footer{border-top:1px solid #edf1ed;margin-top:9px;padding-top:8px;display:flex;justify-content:space-between;align-items:center;gap:8px}.external-card footer span{font-size:9px;color:#758078}.external-card footer button{border:0;background:transparent;color:#15803d;font-size:10px;font-weight:850;cursor:pointer;padding:4px}.external-job{border-color:#d9b4b4;background:#fffdfd}.external-job em{color:#991b1b}.external-note{padding:10px;border-radius:10px;background:#f7faf7;color:#69766e;font-size:11px}.kzk-external-worker-marker,.kzk-external-job-marker{background:transparent!important;border:0!important}@media(max-width:560px){.external-card{padding:10px}.external-card footer{align-items:flex-start}.external-card footer button{text-align:right}}
      `}</style>
    </div>, jobMount) : null;

  return <>{workerPortal}{jobPortal}</>;
}
