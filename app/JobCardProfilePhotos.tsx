"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";

type MarketplaceJob = { id: string; title: string };
type JobDetail = {
  employer_avatar_url?: string | null;
  employer_profile_photo_url?: string | null;
};

function normalize(value: string | null | undefined) {
  return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
}

export default function JobCardProfilePhotos() {
  useEffect(() => {
    let stopped = false;
    let titlePhotos = new Map<string, string>();

    function applyPhotos() {
      document.querySelectorAll<HTMLElement>("button.job").forEach(card => {
        const title = normalize(card.querySelector("b")?.textContent);
        const photo = titlePhotos.get(title);
        if (!photo) {
          card.classList.remove("kzk-job-has-profile-photo");
          card.style.removeProperty("--kzk-job-profile-photo");
          return;
        }
        card.classList.add("kzk-job-has-profile-photo");
        card.style.setProperty("--kzk-job-profile-photo", `url(\"${photo.replace(/\"/g, "%22")}\")`);
      });
    }

    async function loadPhotos() {
      const { data: jobs, error } = await supabase.rpc("get_public_marketplace_jobs");
      if (stopped || error || !Array.isArray(jobs)) return;

      const next = new Map<string, string>();
      await Promise.all(
        (jobs as MarketplaceJob[]).map(async job => {
          const { data } = await supabase.rpc("get_public_job_detail", { p_job_id: job.id });
          if (stopped) return;
          const row = Array.isArray(data) ? data[0] : data;
          const detail = row as JobDetail | null;
          const photo = detail?.employer_profile_photo_url || detail?.employer_avatar_url || null;
          if (photo && !next.has(normalize(job.title))) next.set(normalize(job.title), photo);
        })
      );

      if (stopped) return;
      titlePhotos = next;
      applyPhotos();
    }

    const observer = new MutationObserver(applyPhotos);
    observer.observe(document.body, { childList: true, subtree: true });

    void loadPhotos();
    const timer = window.setInterval(loadPhotos, 20000);

    return () => {
      stopped = true;
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <style jsx global>{`
      button.job.kzk-job-has-profile-photo {
        position: relative;
        min-height: 88px;
        padding-left: 82px !important;
      }
      button.job.kzk-job-has-profile-photo::before {
        content: "";
        position: absolute;
        left: 13px;
        top: 50%;
        width: 56px;
        height: 56px;
        transform: translateY(-50%);
        border-radius: 50%;
        background-image: var(--kzk-job-profile-photo);
        background-size: cover;
        background-position: center;
        border: 2px solid #d8e5db;
        box-shadow: 0 2px 7px rgba(0,0,0,.10);
      }
      @media (max-width: 560px) {
        button.job.kzk-job-has-profile-photo {
          min-height: 82px;
          padding-left: 75px !important;
        }
        button.job.kzk-job-has-profile-photo::before {
          left: 11px;
          width: 52px;
          height: 52px;
        }
      }
    `}</style>
  );
}
