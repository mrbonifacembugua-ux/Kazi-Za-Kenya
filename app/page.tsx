"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Provider = { id: string; name: string; service: string; area: string; price: string; rating: string; status: "AVAILABLE" | "TAKEN"; emoji: string };
type Job = { id: string; title: string; service: string; customer: string; area: string; budget: string; urgency: string };

const providers: Provider[] = [
  { id: "john", name: "John Mwangi", service: "TV & electronics repair", area: "Kilimani", price: "From KSh 1,000", rating: "4.8", status: "AVAILABLE", emoji: "📺" },
  { id: "mary", name: "Mary Wanjiku", service: "House cleaning & laundry", area: "Kileleshwa", price: "From KSh 1,500", rating: "4.9", status: "AVAILABLE", emoji: "🧹" },
  { id: "peter", name: "Peter Otieno", service: "Plumbing & repairs", area: "Lavington", price: "From KSh 1,200", rating: "4.7", status: "TAKEN", emoji: "🔧" },
  { id: "david", name: "David Kamau", service: "Moving & house help", area: "South B", price: "From KSh 2,000", rating: "4.8", status: "AVAILABLE", emoji: "🚚" },
  { id: "grace", name: "Grace Akinyi", service: "Electrical services", area: "Westlands", price: "From KSh 1,000", rating: "4.9", status: "AVAILABLE", emoji: "⚡" },
];

const jobs: Job[] = [
  { id: "1", title: "Kitchen sink is leaking", service: "Plumbing", customer: "Amina Hassan", area: "Kilimani", budget: "KSh 2,000 - 4,000", urgency: "TODAY" },
  { id: "2", title: "TV turns on but has no picture", service: "TV repair", customer: "Brian Otieno", area: "Lavington", budget: "KSh 1,000 - 2,500", urgency: "THIS WEEK" },
  { id: "3", title: "Deep cleaning for a 2-bedroom apartment", service: "House cleaning", customer: "Faith Njeri", area: "Kileleshwa", budget: "KSh 1,500 - 2,500", urgency: "FLEXIBLE" },
  { id: "4", title: "Install additional wall sockets", service: "Electrical", customer: "Samuel Kamau", area: "Westlands", budget: "KSh 2,000 - 5,000", urgency: "THIS WEEK" },
];
const categories = ["Plumbing", "Cleaning", "Electrician", "TV repair", "Moving"];

