"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase=createClient("https://pnqmqxeuzcodnxdixnvc.supabase.co","sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l");

export default function MapSearchEnhancer(){
  useEffect(()=>{
    let stopped=false;
    let timer:number|undefined;
    let cleanupPatch:(()=>void)|undefined;
    let liveLayer:any=null;

    const geocode=async(area:string,road:string,county:string):Promise<[number,number]|null>=>{
      const known:Record<string,[number,number]>={
        kilimani:[-1.2928,36.7877],kileleshwa:[-1.2857,36.777],lavington:[-1.2815,36.769],westlands:[-1.2676,36.807],"south b":[-1.3074,36.831],"south c":[-1.305,36.82],kasarani:[-1.2215,36.897],eastleigh:[-1.275,36.85],donholm:[-1.299,36.891],embakasi:[-1.323,36.902],langata:[-1.329,36.781]};
      const key=(area||"").toLowerCase().trim();
      if(known[key]) return known[key];
      try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ke&q=${encodeURIComponent([road,area,county,"Kenya"].filter(Boolean).join(", "))}`,{headers:{Accept:"application/json"}});const a=await r.json();return a?.length?[Number(a[0].lat),Number(a[0].lon)]:null}catch{return null}
    };

    const capture=(L:any)=>{
      if((window as any).__kaziMapCaptureInstalled) return;
      (window as any).__kaziMapCaptureInstalled=true;
      const originalMap=L.map;
      L.map=function(...args:any[]){const map=originalMap.apply(this,args);(window as any).__kaziMap=map;return map};
      const originalAddLayer=L.Map.prototype.addLayer;
      L.Map.prototype.addLayer=function(layer:any){const result=originalAddLayer.call(this,layer);(window as any).__kaziMap=this;return result};
      if(L.Map.addInitHook){L.Map.addInitHook(function(this:any){(window as any).__kaziMap=this});}
      cleanupPatch=()=>{try{L.map=originalMap;L.Map.prototype.addLayer=originalAddLayer}catch{}};
    };

    const icon=(L:any)=>L.divIcon({className:"kazi-live-provider-marker",html:`<div style="width:38px;height:38px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#16803d;border:3px solid white;box-shadow:0 3px 10px #0005;display:grid;place-items:center"><span style="transform:rotate(45deg);font-size:18px">👷</span></div>`,iconSize:[38,38],iconAnchor:[19,38]});

    const render=async()=>{
      if(stopped) return;
      const L=(window as any).L;
      const map=(window as any).__kaziMap;
      if(!L||!map) return;
      const active=document.querySelector<HTMLElement>(".main-tab.active")?.textContent||"";
      if(!active.includes("Find a worker")) return;
      if(liveLayer){liveLayer.clearLayers()}else{liveLayer=L.layerGroup().addTo(map)}
      const {data:profiles,error}=await supabase.from("profiles").select("id,full_name,phone,area,road,county,latitude,longitude,is_active,role").eq("role","provider").eq("is_active",true).limit(100);
      if(error){console.error("Could not load live providers",error);return}
      for(const p of profiles||[]){
        if(stopped) return;
        let coords:[number,number]|null=null;
        if(typeof p.latitude==="number"&&typeof p.longitude==="number"&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude))coords=[p.latitude,p.longitude];
        else coords=await geocode(p.area||"",p.road||"",p.county||"Nairobi");
        if(!coords) continue;
        const marker=L.marker(coords,{icon:icon(L),title:p.full_name||"Kazi za Kenya provider",zIndexOffset:1000});
        marker.bindTooltip(`<b>${p.full_name||"Kazi za Kenya provider"}</b><br>📍 ${p.area||p.county||"Kenya"}<br><small>Click to open profile</small>`,{direction:"top",offset:[0,-34]});
        marker.on("click",()=>window.location.assign(`/profile/${p.id}`));
        marker.addTo(liveLayer);
      }
    };

    const start=()=>{
      const L=(window as any).L;
      if(!L){timer=window.setTimeout(start,250);return}
      capture(L);
      void render();
      timer=window.setInterval(()=>void render(),1500);
    };
    start();
    return()=>{stopped=true;if(timer)window.clearInterval(timer);cleanupPatch?.();try{liveLayer?.remove()}catch{}};
  },[]);
  return null;
}
