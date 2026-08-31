"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type DemoProfile = {
  id: string;
  full_name: string;
  profile_kind: "worker" | "employer";
  country_code: string;
  country_name: string;
  area: string | null;
  avatar_url: string | null;
  bio: string | null;
  years_experience: number | null;
  occupation: string | null;
  example_label: string;
};

export default function ExamplesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<DemoProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<"worker" | "employer">("worker");
  const [country, setCountry] = useState("");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("demo_profiles")
      .select("id,full_name,profile_kind,country_code,country_name,area,avatar_url,bio,years_experience,occupation,example_label")
      .eq("is_demo", true)
      .order("country_name")
      .order("sort_order");
    const rows = (data || []) as DemoProfile[];
    setProfiles(rows);
    if (rows.length) setCountry(rows[0].country_code);
    setLoading(false);
  }

  const countries = useMemo(() => Array.from(new Map(profiles.map(p => [p.country_code, p.country_name])).entries()), [profiles]);
  const visible = profiles.filter(p => p.profile_kind === kind && (!country || p.country_code === country));

  return (
    <main className="page">
      <section className="shell">
        <button className="back" onClick={() => router.push("/")}>← Marketplace</button>
        <div className="heading">
          <div><p className="eyebrow">HOW ANYDAYWORK PROFILES LOOK</p><h1>Example profiles</h1><p>Explore examples that use the same kind of information as real AnyDayWork profiles.</p></div>
          <span className="demo">EXAMPLES ONLY</span>
        </div>
        <div className="notice"><b>These are demonstrations, not real users.</b> They cannot be contacted, hired, rated or messaged.</div>
        <div className="controls">
          <select value={country} onChange={e => setCountry(e.target.value)} disabled={!countries.length} aria-label="Country">
            {!countries.length && <option>No examples added yet</option>}
            {countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
          <div className="tabs"><button className={kind === "worker" ? "active" : ""} onClick={() => setKind("worker")}>Workers</button><button className={kind === "employer" ? "active" : ""} onClick={() => setKind("employer")}>Employers</button></div>
        </div>
        {loading ? <p className="empty">Loading examples…</p> : visible.length === 0 ? <p className="empty">The isolated example area is ready. No example profiles have been added for this selection yet.</p> : <div className="grid">{visible.map(profile => <article key={profile.id} className="card">
          <div className="photo">{profile.avatar_url ? <img src={profile.avatar_url} alt="Example profile" /> : <span>👤</span>}<b>EXAMPLE</b></div>
          <div className="body"><h2>{profile.full_name}</h2><p className="role">{profile.occupation || (profile.profile_kind === "worker" ? "Worker / service provider" : "Employer")}</p><p>📍 {[profile.area, profile.country_name].filter(Boolean).join(", ")}</p>{profile.years_experience != null && <p>🛠 {profile.years_experience} years experience</p>}{profile.bio && <p className="bio">{profile.bio}</p>}<small>{profile.example_label}</small></div>
        </article>)}</div>}
      </section>
      <style jsx>{`*{box-sizing:border-box}.page{min-height:100vh;background:#f3f6f3;padding:28px 16px;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#17221b}.shell{max-width:1120px;margin:auto}.back{border:0;background:transparent;color:#15803d;font-weight:850;cursor:pointer;padding:4px 0 18px}.heading{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.eyebrow{margin:0 0 6px;color:#15803d;font-size:12px;font-weight:900;letter-spacing:.08em}.heading h1{font-size:34px;margin:0 0 7px}.heading p{margin:0;color:#657269}.demo{background:#fff3cd;color:#7a5600;border:1px solid #f1d77c;border-radius:999px;padding:8px 11px;font-size:11px;font-weight:900}.notice{margin:22px 0;background:#fff;border:1px solid #dce5dd;border-left:4px solid #15803d;border-radius:12px;padding:14px 16px}.controls{display:flex;justify-content:space-between;gap:14px;align-items:center;margin:18px 0}.controls select{min-width:230px;border:1px solid #ccd8cf;border-radius:10px;padding:11px 12px;background:#fff}.tabs{display:flex;background:#e9efea;border-radius:10px;padding:3px}.tabs button{border:0;background:transparent;border-radius:8px;padding:9px 16px;font-weight:850;cursor:pointer}.tabs .active{background:#fff;color:#15803d;box-shadow:0 1px 4px rgba(0,0,0,.08)}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.card{overflow:hidden;background:#fff;border:1px solid #dce5dd;border-radius:15px;box-shadow:0 8px 24px rgba(27,43,31,.06)}.photo{height:180px;background:#eaf1eb;display:grid;place-items:center;position:relative;font-size:42px}.photo img{width:100%;height:100%;object-fit:cover}.photo b{position:absolute;left:9px;top:9px;background:#15803d;color:#fff;border-radius:6px;padding:5px 7px;font-size:10px}.body{padding:14px}.body h2{margin:0 0 4px;font-size:18px}.body p{margin:7px 0;color:#5d6a61;font-size:13px}.body .role{font-weight:850;color:#26372c}.bio{line-height:1.45}.body small{display:block;border-top:1px solid #edf1ed;margin-top:12px;padding-top:10px;color:#8b6500;font-weight:850}.empty{background:#fff;border:1px dashed #cbd8ce;border-radius:14px;padding:30px;text-align:center;color:#69766d}@media(max-width:900px){.grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.page{padding:18px 12px}.heading{display:block}.demo{display:inline-block;margin-top:12px}.heading h1{font-size:28px}.controls{align-items:stretch;flex-direction:column}.controls select{width:100%}.tabs{display:grid;grid-template-columns:1fr 1fr}.grid{grid-template-columns:1fr}.photo{height:250px}}`}</style>
    </main>
  );
}
