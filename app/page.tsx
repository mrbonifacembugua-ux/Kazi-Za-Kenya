"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Provider = {
  id: string; name: string; service: string; area: string; road: string; km: string;
  price: string; rating: string; status: "AVAILABLE" | "TAKEN"; photo: string;
  proof: string[]; about: string; lat: number; lng: number;
};
type Job = {
  id: string; title: string; service: string; customer: string; area: string; road: string;
  budget: string; urgency: string; photo: string; photos: string[]; lat: number; lng: number;
};

declare global { interface Window { L?: any } }

const providers: Provider[] = [
  { id:"john", name:"John Mwangi", service:"TV & electronics repair", area:"Kilimani", road:"Near Ngong Road", km:"0.8 km", price:"From KSh 1,000", rating:"4.8", status:"AVAILABLE", lat:-1.2925, lng:36.7870, photo:"https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80", proof:["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1601944177325-f8867652837f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=900&q=80"], about:"Experienced electronics technician helping households with TV, decoder and general electronics repairs." },
  { id:"mary", name:"Mary Wanjiku", service:"House cleaning & laundry", area:"Kileleshwa", road:"Near Kileleshwa Road", km:"1.4 km", price:"From KSh 1,500", rating:"4.9", status:"AVAILABLE", lat:-1.2760, lng:36.7770, photo:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80", proof:["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=80"], about:"Reliable home cleaning and laundry services for regular or one-time household work." },
  { id:"peter", name:"Peter Otieno", service:"Plumbing & repairs", area:"Lavington", road:"Near James Gichuru Road", km:"2.1 km", price:"From KSh 1,200", rating:"4.7", status:"TAKEN", lat:-1.2768, lng:36.7807, photo:"https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=80", proof:["https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80"], about:"Plumbing and household repair specialist handling leaks, fittings and general repairs." },
  { id:"david", name:"David Kamau", service:"Moving & house help", area:"South B", road:"Near Likoni Road", km:"3.2 km", price:"From KSh 2,000", rating:"4.8", status:"AVAILABLE", lat:-1.3090, lng:36.8240, photo:"https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=700&q=80", proof:["https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80"], about:"Moving assistance, loading, unloading and general house-help services." },
  { id:"grace", name:"Grace Akinyi", service:"Electrical services", area:"Westlands", road:"Near Waiyaki Way", km:"4.0 km", price:"From KSh 1,000", rating:"4.9", status:"AVAILABLE", lat:-1.2675, lng:36.8055, photo:"https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80", proof:["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1555963966-b7ae5406b6a6?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1565600223587-89a2a1f3c9f7?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1581092919535-7146ff6e1a1a?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1581093458791-9d42e3c7e8a8?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80"], about:"Electrical service provider for household installations, repairs and maintenance." }
];

const jobs: Job[] = [
  { id:"1", title:"Kitchen sink is leaking", service:"Plumbing", customer:"Amina Hassan", area:"Kilimani", road:"Near Yaya Centre", budget:"KSh 2,000 - 4,000", urgency:"TODAY", lat:-1.2925, lng:36.7850, photo:"https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80", photos:["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80"] },
  { id:"2", title:"TV turns on but has no picture", service:"TV repair", customer:"Brian Otieno", area:"Lavington", road:"Near Valley Arcade", budget:"KSh 1,000 - 2,500", urgency:"THIS WEEK", lat:-1.2768, lng:36.7780, photo:"https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80", photos:["https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1601944177325-f8867652837f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80"] },
  { id:"3", title:"Deep cleaning for a 2-bedroom apartment", service:"House cleaning", customer:"Faith Njeri", area:"Kileleshwa", road:"Near Oloitoktok Road", budget:"KSh 1,500 - 2,500", urgency:"FLEXIBLE", lat:-1.2760, lng:36.7750, photo:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80", photos:["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80"] },
  { id:"4", title:"Install additional wall sockets", service:"Electrical", customer:"Samuel Kamau", area:"Westlands", road:"Near Sarit Centre", budget:"KSh 2,000 - 5,000", urgency:"THIS WEEK", lat:-1.2680, lng:36.8050, photo:"https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80", photos:["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1555963966-b7ae5406b6a6?auto=format&fit=crop&w=900&q=80"] }
];

const categories = ["Plumbing","Cleaning","Electrician","TV repair","Moving"];
const areaCenters: Record<string,[number,number]> = {
  "nairobi, kenya":[-1.2921,36.8219], "nairobi":[-1.2921,36.8219], kilimani:[-1.2925,36.7870], kileleshwa:[-1.2760,36.7770],
  lavington:[-1.2768,36.7807], westlands:[-1.2675,36.8055], "south b":[-1.3090,36.8240], "yaya centre":[-1.2925,36.7850]
};

function injectLeaflet() {
  if (typeof document === "undefined") return;
  if (!document.querySelector("link[data-kazi-leaflet]")) {
    const link = document.createElement("link"); link.rel="stylesheet"; link.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; link.dataset.kaziLeaflet="1"; document.head.appendChild(link);
  }
  if (!document.querySelector("script[data-kazi-leaflet]")) {
    const script = document.createElement("script"); script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; script.async=true; script.dataset.kaziLeaflet="1"; document.head.appendChild(script);
  }
}

function waitForLeaflet(cb:()=>void) {
  if (window.L) { cb(); return; }
  const timer = window.setInterval(() => { if (window.L) { window.clearInterval(timer); cb(); } }, 50);
  window.setTimeout(() => window.clearInterval(timer), 10000);
}

export default function Home() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement|null>(null);
  const mapInstance = useRef<any>(null);
  const [view,setView] = useState<"workers"|"jobs">("workers");
  const [search,setSearch] = useState("");
  const [area,setArea] = useState("Nairobi, Kenya");
  const [provider,setProvider] = useState<Provider|null>(null);
  const [job,setJob] = useState<Job|null>(null);
  const [form,setForm] = useState<"need"|"service"|null>(null);
  const [files,setFiles] = useState<File[]>([]);
  const [message,setMessage] = useState("");
  const [selectedMapId,setSelectedMapId] = useState<string|null>(null);
  const mapClickCounts = useRef<Record<string,number>>({});

  const filteredProviders = useMemo(()=>{ const q=search.toLowerCase().trim(); return q?providers.filter(p=>`${p.name} ${p.service} ${p.area} ${p.road}`.toLowerCase().includes(q)):providers; },[search]);
  const filteredJobs = useMemo(()=>{ const q=search.toLowerCase().trim(); return q?jobs.filter(j=>`${j.title} ${j.service} ${j.area} ${j.customer}`.toLowerCase().includes(q)):jobs; },[search]);

  useEffect(()=>{ injectLeaflet(); waitForLeaflet(()=>{
    if (!mapRef.current || mapInstance.current) return;
    const L=window.L;
    const map=L.map(mapRef.current,{zoomControl:false,attributionControl:true}).setView([-1.2921,36.8219],12);
    L.control.zoom({position:"bottomright"}).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap contributors"}).addTo(map);
    mapInstance.current=map;
    const addMarker=(item:any,type:"provider"|"job")=>{
      const color=type==="job"?"#d00000":item.status==="TAKEN"?"#d97706":"#138a45";
      const icon=type==="job"?"🔎":item.service.includes("Electrical")?"⚡":item.service.includes("Plumbing")?"🔧":item.service.includes("Cleaning")?"🧹":item.service.includes("Moving")?"🚚":"📺";
      const html=`<div class="kazi-pin" style="--pin:${color}"><span>${icon}</span></div>`;
      const marker=L.marker([item.lat,item.lng],{icon:L.divIcon({className:"kazi-marker-wrap",html,iconSize:[40,40],iconAnchor:[20,38]})}).addTo(map);
      marker.on("click",()=>{
        const key=`${type}-${item.id}`; const next=(mapClickCounts.current[key]||0)+1; mapClickCounts.current[key]=next; setSelectedMapId(key);
        if(next===1) map.flyTo([item.lat,item.lng],14,{duration:.7});
        else if(next===2) map.flyTo([item.lat,item.lng],16,{duration:.7});
        else { mapClickCounts.current[key]=0; if(type==="provider") setProvider(item); else setJob(item); }
      });
    };
    providers.forEach(p=>addMarker(p,"provider")); jobs.forEach(j=>addMarker(j,"job"));
    window.setTimeout(()=>map.invalidateSize(),100);
  }); return ()=>{ if(mapInstance.current){mapInstance.current.remove();mapInstance.current=null;} }; },[]);

  const searchArea=()=>{
    const key=area.trim().toLowerCase(); const center=areaCenters[key]||areaCenters["nairobi, kenya"]; mapInstance.current?.flyTo(center,14,{duration:.8});
  };
  const pickFiles=(e:React.ChangeEvent<HTMLInputElement>)=>{ const list=Array.from(e.target.files||[]); const max=form==="need"?5:7; if(list.length>max){alert(`Please select a maximum of ${max} photos.`);return;} setFiles(list.filter(f=>f.type.startsWith("image/"))); };

  const openProviderFromCard=(p:Provider)=>{ const count=(mapClickCounts.current[`provider-${p.id}`]||0)+1; mapClickCounts.current[`provider-${p.id}`]=count; setSelectedMapId(`provider-${p.id}`); if(count===1) mapInstance.current?.flyTo([p.lat,p.lng],14,{duration:.7}); else if(count===2) mapInstance.current?.flyTo([p.lat,p.lng],16,{duration:.7}); else {mapClickCounts.current[`provider-${p.id}`]=0;setProvider(p);} };

  return <div className="app">
    <header className="topbar">
      <div className="brand"><span className="ke">KE</span><strong>Kazi za Kenya</strong></div>
      <div className="top-search"><span>🔎</span><input id="global-search" name="globalSearch" value={search} onChange={e=>setSearch(e.target.value)} placeholder="What do you need done? Try plumber, cleaner, TV repair..."/></div>
      <button className="login-btn" type="button" onClick={()=>router.push("/login")}>Log in</button>
      <button className="offer-btn" type="button" onClick={()=>setForm("service")}>I offer a service</button>
    </header>

    <main className="content">
      <div ref={mapRef} className="map" aria-label="Interactive Nairobi map" />
      <div className="legend"><span><i className="dot green"/>Offering a service</span><span><i className="dot orange"/>Currently taken</span><span><i className="dot red"/>Looking for a worker</span></div>
      <aside className="panel">
        <div className="panel-title"><h1>Need something done?</h1><p>Find someone nearby, or post what you need and let people who can help come to you.</p></div>
        <div className="choice"><button type="button" onClick={()=>setForm("need")}>✚ <b>I need<br/>something</b></button><button type="button" onClick={()=>setForm("service")}>🛠️ <b>I offer a<br/>service</b></button></div>
        <div className="field"><span>📍</span><input id="area" name="area" value={area} onChange={e=>setArea(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")searchArea()}}/><button type="button" onClick={searchArea}>Search</button></div>
        <div className="field"><span>🔎</span><input id="service" name="service" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search a service"/></div>
        <div className="chips">{categories.map(c=><button key={c} type="button" className="chip" onClick={()=>setSearch(c)}>{c}</button>)}</div>
        <div className="section-title">PEOPLE WHO CAN HELP AROUND NAIROBI</div>
        {view==="workers" ? filteredProviders.map(p=><button key={p.id} type="button" className={`provider ${selectedMapId===`provider-${p.id}`?"selected": ""}`} onClick={()=>openProviderFromCard(p)}>
          <div className="provider-top"><div className="avatar"><img src={p.photo} alt={p.name}/></div><div className="provider-info"><strong>{p.name}</strong><span>{p.service}</span><small>📍 {p.area} · {p.road}</small></div><em className={p.status==="AVAILABLE"?"available":"taken"}>● {p.status}</em></div>
          <div className="provider-bottom"><span>⭐ {p.rating} · {p.km}</span><b>{p.price}</b></div>
          <div className="trusted">✓ Trusted rating {p.rating} · Click to view profile</div>
        </button>) : filteredJobs.map(j=><button key={j.id} type="button" className="provider" onClick={()=>setJob(j)}><div className="provider-top"><div className="avatar"><img src={j.photo} alt={j.title}/></div><div className="provider-info"><strong>{j.title}</strong><span>{j.service}</span><small>📍 {j.area} · {j.road}</small></div><em className="available">● OPEN</em></div><div className="provider-bottom"><span>👤 {j.customer}</span><b>{j.budget}</b></div><div className="trusted">📷 {j.photos.length} photos · {j.urgency}</div></button>)}
        <div className="view-switch"><button className={view==="workers"?"active":""} type="button" onClick={()=>setView("workers")}>Workers</button><button className={view==="jobs"?"active":""} type="button" onClick={()=>setView("jobs")}>Jobs</button></div>
      </aside>
    </main>

    {provider && <div className="overlay" onClick={()=>setProvider(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" type="button" onClick={()=>setProvider(null)}>×</button><div className="profile-head"><div className="large-avatar"><img src={provider.photo} alt={provider.name}/></div><div><h2>{provider.name}</h2><p>{provider.service}</p><strong className={provider.status==="AVAILABLE"?"available":"taken"}>● {provider.status}</strong></div></div><div className="profile-detail">⭐ {provider.rating} Trusted rating<br/>📍 {provider.area} · {provider.road}<br/>{provider.km} away</div><section><h3>About</h3><p>{provider.about}</p></section><section><h3>Services & pricing</h3><p><b>{provider.service}</b> — <b>{provider.price}</b></p></section><section><h3>Proof of previous work</h3><p>See examples of work completed by {provider.name}.</p><div className="photo-grid">{provider.proof.map((u,i)=><img key={u} src={u} alt={`Proof of work ${i+1}`} onClick={()=>window.open(u,"_blank")}/>)}</div><small>📸 Up to 7 proof-of-work photos.</small></section><section><h3>Trust & ratings</h3><p>⭐ {provider.rating} Overall rating<br/>✓ Profile information available<br/>📷 {provider.proof.length} work photos</p></section><textarea id="worker-message" name="message" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell them what you need..." rows={3}/><button className="primary" type="button" onClick={()=>router.push("/login")}>Log in to contact</button></div></div>}

    {job && <div className="overlay" onClick={()=>setJob(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" type="button" onClick={()=>setJob(null)}>×</button><div className="job-modal-photo"><img src={job.photo} alt={job.title}/></div><h2>{job.title}</h2><p>{job.service} · 📍 {job.area}</p><div className="profile-detail">👤 {job.customer}<br/>💰 {job.budget}<br/>⏰ {job.urgency}</div><section><h3>Photos attached</h3><div className="photo-grid">{job.photos.map((u,i)=><img key={u} src={u} alt={`Job photo ${i+1}`} onClick={()=>window.open(u,"_blank")}/>)}</div></section><button className="primary" type="button" onClick={()=>router.push("/login")}>Log in to respond</button></div></div>}

    {form && <div className="overlay" onClick={()=>setForm(null)}><div className="modal form-modal" onClick={e=>e.stopPropagation()}><button className="close" type="button" onClick={()=>setForm(null)}>×</button><h2>{form==="need"?"I need something":"I offer a service"}</h2><p>Tell people around Nairobi what you need or what you can do.</p><label>Title<input id="form-title" name="title" placeholder={form==="need"?"What do you need done?":"What service do you offer?"}/></label><label>Location<input id="form-location" name="location" defaultValue={area}/></label><label>Description<textarea id="form-description" name="description" rows={4} placeholder="Describe the work or service..."/></label><label>Photos<input id="form-photos" name="photos" type="file" accept="image/*" multiple onChange={pickFiles}/></label>{files.length>0&&<div className="file-note">{files.length} photo(s) selected.</div>}<button className="primary" type="button" onClick={()=>router.push("/login")}>Continue to sign in</button></div></div>}

    <style jsx>{`
      *{box-sizing:border-box}html,body{margin:0;height:100%;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#17221b}button,input,textarea{font:inherit}.app{height:100vh;overflow:hidden;background:#eef1ed}.topbar{height:48px;background:#fff;border-bottom:1px solid #d8ded9;display:flex;align-items:center;gap:10px;padding:0 15px;position:relative;z-index:20}.brand{display:flex;align-items:center;gap:5px;white-space:nowrap;font-size:13px;color:#1d2b22}.brand strong{font-weight:900}.ke{font-size:10px;font-weight:900;color:#000}.top-search{height:32px;max-width:460px;flex:1;background:#f8faf8;border:1px solid #d7ddd8;border-radius:9px;display:flex;align-items:center;gap:7px;padding:0 10px;margin-left:8px}.top-search input{border:0;outline:0;background:transparent;width:100%;font-size:11px}.login-btn,.offer-btn{height:32px;border-radius:7px;padding:0 12px;font-size:11px;font-weight:900;cursor:pointer}.login-btn{margin-left:auto;background:#fff;border:1px solid #cfd8d1}.offer-btn{background:#138a45;border:1px solid #138a45;color:#fff}.content{height:calc(100vh - 48px);position:relative}.map{position:absolute;inset:0;background:#dfe7df}.kazi-marker-wrap{background:transparent!important;border:0!important}.kazi-pin{width:34px;height:34px;border-radius:50% 50% 50% 0;background:var(--pin);transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px #0005;display:grid;place-items:center}.kazi-pin span{transform:rotate(45deg);font-size:15px}.legend{position:absolute;right:12px;top:10px;background:#fffffff2;border:1px solid #dfe5df;border-radius:8px;padding:7px 9px;display:flex;gap:10px;font-size:9px;font-weight:800;z-index:5;box-shadow:0 2px 10px #0002}.legend span{display:flex;align-items:center;gap:4px}.dot{width:8px;height:8px;border-radius:50%;display:inline-block}.green{background:#138a45}.orange{background:#d97706}.red{background:#d00000}.panel{position:absolute;z-index:10;left:7px;top:7px;width:245px;max-height:calc(100% - 14px);overflow:auto;background:#fff;border:1px solid #d7ded8;border-radius:5px;box-shadow:0 4px 18px #0003;padding:10px}.panel-title h1{font-size:17px;margin:8px 4px 2px;font-weight:900}.panel-title p{font-size:9px;line-height:1.4;color:#657168;margin:0 4px 10px}.choice{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:8px}.choice button{height:41px;background:#f8fbf9;border:1px solid #d4ded7;border-radius:7px;color:#126b33;font-size:10px;line-height:1.1;cursor:pointer}.choice button:first-child{background:#e9f7ee;border-color:#b8dfc5}.field{height:31px;border:1px solid #d7ded8;border-radius:7px;display:flex;align-items:center;gap:5px;padding:0 7px;margin-bottom:7px;background:#fff}.field input{border:0;outline:0;width:100%;font-size:10px;min-width:0}.field button{border:0;background:#fff;color:#16803d;font-size:9px;font-weight:900;cursor:pointer}.chips{display:flex;gap:5px;flex-wrap:wrap;margin:6px 0 10px}.chip{border:1px solid #d7ded8;background:#fff;border-radius:99px;padding:5px 8px;font-size:9px;font-weight:800;cursor:pointer}.section-title{font-size:9px;font-weight:900;color:#707b73;letter-spacing:.05em;margin:8px 2px 5px}.provider{width:100%;text-align:left;background:#fff;border:1px solid #dce3dd;border-radius:8px;margin-bottom:6px;padding:7px;cursor:pointer}.provider:hover,.provider.selected{border-color:#79b58c;background:#fbfefc}.provider-top{display:grid;grid-template-columns:30px 1fr auto;gap:7px;align-items:center}.avatar{width:30px;height:30px;border-radius:50%;overflow:hidden;background:#e3ece5}.avatar img{width:100%;height:100%;object-fit:cover}.provider-info{display:flex;flex-direction:column;min-width:0}.provider-info strong{font-size:10px}.provider-info span{font-size:8px;color:#5f6c63;margin-top:1px}.provider-info small{font-size:7px;color:#758178;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.provider em{font-style:normal;font-size:7px;font-weight:900}.available{color:#138a45}.taken{color:#d97706}.provider-bottom{display:flex;justify-content:space-between;border-top:1px solid #edf0ed;margin-top:6px;padding-top:5px;font-size:8px;color:#58655c}.provider-bottom b{color:#243229}.trusted{border-top:1px solid #edf0ed;margin-top:5px;padding-top:4px;font-size:7px;color:#68756d}.view-switch{display:flex;gap:4px;margin-top:6px}.view-switch button{flex:1;border:1px solid #d7ded8;background:#fff;border-radius:6px;padding:5px;font-size:8px;font-weight:900;cursor:pointer}.view-switch button.active{background:#138a45;color:#fff;border-color:#138a45}.overlay{position:fixed;inset:0;background:#0006;display:grid;place-items:center;z-index:100;padding:15px}.modal{width:min(520px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:16px;padding:20px;position:relative;box-shadow:0 20px 70px #0005}.close{position:absolute;right:12px;top:9px;border:0;background:#f0f3f0;border-radius:50%;width:30px;height:30px;font-size:22px;cursor:pointer}.profile-head{display:flex;gap:13px;align-items:center;padding-right:35px}.large-avatar{width:65px;height:65px;border-radius:50%;overflow:hidden;background:#e3ece5}.large-avatar img{width:100%;height:100%;object-fit:cover}.profile-head h2{margin:0 0 3px;font-size:21px}.profile-head p{margin:0 0 5px;color:#68756d;font-size:12px}.profile-detail{background:#f6f9f6;border:1px solid #e0e7e1;border-radius:10px;padding:10px;margin-top:12px;font-size:11px;line-height:1.6}.modal section{margin-top:15px}.modal h3{font-size:13px;margin:0 0 6px}.modal section p{font-size:11px;line-height:1.5;color:#536057}.photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.photo-grid img{width:100%;height:95px;object-fit:cover;border-radius:7px;cursor:pointer}.modal textarea,.modal input[type=text],.modal label input,.modal label textarea{width:100%;border:1px solid #d7ded8;border-radius:8px;padding:10px;outline:0;margin-top:6px}.modal label{display:block;font-size:10px;font-weight:900;margin-top:10px}.primary{width:100%;margin-top:12px;border:0;border-radius:9px;background:#138a45;color:#fff;padding:11px;font-weight:900;cursor:pointer}.job-modal-photo{height:180px;border-radius:10px;overflow:hidden;margin-bottom:12px}.job-modal-photo img{width:100%;height:100%;object-fit:cover}.file-note{font-size:9px;color:#68756d;margin-top:6px}
      @media(max-width:800px){.legend{display:none}.panel{width:calc(100% - 14px);max-height:52%;top:auto;bottom:7px}.topbar{gap:6px}.top-search{max-width:none}.offer-btn{display:none}}
    `}</style>
  </div>;
}
