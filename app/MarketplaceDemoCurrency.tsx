"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

type DemoJobMoney = {
  id: string;
  title: string;
  budget_min: number | null;
  budget_max: number | null;
  currency_code: string | null;
};

function amount(value: number | null, currency: string | null) {
  if (value == null) return null;
  const code = (currency || "KES").toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch {
    return `${code} ${Number(value).toLocaleString()}`;
  }
}

function budget(job: DemoJobMoney) {
  const low = amount(job.budget_min, job.currency_code);
  const high = amount(job.budget_max, job.currency_code);
  if (low && high) return `${low} - ${high}`;
  if (low) return `From ${low}`;
  if (high) return `Up to ${high}`;
  return "Budget to discuss";
}

export default function MarketplaceDemoCurrency() {
  const pathname = usePathname();
  const [jobs, setJobs] = useState<DemoJobMoney[]>([]);

  useEffect(() => {
    if (pathname !== "/") return;
    let active = true;
    async function load() {
      const { data, error } = await supabase
        .from("demo_jobs")
        .select("id,title,budget_min,budget_max,currency_code")
        .eq("is_demo", true);
      if (active && !error) setJobs((data || []) as DemoJobMoney[]);
    }
    void load();
    const timer = window.setInterval(load, 30000);
    return () => { active = false; window.clearInterval(timer); };
  }, [pathname]);

  const byId = useMemo(() => new Map(jobs.map(job => [job.id, job])), [jobs]);
  const byTitle = useMemo(() => new Map(jobs.map(job => [job.title.trim().toLowerCase(), job])), [jobs]);

  useEffect(() => {
    if (pathname !== "/" || jobs.length === 0) return;
    let scheduled = 0;

    const apply = () => {
      document.querySelectorAll<HTMLElement>(".anyday-demo-job-card[data-demo-id]").forEach(card => {
        const job = byId.get(card.dataset.demoId || "");
        const target = card.querySelector<HTMLElement>("footer strong");
        if (job && target) target.textContent = budget(job);
      });

      const modal = document.querySelector<HTMLElement>(".anyday-job-modal");
      if (modal) {
        const title = modal.querySelector<HTMLElement>(".anyday-job-detail b")?.textContent?.trim().toLowerCase() || "";
        const job = byTitle.get(title);
        const target = modal.querySelector<HTMLElement>(".anyday-job-detail strong");
        if (job && target) target.textContent = budget(job);
      }
    };

    const schedule = () => {
      window.clearTimeout(scheduled);
      scheduled = window.setTimeout(apply, 20);
    };

    apply();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    const timer = window.setInterval(apply, 1000);
    return () => {
      window.clearTimeout(scheduled);
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [pathname, jobs, byId, byTitle]);

  return null;
}
