"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Provider = {
  id: string;
  name: string;
  service: string;
  area: string;
  near: string;
  km: string;
  price: string;
  rating: string;
  emoji: string;
  lat: number;
  lng: number;
  about: string;
  verified: boolean;
  photos: string[];
  status: "AVAILABLE" | "TAKEN";
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
  lat: number;
  lng: number;
  photos: string[];
};

declare global {
  interface Window {
    L?: any;
  }
}

const providers: Provider[] = [
  { id: "john", name: "John Mwangi", service: "TV & electronics repair", area: "Kilimani", near: "Near Yaya Centre", km: "0.8 km", price: "From KSh 1,000", rating: "4.8", emoji: "📺", lat: -1.2921, lng: 36.7854, about: "Experienced TV and electronics repair specialist.", verified: true, status: "AVAILABLE", photos: [] },
  { id: "mary", name: "Mary Wanjiku", service: "House cleaning & laundry", area: "Kileleshwa", near: "Near Kileleshwa Road", km: "1.4 km", price: "From KSh 1,500", rating: "4.9", emoji: "🧹", lat: -1.2874, lng: 36.7811, about: "Reliable home cleaning and laundry services. Available for regular or one-time household work.", verified: true, status: "AVAILABLE", photos: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=80",
  ] },
  { id: "peter", name: "Peter Otieno", service: "Plumbing & repairs", area: "Lavington", near: "Near Lavington Mall", km: "2.1 km", price: "From KSh 1,200", rating: "4.7", emoji: "🔧", lat: -1.2778, lng: 36.7759, about: "Plumbing, maintenance and household repairs.", verified: true, status: "TAKEN", photos: [] },
  { id: "david", name: "David Kamau", service: "Moving & house help", area: "South B", near: "Near South B Shopping Centre", km: "3.2 km", price: "From KSh 2,000", rating: "4.8", emoji: "🚚", lat: -1.3098, lng: 36.8281, about: "Moving assistance and general house help.", verified: true, status: "AVAILABLE", photos: [] },
  { id: "grace", name: "Grace Akinyi", service: "Electrical services", area: "Westlands", near: "Near Sarit Centre", km: "4.0 km", price: "From KSh 1,000", rating: "4.9", emoji: "⚡", lat: -1.2646, lng: 36.8042, about: "Home electrical services and installations.", verified: true, status: "AVAILABLE", photos: [] },
];

