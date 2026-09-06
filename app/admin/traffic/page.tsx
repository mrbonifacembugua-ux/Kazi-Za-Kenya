"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Summary = {
  views_today: number;
  views_7d: number;
  views_30d: number;
  views_total: number;
  unique_today: number;
  unique_7d: number;
  unique_30d: number;
  unique_total: number;
  registered_users: number;
  jobs_total: number;
  top_pages: { path: string; views: number }[];
};

export default function AdminTrafficPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login?next=/admin/traffic");
        return;
      }
      const auth = await supabase.rpc("admin_is_authorized");
      if (auth.error || !auth.data) {
        setMessage(auth.error ? "Traffic analytics backend is not enabled yet." : "This account is not authorized for administration.");
        setChecking(false);
        return;
      }
      const result = await supabase.rpc("admin_traffic_summary");
      if (result.error) {
        setMessage(result.error.message);
        setChecking(false);
        return;
      }
      setSummary((result.data || null) as Summary | null);
      setChecking(false);
    })();
  }, [router]);

  if (checking) return <main className="center"><div className="card"><h1>AnyDayWork Traffic</h1><p>Loading private analytics…</p><style jsx>{styles}</style></div></main>;
  if (!summary) return <main className="center"><div className="card"><h1>AnyDayWork Traffic</h1><p>{message}</p><button onClick={() => router.push("/admin")}>Back to admin</button><style jsx>{styles}</style></div></main>;

  return (
    <main className="page">
      <header>
        <div><div className="brand"><span>Any</span><b>Day</b><strong>Work</strong></div><h1>Traffic & Growth</h1><p>Private analytics for the administrator. No names, emails, IP addresses or precise locations are stored.</p></div>
        <div className="actions"><button className="secondary" onClick={() => router.push("/admin")}>Moderation</button><button onClick={() => location.reload()}>Refresh</button></div>
      </header>

      <section className="grid">
        <Metric label="Visits today" value={summary.views_today} />
        <Metric label="Unique visitors today" value={summary.unique_today} />
        <Metric label="Visits this week" value={summary.views_7d} />
        <Metric label="Unique visitors this week" value={summary.unique_7d} />
        <Metric label="Visits this month" value={summary.views_30d} />
        <Metric label="Unique visitors this month" value={summary.unique_30d} />
        <Metric label="All visits" value={summary.views_total} />
        <Metric label="All unique visitors" value={summary.unique_total} />
        <Metric label="Registered users" value={summary.registered_users} />
        <Metric label="Jobs in database" value={summary.jobs_total} />
      </section>

      <section className="panel">
        <h2>Most visited pages · last 30 days</h2>
        {summary.top_pages.length ? <table><thead><tr><th>Page</th><th>Views</th></tr></thead><tbody>{summary.top_pages.map((row) => <tr key={row.path}><td>{row.path}</td><td>{row.views.toLocaleString()}</td></tr>)}</tbody></table> : <p className="muted">Traffic collection has just started. Page totals will appear here as visitors use the site.</p>}
      </section>

      <style jsx>{styles}</style>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <article className="metric"><span>{label}</span><strong>{Number(value || 0).toLocaleString()}</strong></article>;
}

const styles = `
  *{box-sizing:border-box}.page,.center{min-height:100vh;background:#f5f7f5;color:#172018;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif}.center{display:grid;place-items:center;padding:24px}.card,.panel,.metric{background:#fff;border:1px solid #dce4dd;border-radius:16px;box-shadow:0 10px 32px #00000008}.card{width:min(520px,100%);padding:28px}.page{padding:28px}header,.grid,.panel{max-width:1240px;margin-left:auto;margin-right:auto}header{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}header h1{margin:7px 0 4px;font-size:30px}header p{margin:0;color:#68736b}.brand{font-size:24px;font-weight:900;letter-spacing:-.04em}.brand b{color:#c91017}.brand strong{color:#16803d}.actions{display:flex;gap:8px}button{border:0;border-radius:9px;background:#16803d;color:#fff;font-weight:750;padding:10px 14px;cursor:pointer}.secondary{background:#fff;color:#172018;border:1px solid #ccd7cf}.grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-top:22px}.metric{padding:18px}.metric span{display:block;color:#68736b;font-size:13px;margin-bottom:8px}.metric strong{font-size:29px}.panel{margin-top:18px;padding:20px}.panel h2{margin:0 0 14px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:11px 8px;border-bottom:1px solid #edf0ed}th{font-size:12px;text-transform:uppercase;color:#6d786f}.muted{color:#68736b}@media(max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.page{padding:18px 12px}header{flex-direction:column}.grid{grid-template-columns:1fr}.actions{width:100%}.actions button{flex:1}}
`;
