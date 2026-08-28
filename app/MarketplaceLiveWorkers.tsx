"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

type Worker = {
  provider_id: string;
  full_name: string | null;
  area: string | null;
  avatar_url: string | null;
  bio: string | null;
  service_title: string | null;
  service_category: string | null;
  service_description: string | null;
  price_from: number | null;
  price_to: number | null;
  availability_status: string | null;
  latitude: number | null;
  longitude: number | null;
  portfolio_count: number;
  rating_avg: number;
  rating_count: number;
  created_at: string;
};

type Coordinates = { lat: number; lng: number };

const AREA_CENTRES: Record<string, Coordinates> = {
  "nairobi": { lat: -1.2864, lng: 36.8172 },
  "cbd": { lat: -1.2864, lng: 36.8172 },
  "kilimani": { lat: -1.2921, lng: 36.7854 },
  "kileleshwa": { lat: -1.2874, lng: 36.7811 },
  "lavington": { lat: -1.2778, lng: 36.7759 },
  "westlands": { lat: -1.2676, lng: 36.8108 },
  "langata": { lat: -1.3521, lng: 36.7357 },
  "south b": { lat: -1.3150, lng: 36.8335 },
  "south c": { lat: -1.3207, lng: 36.8262 },
  "karen": { lat: -1.3190, lng: 36.7073 },
  "ruaka": { lat: -1.2068, lng: 36.7784 },
  "kasarani": { lat: -1.2258, lng: 36.8980 },
  "embakasi": { lat: -1.3227, lng: 36.8952 },
  "donholm": { lat: -1.3008, lng: 36.8846 },
  "buruburu": { lat: -1.2794, lng: 36.8790 },
  "umoja": { lat: -1.2808, lng: 36.8950 },
  "pangani": { lat: -1.2677, lng: 36.8397 },
  "parklands": { lat: -1.2587, lng: 36.8173 },
  "roysambu": { lat: -1.2187, lng: 36.8865 },
  "rongai": { lat: -1.3964, lng: 36.7646 },
  "ongata rongai": { lat: -1.3964, lng: 36.7646 },
};

function money(value: number | null) {
  return value == null ? null : `KSh ${Number(value).toLocaleString("en-KE")}`;
}

function priceLabel(worker: Worker) {
  const a = money(worker.price_from);
  const b = money(worker.price_to);
  if (a && b) return `${a} - ${b}`;
  if (a) return `From ${a}`;
  if (b) return `Up to ${b}`;
  return "Price to discuss";
}

function workerPoint(worker: Worker): Coordinates | null {
  if (Number.isFinite(Number(worker.latitude)) && Number.isFinite(Number(worker.longitude))) {
    return { lat: Number(worker.latitude), lng: Number(worker.longitude) };
  }
  const key = (worker.area || "").trim().toLowerCase();
  return AREA_CENTRES[key] || null;
}

function statusLabel(worker: Worker) {
  return (worker.availability_status || "available").toLowerCase() === "busy" ? "BUSY" : "AVAILABLE";
}

