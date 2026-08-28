"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return <main className="page"><section className="card success"><div className="mark">✓</div><h1>Your request is ready</h1><p>Your job details have been captured. Workers will be able to discover the request and contact you so you can discuss the work directly.</p><button onClick={() => router.push("/")}>Back to Kazi za Kenya</button></section><style jsx>{styles}</style></main>;
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
        <div className="notice">Kazi za Kenya connects you with workers. You and the worker discuss the job details and arrangements directly.</div>
        <button className="submit" type="submit">Post what I need</button>
      </form>
    </section>
    <style jsx>{styles}</style>
  </main>;
}

const styles = `
*{box-sizing:border-box}.page{min-height:100vh;background:#f3f6f3;padding:30px 16px;font-family:Inter,system-ui,-apple-system,\"Segoe UI\",sans-serif;color:#17221b}.card{max-width:680px;margin:auto;background:#fff;border:1px solid #dce4dc;border-radius:20px;padding:28px;box-shadow:0 12px 40px rgba(27,43,31,.10)}.brand{font-size:20px;font-weight:850;margin:8px 0 26px}.brand span{color:#15803d}h1{font-size:30px;margin:0 0 8px}.intro{color:#66736b;line-height:1.55;margin:0 0 24px}.back{border:0;background:transparent;color:#15803d;font-weight:750;padding:0;cursor:pointer}form{display:grid;gap:17px}label{display:grid;gap:7px;font-size:13px;font-weight:800}small{font-weight:500;color:#78847c}input,textarea{width:100%;border:1px solid #d5ddd6;border-radius:11px;padding:12px 13px;outline:0;background:#fff;font:inherit;font-weight:500}input:focus,textarea:focus{border-color:#16803d;box-shadow:0 0 0 3px rgba(22,128,61,.09)}textarea{resize:vertical}.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}.file{padding:10px}.photoNote{font-size:12px;color:#52705b}.notice{background:#eef8f1;border:1px solid #cfe8d6;border-radius:11px;padding:12px 14px;color:#386347;font-size:12px;line-height:1.5}.submit,.success button{border:0;border-radius:11px;background:#16803d;color:#fff;padding:13px 18px;font-weight:800;cursor:pointer}.submit:hover,.success button:hover{background:#126b33}.success{text-align:center;margin-top:10vh}.mark{width:58px;height:58px;border-radius:50%;background:#e7f7ec;color:#16803d;display:grid;place-items:center;margin:0 auto 18px;font-size:30px;font-weight:900}.success p{color:#66736b;line-height:1.6;max-width:500px;margin:0 auto 22px}@media(max-width:600px){.card{padding:21px}.two{grid-template-columns:1fr}h1{font-size:25px}}
`;
