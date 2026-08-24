"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://pnqmqxeuzcodnxdixnvc.supabase.co", "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l");

export default function NeedServicePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [when, setWhen] = useState("Today");
  const [county, setCounty] = useState("Nairobi");
  const [area, setArea] = useState("");
  const [road, setRoad] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  function chooseFiles(list: FileList | null) {
    setFiles(Array.from(list || []).filter((file) => file.type.startsWith("image/")).slice(0, 5));
  }

  function parseBudget(value: string) {
    const numbers = (value.match(/\d[\d,]*/g) || []).map((v) => Number(v.replace(/,/g, ""))).filter(Number.isFinite);
    return { min: numbers[0] ?? null, max: numbers[1] ?? numbers[0] ?? null };
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!title.trim() || !description.trim() || !area.trim()) return;
    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) { router.push("/login?next=/need-service"); return; }
      const budgetValues = parseBudget(budget);
      const { data: job, error: jobError } = await supabase.from("jobs").insert({
        customer_id: user.id,
        title: title.trim(),
        description: description.trim(),
        category: service.trim() || "Other",
        budget_min: budgetValues.min,
        budget_max: budgetValues.max,
        county: county.trim() || null,
        area: area.trim(),
        road: road.trim() || null,
        location_text: [area.trim(), road.trim()].filter(Boolean).join(" · "),
        status: "open",
      }).select("id").single();
      if (jobError) throw jobError;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `jobs/${user.id}/${job.id}/${Date.now()}-${i}-${safe}`;
        const upload = await supabase.storage.from("kazi-media").upload(path, file, { upsert: false, contentType: file.type });
        if (upload.error) throw new Error(`Photo ${i + 1} could not be uploaded.`);
        const { data: publicData } = supabase.storage.from("kazi-media").getPublicUrl(path);
        const { error: photoError } = await supabase.from("job_photos").insert({
          job_id: job.id, uploaded_by: user.id, storage_path: path, photo_url: publicData.publicUrl,
          caption: `Job photo ${i + 1}`, moderation_status: "pending",
        });
        if (photoError) throw photoError;
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post your job. Please try again.");
    } finally { setLoading(false); }
  }

  return <main className="page">
    <div className="flag" />
    <header><button className="brand" type="button" onClick={() => router.push("/")}>🇰🇪 Kazi za <span>Kenya</span></button><button className="back" type="button" onClick={() => router.push("/")}>← Back to map</button></header>
    <section className="card">
      <div className="intro"><div className="icon">➕</div><div><h1>I need something</h1><p>Tell nearby workers exactly what you need done. Add up to five photos so they can understand the job before contacting you.</p></div></div>
      {!success ? <form onSubmit={submit}>
        <label>What do you need done?<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Fix my leaking kitchen sink" required /></label>
        <label>Service / type of worker<input value={service} onChange={(e) => setService(e.target.value)} placeholder="e.g. Plumber, electrician, cleaner" /></label>
        <label>Describe the job<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain what needs to be done, what is broken, the size of the job and anything a worker should know." rows={5} required /></label>
        <div className="grid"><label>Budget (KSh)<input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. 2,000 - 4,000" /></label><label>When do you need it?<select value={when} onChange={(e) => setWhen(e.target.value)}><option>Today</option><option>This week</option><option>Flexible</option></select></label></div>
        <div className="grid"><label>County<input value={county} onChange={(e) => setCounty(e.target.value)} placeholder="Nairobi" /></label><label>Area / estate<input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Kilimani" required /></label></div>
        <label>Road / nearby landmark<input value={road} onChange={(e) => setRoad(e.target.value)} placeholder="Near Yaya Centre" /></label>
        <label>Photos showing what needs to be done <span className="hint">5 spaces maximum</span><input type="file" accept="image/*" multiple onChange={(e) => chooseFiles(e.target.files)} /></label>
        <div className="photo-slots">{Array.from({ length: 5 }).map((_, index) => { const file = files[index]; return <div className={`slot ${file ? "filled" : ""}`} key={index}>{file ? <img src={URL.createObjectURL(file)} alt={`Job photo ${index + 1}`} /> : <span>📷</span>}<b>{index + 1}</b></div>; })}</div>
        <p className="fileInfo">{files.length}/5 photos selected · {(totalSize / 1024 / 1024).toFixed(1)} MB</p>
        {error && <div className="error">{error}</div>}
        <button className="submit" type="submit" disabled={loading}>{loading ? "Posting your job…" : "Post what I need →"}</button>
        <p className="fine">Your job will be added to the live Kazi za Kenya jobs board for nearby workers to find.</p>
      </form> : <div className="successBox"><div className="successIcon">✓</div><h2>Your job has been posted</h2><p>Your request and photos have been saved. Workers can now find your job on the live jobs board.</p><div className="actions"><button className="submit" type="button" onClick={() => router.push("/")}>View Kazi za Kenya</button><button className="secondary" type="button" onClick={() => setSuccess(false)}>Edit request</button></div></div>}
    </section>
    <footer>Find Work. Grow Kenya.</footer>
    <style jsx>{`*{box-sizing:border-box}.page{min-height:100vh;background:#f4f7f4;color:#152019;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;padding-bottom:30px}.flag{height:6px;background:linear-gradient(to bottom,#000 0 25%,#fff 25% 38%,#bb0000 38% 62%,#fff 62% 75%,#006b3c 75%)}header{height:66px;background:#fff;border-bottom:1px solid #dde4de;display:flex;align-items:center;justify-content:space-between;padding:0 max(18px,calc((100% - 850px)/2))}.brand{border:0;background:none;font-size:21px;font-weight:900;cursor:pointer}.brand span{color:#16803d}.back{border:1px solid #d6dfd8;background:#fff;border-radius:9px;padding:9px 12px;font-weight:800;color:#166b36;cursor:pointer}.card{width:min(720px,calc(100% - 28px));margin:25px auto;background:#fff;border:1px solid #dce5de;border-radius:18px;padding:25px;box-shadow:0 14px 40px #1b2b1f14}.intro{display:flex;gap:13px;align-items:center;margin-bottom:22px}.icon{width:52px;height:52px;border-radius:14px;background:#e7f5eb;display:grid;place-items:center;font-size:25px}.intro h1{margin:0;font-size:27px}.intro p{margin:5px 0 0;color:#66736a;font-size:12px;line-height:1.5}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}label{display:block;font-size:11px;font-weight:900;margin:0 0 13px}input,select,textarea{display:block;width:100%;margin-top:6px;border:1px solid #d5ded7;border-radius:9px;padding:11px;font:inherit;font-size:12px;background:#fff;outline:none}input:focus,select:focus,textarea:focus{border-color:#16803d;box-shadow:0 0 0 2px #16803d18}.hint{font-weight:600;color:#758078;margin-left:4px}.photo-slots{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:-3px 0 5px}.slot{position:relative;aspect-ratio:1;border:1px dashed #b9c9bc;border-radius:10px;background:#f7faf7;display:grid;place-items:center;color:#7b887f;overflow:hidden}.slot.filled{border-style:solid}.slot img{width:100%;height:100%;object-fit:cover}.slot span{font-size:22px}.slot b{position:absolute;left:6px;bottom:6px;background:#000b;color:#fff;border-radius:5px;padding:2px 6px;font-size:10px}.fileInfo,.fine{font-size:10px;color:#758078}.submit{width:100%;height:43px;border:0;border-radius:9px;background:#c90000;color:#fff;font-weight:900;cursor:pointer;margin-top:8px}.submit:disabled{opacity:.65;cursor:wait}.secondary{width:100%;height:43px;border:1px solid #d6dfd8;border-radius:9px;background:#fff;color:#166b36;font-weight:900;cursor:pointer;margin-top:8px}.error{background:#fff0f0;border:1px solid #f2c4c4;color:#a50000;padding:10px;border-radius:8px;font-size:11px;margin:10px 0}.successBox{text-align:center;padding:25px 8px}.successIcon{width:58px;height:58px;border-radius:50%;background:#e7f5eb;color:#16803d;display:grid;place-items:center;font-size:30px;font-weight:900;margin:0 auto 12px}.successBox h2{margin:0 0 7px}.successBox p{font-size:12px;line-height:1.5;color:#66736a}.actions{margin-top:18px}.fine{line-height:1.45}footer{text-align:center;color:#6f7b72;font-size:10px}@media(max-width:620px){.grid{grid-template-columns:1fr}.photo-slots{grid-template-columns:repeat(3,1fr)}header{padding:0 12px}.brand{font-size:18px}.card{padding:17px}.back{font-size:10px}}`}</style>
  </main>;
}
