"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://pnqmqxeuzcodnxdixnvc.supabase.co", "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l");

type Profile = { id:string; full_name:string|null; phone:string|null; county:string|null; area:string|null; road:string|null; bio:string|null; latitude:number|null; longitude:number|null; profile_photo_url:string|null; verification_status:string|null };
type Service = { id:string; title:string; description:string|null; category:string|null; price_from:number|null; price_to:number|null; availability_status:string|null };
type Photo = { photo_url:string|null; title:string|null };

export default function ProviderProfile(){
  const params=useParams(); const router=useRouter();
  const id=String(params.id);
  const [profile,setProfile]=useState<Profile|null>(null); const [services,setServices]=useState<Service[]>([]); const [photos,setPhotos]=useState<Photo[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const [showMessage,setShowMessage]=useState(false); const [message,setMessage]=useState(""); const [sending,setSending]=useState(false); const [messageError,setMessageError]=useState(""); const [sent,setSent]=useState(false);
  useEffect(()=>{(async()=>{try{
    const [{data:p,error:pe},{data:s,error:se},{data:ph,error:phe}]=await Promise.all([
      supabase.from("profiles").select("id,full_name,phone,county,area,road,bio,latitude,longitude,profile_photo_url,verification_status").eq("id",id).single(),
      supabase.from("services").select("id,title,description,category,price_from,price_to,availability_status").eq("provider_id",id).order("created_at",{ascending:false}),
      supabase.from("portfolio_items").select("photo_url,title").eq("provider_id",id).eq("moderation_status","approved").order("created_at",{ascending:true})
    ]); if(pe) throw pe; if(se) throw se; if(phe) throw phe; setProfile(p); setServices(s||[]); setPhotos((ph||[]).filter(x=>x.photo_url));
  }catch(e){setError(e instanceof Error?e.message:"Profile could not be loaded.")}finally{setLoading(false)}})()},[id]);

  async function sendMessage(){
    setMessageError("");
    const text=message.trim();
    if(!text){setMessageError("Please write a message first.");return;}
    setSending(true);
    try{
      const {data:{user}}=await supabase.auth.getUser();
      if(!user){router.push(`/login?next=/profile/${id}`);return;}
      if(user.id===id){setMessageError("You cannot message your own profile.");return;}
      const {data:existing}=await supabase.from("conversations").select("id").eq("employer_id",user.id).eq("provider_id",id).is("job_id",null).maybeSingle();
      let conversationId=existing?.id;
      if(!conversationId){
        const {data:conversation,error:ce}=await supabase.from("conversations").insert({employer_id:user.id,provider_id:id}).select("id").single();
        if(ce) throw ce; conversationId=conversation.id;
      }
      const {error:me}=await supabase.from("messages").insert({conversation_id:conversationId,sender_id:user.id,body:text});
      if(me) throw me;
      setMessage("");setSent(true);setShowMessage(false);
      setTimeout(()=>setSent(false),3500);
    }catch(e){setMessageError(e instanceof Error?e.message:"Message could not be sent. Please try again.");}
    finally{setSending(false);}
  }

  if(loading) return <main className="state">Loading profile…</main>;
  if(error||!profile) return <main className="state"><h2>Profile unavailable</h2><p>{error||"This provider could not be found."}</p><button onClick={()=>router.push("/")}>← Back to map</button></main>;
  const location=[profile.area,profile.road,profile.county].filter(Boolean).join(" · ");
  return <main className="page"><div className="flag"/><header><button className="brand" onClick={()=>router.push("/")}>🇰🇪 Kazi za <span>Kenya</span></button><button className="back" onClick={()=>router.push("/")}>← Back to map</button></header><section className="card"><div className="hero"><div className="avatar">{profile.profile_photo_url?<img src={profile.profile_photo_url} alt={profile.full_name||"Provider"}/>:"👤"}</div><div><h1>{profile.full_name||"Kazi za Kenya provider"} {profile.verification_status==="verified"&&<span className="verified">✓ Verified</span>}</h1><p>📍 {location||"Kenya"}</p></div></div><h2>Services</h2>{services.length?services.map(s=><article className="service" key={s.id}><div><b>{s.title}</b><small>{s.category||"Service"}</small><p>{s.description||"Professional service available nearby."}</p></div><strong>{s.price_from!=null?`From KSh ${Number(s.price_from).toLocaleString()}`:"Price on request"}</strong></article>):<p>No services listed yet.</p>}<h2>About</h2><p className="about">{profile.bio||"This provider has not added an about section yet."}</p>{photos.length>0&&<><h2>Proof of previous work</h2><div className="gallery">{photos.map((p,i)=><img key={i} src={p.photo_url||""} alt={p.title||`Work sample ${i+1}`}/>)}</div></>}<div className="contact"><button onClick={()=>{setMessageError("");setShowMessage(true)}}>💬 Message provider</button><p className="privacy">Your phone number stays private. Share it only when you feel comfortable.</p></div>{sent&&<div className="sent">✓ Message sent privately.</div>}</section>{showMessage&&<div className="overlay" onClick={()=>setShowMessage(false)}><div className="messageBox" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowMessage(false)}>×</button><h2>Message {profile.full_name||"this provider"}</h2><p className="privacy">Start with a message. You can share your phone number later if you both feel comfortable.</p><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write your message…" rows={6}/>{messageError&&<p className="error">{messageError}</p>}<button className="send" onClick={sendMessage} disabled={sending}>{sending?"Sending…":"Send message"}</button></div></div>}<style jsx>{`*{box-sizing:border-box}.page{min-height:100vh;background:#f4f7f4;color:#152019;font-family:Inter,system-ui,sans-serif;padding-bottom:30px}.flag{height:6px;background:linear-gradient(to bottom,#000 0 25%,#fff 25% 38%,#bb0000 38% 62%,#fff 62% 75%,#006b3c 75%)}header{height:66px;background:#fff;border-bottom:1px solid #dde4de;display:flex;align-items:center;justify-content:space-between;padding:0 max(18px,calc((100% - 850px)/2))}.brand{border:0;background:none;font-size:21px;font-weight:900;cursor:pointer}.brand span{color:#16803d}.back{border:1px solid #d6dfd8;background:#fff;border-radius:9px;padding:9px 12px;font-weight:800;color:#166b36;cursor:pointer}.card{width:min(850px,calc(100% - 28px));margin:25px auto;background:#fff;border:1px solid #dce5de;border-radius:18px;padding:25px;box-shadow:0 14px 40px #1b2b1f14}.hero{display:flex;gap:18px;align-items:center;border-bottom:1px solid #e8eee9;padding-bottom:20px}.avatar{width:88px;height:88px;border-radius:50%;background:#e7f5eb;display:grid;place-items:center;font-size:38px;overflow:hidden}.avatar img{width:100%;height:100%;object-fit:cover}.hero h1{margin:0;font-size:27px}.hero p{color:#66736a;font-size:12px}.verified{font-size:11px;color:#176b35;background:#e7f5eb;border-radius:20px;padding:5px 8px;vertical-align:middle}.service{display:flex;justify-content:space-between;gap:20px;padding:15px 0;border-bottom:1px solid #edf1ee}.service small{display:block;color:#16803d;margin-top:4px}.service p,.about{font-size:12px;color:#66736a;line-height:1.55}.service strong{white-space:nowrap;font-size:12px}.gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.gallery img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:9px}.contact button{display:block;width:100%;border:0;background:#c90000;color:white;font-weight:900;padding:13px;border-radius:9px;margin-top:20px;cursor:pointer;font-size:15px}.privacy{font-size:11px;color:#66736a;text-align:center;line-height:1.5}.sent{text-align:center;background:#e7f5eb;color:#176b35;font-weight:800;padding:10px;border-radius:9px;margin-top:12px}.overlay{position:fixed;inset:0;background:#07140bb8;display:grid;place-items:center;padding:18px;z-index:1000}.messageBox{position:relative;width:min(520px,100%);background:#fff;border-radius:18px;padding:25px;box-shadow:0 20px 70px #0005}.messageBox h2{margin-top:0}.close{position:absolute;right:14px;top:10px;border:0;background:none;font-size:28px;cursor:pointer;color:#526057}.messageBox textarea{width:100%;resize:vertical;border:1px solid #d5dfd8;border-radius:10px;padding:12px;font:inherit;outline:none}.messageBox textarea:focus{border-color:#16803d}.send{width:100%;margin-top:12px;border:0;border-radius:10px;padding:13px;background:#16803d;color:#fff;font-weight:900;cursor:pointer}.send:disabled{opacity:.6;cursor:wait}.error{color:#b00000;font-size:12px}.state{min-height:100vh;display:grid;place-items:center;text-align:center;font-family:Inter,system-ui,sans-serif}@media(max-width:620px){.gallery{grid-template-columns:repeat(2,1fr)}.service{display:block}.hero h1{font-size:21px}}`}</style></main>;
}