const jobs: Job[] = [
  { id: "job-1", title: "Kitchen sink is leaking", service: "Plumbing", customer: "Amina Hassan", area: "Kilimani", road: "Near Yaya Centre", budget: "KSh 2,000 - 4,000", urgency: "TODAY", lat: -1.2925, lng: 36.785, photos: ["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80"] },
  { id: "job-2", title: "TV turns on but has no picture", service: "TV repair", customer: "Brian Otieno", area: "Lavington", road: "Near Valley Arcade", budget: "KSh 1,000 - 2,500", urgency: "THIS WEEK", lat: -1.2768, lng: 36.778, photos: ["https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80"] },
  { id: "job-3", title: "Deep cleaning for a 2-bedroom apartment", service: "House cleaning", customer: "Faith Njeri", area: "Kileleshwa", road: "Near Oloitoktok Road", budget: "KSh 1,500 - 2,500", urgency: "FLEXIBLE", lat: -1.276, lng: 36.775, photos: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80"] },
  { id: "job-4", title: "Install additional wall sockets", service: "Electrical", customer: "Samuel Kamau", area: "Westlands", road: "Near Sarit Centre", budget: "KSh 2,000 - 5,000", urgency: "THIS WEEK", lat: -1.268, lng: 36.805, photos: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80"] },
];

const places: Array<[string, number, number]> = [
  ["Nairobi, Kenya", -1.2921, 36.8219],
  ["Kileleshwa, Nairobi", -1.2885, 36.777],
  ["Westlands, Nairobi", -1.2646, 36.8042],
  ["Kilimani, Nairobi", -1.2921, 36.7854],
  ["Lavington, Nairobi", -1.2778, 36.7759],
  ["South B, Nairobi", -1.3098, 36.8281],
  ["South C, Nairobi", -1.302, 36.821],
  ["Karen, Nairobi", -1.3197, 36.7073],
  ["Parklands, Nairobi", -1.263, 36.818],
  ["Eastleigh, Nairobi", -1.277, 36.846],
  ["Kasarani, Nairobi", -1.221, 36.897],
  ["Ruiru, Kenya", -1.148, 36.961],
  ["Embakasi, Nairobi", -1.322, 36.903],
  ["Donholm, Nairobi", -1.3, 36.891],
  ["Mombasa, Kenya", -4.0435, 39.6682],
  ["Kisumu, Kenya", -0.1022, 34.7617],
  ["Nakuru, Kenya", -0.3031, 36.08],
];

const chips = ["Plumber", "Cleaner", "Electrician", "TV repair", "Mover"];

export default function HomePage() {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Nairobi, Kenya");
  const [locationOpen, setLocationOpen] = useState(false);
  const [providerModal, setProviderModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [profile, setProfile] = useState<Provider | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [message, setMessage] = useState("");
  const [providerFiles, setProviderFiles] = useState<File[]>([]);
  const [requestFiles, setRequestFiles] = useState<File[]>([]);
  const [markerClicks, setMarkerClicks] = useState<Record<string, number>>({});

  const filteredProviders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((p) => `${p.name} ${p.service} ${p.area}`.toLowerCase().includes(q));
  }, [search]);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) => `${j.title} ${j.service} ${j.area}`.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (cancelled || !window.L || mapRef.current) return;
      const L = window.L;
      const map = L.map("map", { zoomControl: false }).setView([-1.2921, 36.8219], 12);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      mapRef.current = map;
      markerLayerRef.current = L.layerGroup().addTo(map);
      setTimeout(() => map.invalidateSize(), 100);
    };

    if (!document.querySelector("link[data-kazi-leaflet]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.dataset.kaziLeaflet = "1";
      document.head.appendChild(link);
    }
    if (window.L) load();
    else {
      const existing = document.querySelector("script[data-kazi-leaflet]") as HTMLScriptElement | null;
      if (existing) existing.addEventListener("load", load, { once: true });
      else {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.async = true;
        script.dataset.kaziLeaflet = "1";
        script.onload = load;
        document.body.appendChild(script);
      }
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    const L = window.L;
    if (!map || !layer || !L) return;
    layer.clearLayers();

    const providerIcon = (emoji: string, available: boolean) => L.divIcon({
      className: "kazi-marker-wrap",
      html: `<div class="kazi-pin provider-pin ${available ? "available" : "taken"}"><span>${emoji}</span></div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });
    const jobIcon = () => L.divIcon({
      className: "kazi-marker-wrap",
      html: `<div class="kazi-pin job-pin"><span>🔎</span></div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });

    filteredProviders.forEach((p) => {
      const marker = L.marker([p.lat, p.lng], { icon: providerIcon(p.emoji, p.status === "AVAILABLE") }).addTo(layer);
      marker.bindTooltip(`${p.name}<br>${p.service}`, { direction: "top", offset: [0, -30] });
      marker.on("click", () => {
        setMarkerClicks((prev) => {
          const next = (prev[p.id] || 0) + 1;
          if (next >= 3) {
            setProfile(p);
            return { ...prev, [p.id]: 0 };
          }
          map.setView([p.lat, p.lng], next === 1 ? 15 : 17, { animate: true });
          return { ...prev, [p.id]: next };
        });
      });
    });

    filteredJobs.forEach((j) => {
      const marker = L.marker([j.lat, j.lng], { icon: jobIcon() }).addTo(layer);
      marker.bindPopup(`<b>Looking for help</b><br>${j.title}<br>${j.service}<br>${j.budget}`);
      marker.on("click", () => {
        map.setView([j.lat, j.lng], 16, { animate: true });
        setSelectedJob(j);
      });
    });
  }, [filteredProviders, filteredJobs]);

  function goToPlace(name: string, lat: number, lng: number) {
    setLocation(name);
    setLocationOpen(false);
    mapRef.current?.setView([lat, lng], 14, { animate: true });
  }

  function openProviderFromList(p: Provider) {
    mapRef.current?.setView([p.lat, p.lng], 16, { animate: true });
    setTimeout(() => setProfile(p), 350);
  }

  function submitProvider(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Provider profile created successfully. Your proof-of-work photos are ready to be added to the profile.");
    setProviderModal(false);
  }

  function submitRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Your request has been posted. Nearby providers can now review the job details and photos.");
    setRequestModal(false);
  }

  return (
    <main className="app">
      <header className="topbar">
        <button className="brand" onClick={() => { setSearch(""); mapRef.current?.setView([-1.2921, 36.8219], 12); }} aria-label="Kazi za Kenya home">
          🇰🇪 Kazi za <span>Kenya</span>
        </button>
        <div className="searchbar">🔎<input aria-label="Search for a service" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="What do you need done? Try plumber, cleaner, TV repair..." /></div>
        <div className="actions"><button className="btn" onClick={() => router.push("/login")}>Log in</button></div>
      </header>

      <section className="content">
        <div id="map" className="map" />
        <aside className="panel">
          <div className="hero"><h1>Need something done?</h1><p>Find someone nearby, or post what you need and let people who can help come to you.</p></div>
          <div className="choice"><button onClick={() => setRequestModal(true)}>➕ I need something</button><button onClick={() => setProviderModal(true)}>🛠️ I offer a service</button></div>

          <div className="location-wrap">
            <div className="field">📍<input id="location" name="location" aria-label="Location" value={location} autoComplete="off" onFocus={() => setLocationOpen(true)} onChange={(e) => { setLocation(e.target.value); setLocationOpen(true); }} /></div>
            {locationOpen && (
              <div className="suggestions open">
                {places.filter((p) => p[0].toLowerCase().includes(location.toLowerCase().trim())).slice(0, 7).map((p) => <button className="suggestion" key={p[0]} onClick={() => goToPlace(p[0], p[1], p[2])}>📍 {p[0]}</button>)}
                {!places.some((p) => p[0].toLowerCase().includes(location.toLowerCase().trim())) && <div className="suggestion muted">No saved area found. Try Nairobi, Kilimani, Kileleshwa, Lavington or Westlands.</div>}
              </div>
            )}
          </div>

          <div className="field">🔎<input id="service" name="service" aria-label="Search a service" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search a service" /></div>
          <div className="chips">{chips.map((c) => <button className="chip" key={c} onClick={() => setSearch(c)}>{c === "Plumber" ? "Plumbing" : c === "Cleaner" ? "Cleaning" : c === "Mover" ? "Moving" : c}</button>)}</div>

          <div className="legend"><span><i className="dot green" /> People offering services</span><span><i className="dot red" /> People looking for help</span></div>
          <div className="section-title">People who can help around Nairobi</div>
          {filteredProviders.map((p) => <button className="provider" key={p.id} onClick={() => openProviderFromList(p)}><div className="provider-top"><div className="avatar">{p.emoji}</div><div><div className="pname">{p.name}</div><div className="meta">{p.service} · {p.area}</div></div><div className={`status ${p.status === "TAKEN" ? "taken-text" : ""}`}>● {p.status}</div></div><div className="provider-bottom"><span>⭐ {p.rating} · {p.km}</span><b>{p.price}</b></div></button>)}

          <div className="section-title">People looking for workers</div>
          {filteredJobs.slice(0, 3).map((j) => <button className="job" key={j.id} onClick={() => { mapRef.current?.setView([j.lat, j.lng], 16, { animate: true }); setSelectedJob(j); }}><div className="pname">🔎 {j.title}</div><div className="meta">{j.service} · {j.area} · {j.urgency}</div><div className="provider-bottom"><span>{j.customer}</span><b>{j.budget}</b></div></button>)}

          <div className="section-title">Anything else?</div><button className="btn primary full" onClick={() => setRequestModal(true)}>Post what I need</button>
        </aside>
      </section>

      {message && <div className="toast" role="status"><span>{message}</span><button onClick={() => setMessage("")}>×</button></div>}

      {profile && <div className="modal-backdrop open" onMouseDown={(e) => e.currentTarget === e.target && setProfile(null)}><div className="modal"><div className="modal-head"><div><h2>{profile.name}</h2><div className="profile-service">{profile.service}</div><div className={`profile-status ${profile.status === "TAKEN" ? "taken-text" : ""}`}>● {profile.status}</div></div><button className="close" onClick={() => setProfile(null)}>×</button></div><div className="profile-detail"><b>⭐ {profile.rating}</b> Trusted rating</div><div className="profile-detail"><b>📍 Location</b><br />{profile.area} · {profile.near}<br />{profile.km} away</div><div className="profile-section"><h3>About</h3><div className="profile-line">{profile.about}</div></div><div className="profile-section"><h3>Services & pricing</h3><div className="profile-line"><b>{profile.service}</b> — <b>{profile.price}</b></div></div><div className="profile-section"><h3>Proof of previous work</h3><div className="profile-detail">See examples of work completed by {profile.name}.</div>{profile.photos.length ? <div className="photo-grid">{profile.photos.map((src, i) => <img key={src} src={src} alt={`Proof of work ${i + 1}`} onClick={() => window.open(src, "_blank", "noopener,noreferrer")} />)}</div> : <div className="file-note">📸 No work photos uploaded yet.</div>}<div className="file-note">📸 Workers can add up to 7 photos showing their previous work.</div></div><div className="profile-section"><h3>Trust & ratings</h3><div className="profile-line">⭐ {profile.rating} Overall rating</div><div className="profile-line">✓ {profile.verified ? "Profile verified" : "Profile not verified"}</div><div className="profile-line">📷 {profile.photos.length} work photos</div></div><div className="profile-actions"><button className="btn" onClick={() => setProfile(null)}>Back to map</button><button className="btn primary" onClick={() => setMessage(`Messaging ${profile.name} will be available after login.`)}>💬 Message</button></div></div></div>}

      {selectedJob && <div className="modal-backdrop open" onMouseDown={(e) => e.currentTarget === e.target && setSelectedJob(null)}><div className="modal"><div className="modal-head"><div><h2>Looking for help</h2><div className="profile-service">{selectedJob.title}</div></div><button className="close" onClick={() => setSelectedJob(null)}>×</button></div><div className="profile-detail"><b>📍 {selectedJob.area}</b> · {selectedJob.road}</div><div className="profile-section"><h3>Service</h3><div className="profile-line">{selectedJob.service}</div></div><div className="profile-section"><h3>Budget & timing</h3><div className="profile-line"><b>{selectedJob.budget}</b> · {selectedJob.urgency}</div></div>{selectedJob.photos.length > 0 && <div className="photo-grid">{selectedJob.photos.map((src) => <img key={src} src={src} alt="Job photo" />)}</div>}<div className="profile-actions"><button className="btn" onClick={() => setSelectedJob(null)}>Back to map</button><button className="btn primary" onClick={() => router.push("/login")}>Login to respond</button></div></div></div>}

      {providerModal && <div className="modal-backdrop open"><div className="modal"><div className="modal-head"><div><h2>Provider registration</h2><p>Create your profile and showcase your services. Add up to 7 proof-of-work photos.</p></div><button className="close" onClick={() => setProviderModal(false)}>×</button></div><form onSubmit={submitProvider}><div className="form-grid"><div className="form-field"><label htmlFor="providerName">Name or business name</label><input id="providerName" name="providerName" required /></div><div className="form-field"><label htmlFor="providerPhone">Phone number</label><input id="providerPhone" name="providerPhone" type="tel" required /></div><div className="form-field full"><label htmlFor="providerServices">Services offered</label><input id="providerServices" name="providerServices" required /></div><div className="form-field"><label htmlFor="providerPrice">Starting price</label><input id="providerPrice" name="providerPrice" /></div><div className="form-field"><label htmlFor="providerLocation">Location</label><input id="providerLocation" name="providerLocation" value="Nairobi, Kenya" readOnly /></div><div className="form-field full"><label htmlFor="providerAvailability">Availability</label><textarea id="providerAvailability" name="providerAvailability" /></div><div className="form-field full"><label htmlFor="providerPhotos">Proof-of-work photos — up to 7</label><input id="providerPhotos" name="providerPhotos" type="file" accept="image/*" multiple onChange={(e) => { const files = Array.from(e.target.files || []); if (files.length > 7) { alert("Please choose a maximum of 7 proof-of-work photos."); e.currentTarget.value = ""; setProviderFiles([]); } else setProviderFiles(files); }} /><div className="file-note">{providerFiles.length} photo(s) selected. Choose no more than 7 photos showing completed work.</div></div><div className="form-field full"><label htmlFor="providerEvidence">Work evidence</label><input id="providerEvidence" name="providerEvidence" type="file" multiple /></div></div><div className="modal-actions"><button className="btn" type="button" onClick={() => setProviderModal(false)}>Cancel</button><button className="btn primary" type="submit">Create provider profile</button></div></form></div></div>}

      {requestModal && <div className="modal-backdrop open"><div className="modal"><div className="modal-head"><div><h2>Post what you need</h2><p>Describe the job, set your location, budget and preferred time.</p></div><button className="close" onClick={() => setRequestModal(false)}>×</button></div><form onSubmit={submitRequest}><div className="form-grid"><div className="form-field full"><label htmlFor="requestDescription">What do you need done?</label><textarea id="requestDescription" name="requestDescription" placeholder="e.g. I need a plumber to fix a leaking kitchen pipe." required /></div><div className="form-field"><label htmlFor="requestLocation">Location</label><input id="requestLocation" name="requestLocation" value={location} readOnly /></div><div className="form-field"><label htmlFor="requestBudget">Budget</label><input id="requestBudget" name="requestBudget" placeholder="e.g. KSh 2,000" /></div><div className="form-field"><label htmlFor="requestTime">When do you need it?</label><input id="requestTime" name="requestTime" placeholder="e.g. Today after 3pm" /></div><div className="form-field full"><label htmlFor="requestPhotos">📸 Photos of what needs to be done — up to 5</label><div className="photo-upload"><input id="requestPhotos" name="requestPhotos" type="file" accept="image/*" multiple onChange={(e) => { const files = Array.from(e.target.files || []); if (files.length > 5) { alert("Please choose a maximum of 5 photos."); e.currentTarget.value = ""; setRequestFiles([]); } else setRequestFiles(files); }} /><div className="file-note">{requestFiles.length} photo(s) selected. Upload up to 5 photos.</div></div></div></div><div className="modal-actions"><button className="btn" type="button" onClick={() => setRequestModal(false)}>Cancel</button><button className="btn primary" type="submit">Post Request</button></div></form></div></div>}

      <style jsx global>{`
        *{box-sizing:border-box}html,body{margin:0;height:100%;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#17221b}body{background:#eef1ed}.app{height:100vh;display:flex;flex-direction:column}.topbar{height:68px;background:#fff;border-bottom:1px solid #dfe5df;display:flex;align-items:center;padding:0 22px;gap:18px;z-index:1000}.brand{border:0;background:none;padding:0;font-weight:850;font-size:21px;white-space:nowrap;color:#17221b;cursor:pointer}.brand span{color:#15803d}.searchbar{height:44px;flex:1;max-width:650px;border:1px solid #d8ded8;border-radius:13px;background:#f8faf8;display:flex;align-items:center;padding:0 14px;gap:9px;color:#718078}.searchbar input{border:0;outline:0;background:transparent;width:100%;font-size:14px}.actions{margin-left:auto;display:flex;gap:9px}.btn{border:1px solid #d4dbd5;background:#fff;border-radius:11px;padding:10px 14px;font-weight:700;cursor:pointer}.btn.primary{background:#16803d;color:white;border-color:#16803d}.btn.full{width:100%}.content{position:relative;flex:1;min-height:0}.map{position:absolute;inset:0;z-index:0}.panel{position:absolute;left:18px;top:18px;width:360px;max-height:calc(100% - 36px);overflow:auto;background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border:1px solid #dce4dc;border-radius:18px;box-shadow:0 12px 40px rgba(27,43,31,.16);z-index:900;padding:18px}.hero h1{margin:0 0 6px;font-size:27px;letter-spacing:-.7px}.hero p{margin:0 0 16px;color:#647169;font-size:13px;line-height:1.45}.choice{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:14px}.choice button{border:1px solid #dce3dd;background:#f7faf7;border-radius:12px;padding:12px 8px;font-weight:800;cursor:pointer}.choice button:first-child{background:#e9f7ee;border-color:#b9dfc6;color:#126b33}.field{height:43px;border:1px solid #d8dfd9;border-radius:11px;background:white;display:flex;align-items:center;padding:0 11px;margin-bottom:9px}.field input{width:100%;border:0;outline:0;font-size:13px}.location-wrap{position:relative}.suggestions{position:absolute;left:0;right:0;top:48px;background:#fff;border:1px solid #d8dfd9;border-radius:10px;box-shadow:0 8px 24px #0002;z-index:1200;overflow:hidden}.suggestion{display:block;width:100%;border:0;background:#fff;text-align:left;padding:11px 13px;font-size:13px;cursor:pointer}.suggestion:hover{background:#f0f7f1}.muted{color:#718078}.chips{display:flex;gap:7px;flex-wrap:wrap;margin:7px 0 12px}.chip{border:1px solid #dce3dd;border-radius:99px;background:white;padding:7px 10px;font-size:12px;font-weight:700;cursor:pointer}.section-title{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#758178;font-weight:850;margin:16px 0 9px}.legend{display:flex;flex-direction:column;gap:5px;font-size:10px;color:#5f6d64;margin:7px 0}.dot{width:9px;height:9px;border-radius:50%;display:inline-block;margin-right:5px}.dot.green{background:#16803d}.dot.red{background:#c90000}.provider,.job{width:100%;text-align:left;border:1px solid #e0e6e1;border-radius:13px;padding:11px;margin-bottom:9px;background:white;cursor:pointer}.provider:hover,.job:hover{border-color:#b7cbbd;box-shadow:0 4px 14px rgba(27,43,31,.07)}.provider-top{display:flex;gap:10px;align-items:center}.avatar{width:40px;height:40px;border-radius:50%;background:#dfece2;display:grid;place-items:center;font-weight:850;color:#25633a;flex:0 0 auto}.pname{font-weight:800;font-size:13px}.meta{font-size:11px;color:#69756d;margin-top:2px}.status{margin-left:auto;font-size:10px;font-weight:800;color:#16803d}.taken-text{color:#c90000}.provider-bottom{display:flex;justify-content:space-between;gap:10px;margin-top:9px;font-size:11px;color:#526057}.kazi-marker-wrap{background:transparent!important;border:0!important}.kazi-pin{width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 12px #0003}.kazi-pin span{display:block;transform:rotate(45deg);color:#fff;text-align:center;font-size:16px;padding-top:5px}.provider-pin.available{background:#16803d}.provider-pin.taken{background:#c90000}.job-pin{background:#c90000}.modal-backdrop{position:fixed;inset:0;background:rgba(15,23,18,.48);z-index:2000;display:none;align-items:center;justify-content:center;padding:18px}.modal-backdrop.open{display:flex}.modal{width:min(680px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:20px;padding:22px;box-shadow:0 24px 70px rgba(0,0,0,.25)}.modal-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}.modal h2{margin:0 0 6px;font-size:24px}.modal p{margin:0 0 16px;color:#647169;font-size:13px;line-height:1.45}.close{border:0;background:#f1f4f1;border-radius:50%;width:36px;height:36px;font-size:20px;cursor:pointer}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.form-field{display:flex;flex-direction:column;gap:6px;margin-bottom:10px}.form-field.full{grid-column:1/-1}.form-field label{font-size:12px;font-weight:800;color:#526057}.form-field input,.form-field textarea{width:100%;border:1px solid #d8dfd9;border-radius:10px;padding:11px;font:inherit;font-size:13px}.form-field textarea{min-height:80px;resize:vertical}.file-note{font-size:11px;color:#758178;margin-top:5px}.photo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}.photo-grid img{width:100%;aspect-ratio:1;border-radius:10px;object-fit:cover;cursor:pointer}.profile-service{font-weight:800;font-size:14px}.profile-detail{font-size:12px;color:#69756d;margin-top:9px}.profile-status{display:inline-block;color:#16803d;font-weight:850;font-size:12px;margin:4px 0 12px}.profile-section{margin-top:18px}.profile-section h3{font-size:14px;margin:0 0 8px}.profile-line{padding:9px 0;border-bottom:1px solid #edf0ed;font-size:13px}.profile-actions,.modal-actions{display:flex;gap:9px;margin-top:18px}.photo-upload{border:1px dashed #b8c8bb;border-radius:12px;padding:12px;background:#f8fbf8}.toast{position:fixed;right:18px;bottom:18px;max-width:420px;background:#17221b;color:#fff;border-radius:12px;padding:13px 14px;z-index:3000;box-shadow:0 10px 30px #0003;display:flex;gap:12px;align-items:flex-start;font-size:12px}.toast button{border:0;background:transparent;color:#fff;font-size:18px;cursor:pointer}@media(max-width:800px){.topbar{height:62px;padding:0 12px}.brand{font-size:18px}.actions{display:none}.searchbar{max-width:none}.panel{left:10px;right:10px;width:auto;top:auto;bottom:10px;max-height:55%;padding:14px}.hero h1{font-size:22px}.modal-backdrop{padding:10px}.modal{max-height:95vh;padding:17px}.form-grid{grid-template-columns:1fr}.form-field.full{grid-column:auto}.photo-grid{grid-template-columns:repeat(3,1fr)}}
      `}</style>
    </main>
  );
}
