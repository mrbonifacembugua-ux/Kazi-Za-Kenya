"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Provider = {
  id: string;
  name: string;
  service: string;
  area: string;
  road: string;
  km: string;
  price: string;
  rating: string;
  status: "AVAILABLE" | "TAKEN";
  photo: string;
  proof: string[];
  about: string;
  lat: number;
  lng: number;
};

type Job = {
  id: string;
  title: string;
  service: string;
  customer: string;
  area: string;
  road: string;
  budget: string;
  urgency: string;
  photo: string;
  photos: string[];
  lat: number;
  lng: number;
};

declare global {
  interface Window {
    L?: any;
  }
}

const providers: Provider[] = [
  {
    id: "john",
    name: "John Mwangi",
    service: "TV & electronics repair",
    area: "Kilimani",
    road: "Near Ngong Road",
    km: "0.8 km",
    price: "From KSh 1,000",
    rating: "4.8",
    status: "AVAILABLE",
    lat: -1.2925,
    lng: 36.787,
    photo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80",
    proof: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1601944177325-f8867652837f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=900&q=80",
    ],
    about: "Experienced electronics technician helping households with TV, decoder and general electronics repairs.",
  },
  {
    id: "mary",
    name: "Mary Wanjiku",
    service: "House cleaning & laundry",
    area: "Kileleshwa",
    road: "Near Kileleshwa Road",
    km: "1.4 km",
    price: "From KSh 1,500",
    rating: "4.9",
    status: "AVAILABLE",
    lat: -1.276,
    lng: 36.777,
    photo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80",
    proof: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=80",
    ],
    about: "Reliable home cleaning and laundry services for regular or one-time household work.",
  },
  {
    id: "peter",
    name: "Peter Otieno",
    service: "Plumbing & repairs",
    area: "Lavington",
    road: "Near James Gichuru Road",
    km: "2.1 km",
    price: "From KSh 1,200",
    rating: "4.7",
    status: "TAKEN",
    lat: -1.2768,
    lng: 36.7807,
    photo: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=500&q=80",
    proof: [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    ],
    about: "Plumbing and household repair specialist handling leaks, fittings and general repairs.",
  },
  {
    id: "david",
    name: "David Kamau",
    service: "Moving & house help",
    area: "South B",
    road: "Near Likoni Road",
    km: "3.2 km",
    price: "From KSh 2,000",
    rating: "4.8",
    status: "AVAILABLE",
    lat: -1.309,
    lng: 36.824,
    photo: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=500&q=80",
    proof: [
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    ],
    about: "Moving assistance, loading, unloading and general house-help services.",
  },
  {
    id: "grace",
    name: "Grace Akinyi",
    service: "Electrical services",
    area: "Westlands",
    road: "Near Waiyaki Way",
    km: "4.0 km",
    price: "From KSh 1,000",
    rating: "4.9",
    status: "AVAILABLE",
    lat: -1.2675,
    lng: 36.8055,
    photo: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=500&q=80",
    proof: [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1555963966-b7ae5406b6a6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565600223587-89a2a1f3c9f7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092919535-7146ff6e1a1a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581093458791-9d42e3c7e8a8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    ],
    about: "Electrical service provider for household installations, repairs and maintenance.",
  },
];

