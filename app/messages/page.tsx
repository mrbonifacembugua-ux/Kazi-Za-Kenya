"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Conversation={id:string;job_id:string;employer_id:string;provider_id:string;updated_at:string;stage:string;job:{title:string}|null;employer:{full_name:string|null}|null;provider:{full_name:string|null}|null};
type UnreadRow={conversation_id:string;unread_count:number};
type HiddenRow={conversation_id:string;hidden_at:string};

export default function MessagesPage(){
 const router=useRouter();
 const [loading,setLoading]=useState(true);
 const [uid,setUid]=useState("");
 const [items,setItems]=useState<Conversation[]>([]);
 const [unread,setUnread]=useState<Record<string,number>>({});
 const [error,setError]=useState("");
 const [removing,setRemoving]=useState("");

 useEffect(()=>{
  void load();
  const ch=supabase.channel("messages-inbox-live").on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},()=>{void load()}).subscribe();
  return()=>{supabase.removeChannel(ch)}
 },[]);

 async function load(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){router.replace("/login?next=%2Fmessages");return}
  setUid(user.id);
  const [{data,error:e},{data:counts,error:ue},{data:hidden,error:he}]=await Promise.all([
   supabase.from("conversations").select("id,job_id,employer_id,provider_id,updated_at,stage,job:jobs!conversations_job_id_fkey(title),employer:profiles!conversations_employer_id_fkey(full_name),provider:profiles!conversations_provider_id_fkey(full_name)").order("updated_at",{ascending:false}),
   supabase.rpc("get_conversation_unread_counts"),
   supabase.from("conversation_hidden_for").select("conversation_id,hidden_at").eq("user_id",user.id)
  ]);
  const firstError=e||ue||he;
  if(firstError){setError(firstError.message);setLoading(false);return}
  const hiddenMap=new Map((hidden||[] as HiddenRow[]).map((row:any)=>[row.conversation_id,row.hidden_at]));
  const visible=((data||[]) as unknown as Conversation[]).filter(c=>{
   const hiddenAt=hiddenMap.get(c.id);
   return !hiddenAt||new Date(c.updated_at).getTime()>new Date(hiddenAt).getTime();
  });
  setItems(visible);
  const map:Record<string,number>={};
  for(const row of (counts||[]) as UnreadRow[]) map[row.conversation_id]=Number(row.unread_count)||0;
  setUnread(map);
  setError("");
  setLoading(false)
 }

 async function removeConversation(c:Conversation){
  const other=c.employer_id===uid?c.provider?.full_name:c.employer?.full_name;
  const ok=window.confirm(`Remove this conversation with ${other||"this participant"} from your Messages list?\n\nIt will not be deleted for the other person. If a new message arrives later, the conversation will appear again.`);
  if(!ok)return;
  setRemoving(c.id);setError("");
  const {error:e}=await supabase.from("conversation_hidden_for").upsert({conversation_id:c.id,user_id:uid,hidden_at:new Date().toISOString()},{onConflict:"conversation_id,user_id"});
  if(e){setError(e.message);setRemoving("");return}
  setItems(current=>current.filter(x=>x.id!==c.id));
  setRemoving("")
 }

 if(loading)return <main className="page"><section className="card"><h1>Loading messages…</h1></section><style jsx>{styles}</style></main>;
 return <main className="page"><section className="card">
  <button className="back" onClick={()=>router.push("/account")}>← My account</button>
  <h1>Messages</h1>
  <p className="intro">Private job conversations. The newest activity stays at the top, and unread messages are counted until you open the chat.</p>
  {error&&<div className="error">{error}</div>}
  {!error&&items.length===0?<div className="empty">No job conversations yet.</div>:<div className="list">{items.map(c=>{const other=c.employer_id===uid?c.provider?.full_name:c.employer?.full_name;const n=unread[c.id]||0;return <article className={`row ${n?"unread":""}`} key={c.id}>
   <button className="open" onClick={()=>router.push(`/messages/${c.id}`)}>
    <div><div className="titleline"><b>{c.job?.title||"Kazi za Kenya job"}</b>{n>0&&<strong className="badge">{n}</strong>}</div><p>{other||"Job participant"}</p><small>{c.stage.replaceAll("_"," ")}</small><time>{new Date(c.updated_at).toLocaleString()}</time></div>
    <span>Open chat →</span>
   </button>
   <button className="remove" disabled={removing===c.id} onClick={()=>removeConversation(c)}>{removing===c.id?"Removing…":"Remove from my messages"}</button>
  </article>})}</div>}
 </section><style jsx>{styles}</style></main>
}

const styles=`*{box-sizing:border-box}.page{min-height:100vh;background:#f3f6f3;padding:30px 16px;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#17221b}.card{max-width:760px;margin:auto;background:#fff;border:1px solid #dce4dc;border-radius:20px;padding:28px;box-shadow:0 12px 40px rgba(27,43,31,.1)}.back{border:0;background:transparent;color:#15803d;font-weight:800;cursor:pointer;padding:0;margin-bottom:22px}h1{margin:0 0 7px;font-size:28px}.intro{color:#69766e;margin:0 0 22px;line-height:1.5}.list{display:grid;gap:10px}.row{border:1px solid #dfe7e0;background:#fff;border-radius:12px;overflow:hidden;color:#17221b}.row.unread{background:#f5fbf6;border-color:#b9dbc3}.open{width:100%;display:flex;justify-content:space-between;align-items:center;text-align:left;border:0;background:transparent;padding:15px;cursor:pointer;color:#17221b}.open:hover{background:#f5faf6}.titleline{display:flex;align-items:center;gap:8px}.badge{min-width:24px;height:24px;padding:0 7px;border-radius:999px;background:#16803d;color:#fff;display:inline-grid;place-items:center;font-size:11px}.open p{margin:5px 0 0;color:#758078;font-size:12px}.open small{display:inline-block;margin-top:7px;padding:4px 7px;border-radius:999px;background:#edf5ef;color:#46624e;font-size:10px;font-weight:800;text-transform:uppercase}.open time{display:block;color:#89948d;font-size:10px;margin-top:7px}.open>span{font-size:12px;font-weight:850;color:#15803d}.remove{width:100%;border:0;border-top:1px solid #edf1ed;background:#fbfcfb;color:#6e2d2d;padding:9px 15px;font-size:11px;font-weight:800;text-align:right;cursor:pointer}.remove:hover{background:#fff6f6}.remove:disabled{opacity:.55;cursor:not-allowed}.empty{background:#f7faf7;color:#748078;padding:16px;border-radius:11px}.error{background:#fff1f1;border:1px solid #f0caca;color:#9f2020;border-radius:11px;padding:12px;margin-bottom:12px}@media(max-width:600px){.card{padding:20px}.open{align-items:flex-start;gap:12px}.open>span{white-space:nowrap}.remove{text-align:center;padding:11px}}`;