export default function Home() {
  const router = useRouter();
  const [view, setView] = useState<"workers" | "jobs">("workers");
  const [mode, setMode] = useState<"need" | "offer">("need");
  const [area, setArea] = useState("Nairobi, Kenya");
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const filteredProviders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? providers.filter((p) => `${p.name} ${p.service} ${p.area}`.toLowerCase().includes(q)) : providers;
  }, [search]);
  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? jobs.filter((j) => `${j.title} ${j.service} ${j.area}`.toLowerCase().includes(q)) : jobs;
  }, [search]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><span>Kazi</span> za <b>Kenya</b></div>
        <div className="search"><span>🔎</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="What do you need done? Try plumber, cleaner, TV repair..." /></div>
        <button className="btn" type="button" onClick={() => router.push("/login")}>Log in</button>
      </header>

      <main className="content">
        <div className="map-wrap">
          <iframe title="Nairobi map" src="https://www.openstreetmap.org/export/embed.html?bbox=36.70%2C-1.36%2C36.92%2C-1.20&layer=mapnik" className="map" />
          <div className="map-note">📍 Nairobi launch area</div>
        </div>

        <aside className="panel">
          <div className="hero"><h1>Find work. Get things done.</h1><p>Kazi za Kenya connects people who need work done with people who can do it.</p></div>
          <div className="tabs">
            <button type="button" className={view === "workers" ? "tab active" : "tab"} onClick={() => setView("workers")}>👷 Find a worker</button>
            <button type="button" className={view === "jobs" ? "tab active" : "tab"} onClick={() => setView("jobs")}>📋 Find jobs</button>
          </div>
          <div className="choice">
            <button type="button" className={mode === "need" ? "choice-btn selected" : "choice-btn"} onClick={() => { setMode("need"); setFormOpen(true); }}>➕ I need something</button>
            <button type="button" className={mode === "offer" ? "choice-btn selected" : "choice-btn"} onClick={() => { setMode("offer"); setFormOpen(true); }}>🛠️ I offer a service</button>
          </div>
          <div className="field"><span>📍</span><input id="area-search" name="area" value={area} onChange={(e) => setArea(e.target.value)} aria-label="Search area" /><button type="button" onClick={() => setArea(area.trim() || "Nairobi, Kenya")}>Search</button></div>
          <div className="field"><span>🔎</span><input id="service-search" name="service" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search service" placeholder={view === "workers" ? "Search a service" : "Search jobs"} /></div>
          <div className="chips">{categories.map((category) => <button key={category} type="button" className="chip" onClick={() => setSearch(category)}>{category}</button>)}</div>

          {view === "workers" ? <>
            <div className="section-title">People who can help around Nairobi</div>
            {filteredProviders.map((provider) => <button key={provider.id} type="button" className="card" onClick={() => { setSelectedProvider(provider); setSent(false); }}>
              <div className="avatar">{provider.emoji}</div>
              <div className="card-main"><strong>{provider.name}</strong><span>{provider.service}</span><small>📍 {provider.area}</small></div>
              <span className={provider.status === "AVAILABLE" ? "available" : "taken"}>● {provider.status}</span>
              <div className="card-bottom">⭐ {provider.rating} · nearby <b>{provider.price}</b></div>
            </button>)}
            {!filteredProviders.length && <p className="empty">No workers match your search.</p>}
          </> : <>
            <div className="section-title">Jobs available around Nairobi</div>
            {filteredJobs.map((job) => <button key={job.id} type="button" className="job-card" onClick={() => { setSelectedJob(job); setSent(false); }}>
              <div className="job-top"><span className="job-icon">{job.service === "Plumbing" ? "🔧" : job.service === "Electrical" ? "⚡" : job.service === "TV repair" ? "📺" : "🧹"}</span><span className="open">OPEN</span></div>
              <strong>{job.title}</strong><span>{job.service} · 📍 {job.area}</span><small>Budget: {job.budget} · {job.urgency}</small>
            </button>)}
            {!filteredJobs.length && <p className="empty">No jobs match your search.</p>}
          </>}
        </aside>
      </main>

      {selectedProvider && <div className="overlay" onClick={() => setSelectedProvider(null)}><div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" type="button" onClick={() => setSelectedProvider(null)}>×</button>
        <div className="modal-avatar">{selectedProvider.emoji}</div><h2>{selectedProvider.name}</h2><p className="muted">{selectedProvider.service}</p>
        <div className="info">📍 {selectedProvider.area}<br />⭐ {selectedProvider.rating} rating<br />💰 {selectedProvider.price}</div>
        <h3>Message {selectedProvider.name.split(" ")[0]}</h3><textarea id="worker-message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell them what you need..." rows={4} />
        <button className="btn primary full" type="button" onClick={() => setSent(true)}>{sent ? "✓ Message ready" : "Send message"}</button>
        {sent && <p className="success">Your message is ready. Sign in to continue the conversation.</p>}
      </div></div>}

      {selectedJob && <div className="overlay" onClick={() => setSelectedJob(null)}><div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" type="button" onClick={() => setSelectedJob(null)}>×</button><div className="modal-avatar">📋</div><h2>{selectedJob.title}</h2><p className="muted">{selectedJob.service} · {selectedJob.area}</p>
        <div className="info">👤 {selectedJob.customer}<br />💰 {selectedJob.budget}<br />⏰ {selectedJob.urgency}</div><p>Interested in this job? Sign in to contact the person who posted it.</p>
        <button className="btn primary full" type="button" onClick={() => router.push("/login")}>Log in to respond</button>
      </div></div>}

      {formOpen && <div className="overlay" onClick={() => setFormOpen(false)}><div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" type="button" onClick={() => setFormOpen(false)}>×</button><h2>{mode === "need" ? "Post what I need" : "Offer a service"}</h2><p className="muted">Create your request now. Sign in when you are ready to publish or contact someone.</p>
        <input id="form-title" name="title" placeholder={mode === "need" ? "What do you need done?" : "What service do you offer?"} /><input id="form-location" name="location" placeholder="Location / area" defaultValue={area} /><textarea id="form-description" name="description" placeholder="Describe the work or service..." rows={4} />
        <button className="btn primary full" type="button" onClick={() => router.push("/login")}>Continue to sign in</button>
      </div></div>}

      <style jsx>{`
        *{box-sizing:border-box}html,body{margin:0;color:#17221b;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input,textarea{font:inherit}.app{height:100vh;display:flex;flex-direction:column;background:#eef1ed}.topbar{height:68px;background:#fff;border-bottom:1px solid #dfe5df;display:flex;align-items:center;gap:16px;padding:0 22px;z-index:10}.brand{font-size:21px;font-weight:850;white-space:nowrap}.brand span{color:#15803d}.brand b{color:#16803d}.search{height:44px;max-width:680px;flex:1;background:#f8faf8;border:1px solid #d8ded8;border-radius:13px;display:flex;align-items:center;gap:8px;padding:0 13px}.search input{width:100%;border:0;outline:0;background:transparent}.btn{border:1px solid #d4dbd5;background:#fff;border-radius:11px;padding:10px 14px;font-weight:800;cursor:pointer}.btn.primary{background:#16803d;border-color:#16803d;color:#fff}.content{position:relative;flex:1;min-height:0}.map-wrap{position:absolute;inset:0;background:#dfe7df}.map{width:100%;height:100%;border:0}.map-note{position:absolute;right:18px;top:18px;background:#fff;padding:10px 13px;border-radius:12px;box-shadow:0 4px 16px #0002;font-weight:800;font-size:12px}.panel{position:absolute;z-index:5;left:18px;top:18px;width:390px;max-height:calc(100% - 36px);overflow:auto;background:#fffffff5;border:1px solid #dce4dc;border-radius:18px;padding:18px;box-shadow:0 12px 40px #1b2b1f29}.hero h1{margin:0 0 6px;font-size:27px;letter-spacing:-.7px}.hero p{margin:0 0 16px;color:#647169;font-size:13px;line-height:1.45}.tabs,.choice{display:grid;grid-template-columns:1fr 1fr;gap:7px}.tabs{background:#eef3ef;padding:4px;border-radius:12px;margin-bottom:12px}.tab,.choice-btn{border:0;border-radius:9px;padding:10px 7px;font-weight:800;cursor:pointer;background:transparent}.tab.active{background:#fff;color:#16803d;box-shadow:0 2px 8px #0001}.choice{margin-bottom:12px}.choice-btn{background:#f7faf7;border:1px solid #dce3dd;border-radius:12px}.choice-btn.selected{background:#e9f7ee;color:#126b33;border-color:#b9dfc6}.field{display:flex;align-items:center;gap:7px;border:1px solid #d8dfd9;border-radius:11px;background:#fff;min-height:43px;margin-bottom:9px;padding:0 7px 0 11px}.field input{border:0;outline:0;width:100%;min-width:0}.field button{border:0;background:#16803d;color:#fff;border-radius:8px;padding:7px 10px;font-weight:800;cursor:pointer}.chips{display:flex;flex-wrap:wrap;gap:7px;margin:7px 0 15px}.chip{border:1px solid #dce3dd;background:#fff;border-radius:99px;padding:7px 10px;font-size:12px;font-weight:700;cursor:pointer}.section-title{text-transform:uppercase;letter-spacing:.08em;color:#758178;margin:15px 0 9px;font-size:12px;font-weight:850}.card,.job-card{width:100%;text-align:left;border:1px solid #e0e6e1;background:#fff;border-radius:13px;margin-bottom:9px;cursor:pointer}.card{padding:11px;display:grid;grid-template-columns:40px 1fr auto;gap:9px;align-items:center}.card:hover,.job-card:hover{border-color:#8cc49b;box-shadow:0 4px 16px #14642d1a}.avatar,.modal-avatar{display:grid;place-items:center;border-radius:50%;background:#dfece2}.avatar{width:40px;height:40px;font-size:20px}.card-main{min-width:0;display:flex;flex-direction:column}.card-main strong{font-size:13px}.card-main span{font-size:11px;color:#69756d;margin-top:2px}.card-main small{font-size:10px;color:#68756d;margin-top:3px}.available{color:#16803d;font-size:9px;font-weight:900}.taken{color:#d97706;font-size:9px;font-weight:900}.card-bottom{grid-column:1/-1;border-top:1px solid #edf0ed;padding-top:8px;color:#526057;font-size:10px;display:flex;justify-content:space-between}.job-card{padding:12px;display:flex;flex-direction:column;gap:5px}.job-top{display:flex;justify-content:space-between;align-items:center}.job-icon{font-size:23px}.open{color:#16803d;background:#e9f7ee;border-radius:99px;padding:4px 7px;font-size:9px;font-weight:900}.job-card strong{font-size:14px}.job-card span{font-size:11px;color:#657168}.job-card small{font-size:10px;color:#718078}.empty{font-size:12px;color:#6b776f}.overlay{position:fixed;inset:0;z-index:100;background:#0e17117a;display:flex;align-items:center;justify-content:center;padding:20px}.modal{position:relative;width:min(520px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:18px;padding:25px;box-shadow:0 25px 80px #0005}.close{position:absolute;right:14px;top:12px;width:38px;height:38px;border-radius:50%;border:1px solid #dce3dd;background:#fff;font-size:24px;cursor:pointer}.modal-avatar{width:64px;height:64px;font-size:30px}.modal h2{margin:12px 40px 4px 0}.muted{color:#657168;font-size:13px;line-height:1.5}.info{background:#f5faf6;border:1px solid #dce5dd;border-radius:12px;padding:13px;line-height:1.8;font-size:13px;margin:15px 0}.modal input,.modal textarea{width:100%;border:1px solid #d8dfd9;border-radius:10px;padding:12px;outline:0;margin-bottom:10px}.modal textarea{resize:vertical}.full{width:100%}.success{color:#287343;background:#eef8f0;border-radius:9px;padding:9px;font-size:11px}@media(max-width:800px){.topbar{height:62px;padding:0 10px}.brand{font-size:18px}.topbar>.btn{display:none}.panel{left:10px;right:10px;top:auto;bottom:10px;width:auto;max-height:58%;padding:14px}.hero h1{font-size:22px}.map-note{display:none}}
      `}</style>
    </div>
  );
}
