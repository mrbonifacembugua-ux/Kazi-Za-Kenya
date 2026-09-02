"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

type Profile={id:string;full_name:string;profile_kind:"worker"|"employer";country_code:string;country_name:string;area:string|null;avatar_url:string|null;bio:string|null;years_experience:number|null;occupation:string|null;latitude:number|null;longitude:number|null};
type Job={id:string;employer_profile_id:string;title:string;description:string;category:string|null;budget_min:number|null;budget_max:number|null;currency_code:string|null;country_code:string;country_name:string;area:string|null;latitude:number|null;longitude:number|null};
type Media={id:number;owner_type:"profile"|"job";owner_id:string;image_url:string;caption:string|null;sort_order:number};
type Point={latitude:number|null;longitude:number|null};

const COUNTRY_KEY="anydaywork-marketplace-country";
const REGIONAL_DEMO=new Set(["ZA","BW","NA","ZW","ZM","MW","MZ","AO","LS","SZ","NG","GH","SN","CI","CM","CD","BF","BJ","CV","GM","GN","GW","LR","ML","NE","SL","TG","CF","TD","CG","GQ","GA","ST","DZ","EG","EH","LY","MA","MR","TN","MG","AR","BO","BR","CL","CO","EC","GY","PY","PE","SR","UY","VE","AG","BS","BB","CU","DM","DO","GD","HT","JM","KN","LC","VC","TT","BZ","GT","SV","HN","NI","CR","PA","US","CA","MX"]);

function clean(v:unknown){return String(v||"").trim().toLowerCase()}
function code(v:unknown){const c=String(v||"").trim().toUpperCase();return /^[A-Z]{2}$/.test(c)?c:"KE"}
function requestedCountry(){
  if(typeof window==="undefined") return "KE";
  try{
    const raw=new URLSearchParams(window.location.search).get("country");
    if(raw&&/^[a-z]{2}$/i.test(raw)) return raw.toUpperCase();
    const saved=window.localStorage.getItem(COUNTRY_KEY);
    if(saved&&/^[a-z]{2}$/i.test(saved)) return saved.toUpperCase();
  }catch{}
  return "KE";
}
function activeMode(){const t=Array.from(document.querySelectorAll<HTMLElement>(".main-tab")).find(x=>x.classList.contains("active"));return (t?.textContent||"").toLowerCase().includes("job")?"jobs":"workers"}
function point(v:Point){if(v.latitude==null||v.longitude==null)return null;const lat=Number(v.latitude),lng=Number(v.longitude);return Number.isFinite(lat)&&Number.isFinite(lng)?{lat,lng}:null}
function getMap(){const el=document.querySelector<HTMLElement>(".leaflet-container") as any;if(!el)return{el:null,map:null};const w=window as any;const map=w.__kzkMarketplaceMap||el.__kzkMarketplaceMap||el._leaflet_map||Object.values(w).find((v:any)=>v&&typeof v==="object"&&v._container===el&&typeof v.flyTo==="function"&&typeof v.addLayer==="function");return{el,map}}
function fly(v:Point,zoom=15){const p=point(v);const{map}=getMap();if(!p||!map)return;try{map.flyTo([p.lat,p.lng],zoom,{animate:true,duration:1.1})}catch{}}
function money(v:number|null,currency:string|null){if(v==null)return null;const c=(currency||"USD").toUpperCase();try{return new Intl.NumberFormat(undefined,{style:"currency",currency:c,maximumFractionDigits:0}).format(v)}catch{return `${c} ${Number(v).toLocaleString()}`}}
function budget(j:Job){const a=money(j.budget_min,j.currency_code),b=money(j.budget_max,j.currency_code);return a&&b?`${a} - ${b}`:a?`From ${a}`:b?`Up to ${b}`:"Budget to discuss"}

