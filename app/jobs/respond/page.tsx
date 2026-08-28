"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function RespondToJobPage() {
  const router = useRouter();
  const params = useSearchParams();
  const jobId = params.get("job");
  const [job, setJob] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!jobId) { setError("No job was selected."); setLoading(false); return; }
      const { data, error } = await supabase.from("jobs").select("id,title,description,category,area,location_text,budget_min,budget_max,status,customer_id").eq("id", jobId).single();
      if (error || !data) setError(error?.message || "Job not found.");
      else setJob(data);
      setLoading(false);
    }
    load();
  }, [jobId]);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setSending(true);
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) { router.push("/login"); return; }
    if (!job || job.status !== "available") { setError("This job is no longer available."); setSending(false); return; }
    if (job.customer_id === user.id) { setError("You cannot apply to your own job."); setSending(false); return; }
    const quoted = price.trim() ? Number(price.replace(/,/g, "")) : null;
    if (quoted !== null && (!Number.isFinite(quoted) || quoted < 0)) { setError("Enter a valid quoted price."); setSending(false); return; }
    const { error: insertError } = await supabase.from("job_responses").insert({ job_id: job.id, provider_id: user.id, message: message.trim() || null, quoted_price: quoted, status: "pending" });
    if (insertError) setError(insertError.code === "23505" ? "You have already responded to this job." : insertError.message);
    else setDone(true);
    setSending(false);
  }

  if (loading) return <main style={{padding:32,fontFamily:"system-ui"}}>Loading job…</main>;
  if (done) return <main className="page"><section className="card success"><div className="mark">✓</div><h1>Response sent</h1><p>The employer can now review your response and choose who to hire.</p><button onClick={() => router.push("/")}>Back to jobs</button><style jsx>{styles}</style></section></main>;
  return <main className="page"><section className="card"><button className="back" onClick={() => router.back()}>← Back</button><div className="brand">🇰🇪 Kazi za <span>Kenya</span></div><h1>Respond to this job</h1>{job && <div className="job"><b>{job.title}</b><span>{job.category} · {job.area || job.location_text || "Kenya"}</span><p>{job.description}</p></div>}{error && <div className="error">{error}</div>}{job && <form onSubmit={submit}><label>Message to employer<textarea rows={5} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Briefly explain how you can help" /></label><label>Your quoted price <small>(optional)</small><input inputMode="numeric" value={price} onChange={e=>setPrice(e.target.value)} placeholder="e.g. 2500" /></label><div className="notice">The employer chooses who to hire. Kazi za Kenya connects you; you discuss final price, timing and materials directly.</div><button className="submit" disabled={sending || job.status !== "available"}>{sending ? "Sending…" : "I'm interested in this job"}</button></form>}<style jsx>{styles}</style></section></main>;
}

const styles=`*{box-sizing:border-box}.page{min-height:100vh;background:#f3f6f3;padding:30px 16px;font-family:Inter,system-ui,sans-serif;color:#17221b}.card{max-width:680px;margin:auto;background:#fff;border:1px solid #dce4dc;border-radius:20px;padding:28px;box-shadow:0 12px 40px rgba(27,43,31,.10)}.brand{font-size:20px;font-weight:850;margin:10px 0 25px}.brand span{color:#15803d}.back{border:0;background:transparent;color:#15803d;font-weight:750;cursor:pointer;padding:0}h1{font-size:30px;margin:0 0 18px}.job{display:grid;gap:6px;background:#f7faf7;border:1px solid #dce6dd;border-radius:13px;padding:16px;margin-bottom:18px}.job b{font-size:18px}.job span{font-size:12px;color:#617067}.job p{margin:4px 0 0;line-height:1.5;color:#4e5e54}form{display:grid;gap:17px}label{display:grid;gap:7px;font-size:13px;font-weight:800}small{font-weight:500;color:#78847c}input,textarea{border:1px solid #d5ddd6;border-radius:11px;padding:12px 13px;font:inherit;outline:0}textarea{resize:vertical}.notice{background:#eef8f1;border:1px solid #cfe8d6;border-radius:11px;padding:12px 14px;color:#386347;font-size:12px;line-height:1.5}.error{background:#fff1f1;border:1px solid #efcaca;color:#9b2929;border-radius:10px;padding:11px 13px;margin-bottom:16px}.submit,.success button{border:0;border-radius:11px;background:#16803d;color:#fff;padding:13px 18px;font-weight:800;cursor:pointer}.submit:disabled{opacity:.55;cursor:not-allowed}.success{text-align:center;margin-top:10vh}.mark{width:58px;height:58px;border-radius:50%;background:#e7f7ec;color:#16803d;display:grid;place-items:center;margin:0 auto 18px;font-size:30px;font-weight:900}.success p{color:#66736b;line-height:1.6;margin-bottom:22px}`;