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

      const { data: jobs } = await supabase
        .from("jobs")
        .select("id,title,description,category,budget_min,budget_max,county,area,road,status,created_at,customer_id")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(30);

      if (!jobs || !jobs.length || stopped) return;

      const ids = jobs.map((job) => job.id);
      const customerIds = [...new Set(jobs.map((job) => job.customer_id))];
      const [{ data: photos }, { data: profiles }] = await Promise.all([
        supabase.from("job_photos").select("job_id,photo_url,created_at").in("job_id", ids).order("created_at", { ascending: true }),
        supabase.from("profiles").select("id,full_name").in("id", customerIds),
      ]);

      if (stopped) return;

      const panel = document.querySelector(".panel");
      if (!panel) return;
      const headings = Array.from(panel.querySelectorAll(".section-title"));
      const heading = headings.find((el) => (el.textContent || "").includes("Jobs people need done"));
      if (!heading) return;

      let live = panel.querySelector(".live-jobs-from-db") as HTMLElement | null;
      if (!live) {
        live = document.createElement("div");
        live.className = "live-jobs-from-db";
        heading.insertAdjacentElement("afterend", live);
      }

      const profileMap = new Map((profiles || []).map((p) => [p.id, p.full_name || "Kazi za Kenya user"]));
      const photoMap = new Map<string, string[]>();
      (photos || []).forEach((p) => {
        const arr = photoMap.get(p.job_id) || [];
        if (p.photo_url) arr.push(p.photo_url);
        photoMap.set(p.job_id, arr);
      });

      live.innerHTML = jobs.map((job) => {
        const jobPhotos = photoMap.get(job.id) || [];
        const photo = jobPhotos[0] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80";
        const customer = profileMap.get(job.customer_id) || "Kazi za Kenya user";
        const budget = job.budget_min != null && job.budget_max != null
          ? `KSh ${Number(job.budget_min).toLocaleString()} - ${Number(job.budget_max).toLocaleString()}`
          : job.budget_min != null
            ? `From KSh ${Number(job.budget_min).toLocaleString()}`
            : "Budget not specified";
        const when = job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recently posted";
        return `<button type="button" class="job-card live-job-card" data-live-job-id="${job.id}">
          <div class="job-photo"><img src="${photo}" alt="${escapeHtml(job.title)}"/><span class="job-status open">OPEN</span><span class="photo-count">📷 ${jobPhotos.length}</span></div>
          <div class="job-content"><div class="job-title">${escapeHtml(job.title)}</div><div class="job-customer">👤 ${escapeHtml(customer)}</div><div class="job-location">📍 ${escapeHtml(job.area || job.county || "Kenya")} · ${escapeHtml(job.road || "Location shared privately")}</div><div class="job-details-row"><span>💰 ${escapeHtml(budget)}</span><span>🕒 ${when}</span></div></div>
        </button>`;
      }).join("");

      panel.querySelectorAll(".job-card:not(.live-job-card)").forEach((el) => ((el as HTMLElement).style.display = "none"));
    }

    function escapeHtml(value: string) {
      return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" }[char] || char));
    }

    const observer = new MutationObserver(() => { void loadJobs(); });
    observer.observe(document.body, { childList: true, subtree: true });
    void loadJobs();

    return () => {
      stopped = true;
      observer.disconnect();
    };
  }, []);

  return null;
}
