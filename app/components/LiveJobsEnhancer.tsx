"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://pnqmqxeuzcodnxdixnvc.supabase.co", "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l");
export default function LiveJobsEnhancer() {
  useEffect(() => {
    let stopped = false;
    async function loadJobs() {
      if (window.location.pathname !== "/") return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || stopped) return;
      const { data: jobs, error } = await supabase.from("jobs").select("id,title,description,category,budget_min,budget_max,county,area,road,status,created_at,customer_id").eq("status", "available").order("created_at", { ascending: false }).limit(30);
      if (error || !jobs || stopped) return;
      const ids = jobs.map(j => j.id); const customerIds = [...new Set(jobs.map(j => j.customer_id))];
      const [{ data: photos }, { data: profiles }] = await Promise.all([
        supabase.from("job_photos").select("job_id,photo_url,created_at").in("job_id", ids).order("created_at", { ascending: true }),
        supabase.from("profiles").select("id,full_name").in("id", customerIds)
      ]);
      if (stopped) return;
      const panel = document.querySelector(".panel"); if (!panel) return;
      const heading = Array.from(panel.querySelectorAll(".section-title")).find(el => (el.textContent || "").includes("Jobs people need done"));
      if (!heading) return;
      let live = panel.querySelector(".live-jobs-from-db") as HTMLElement | null;
      if (!live) { live = document.createElement("div"); live.className = "live-jobs-from-db"; heading.insertAdjacentElement("afterend", live); }
      const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name || "Kazi za Kenya user"]));
      const photoMap = new Map<string,string[]>(); (photos || []).forEach(p => { const a = photoMap.get(p.job_id) || []; if (p.photo_url) a.push(p.photo_url); photoMap.set(p.job_id, a); });
      live.innerHTML = jobs.map(job => {
        const jp = photoMap.get(job.id) || []; const photo = jp[0] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80";
        const customer = profileMap.get(job.customer_id) || "Kazi za Kenya user";
        const budget = job.budget_min != null && job.budget_max != null ? `KSh ${Number(job.budget_min).toLocaleString()} - ${Number(job.budget_max).toLocaleString()}` : job.budget_min != null ? `From KSh ${Number(job.budget_min).toLocaleString()}` : "Budget not specified";
        return `<button type="button" class="job-card live-job-card" data-live-job-id="${job.id}"><div class="job-photo"><img src="${photo}" alt="${escapeHtml(job.title)}"/><span class="job-status open">OPEN</span><span class="photo-count">📷 ${jp.length}</span></div><div class="job-content"><div class="job-title">${escapeHtml(job.title)}</div><div class="job-customer">👤 ${escapeHtml(customer)}</div><div class="job-location">📍 ${escapeHtml(job.area || job.county || "Kenya")} · ${escapeHtml(job.road || "Location shared privately")}</div><div class="job-details-row"><span>💰 ${escapeHtml(budget)}</span><span>🕒 ${job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recently posted"}</span></div></div></button>`;
      }).join("");
    }
    function escapeHtml(value:string){return value.replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]||c));}
    void loadJobs(); const interval = window.setInterval(() => void loadJobs(), 5000);
    return () => { stopped = true; window.clearInterval(interval); };
  }, []);
  return null;
}