export default function MarketplaceSouthernDemoContent(){
  const pathname=usePathname();
  const[profiles,setProfiles]=useState<Profile[]>([]);
  const[jobs,setJobs]=useState<Job[]>([]);
  const[media,setMedia]=useState<Media[]>([]);
  const[country,setCountry]=useState("KE");
  const[query,setQuery]=useState("");
  const[workerMount,setWorkerMount]=useState<HTMLElement|null>(null);
  const[jobMount,setJobMount]=useState<HTMLElement|null>(null);
  const[selectedWorker,setSelectedWorker]=useState<Profile|null>(null);
  const[selectedJob,setSelectedJob]=useState<Job|null>(null);

  useEffect(()=>{
    if(pathname!=="/")return;
    const sync=()=>setCountry(requestedCountry());
    sync();
    const onCountry=(e:Event)=>{
      const next=code((e as CustomEvent<{countryCode?:string}>).detail?.countryCode);
      setCountry(next);
      try{window.localStorage.setItem(COUNTRY_KEY,next)}catch{}
    };
    const onPop=()=>sync();
    const onInput=(e:Event)=>{
      const i=e.target as HTMLInputElement|null;
      if(!i||i.tagName!=="INPUT")return;
      const p=clean(i.placeholder);
      if(p.includes("search")||p.includes("service")||p.includes("what do you need"))setQuery(clean(i.value));
    };
    window.addEventListener("anydaywork:country-changed",onCountry as EventListener);
    window.addEventListener("popstate",onPop);
    document.addEventListener("input",onInput,true);
    return()=>{
      window.removeEventListener("anydaywork:country-changed",onCountry as EventListener);
      window.removeEventListener("popstate",onPop);
      document.removeEventListener("input",onInput,true);
    };
  },[pathname]);

  useEffect(()=>{
    if(pathname!=="/")return;
    let active=true;
    async function load(){
      if(!REGIONAL_DEMO.has(country)){
        if(active){setProfiles([]);setJobs([]);setMedia([])}
        return;
      }
      const[p,j]=await Promise.all([
        supabase.from("demo_profiles").select("id,full_name,profile_kind,country_code,country_name,area,avatar_url,bio,years_experience,occupation,latitude,longitude").eq("dev_only",true).eq("country_code",country).order("sort_order"),
        supabase.from("demo_jobs").select("id,employer_profile_id,title,description,category,budget_min,budget_max,currency_code,country_code,country_name,area,latitude,longitude").eq("dev_only",true).eq("country_code",country).order("sort_order")
      ]);
      if(!active)return;
      const nextProfiles=!p.error?((p.data||[]) as Profile[]):[];
      const nextJobs=!j.error?((j.data||[]) as Job[]):[];
      setProfiles(nextProfiles);
      setJobs(nextJobs);
      const ownerIds=[...nextProfiles.map(x=>x.id),...nextJobs.map(x=>x.id)];
      if(!ownerIds.length){setMedia([]);return;}
      const m=await supabase.from("demo_media").select("id,owner_type,owner_id,image_url,caption,sort_order").eq("dev_only",true).in("owner_id",ownerIds).order("sort_order");
      if(active&&!m.error)setMedia((m.data||[]) as Media[]);
    }
    void load();
    const t=window.setInterval(load,30000);
    return()=>{active=false;window.clearInterval(t)};
  },[pathname,country]);

  useEffect(()=>{
    if(pathname!=="/")return;
    let stopped=false;
    const attach=()=>{
      const wm=document.getElementById("anyday-demo-workers-mount"),jm=document.getElementById("anyday-demo-jobs-mount");
      if(wm?.parentElement){let x=document.getElementById("anyday-south-workers-mount") as HTMLElement|null;if(!x){x=document.createElement("div");x.id="anyday-south-workers-mount";wm.insertAdjacentElement("afterend",x)}if(!stopped)setWorkerMount(x)}
      if(jm?.parentElement){let x=document.getElementById("anyday-south-jobs-mount") as HTMLElement|null;if(!x){x=document.createElement("div");x.id="anyday-south-jobs-mount";jm.insertAdjacentElement("afterend",x)}if(!stopped)setJobMount(x)}
    };
    attach();
    const o=new MutationObserver(attach);o.observe(document.body,{childList:true,subtree:true});
    return()=>{stopped=true;o.disconnect()};
  },[pathname]);

  const employers=useMemo(()=>new Map(profiles.filter(p=>p.profile_kind==="employer").map(p=>[p.id,p])),[profiles]);
  const photos=(type:"profile"|"job",id:string)=>media.filter(m=>m.owner_type===type&&m.owner_id===id).sort((a,b)=>a.sort_order-b.sort_order);
  const visibleWorkers=useMemo(()=>profiles.filter(p=>p.profile_kind==="worker").filter(p=>query?[p.full_name,p.occupation,p.area,p.country_name].some(v=>clean(v).includes(query)):true),[profiles,query]);
  const visibleJobs=useMemo(()=>jobs.filter(j=>query?[j.title,j.category,j.area,j.country_name].some(v=>clean(v).includes(query)):true),[jobs,query]);

  useEffect(()=>{
    if(pathname!=="/")return;
    const sync=()=>{const mode=activeMode();if(workerMount)workerMount.style.display=mode==="workers"?"block":"none";if(jobMount)jobMount.style.display=mode==="jobs"?"block":"none"};
    sync();const h=()=>setTimeout(sync,0);document.addEventListener("click",h,true);return()=>document.removeEventListener("click",h,true);
  },[pathname,workerMount,jobMount]);

  useEffect(()=>{
    if(pathname!=="/"||(!profiles.length&&!jobs.length))return;
    let cancelled=false;let timer=0;let workerGroup:any=null,jobGroup:any=null,mountedMap:any=null,mountedEl:any=null;
    const mount=()=>{
      if(cancelled)return true;
      const{el,map}=getMap();const L=(window as any).L;if(!el||!map||!L)return false;
      mountedMap=map;mountedEl=el;
      try{el.__anydaySouthWorkerGroup?.remove?.();el.__anydaySouthJobGroup?.remove?.()}catch{}
      workerGroup=L.layerGroup();jobGroup=L.layerGroup();
      profiles.filter(p=>p.profile_kind==="worker").forEach(w=>{const pt=point(w);if(!pt)return;const icon=L.divIcon({className:"anyday-south-map-marker",html:'<div class="anyday-south-pin anyday-south-pin-worker">E</div>',iconSize:[34,34],iconAnchor:[17,17]});const marker=L.marker([pt.lat,pt.lng],{icon});marker.bindTooltip(`${w.full_name} · EXAMPLE WORKER · ${w.area||w.country_name}`);marker.on("click",()=>{fly(w,14);setSelectedWorker(w)});marker.addTo(workerGroup)});
      jobs.forEach(j=>{const pt=point(j);if(!pt)return;const icon=L.divIcon({className:"anyday-south-map-marker",html:'<div class="anyday-south-pin anyday-south-pin-job">J</div>',iconSize:[34,34],iconAnchor:[17,17]});const marker=L.marker([pt.lat,pt.lng],{icon});marker.bindTooltip(`${j.title} · EXAMPLE JOB · ${j.area||j.country_name}`);marker.on("click",()=>{fly(j,14);setSelectedJob(j)});marker.addTo(jobGroup)});
      if(activeMode()==="workers")workerGroup.addTo(map);else jobGroup.addTo(map);
      el.__anydaySouthWorkerGroup=workerGroup;el.__anydaySouthJobGroup=jobGroup;return true;
    };
    let tries=0;timer=window.setInterval(()=>{tries++;if(mount()||tries>80)window.clearInterval(timer)},250);mount();
    const sync=()=>{if(!mountedMap||!workerGroup||!jobGroup)return;try{if(activeMode()==="workers"){if(!mountedMap.hasLayer(workerGroup))workerGroup.addTo(mountedMap);if(mountedMap.hasLayer(jobGroup))jobGroup.remove()}else{if(!mountedMap.hasLayer(jobGroup))jobGroup.addTo(mountedMap);if(mountedMap.hasLayer(workerGroup))workerGroup.remove()}}catch{}};
    const click=()=>setTimeout(sync,0);document.addEventListener("click",click,true);
    return()=>{cancelled=true;window.clearInterval(timer);document.removeEventListener("click",click,true);try{workerGroup?.remove?.();jobGroup?.remove?.()}catch{}if(mountedEl?.__anydaySouthWorkerGroup===workerGroup)mountedEl.__anydaySouthWorkerGroup=null;if(mountedEl?.__anydaySouthJobGroup===jobGroup)mountedEl.__anydaySouthJobGroup=null};
  },[pathname,profiles,jobs]);

  if(pathname!=="/"||!REGIONAL_DEMO.has(country))return null;
  const workerPortal=workerMount?createPortal(<div className="anyday-south-list">{visibleWorkers.map(p=>{const fallback=photos("profile",p.id)[0]?.image_url||"";return <button key={p.id} className="anyday-south-card" onClick={()=>{fly(p);setSelectedWorker(p)}}><img src={p.avatar_url||fallback} alt="Illustrative example profile" onError={e=>{if(fallback&&e.currentTarget.src!==fallback)e.currentTarget.src=fallback}}/><div><b>{p.full_name}</b><span>EXAMPLE</span><p>{p.occupation}</p><small>📍 {p.area}, {p.country_name}</small><em>📷 {photos("profile",p.id).length} work photos</em></div></button>})}</div>,workerMount):null;
  const jobPortal=jobMount?createPortal(<div className="anyday-south-list">{visibleJobs.map(j=>{const e=employers.get(j.employer_profile_id);const fallback=photos("job",j.id)[0]?.image_url||"";return <button key={j.id} className="anyday-south-card anyday-south-job" onClick={()=>{fly(j);setSelectedJob(j)}}><img src={e?.avatar_url||fallback} alt="Illustrative example employer" onError={ev=>{if(fallback&&ev.currentTarget.src!==fallback)ev.currentTarget.src=fallback}}/><div><b>{j.title}</b><span>EXAMPLE JOB</span><p>{e?.full_name||"Example employer"} · {j.area}</p><small>{budget(j)}</small><em>📷 {photos("job",j.id).length} job photos</em></div></button>})}</div>,jobMount):null;
  const wPhotos=selectedWorker?photos("profile",selectedWorker.id):[];
  const jPhotos=selectedJob?photos("job",selectedJob.id):[];
  const jobEmployer=selectedJob?employers.get(selectedJob.employer_profile_id):null;

  return <>{workerPortal}{jobPortal}{selectedWorker&&createPortal(<div className="anyday-south-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedWorker(null)}}><section className="anyday-south-modal"><button className="anyday-south-close" onClick={()=>setSelectedWorker(null)}>×</button><header><img src={selectedWorker.avatar_url||wPhotos[0]?.image_url||""} alt="Illustrative example profile"/><div><h2>{selectedWorker.full_name}</h2><p>{selectedWorker.occupation}</p><b>EXAMPLE — NOT A REAL USER</b></div></header><div className="anyday-south-box">📍 {selectedWorker.area}, {selectedWorker.country_name}</div><h3>About</h3><p>{selectedWorker.bio}</p><h3>Photos of my work</h3><div className="anyday-south-gallery">{wPhotos.map(x=><figure key={x.id}><img src={x.image_url} alt={x.caption||"Illustrative work example"}/><figcaption>{x.caption}</figcaption></figure>)}</div><p className="anyday-south-note">Illustrative example imagery only. This profile cannot be contacted, hired, rated or reviewed.</p></section></div>,document.body)}{selectedJob&&createPortal(<div className="anyday-south-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedJob(null)}}><section className="anyday-south-modal"><button className="anyday-south-close" onClick={()=>setSelectedJob(null)}>×</button><header><img src={jobEmployer?.avatar_url||jPhotos[0]?.image_url||""} alt="Illustrative example employer"/><div><h2>{jobEmployer?.full_name||"Example employer"}</h2><p>{jobEmployer?.occupation||"Job poster"}</p><b>EXAMPLE — NOT A REAL USER</b></div></header><div className="anyday-south-box">📍 {selectedJob.area}, {selectedJob.country_name}</div><h3>{selectedJob.title}</h3><strong>{budget(selectedJob)}</strong><p>{selectedJob.description}</p><h3>Photos of the work needed</h3><div className="anyday-south-gallery">{jPhotos.map(x=><figure key={x.id}><img src={x.image_url} alt={x.caption||"Illustrative job example"}/><figcaption>{x.caption}</figcaption></figure>)}</div><p className="anyday-south-note">Illustrative example job only. It cannot be applied to, accepted, messaged, rated or reviewed.</p></section></div>,document.body)}<style jsx global>{`#anyday-south-workers-mount,#anyday-south-jobs-mount{width:100%}.anyday-south-list{display:grid;gap:10px;margin:0 0 10px}.anyday-south-card{display:flex;width:100%;gap:12px;text-align:left;border:1px solid #d9e3db;background:#fff;border-radius:14px;padding:11px;cursor:pointer;color:#17221b}.anyday-south-card:hover{border-color:#6caf7f;box-shadow:0 3px 12px rgba(20,90,45,.1)}.anyday-south-card>img{width:86px;height:86px;object-fit:cover;border-radius:11px;background:#eef3ef}.anyday-south-card>div{min-width:0;flex:1}.anyday-south-card b{font-size:14px}.anyday-south-card span{float:right;background:#e4f5e8;color:#176b35;border-radius:999px;padding:3px 7px;font-size:9px;font-weight:800}.anyday-south-card p{margin:4px 0;font-size:12px}.anyday-south-card small,.anyday-south-card em{display:block;font-size:11px;color:#65736a;font-style:normal;margin-top:4px}.anyday-south-map-marker{background:transparent!important;border:0!important}.anyday-south-pin{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;border:3px solid #fff;box-shadow:0 3px 11px rgba(0,0,0,.3);font:900 11px/1 system-ui}.anyday-south-pin-worker{background:#16803d}.anyday-south-pin-job{background:#7c3aed}.anyday-south-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:999999;display:flex;justify-content:flex-end}.anyday-south-modal{width:min(540px,100%);height:100%;overflow:auto;background:#fff;padding:24px;box-shadow:-8px 0 30px rgba(0,0,0,.18);position:relative;color:#17221b}.anyday-south-close{position:absolute;right:14px;top:12px;border:0;background:#edf2ee;width:34px;height:34px;border-radius:50%;font-size:25px;cursor:pointer}.anyday-south-modal header{display:flex;gap:15px;align-items:center;padding-right:36px}.anyday-south-modal header img{width:96px;height:96px;object-fit:cover;border-radius:14px}.anyday-south-modal h2{margin:0 0 5px;font-size:23px}.anyday-south-modal header p{margin:0 0 7px}.anyday-south-modal header b{font-size:10px;color:#176b35;background:#e4f5e8;padding:5px 8px;border-radius:999px}.anyday-south-box{margin:18px 0;background:#f3f7f4;border-radius:10px;padding:11px}.anyday-south-modal h3{margin:18px 0 8px}.anyday-south-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.anyday-south-gallery figure{margin:0}.anyday-south-gallery img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:9px;background:#edf1ee}.anyday-south-gallery figcaption{font-size:10px;line-height:1.25;margin-top:4px;color:#66736a}.anyday-south-note{margin-top:20px;padding:10px;border-radius:9px;background:#fff7d8;font-size:11px}@media(max-width:700px){.anyday-south-modal{padding:18px}.anyday-south-gallery{grid-template-columns:1fr}.anyday-south-card>img{width:74px;height:74px}}`}</style></>;
}
