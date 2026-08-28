"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

function parseBudget(value: string) {
  const numbers = value.match(/[\d,]+(?:\.\d+)?/g)?.map((part) => Number(part.replace(/,/g, ""))).filter(Number.isFinite) ?? [];
  if (numbers.length === 0) return { min: null, max: null };
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] };
  return { min: Math.min(numbers[0], numbers[1]), max: Math.max(numbers[0], numbers[1]) };
}

export default function PostJobPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (!data.user) {
        const next = encodeURIComponent("/post-job");
        router.replace(`/login?next=${next}`);
        return;
      }
      setCheckingAuth(false);
    });
    return () => { active = false; };
  }, [router]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        router.replace("/login?next=%2Fpost-job");
        return;
      }

      const form = new FormData(e.currentTarget);
      const title = String(form.get("title") || "").trim();
      const category = String(form.get("service") || "").trim();
      const description = String(form.get("description") || "").trim();
      const area = String(form.get("area") || "").trim();
      const budgetText = String(form.get("budget") || "").trim();
      const budget = parseBudget(budgetText);

      const { error: insertError } = await supabase.from("jobs").insert({
        customer_id: authData.user.id,
        title,
        description,
        category,
        budget_min: budget.min,
        budget_max: budget.max,
        county: "Nairobi",
        area,
        location_text: `${area}, Nairobi, Kenya`,
        status: "available",
      });

      if (insertError) throw insertError;

      // Photo upload will be connected to Supabase Storage next. The job itself
      // is already saved safely to the signed-in employer's account.
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not post your job. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (checkingAuth) {
    return <main className="page"><section className="card success"><h1>Checking your account…</h1><p>You need to be signed in so this job belongs to the correct employer.</p><style jsx>{styles}</style></section></main>;
  }

  if (submitted) {
    return <main className="page"><section className="card success"><div className="mark">✓</div><h1>Your request is posted</h1><p>Your job is now saved to your Kazi za Kenya account. Workers can discover it once the marketplace is connected to the live jobs database.</p>{photos.length > 0 && <p className="photoWarning">Your job was saved. Photo upload is the next connection we are adding, so these selected photos were not uploaded yet.</p>}<button onClick={() => router.push("/")}>Back to Kazi za Kenya</button></section><style jsx>{styles}</style></main>;
  }

  return <main className="page">
    <section className="card">
      <button className="back" type="button" onClick={() => router.push("/")}>← Back</button>
      <div className="brand">🇰🇪 Kazi za <span>Kenya</span></div>
      <h1>What do you need done?</h1>
      <p className="intro">Tell nearby workers what you need. You can discuss timing, final price and other arrangements directly with the worker.</p>
      <form onSubmit={submit}>
        <label>Job title<input required name="title" placeholder="e.g. Fix a leaking kitchen sink" /></label>
        <label>Service or category<input required name="service" placeholder="e.g. Plumbing, cleaning, moving" /></label>
        <label>Description<textarea required name="description" rows={5} placeholder="Describe the work that needs to be done" /></label>
        <div className="two"><label>Area<input required name="area" placeholder="e.g. Kilimani" /></label><label>Approximate budget<input required name="budget" placeholder="e.g. KSh 2,000 - 4,000" /></label></div>
        <label>Photos <small>(optional, up to 5)</small><input className="file" type="file" accept="image/*" multiple onChange={(e) => setPhotos(Array.from(e.target.files || []).slice(0,5))} /></label>
        {photos.length > 0 && <div className="photoNote">📷 {photos.length} photo{photos.length === 1 ? "" : "s"} selected</div>}
        {error && <div className="error">{error}</div>}
        <div className="notice">Kazi za Kenya connects you with workers. You and the worker discuss the job details and arrangements directly.</div>
        <button className="submit" type="submit" disabled={saving}>{saving ? "Posting…" : "Post what I need"}</button>
      </form>
    </section>
    <style jsx>{styles}</style>
  </main>;
}

const styles = `
*{box-sizing:border-box}.page{min-height:100vh;background:#f3f6f3;padding:30px 16px;font-family:Inter,system-ui,-apple-system,\"Segoe UI\",sans-serif;color:#17221b}.card{max-width:680px;margin:auto;background:#fff;border:1px solid #dce4dc;border-radius:20px;padding:28px;box-shadow:0 12px 40px rgba(27,43,31,.10)}.brand{font-size:20px;font-weight:850;margin:8px 0 26px}.brand span{color:#15803d}h1{font-size:30px;margin:0 0 8px}.intro{color:#66736b;line-height:1.55;margin:0 0 24px}.back{border:0;background:transparent;color:#15803d;font-weight:750;padding:0;cursor:pointer}form{display:grid;gap:17px}label{display:grid;gap:7px;font-size:13px;font-weight:800}small{font-weight:500;color:#78847c}input,textarea{width:100%;border:1px solid #d5ddd6;border-radius:11px;padding:12px 13px;outline:0;background:#fff;font:inherit;font-weight:500}input:focus,textarea:focus{border-color:#16803d;box-shadow:0 0 0 3px rgba(22,128,61,.09)}textarea{resize:vertical}.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}.file{padding:10px}.photoNote{font-size:12px;color:#52705b}.notice{background:#eef8f1;border:1px solid #cfe8d6;border-radius:11px;padding:12px 14px;color:#386347;font-size:12px;line-height:1.5}.error{background:#fff1f1;border:1px solid #f2c4c4;color:#9f1d1d;border-radius:11px;padding:11px 13px;font-size:13px}.submit,.success button{border:0;border-radius:11px;background:#16803d;color:#fff;padding:13px 18px;font-weight:800;cursor:pointer}.submit:disabled{opacity:.65;cursor:wait}.submit:hover:not(:disabled),.success button:hover{background:#126b33}.success{text-align:center;margin-top:10vh}.mark{width:58px;height:58px;border-radius:50%;background:#e7f7ec;color:#16803d;display:grid;place-items:center;margin:0 auto 18px;font-size:30px;font-weight:900}.success p{color:#66736b;line-height:1.6;max-width:500px;margin:0 auto 22px}.photoWarning{background:#fff8e8;border:1px solid #f0dfb2;border-radius:10px;padding:10px;color:#795c18!important;font-size:12px}@media(max-width:600px){.card{padding:21px}.two{grid-template-columns:1fr}h1{font-size:25px}}
`;
