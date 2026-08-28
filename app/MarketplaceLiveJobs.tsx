"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

type LiveJob = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  budget_min: number | null;
  budget_max: number | null;
  county: string;
  area: string | null;
  road: string | null;
  location_text: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

function money(value: number | null) {
  if (value === null || Number.isNaN(Number(value))) return null;
  return `KSh ${Number(value).toLocaleString("en-KE")}`;
}
function budget(job: LiveJob) {
  const min = money(job.budget_min), max = money(job.budget_max);
  if (min && max) return `${min} - ${max}`;
  if (min) return `From ${min}`;
  if (max) return `Up to ${max}`;
  return "Budget to discuss";
}
function when(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 60) return minutes <= 1 ? "Just now" : `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function MarketplaceLiveJobs() {
  const pathname = usePathname();
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [selected, setSelected] = useState<LiveJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (pathname !== "/") return;
    let stopped = false;
    let observer: MutationObserver | null = null;
    function attach() {
      const titles = Array.from(document.querySelectorAll<HTMLElement>(".section-title"));
      const title = titles.find((node) => (node.textContent || "").replace(/\s+/g, " ").trim() === "Jobs people need done");
      if (!title || !title.parentElement) return;
      let node = document.getElementById("kzk-live-jobs-mount") as HTMLElement | null;
      if (!node) { node = document.createElement("div"); node.id = "kzk-live-jobs-mount"; title.insertAdjacentElement("afterend", node); }
      if (!stopped) setMount(node);
    }
    attach(); observer = new MutationObserver(attach); observer.observe(document.body, { childList: true, subtree: true });
    function captureSearch(event: Event) {
      const input = event.target as HTMLInputElement | null;
      if (!input || input.tagName !== "INPUT") return;
      const placeholder = (input.placeholder || "").toLowerCase();
      if (placeholder.includes("search") || placeholder.includes("service") || placeholder.includes("area")) setSearch(input.value || "");
    }
    document.addEventListener("input", captureSearch, true);
    return () => { stopped = true; observer?.disconnect(); document.removeEventListener("input", captureSearch, true); };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    let active = true;
    async function loadJobs() {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_public_marketplace_jobs");
      if (!active) return;
      if (error) { setError(error.message); setJobs([]); }
      else { setError(null); setJobs((data || []) as LiveJob[]); }
      setLoading(false);
    }
    loadJobs();
    const timer = window.setInterval(loadJobs, 20000);
    return () => { active = false; window.clearInterval(timer); };
  }, [pathname]);

  useEffect(() => {
    if (!mount) return;
    const parent = mount.parentElement; if (!parent) return;
    const legacyCards = Array.from(parent.children).filter((el) => el !== mount && (el as HTMLElement).classList?.contains("job-card")) as HTMLElement[];
    if (!loading && !error) legacyCards.forEach((card) => { card.dataset.kzkLegacyHidden = "1"; card.style.display = "none"; });
    else legacyCards.forEach((card) => { if (card.dataset.kzkLegacyHidden === "1") { card.style.removeProperty("display"); delete card.dataset.kzkLegacyHidden; } });
    return () => legacyCards.forEach((card) => { if (card.dataset.kzkLegacyHidden === "1") { card.style.removeProperty("display"); delete card.dataset.kzkLegacyHidden; } });
  }, [mount, loading, error]);

  const visible = useMemo(() => {
    const q = search.toLowerCase().trim(); if (!q) return jobs;
    return jobs.filter((job) => `${job.title} ${job.description} ${job.category || ""} ${job.area || ""} ${job.road || ""} ${job.location_text || ""} ${job.county || ""}`.toLowerCase().includes(q));
  }, [jobs, search]);

  if (pathname !== "/" || !mount) return null;
  return createPortal(<>
    <div className="kzk-live-wrap">
      <div className="kzk-live-label"><span className="kzk-live-dot" /> Live marketplace jobs</div>
      {loading && <div className="kzk-live-note">Loading current jobs…</div>}
      {!loading && error && <div className="kzk-live-note error">Could not load live jobs. Showing the existing marketplace list.</div>}
      {!loading && !error && visible.length === 0 && jobs.length > 0 && <div className="kzk-live-note">No live jobs match your search.</div>}
      {!loading && !error && jobs.length === 0 && <div className="kzk-live-note">No live jobs have been posted yet.</div>}
      {!loading && !error && visible.map((job) => <button className="kzk-live-card" type="button" key={job.id} onClick={() => setSelected(job)}>
        <div className="kzk-live-icon">🛠️</div><div className="kzk-live-main"><div className="kzk-live-top"><strong>{job.title}</strong><span>OPEN</span></div><div className="kzk-live-meta">{job.category || "General work"} · {job.area || job.location_text || job.county}</div><div className="kzk-live-bottom"><b>{budget(job)}</b><span>{when(job.created_at)}</span></div></div>
      </button>)}
    </div>
    {selected && createPortal(<div className="kzk-live-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.currentTarget === e.target) setSelected(null); }}><section className="kzk-live-modal" role="dialog" aria-modal="true" aria-label="Job details"><button className="kzk-live-close" type="button" onClick={() => setSelected(null)} aria-label="Close">×</button><div className="kzk-live-modal-tag">LIVE JOB · OPEN</div><h2>{selected.title}</h2><div className="kzk-live-modal-sub">📍 {selected.area || selected.location_text || selected.county}{selected.road ? ` · ${selected.road}` : ""}</div><div className="kzk-live-budget">{budget(selected)}</div><p>{selected.description}</p><div className="kzk-live-customer">Posted through Kazi za Kenya · {when(selected.created_at)}</div><button className="kzk-live-action" type="button" onClick={async () => { const { data } = await supabase.auth.getUser(); if (!data.user) { window.location.href = `/login?next=${encodeURIComponent(`/jobs/respond?job=${selected.id}`)}`; return; } window.location.href = `/jobs/respond?job=${selected.id}`; }}>I’m interested in this job</button></section></div>, document.body)}
    <style jsx global>{`#kzk-live-jobs-mount{display:block;width:100%}.kzk-live-wrap{display:grid;gap:10px;margin:0 0 12px}.kzk-live-label{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;color:#13753a;padding:3px 2px}.kzk-live-dot{width:8px;height:8px;border-radius:50%;background:#16a34a;box-shadow:0 0 0 4px rgba(22,163,74,.12)}.kzk-live-note{padding:12px;border:1px solid #dfe7df;border-radius:12px;background:#f8faf8;color:#5d6b61;font-size:12px}.kzk-live-note.error{border-color:#f0d5d5;background:#fff8f8;color:#8b3333}.kzk-live-card{width:100%;border:1px solid #dce5dd;border-radius:14px;background:#fff;padding:12px;display:flex;gap:11px;text-align:left;cursor:pointer;box-shadow:0 4px 14px rgba(24,53,34,.06);font-family:inherit;color:#16251b}.kzk-live-card:hover{border-color:#98c9a8;box-shadow:0 7px 20px rgba(24,53,34,.10)}.kzk-live-icon{width:39px;height:39px;border-radius:11px;background:#eef8f1;display:grid;place-items:center;font-size:20px;flex:none}.kzk-live-main{min-width:0;flex:1}.kzk-live-top{display:flex;gap:8px;align-items:flex-start;justify-content:space-between}.kzk-live-top strong{font-size:13px;line-height:1.3}.kzk-live-top span{font-size:9px;font-weight:900;color:#fff;background:#16803d;border-radius:999px;padding:3px 6px;white-space:nowrap}.kzk-live-meta{font-size:11px;color:#6a776f;margin:5px 0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kzk-live-bottom{display:flex;justify-content:space-between;gap:10px;align-items:center;font-size:11px}.kzk-live-bottom b{color:#1d5b33}.kzk-live-bottom span{color:#7d8781}.kzk-live-modal-backdrop{position:fixed;inset:0;z-index:100000;background:rgba(15,23,18,.55);display:grid;place-items:center;padding:20px}.kzk-live-modal{position:relative;width:min(560px,96vw);max-height:88vh;overflow:auto;background:#fff;border-radius:20px;padding:26px;box-shadow:0 28px 80px rgba(0,0,0,.28);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#17221b}.kzk-live-close{position:absolute;right:16px;top:13px;border:0;background:transparent;font-size:30px;line-height:1;cursor:pointer;color:#536057}.kzk-live-modal-tag{font-size:10px;font-weight:900;color:#16803d;letter-spacing:.05em;margin-bottom:8px}.kzk-live-modal h2{font-size:24px;line-height:1.2;margin:0 40px 8px 0}.kzk-live-modal-sub{font-size:12px;color:#69756d}.kzk-live-budget{margin:16px 0 8px;font-size:18px;font-weight:900;color:#156f37}.kzk-live-modal p{line-height:1.6;color:#48554c}.kzk-live-customer{font-size:12px;color:#69756d;border-top:1px solid #e6ece7;padding-top:14px;margin-top:14px}.kzk-live-action{width:100%;margin-top:18px;border:0;border-radius:11px;background:#16803d;color:#fff;padding:13px 16px;font-weight:850;cursor:pointer}.kzk-live-action:hover{background:#126b33}@media(max-width:640px){.kzk-live-modal{padding:22px}.kzk-live-modal h2{font-size:21px}}`}</style>
  </>, mount);
}
