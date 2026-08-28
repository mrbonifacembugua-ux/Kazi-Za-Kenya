"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Profile={full_name:string|null;role:string|null;area:string|null;avatar_url:string|null};
type Job={id:string;title:string;status:string;created_at:string;customer_id:string;taken_by:string|null};
type Review={rating:number;reviewee_id:string};

export default function AccountPage(){
 const router=useRouter();
 const [loading,setLoading]=useState(true); const [busy,setBusy]=useState(false); const [profile,setProfile]=useState<Profile|null>(null); const [jobs,setJobs]=useState<Job[]>([]); const [uid,setUid]=useState(""); const [rating,setRating]=useState<{avg:number;count:number}>({avg:0,count:0}); const [messageCount,setMessageCount]=useState(0); const [ratedJobs,setRatedJobs]=useState<Set<string>>(new Set());
 useEffect(()=>{void load()},[]);
 async function load(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){router.replace("/login?next=%2Faccount");return} setUid(user.id);
  const [{data:p},{data:posted},{data:work},{data:reviews},{data:conversations},{data:mine}]=await Promise.all([
   supabase.from("profiles").select("full_name,role,area,avatar_url").eq("id",user.id).maybeSingle(),
   supabase.from("jobs").select("id,title,status,created_at,customer_id,taken_by").eq("customer_id",user.id).order("created_at",{ascending:false}),
   supabase.from("jobs").select("id,title,status,created_at,customer_id,taken_by").eq("taken_by",user.id).order("created_at",{ascending:false}),
   supabase.from("reviews").select("rating,reviewee_id").eq("reviewee_id",user.id),
   supabase.from("conversations").select("id"),
   supabase.from("reviews").select("job_id").eq("reviewer_id",user.id)
  ]);
  setProfile(p||null); const all=[...(posted||[]),...(work||[])]; setJobs(Array.from(new Map(all.map(j=>[j.id,j])).values()));
  const rr=(reviews||[]) as Review[]; setRating({count:rr.length,avg:rr.length?rr.reduce((a,r)=>a+Number(r.rating),0)/rr.length:0}); setMessageCount((conversations||[]).length); setRatedJobs(new Set((mine||[]).map((r:any)=>r.job_id))); setLoading(false);
 }
 async function logout(){setBusy(true); await supabase.auth.signOut(); router.replace("/login"); router.refresh()}
 const active=jobs.filter(j=>!["completed","archived","cancelled"].includes(j.status)); const history=jobs.filter(j=>["completed","archived","cancelled"].includes(j.status));
 if(loading)return <main className="page"><section className="card"><h1>Loading your account…</h1></section><style jsx>{styles}</style></main>;
 return <main className="page"><section className="card">
  <button className="back" onClick={()=>router.push("/")}>← Marketplace</button>
  <header><div>{profile?.avatar_url?<img className="avatar" src={profile.avatar_url} alt="Profile"/>:<div className="avatar blank">👤</div>}</div><div><h1>{profile?.full_name||"My Kazi za Kenya account"}</h1><p>{profile?.area||"Kenya"} · {profile?.role||"member"}</p>{rating.count>0&&<strong>⭐ {rating.avg.toFixed(1)} ({rating.count} verified review{rating.count===1?"":"s"})</strong>}</div></header>
  <div className="actions"><button onClick={()=>router.push("/post-job")}>＋ Post a job</button><button onClick={()=>router.push("/offer-service")}>🛠 Offer a service</button><button onClick={()=>router.push("/manage-jobs")}>📋 Manage my jobs</button><button onClick={()=>router.push("/my-work")}>🔨 My work</button><button onClick={()=>router.push("/messages")}>💬 Messages{messageCount?` (${messageCount})`:""}</button></div>
  <h2>Active jobs</h2>{active.length===0?<p className="empty">No active jobs right now.</p>:<div className="list">{active.map(j=><JobRow key={j.id} job={j} uid={uid} router={router} rated={ratedJobs.has(j.id)}/>)}</div>}
  <h2>Job history</h2>{history.length===0?<p className="empty">Completed and archived jobs will appear here.</p>:<div className="list">{history.map(j=><JobRow key={j.id} job={j} uid={uid} router={router} rated={ratedJobs.has(j.id)}/>)}</div>}
  <button className="logout" disabled={busy} onClick={logout}>{busy?"Signing out…":"Sign out"}</button>
 </section><style jsx>{styles}</style></main>
}
function JobRow({job,uid,router,rated}:{job:Job;uid:string;router:any;rated:boolean}){const employer=job.customer_id===uid;const done=["completed","archived"].includes(job.status);return <article><div><b>{job.title}</b><p>{employer?"You posted this job":"You were hired for this job"} · {new Date(job.created_at).toLocaleDateString()}</p></div><div className="right"><span>{job.status.replaceAll("_"," ")}</span>{done&&!rated&&<button onClick={()=>router.push(`/rate-job?job=${job.id}`)}>Rate</button>}{done&&rated&&<em>✓ Rated</em>}<button onClick={()=>router.push(employer?"/manage-jobs":"/my-work")}>Open</button></div></article>}
const styles=`*{box-sizing:border-box}.page{min-height:100vh;background:#f3f6f3;padding:30px 16px;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#17221b}.card{max-width:900px;margin:auto;background:#fff;border:1px solid #dce4dc;border-radius:20px;padding:28px;box-shadow:0 12px 40px rgba(27,43,31,.1)}.back{border:0;background:transparent;color:#15803d;font-weight:800;cursor:pointer;padding:0;margin-bottom:24px}header{display:flex;align-items:center;gap:16px;border-bottom:1px solid #e6ece7;padding-bottom:22px}.avatar{width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #dce8df}.blank{display:grid;place-items:center;background:#eef5ef;font-size:30px}h1{margin:0 0 5px;font-size:28px}header p{margin:0 0 5px;color:#68756d}header strong{font-size:13px;color:#9a6b00}.actions{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:24px 0}.actions button,.right button{border:1px solid #cfe1d3;background:#f4fbf6;color:#176b35;border-radius:11px;padding:11px;font-weight:800;cursor:pointer}h2{font-size:18px;margin:28px 0 12px}.list{display:grid;gap:9px}article{display:flex;justify-content:space-between;gap:14px;align-items:center;border:1px solid #e0e7e1;border-radius:12px;padding:14px}article p{margin:4px 0 0;color:#758078;font-size:12px}.right{display:flex;align-items:center;gap:10px}.right span{text-transform:capitalize;font-size:11px;font-weight:850;background:#eef7f0;color:#2d6940;border-radius:999px;padding:6px 9px}.right button{padding:7px 10px}.right em{font-size:11px;font-style:normal;color:#647269;font-weight:800}.empty{color:#7a867e;background:#f8faf8;padding:14px;border-radius:10px}.logout{margin-top:30px;border:1px solid #e1bcbc;background:#fff;color:#9b2626;border-radius:10px;padding:10px 15px;font-weight:800;cursor:pointer}@media(max-width:700px){.card{padding:20px}.actions{grid-template-columns:1fr 1fr}article{align-items:flex-start;flex-direction:column}.right{width:100%;justify-content:flex-start;flex-wrap:wrap}h1{font-size:23px}}`;