export default function MarketplaceLiveWorkers() {
  const pathname = usePathname();
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (pathname !== "/") return;
    let stopped = false;
    let observer: MutationObserver | null = null;

    function attach() {
      const titles = Array.from(document.querySelectorAll<HTMLElement>(".section-title"));
      const title = titles.find(node =>
        (node.textContent || "").replace(/\s+/g, " ").trim().toLowerCase().startsWith("people who can help")
      );
      if (!title || !title.parentElement) return;
      let node = document.getElementById("kzk-live-workers-mount") as HTMLElement | null;
      if (!node) {
        node = document.createElement("div");
        node.id = "kzk-live-workers-mount";
        title.insertAdjacentElement("afterend", node);
      }
      if (!stopped) setMount(node);
    }

    attach();
    observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    function capture(event: Event) {
      const input = event.target as HTMLInputElement | null;
      if (!input || input.tagName !== "INPUT") return;
      const placeholder = (input.placeholder || "").toLowerCase();
      if (placeholder.includes("what do you need") || placeholder.includes("search") || placeholder.includes("service")) {
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
      setLoading(true);
      const { data, error: loadError } = await supabase.rpc("get_public_marketplace_workers");
      if (!active) return;
      if (loadError) {
        setError(loadError.message);
        setWorkers([]);
      } else {
        setError(null);
        setWorkers((data || []) as Worker[]);
      }
      setLoading(false);
    }
    void load();
    const timer = window.setInterval(load, 20000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [pathname]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return workers;
    return workers.filter(worker =>
      [worker.full_name, worker.service_title, worker.service_category, worker.service_description, worker.bio, worker.area]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [workers, search]);

  useEffect(() => {
    if (!mount) return;
    const parent = mount.parentElement;
    if (!parent) return;
    const cards = Array.from(parent.children).filter(
      el => el !== mount && (el as HTMLElement).classList?.contains("provider")
    ) as HTMLElement[];
    if (!loading && !error && workers.length > 0) cards.forEach(card => (card.style.display = "none"));
    else cards.forEach(card => card.style.removeProperty("display"));
    return () => cards.forEach(card => card.style.removeProperty("display"));
  }, [mount, loading, error, workers.length]);

  useEffect(() => {
    if (pathname !== "/" || loading || error) return;
    const w = window as any;
    let cancelled = false;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries++;
      if (cancelled) return;
      const mapEl = document.querySelector<HTMLElement>(".leaflet-container");
      const L = w.L;
      if (!mapEl || !L) {
        if (tries > 60) window.clearInterval(timer);
        return;
      }
      const map = (mapEl as any).__kzkMarketplaceMap || w.__kzkMarketplaceMap || (mapEl as any)._leaflet_map || Object.values(w).find(
        (value: any) => value && typeof value === "object" && value._container === mapEl && typeof value.addLayer === "function"
      );
      if (!map) {
        if (tries > 60) window.clearInterval(timer);
        return;
      }
      window.clearInterval(timer);
      (mapEl as any).__kzkLiveWorkerGroup?.remove?.();
      const group = L.layerGroup().addTo(map);
      visible.forEach(worker => {
        const point = workerPoint(worker);
        if (!point) return;
        const busy = statusLabel(worker) === "BUSY";
        const icon = L.divIcon({
          className: "kzk-live-worker-marker",
          html: `<div style="width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:${busy ? "#d97706" : "#16803d"};border:3px solid white;box-shadow:0 2px 9px rgba(0,0,0,.28);font-size:16px">🛠</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });
        const marker = L.marker([point.lat, point.lng], { icon }).addTo(group);
        marker.bindTooltip(`${worker.full_name || "Worker"} · ${worker.service_title || "Service"}`);
        marker.on("click", () => { window.location.href = `/profile/${worker.provider_id}`; });
      });
      (mapEl as any).__kzkLiveWorkerGroup = group;
    }, 200);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      const mapEl = document.querySelector<HTMLElement>(".leaflet-container") as any;
      mapEl?.__kzkLiveWorkerGroup?.remove?.();
      if (mapEl) delete mapEl.__kzkLiveWorkerGroup;
    };
  }, [pathname, visible, loading, error]);

  if (pathname !== "/" || !mount) return null;

  return createPortal(
    <div className="kzk-live-workers">
      {loading && <div className="worker-note">Loading current worker profiles…</div>}
      {!loading && error && <div className="worker-note">Could not load live worker profiles. Showing the existing marketplace workers.</div>}
      {!loading && !error && visible.length === 0 && <div className="worker-note">No worker profiles match your search.</div>}
      {!loading && !error && visible.map(worker => {
        const status = statusLabel(worker);
        return (
          <button className="live-worker-card" key={worker.provider_id} type="button" onClick={() => { window.location.href = `/profile/${worker.provider_id}`; }}>
            <div className="worker-top">
              {worker.avatar_url ? <img src={worker.avatar_url} alt={`${worker.full_name || "Worker"} profile`} /> : <div className="worker-avatar">👤</div>}
              <div className="worker-main">
                <div className="worker-name-row"><b>{worker.full_name || "Kazi za Kenya worker"}</b><span className={status === "BUSY" ? "busy" : "available"}>● {status}</span></div>
                <p>{worker.service_title || worker.service_category || "General services"}</p>
                <small>📍 {worker.area || "Kenya"}{worker.latitude == null ? " · approximate area" : ""}</small>
              </div>
            </div>
            <div className="worker-stats">
              <span>{Number(worker.rating_count) > 0 ? `⭐ ${Number(worker.rating_avg).toFixed(1)} · ${Number(worker.rating_count)} review${Number(worker.rating_count) === 1 ? "" : "s"}` : "☆ New worker"}</span>
              <strong>{priceLabel(worker)}</strong>
            </div>
            <div className="worker-proof">✓ {Number(worker.portfolio_count) || 0} proof-of-work photo{Number(worker.portfolio_count) === 1 ? "" : "s"} · View profile</div>
          </button>
        );
      })}
      <style jsx global>{`
        #kzk-live-workers-mount{width:100%}.kzk-live-workers{display:grid;gap:9px;margin-bottom:10px}.worker-note{border:1px solid #dce5dd;border-radius:12px;background:#fff;padding:12px;color:#66736b;font-size:12px}.live-worker-card{width:100%;text-align:left;border:1px solid #dce4dc;background:#fff;border-radius:13px;padding:12px;cursor:pointer;color:#17221b;font-family:inherit}.live-worker-card:hover{background:#f7fbf8}.worker-top{display:flex;gap:11px;align-items:flex-start}.worker-top img,.worker-avatar{width:42px;height:42px;border-radius:50%;object-fit:cover;border:1px solid #d8e1da;flex:0 0 auto}.worker-avatar{display:grid;place-items:center;background:#eef5ef}.worker-main{min-width:0;flex:1}.worker-name-row{display:flex;justify-content:space-between;align-items:center;gap:8px}.worker-name-row b{font-size:13px}.worker-name-row span{font-size:9px;font-weight:900;white-space:nowrap}.worker-name-row .available{color:#16803d}.worker-name-row .busy{color:#d97706}.worker-main p{margin:3px 0 5px;color:#5f6e65;font-size:11px}.worker-main small{font-size:9px;color:#77847c}.worker-stats{display:flex;justify-content:space-between;gap:10px;border-top:1px solid #edf1ed;margin-top:10px;padding-top:9px;font-size:10px}.worker-stats strong{white-space:nowrap}.worker-proof{border-top:1px solid #edf1ed;margin-top:8px;padding-top:8px;color:#5d7364;font-size:9px}.kzk-live-worker-marker{background:transparent!important;border:0!important}@media(max-width:560px){.worker-name-row{align-items:flex-start}.worker-stats{flex-direction:column}.worker-stats strong{white-space:normal}}
      `}</style>
    </div>,
    mount
  );
}