const jobs: Job[] = [
  {
    id: "job-1",
    title: "Kitchen sink is leaking",
    service: "Plumbing",
    customer: "Amina Hassan",
    area: "Kilimani",
    road: "Near Yaya Centre",
    budget: "KSh 2,000 - 4,000",
    urgency: "TODAY",
    lat: -1.2925,
    lng: 36.785,
    photo: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500&q=80",
    photos: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "job-2",
    title: "TV turns on but has no picture",
    service: "TV repair",
    customer: "Brian Otieno",
    area: "Lavington",
    road: "Near Valley Arcade",
    budget: "KSh 1,000 - 2,500",
    urgency: "THIS WEEK",
    lat: -1.2768,
    lng: 36.778,
    photo: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=500&q=80",
    photos: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1601944177325-f8867652837f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "job-3",
    title: "Deep cleaning for a 2-bedroom apartment",
    service: "House cleaning",
    customer: "Faith Njeri",
    area: "Kileleshwa",
    road: "Near Oloitoktok Road",
    budget: "KSh 1,500 - 2,500",
    urgency: "FLEXIBLE",
    lat: -1.276,
    lng: 36.775,
    photo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80",
    photos: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "job-4",
    title: "Install additional wall sockets",
    service: "Electrical",
    customer: "Samuel Kamau",
    area: "Westlands",
    road: "Near Sarit Centre",
    budget: "KSh 2,000 - 5,000",
    urgency: "THIS WEEK",
    lat: -1.268,
    lng: 36.805,
    photo: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=500&q=80",
    photos: [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1555963966-b7ae5406b6a6?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

const categories = ["Plumbing", "Cleaning", "Electrician", "TV repair", "Moving"];

const areaCenters: Record<string, [number, number]> = {
  "nairobi": [-1.2921, 36.8219],
  "nairobi kenya": [-1.2921, 36.8219],
  "kilimani": [-1.2925, 36.787],
  "kileleshwa": [-1.276, 36.777],
  "lavington": [-1.2768, 36.7807],
  "westlands": [-1.2675, 36.8055],
  "south b": [-1.309, 36.824],
  "south c": [-1.302, 36.821],
  "karen": [-1.3197, 36.7073],
  "parklands": [-1.263, 36.818],
  "eastleigh": [-1.277, 36.846],
  "kasarani": [-1.221, 36.897],
  "ruiru": [-1.148, 36.961],
  "embakasi": [-1.322, 36.903],
  "donholm": [-1.300, 36.891],
  "yaya centre": [-1.2925, 36.785],
};

function injectLeaflet() {
  if (typeof document === "undefined") return;
  if (!document.querySelector("link[data-kazi-leaflet]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.dataset.kaziLeaflet = "1";
    document.head.appendChild(link);
  }
  if (!document.querySelector("script[data-kazi-leaflet]")) {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.dataset.kaziLeaflet = "1";
    document.head.appendChild(script);
  }
}

function waitForLeaflet(callback: () => void) {
  if (window.L) {
    callback();
    return;
  }
  const timer = window.setInterval(() => {
    if (window.L) {
      window.clearInterval(timer);
      callback();
    }
  }, 50);
  window.setTimeout(() => window.clearInterval(timer), 10000);
}

function iconForService(service: string) {
  const text = service.toLowerCase();
  if (text.includes("plumb")) return "🔧";
  if (text.includes("clean")) return "🧹";
  if (text.includes("electric")) return "⚡";
  if (text.includes("mov")) return "🚚";
  return "📺";
}

export default function Home() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markerLayer = useRef<any>(null);
  const clickCounts = useRef<Record<string, number>>({});

  const [mode, setMode] = useState<"need" | "offer">("need");
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("Nairobi, Kenya");
  const [areaMessage, setAreaMessage] = useState("");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");

  const filteredProviders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((p) => `${p.name} ${p.service} ${p.area} ${p.road}`.toLowerCase().includes(q));
  }, [search]);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) => `${j.title} ${j.service} ${j.area} ${j.customer}`.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    injectLeaflet();
    waitForLeaflet(() => {
      if (!mapRef.current || mapInstance.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: false, attributionControl: true }).setView([-1.2921, 36.8219], 12);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      markerLayer.current = L.layerGroup().addTo(map);
      mapInstance.current = map;
      window.setTimeout(() => map.invalidateSize(), 200);
    });
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const L = window.L;
    if (!map || !L || !markerLayer.current) return;
    markerLayer.current.clearLayers();
    clickCounts.current = {};

    const addMarker = (item: Provider | Job, type: "provider" | "job") => {
      const isProvider = type === "provider";
      const providerItem = item as Provider;
      const color = isProvider ? (providerItem.status === "TAKEN" ? "#e08b00" : "#138a45") : "#d00000";
      const icon = isProvider ? iconForService(providerItem.service) : "🔎";
      const html = `<div class="kazi-map-pin ${isProvider ? "provider-pin" : "job-pin"}" style="--pin-color:${color}"><span>${icon}</span></div>`;
      const marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({ className: "kazi-marker-host", html, iconSize: [36, 36], iconAnchor: [18, 34] }),
      }).addTo(markerLayer.current);

      marker.on("click", () => {
        const key = `${type}-${item.id}`;
        const count = (clickCounts.current[key] || 0) + 1;
        clickCounts.current[key] = count;

        if (count === 1) {
          map.flyTo([item.lat, item.lng], 14.5, { duration: 0.8 });
        } else if (count === 2) {
          map.flyTo([item.lat, item.lng], 16, { duration: 0.8 });
        } else {
          if (type === "provider") setProvider(item as Provider);
          else setJob(item as Job);
          clickCounts.current[key] = 0;
        }
      });
    };

    filteredProviders.forEach((p) => addMarker(p, "provider"));
    filteredJobs.forEach((j) => addMarker(j, "job"));

    window.setTimeout(() => map.invalidateSize(), 100);
  }, [filteredProviders, filteredJobs]);

  function searchArea() {
    const cleaned = area.trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, " ");
    const exact = areaCenters[cleaned] || areaCenters[cleaned.replace(/ kenya$/, "")];
    if (exact && mapInstance.current) {
      mapInstance.current.flyTo(exact, cleaned === "nairobi" || cleaned === "nairobi kenya" ? 12 : 15, { duration: 1 });
      setAreaMessage("");
      return;
    }
    const match = Object.keys(areaCenters).find((key) => key.includes(cleaned) || cleaned.includes(key));
    if (match && mapInstance.current) {
      mapInstance.current.flyTo(areaCenters[match], 15, { duration: 1 });
      setAreaMessage("");
      return;
    }
    setAreaMessage("Try a Nairobi area such as Kilimani, Kileleshwa, Lavington or Westlands.");
  }

  function chooseCategory(category: string) {
    setSearch(category);
  }

  return (
    <div className="kazi-app">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => { setSearch(""); setArea("Nairobi, Kenya"); mapInstance.current?.flyTo([-1.2921, 36.8219], 12, { duration: 0.8 }); }}>
          <span>KE</span> Kazi za <b>Kenya</b>
        </button>
        <div className="top-search">
          <span>🔎</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="What do you need done? Try plumber, cleaner, TV repair..." aria-label="Search for a service" />
        </div>
        <button className="login-button" type="button" onClick={() => router.push("/login")}>Log in</button>
        <button className="offer-button" type="button" onClick={() => { setMode("offer"); setFormOpen(true); }}>I offer a service</button>
      </header>

      <main className="map-area">
        <div ref={mapRef} className="map" />

        <aside className="side-panel">
          <h1>Need something done?</h1>
          <p className="intro">Find someone nearby, or post what you need and let people who can help come to you.</p>

          <div className="mode-row">
            <button type="button" className={mode === "need" ? "mode active" : "mode"} onClick={() => { setMode("need"); setFormOpen(true); }}>✚ <strong>I need<br />something</strong></button>
            <button type="button" className={mode === "offer" ? "mode active" : "mode"} onClick={() => { setMode("offer"); setFormOpen(true); }}>🛠 <strong>I offer a<br />service</strong></button>
          </div>

          <div className="panel-field">
            <span>📍</span>
            <input id="area-search" name="area" value={area} onChange={(e) => setArea(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchArea()} aria-label="Search Nairobi area" />
            <button type="button" onClick={searchArea}>Search</button>
          </div>
          {areaMessage && <div className="area-message">{areaMessage}</div>}

          <div className="panel-field">
            <span>🔎</span>
            <input id="service-search" name="service" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search a service" aria-label="Search a service" />
          </div>

          <div className="chips">
            {categories.map((category) => <button key={category} type="button" className="chip" onClick={() => chooseCategory(category)}>{category}</button>)}
          </div>

          <div className="legend">
            <span><i className="dot green" /> Offering a service</span>
            <span><i className="dot red" /> Looking for a worker</span>
            <span><i className="dot orange" /> Already taken</span>
          </div>

          <div className="section-title">People who can help around Nairobi</div>
          {filteredProviders.map((p) => (
            <button key={p.id} type="button" className="person-card" onClick={() => {
              mapInstance.current?.flyTo([p.lat, p.lng], 16, { duration: 0.8 });
              clickCounts.current[`provider-${p.id}`] = 2;
            }}>
              <img src={p.photo} alt={p.name} />
              <div className="person-main">
                <strong>{p.name}</strong>
                <span>{p.service}</span>
                <small>📍 {p.area} · {p.road}</small>
              </div>
              <b className={p.status === "AVAILABLE" ? "available" : "taken"}>• {p.status}</b>
              <div className="person-bottom"><span>⭐ {p.rating} · {p.km}</span><b>{p.price}</b></div>
              <div className="profile-hint">✓ Trusted rating {p.rating} · Click to view profile</div>
            </button>
          ))}
          {!filteredProviders.length && <div className="empty">No workers match your search.</div>}
        </aside>
      </main>

      {(provider || job) && (
        <div className="modal-backdrop" onClick={() => { setProvider(null); setJob(null); }}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => { setProvider(null); setJob(null); }}>×</button>
            {provider ? (
              <>
                <div className="profile-head">
                  <img src={provider.photo} alt={provider.name} />
                  <div><h2>{provider.name}</h2><p>{provider.service}</p><span className={provider.status === "AVAILABLE" ? "status-pill green-pill" : "status-pill orange-pill"}>{provider.status}</span></div>
                </div>
                <div className="profile-grid">
                  <div><b>⭐ {provider.rating}</b><span>Trusted rating</span></div>
                  <div><b>📍 {provider.area}</b><span>{provider.road} · {provider.km}</span></div>
                  <div><b>💰 {provider.price}</b><span>Typical starting price</span></div>
                </div>
                <section><h3>About</h3><p>{provider.about}</p></section>
                <section><h3>Services & pricing</h3><p><b>{provider.service}</b> — <b>{provider.price}</b></p></section>
                <section><h3>Proof of previous work</h3><p className="muted">Examples of work completed by {provider.name}. Up to 7 photos can be shown.</p><div className="proof-grid">{provider.proof.slice(0, 7).map((url, i) => <img key={url} src={url} alt={`Proof of work ${i + 1}`} onClick={() => window.open(url, "_blank")} />)}</div></section>
                <section><h3>Contact {provider.name.split(" ")[0]}</h3><textarea id="profile-message" name="profileMessage" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell them what you need..." rows={3} /><button className="send-button" type="button" onClick={() => router.push("/login")}>Log in to contact</button></section>
              </>
            ) : job ? (
              <>
                <div className="profile-head"><img src={job.photo} alt={job.title} /><div><h2>{job.title}</h2><p>{job.service} · {job.area}</p><span className="status-pill red-pill">LOOKING FOR WORKER</span></div></div>
                <div className="profile-grid"><div><b>👤 {job.customer}</b><span>Posted by</span></div><div><b>📍 {job.area}</b><span>{job.road}</span></div><div><b>💰 {job.budget}</b><span>{job.urgency}</span></div></div>
                <section><h3>Proof / job photos</h3><div className="proof-grid">{job.photos.map((url, i) => <img key={url} src={url} alt={`Job photo ${i + 1}`} onClick={() => window.open(url, "_blank")} />)}</div></section>
                <button className="send-button" type="button" onClick={() => router.push("/login")}>Log in to respond</button>
              </>
            ) : null}
          </div>
        </div>
      )}

      {formOpen && (
        <div className="modal-backdrop" onClick={() => setFormOpen(false)}>
          <div className="request-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setFormOpen(false)}>×</button>
            <h2>{mode === "need" ? "I need something" : "I offer a service"}</h2>
            <p>{mode === "need" ? "Tell people nearby what you need done." : "Tell people nearby what service you can provide."}</p>
            <label>What is needed?<input id="request-title" name="requestTitle" placeholder={mode === "need" ? "e.g. Fix my TV" : "e.g. TV repair"} /></label>
            <label>Location / area<input id="request-area" name="requestArea" defaultValue={area} /></label>
            <label>Details<textarea id="request-details" name="requestDetails" rows={4} placeholder="Describe the work, timing and what you can pay / charge." /></label>
            <button className="send-button" type="button" onClick={() => router.push("/login")}>Continue to log in</button>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(html),:global(body){margin:0;padding:0;height:100%;overflow:hidden}
        :global(body){font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans",sans-serif;color:#17221b;background:#fff}
        *{box-sizing:border-box}
        button,input,textarea{font:inherit}
        .kazi-app{height:100vh;width:100%;display:flex;flex-direction:column;background:#fff}
        .topbar{height:51px;min-height:51px;display:flex;align-items:center;gap:8px;padding:0 15px;background:#fff;border-bottom:1px solid #d9ded9;z-index:50}
        .brand{border:0;background:none;padding:0;cursor:pointer;white-space:nowrap;font-size:15px;font-weight:900;color:#111}
        .brand span{font-size:9px;margin-right:4px;color:#111}
        .brand b{color:#08783c}
        .top-search{height:31px;max-width:470px;flex:1;margin-left:8px;border:1px solid #d5ddd7;border-radius:8px;background:#fafcfa;display:flex;align-items:center;gap:7px;padding:0 10px}
        .top-search span{font-size:12px}.top-search input{border:0;outline:0;background:transparent;width:100%;font-size:11px;color:#233029}
        .login-button,.offer-button{height:31px;border-radius:7px;padding:0 12px;font-size:11px;font-weight:900;cursor:pointer}
        .login-button{margin-left:auto;border:1px solid #cfd8d1;background:#fff;color:#17221b}.offer-button{border:1px solid #138a45;background:#138a45;color:#fff}
        .map-area{position:relative;flex:1;min-height:0}
        .map{position:absolute;inset:0;z-index:1}
        .side-panel{position:absolute;z-index:20;left:7px;top:7px;width:244px;max-height:calc(100% - 14px);overflow:auto;background:rgba(255,255,255,.97);border:1px solid #d9dfda;border-radius:7px;box-shadow:0 3px 14px rgba(0,0,0,.16);padding:11px 10px 9px}
        .side-panel h1{font-size:18px;line-height:1.05;margin:2px 5px 5px;letter-spacing:-.3px}.intro{font-size:9px;line-height:1.35;color:#667169;margin:0 5px 10px}
        .mode-row{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}.mode{min-height:40px;border:1px solid #d7dfd9;border-radius:7px;background:#fff;color:#111;font-size:9px;line-height:1.1;cursor:pointer}.mode.active{background:#e9f7ee;border-color:#9ed2af;color:#08783c}.mode:first-child{font-size:14px}.mode strong{font-size:9px;display:inline-block;vertical-align:middle}
        .panel-field{height:31px;display:flex;align-items:center;gap:5px;border:1px solid #d4ddd6;border-radius:7px;background:#fff;margin-bottom:6px;padding:0 6px;font-size:11px}.panel-field input{min-width:0;flex:1;border:0;outline:0;font-size:9px;background:transparent}.panel-field button{border:0;background:transparent;color:#08783c;font-size:8px;font-weight:900;cursor:pointer;padding:2px}
        .area-message{font-size:8px;line-height:1.25;color:#a90000;background:#fff4f4;border:1px solid #f0c4c4;border-radius:5px;padding:5px;margin:-2px 0 6px}
        .chips{display:flex;flex-wrap:wrap;gap:4px;margin:3px 0 7px}.chip{border:1px solid #d7dfd9;background:#fff;border-radius:10px;padding:4px 7px;font-size:8px;font-weight:800;cursor:pointer}.chip:hover{border-color:#79b78e;color:#08783c}
        .legend{display:flex;flex-wrap:wrap;gap:5px 8px;font-size:7px;color:#68736c;margin:4px 2px 8px}.legend span{display:flex;align-items:center;gap:3px}.dot{width:7px;height:7px;border-radius:50%;display:inline-block}.dot.green{background:#138a45}.dot.red{background:#d00000}.dot.orange{background:#e08b00}
        .section-title{font-size:8px;font-weight:900;letter-spacing:.04em;color:#737d76;text-transform:uppercase;margin:6px 2px 6px}
        .person-card{position:relative;width:100%;display:grid;grid-template-columns:29px 1fr auto;gap:6px;align-items:start;text-align:left;border:1px solid #dce3de;background:#fff;border-radius:8px;padding:7px 7px 6px;margin-bottom:6px;cursor:pointer}.person-card:hover{border-color:#72b48a;box-shadow:0 2px 8px rgba(19,138,69,.12)}
        .person-card>img{width:29px;height:29px;border-radius:50%;object-fit:cover;background:#e7eee8}.person-main{min-width:0;display:flex;flex-direction:column}.person-main strong{font-size:9px;line-height:1.15;color:#202a23}.person-main span{font-size:7px;color:#69746d;line-height:1.25;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.person-main small{font-size:7px;color:#78817c;line-height:1.25;margin-top:2px}.available,.taken{font-size:7px;font-weight:900;white-space:nowrap}.available{color:#08783c}.taken{color:#e08b00}.person-bottom{grid-column:2/4;border-top:1px solid #edf0ed;margin-top:1px;padding-top:4px;display:flex;justify-content:space-between;gap:5px;font-size:7px;color:#657169}.person-bottom b{color:#29332d}.profile-hint{grid-column:1/-1;border-top:1px solid #edf0ed;padding-top:4px;color:#6a756e;font-size:7px}
        .empty{font-size:9px;color:#68736c;padding:8px}
        :global(.kazi-marker-host){background:transparent!important;border:0!important}.kazi-map-pin{width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--pin-color);border:2px solid #fff;box-shadow:0 2px 7px rgba(0,0,0,.35);display:grid;place-items:center}.kazi-map-pin span{transform:rotate(45deg);font-size:14px;line-height:1}.provider-pin{background:var(--pin-color)}.job-pin{background:#d00000}
        .modal-backdrop{position:fixed;z-index:100;inset:0;background:rgba(15,25,18,.45);display:flex;align-items:center;justify-content:center;padding:18px}.profile-modal,.request-modal{position:relative;width:min(650px,96vw);max-height:90vh;overflow:auto;background:#fff;border-radius:14px;box-shadow:0 18px 60px rgba(0,0,0,.3);padding:22px}.request-modal{width:min(430px,94vw)}
        .modal-close{position:absolute;right:12px;top:8px;border:0;background:none;font-size:27px;line-height:1;color:#47524b;cursor:pointer}.profile-head{display:flex;gap:13px;align-items:center;padding-right:30px}.profile-head img{width:72px;height:72px;border-radius:50%;object-fit:cover}.profile-head h2{font-size:21px;margin:0 0 3px}.profile-head p{font-size:11px;color:#657169;margin:0 0 6px}.status-pill{display:inline-block;border-radius:99px;padding:4px 7px;font-size:8px;font-weight:900}.green-pill{background:#e7f7ed;color:#08783c}.orange-pill{background:#fff2dc;color:#9b5b00}.red-pill{background:#ffe8e8;color:#a50000}
        .profile-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:16px 0}.profile-grid>div{background:#f5f8f5;border:1px solid #e3e9e4;border-radius:8px;padding:9px}.profile-grid b{display:block;font-size:10px}.profile-grid span{display:block;font-size:8px;color:#69746d;margin-top:3px}.profile-modal section{border-top:1px solid #e8ece9;padding-top:12px;margin-top:12px}.profile-modal h3{font-size:12px;margin:0 0 6px}.profile-modal section p{font-size:10px;line-height:1.45;color:#4e5a52;margin:0}.muted{color:#758078!important}.proof-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}.proof-grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:7px;cursor:pointer;border:1px solid #e0e6e1}.profile-modal textarea,.request-modal textarea,.request-modal input{width:100%;border:1px solid #d6ded8;border-radius:7px;padding:8px;font-size:10px;outline:0;margin-top:4px}.request-modal label{display:block;font-size:9px;font-weight:900;margin:12px 0}.send-button{width:100%;height:38px;border:0;border-radius:7px;background:#138a45;color:#fff;font-size:10px;font-weight:900;cursor:pointer;margin-top:10px}
        @media(max-width:700px){.topbar{padding:0 8px;gap:5px}.brand{font-size:12px}.top-search{margin-left:2px}.offer-button{display:none}.side-panel{width:235px}.profile-grid{grid-template-columns:1fr}.proof-grid{grid-template-columns:repeat(3,1fr)}}
      `}</style>
    </div>
  );
}
