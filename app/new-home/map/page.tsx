"use client";

import { useMemo, useState } from "react";

type Marker = { id: string; kind: "worker" | "job"; name: string; service: string; area: string; x: number; y: number };

const workers: Marker[] = [
  { id: "w1", kind: "worker", name: "Brian • Electrician", service: "Electrical & repairs", area: "Kilimani", x: 42, y: 46 },
  { id: "w2", kind: "worker", name: "Mary • House help", service: "Cleaning & home help", area: "Lavington", x: 57, y: 35 },
  { id: "w3", kind: "worker", name: "Peter • Mover", service: "House moving", area: "South B", x: 68, y: 59 },
  { id: "w4", kind: "worker", name: "Kevin • Plumber", service: "Plumbing", area: "Westlands", x: 31, y: 28 },
];

const jobs: Marker[] = [
  { id: "j1", kind: "job", name: "Need a TV repaired", service: "TV / electronics repair", area: "Kileleshwa", x: 48, y: 41 },
  { id: "j2", kind: "job", name: "House moving needed", service: "Mover wanted", area: "Kasarani", x: 74, y: 27 },
  { id: "j3", kind: "job", name: "Need a plumber", service: "Plumbing", area: "Embakasi", x: 62, y: 70 },
];

export default function NewMapPage() {
  const [mode, setMode] = useState<"workers" | "jobs">("workers");
  const [selected, setSelected] = useState<Marker | null>(null);
  const markers = useMemo(() => (mode === "workers" ? workers : jobs), [mode]);

  return (
    <main className="page">
      <style>{styles}</style>
      <header className="header">
        <div className="brand"><b>Kazi</b><span>za</span><strong>Kenya</strong></div>
        <div className="tag">Find Work. Grow Kenya.</div>
      </header>

      <section className="toolbar">
        <div>
          <h1>{mode === "workers" ? "Find a worker near you" : "Find jobs near you"}</h1>
          <p>{mode === "workers" ? "People ready to help, starting with Nairobi." : "People nearby who need something done."}</p>
        </div>
        <div className="switcher">
          <button className={mode === "workers" ? "active" : ""} onClick={() => { setMode("workers"); setSelected(null); }}>Find a Worker</button>
          <button className={mode === "jobs" ? "active" : ""} onClick={() => { setMode("jobs"); setSelected(null); }}>Find Jobs</button>
        </div>
      </section>

      <section className="mapWrap">
        <div className="map" aria-label="Nairobi map">
          <div className="mapLabel">NAIROBI COUNTY</div>
          <div className="road r1" /><div className="road r2" /><div className="road r3" /><div className="road r4" />
          {markers.map((marker) => (
            <button key={marker.id} className={`marker ${marker.kind}`} style={{ left: `${marker.x}%`, top: `${marker.y}%` }} onClick={() => setSelected(marker)} aria-label={marker.name}>
              {marker.kind === "worker" ? "●" : "◆"}
            </button>
          ))}
          <div className="you">You</div>
        </div>

        <aside className="results">
          <div className="resultTitle">{markers.length} nearby</div>
          {markers.map((marker) => (
            <button className={`card ${selected?.id === marker.id ? "selected" : ""}`} key={marker.id} onClick={() => setSelected(marker)}>
              <span className={`icon ${marker.kind}`}>{marker.kind === "worker" ? "W" : "J"}</span>
              <span><b>{marker.name}</b><small>{marker.service} · {marker.area}</small></span>
            </button>
          ))}
          {selected && <div className="detail"><b>{selected.name}</b><p>{selected.service}</p><p>📍 {selected.area}</p><button>Message safely</button></div>}
        </aside>
      </section>
    </main>
  );
}

const styles = `
*{box-sizing:border-box}.page{min-height:100vh;background:#f7f7f4;color:#111;font-family:Arial,sans-serif}.header{height:74px;background:white;border-bottom:4px solid #111;display:flex;align-items:center;justify-content:space-between;padding:0 5vw}.brand{font-size:27px;letter-spacing:-1px}.brand b{color:#111}.brand span{color:#c51f2a;margin:0 3px}.brand strong{color:#087a45}.tag{font-size:14px;color:#666}.toolbar{padding:28px 5vw 18px;display:flex;justify-content:space-between;gap:20px;align-items:end}.toolbar h1{margin:0 0 6px;font-size:28px}.toolbar p{margin:0;color:#666}.switcher{display:flex;background:#e9e9e4;padding:4px;border-radius:12px}.switcher button{border:0;background:transparent;padding:11px 17px;border-radius:9px;font-weight:700;cursor:pointer}.switcher .active{background:#111;color:#fff}.mapWrap{margin:0 5vw 40px;background:white;border:1px solid #ddd;border-radius:18px;overflow:hidden;display:grid;grid-template-columns:1fr 340px;min-height:600px;box-shadow:0 10px 30px #0000000d}.map{position:relative;min-height:600px;overflow:hidden;background:linear-gradient(135deg,#dcebd7,#eaf0dd 48%,#d8e5d1);background-image:radial-gradient(#b7cdb0 1px,transparent 1px);background-size:18px 18px}.map:before{content:"";position:absolute;inset:8% 20% 10% 8%;border:22px solid #d1e1c9;border-radius:48% 52% 43% 57%;transform:rotate(-8deg)}.mapLabel{position:absolute;left:28px;top:22px;background:#ffffffdd;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;letter-spacing:1px}.road{position:absolute;height:8px;background:#fff;box-shadow:0 0 0 1px #d5ddd0;transform-origin:center;border-radius:10px}.r1{width:90%;left:5%;top:50%;transform:rotate(13deg)}.r2{width:72%;left:16%;top:36%;transform:rotate(-30deg)}.r3{width:65%;left:18%;top:68%;transform:rotate(-7deg)}.r4{width:55%;left:25%;top:24%;transform:rotate(48deg)}.marker{position:absolute;transform:translate(-50%,-50%);width:38px;height:38px;border-radius:50%;border:4px solid white;box-shadow:0 4px 12px #0005;color:white;font-size:14px;cursor:pointer;z-index:3}.marker.worker{background:#087a45}.marker.job{background:#c51f2a}.you{position:absolute;left:50%;top:54%;transform:translate(-50%,-50%);background:#111;color:white;padding:6px 10px;border-radius:20px;font-size:11px;font-weight:700;z-index:2}.results{padding:20px;overflow:auto}.resultTitle{font-weight:800;margin-bottom:12px}.card{width:100%;display:flex;gap:12px;text-align:left;border:1px solid #e1e1dc;background:#fff;padding:13px;border-radius:12px;margin-bottom:10px;cursor:pointer}.card:hover,.card.selected{border-color:#111}.icon{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;flex:none}.icon.worker{background:#087a45}.icon.job{background:#c51f2a}.card small{display:block;color:#666;margin-top:4px}.detail{margin-top:16px;padding:16px;background:#f4f4ef;border-radius:12px}.detail p{margin:6px 0;color:#666}.detail button{width:100%;border:0;background:#111;color:#fff;padding:11px;border-radius:9px;margin-top:8px;font-weight:700}@media(max-width:800px){.toolbar{display:block}.switcher{margin-top:16px}.mapWrap{grid-template-columns:1fr}.map{min-height:440px}.results{max-height:none}.tag{display:none}}
`;
