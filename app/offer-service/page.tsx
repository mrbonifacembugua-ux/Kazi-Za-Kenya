"use client";

import { FormEvent, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  "https://pnqmqxeuzcodnxdixnvc.supabase.co",
  "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l"
);

const categories = ["Plumbing","Cleaning","Electrical","TV & electronics repair","Moving & house help","Driving","Selling","Other"];

export default function OfferServicePage(){
  const router = useRouter();
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [service,setService]=useState("");
  const [category,setCategory]=useState("Plumbing");
  const [description,setDescription]=useState("");
  const [price,setPrice]=useState("");
  const [county,setCounty]=useState("Nairobi");
  const [area,setArea]=useState("");
  const [road,setRoad]=useState("");
  const [files,setFiles]=useState<File[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");

  const totalSize=useMemo(()=>files.reduce((n,f)=>n+f.size,0),[files]);

  function chooseFiles(list:FileList|null){
    const next=Array.from(list||[]).filter(f=>f.type.startsWith("image/")).slice(0,7);
    setFiles(next);
  }

  async function submit(e:FormEvent){
    e.preventDefault(); setError(""); setSuccess("");
    if(!service.trim() || !area.trim()){setError("Please enter the service and your area.");return;}
    setLoading(true);
    try{
      const {data:{user},error:authError}=await supabase.auth.getUser();
      if(authError) throw authError;
      if(!user){router.push("/login?next=/offer-service");return;}

      const {error:profileError}=await supabase.from("profiles").upsert({
        id:user.id, full_name:name.trim() || user.email?.split("@")[0] || "Kazi za Kenya user",
        phone:phone.trim()||null, county:county.trim()||null, area:area.trim(), road:road.trim()||null,
        role:"provider", is_active:true, bio:description.trim()||null
      });
      if(profileError) throw profileError;

      const {data:serviceRow,error:serviceError}=await supabase.from("services").insert({
        provider_id:user.id,title:service.trim(),description:description.trim()||null,category,
        price_from:price?Number(price):null,availability_status:"available"
      }).select("id").single();
      if(serviceError) throw serviceError;

      if(files.length){
        for(let i=0;i<files.length;i++){
          const file=files[i];
          const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
          const path=`${user.id}/${serviceRow.id}/${Date.now()}-${i}-${safe}`;
          const upload=await supabase.storage.from("portfolio").upload(path,file,{upsert:false,contentType:file.type});
          if(upload.error) throw new Error(`Photo ${i+1} could not be uploaded. Make sure the portfolio storage bucket is enabled.`);
          const {data:publicData}=supabase.storage.from("portfolio").getPublicUrl(path);
          const {error:photoError}=await supabase.from("portfolio_items").insert({
            provider_id:user.id,title:`${service.trim()} — work sample ${i+1}`,
            storage_path:path,photo_url:publicData.publicUrl,moderation_status:"pending"
          });
          if(photoError) throw photoError;
        }
      }
      setSuccess("Your service profile has been created. You can now be discovered by people nearby.");
    }catch(err){setError(err instanceof Error?err.message:"Could not create your service profile. Please try again.");}
    finally{setLoading(false)}
  }

  return <main className="page">
    <div className="flag"/>
    <header><button className="brand" onClick={()=>router.push("/")}>🇰🇪 Kazi za <span>Kenya</span></button><button className="back" onClick={()=>router.push("/")}>← Back to map</button></header>
    <section className="card">
      <div className="intro"><div className="icon">🛠️</div><div><h1>Offer a service</h1><p>Tell Kenya what you can do. People nearby can find your service and contact you.</p></div></div>
      <form onSubmit={submit}>
        <div className="grid"><label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name"/></label><label>Phone number<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XX XXX XXX" type="tel" autoComplete="tel"/></label></div>
        <label>Service you offer<input value={service} onChange={e=>setService(e.target.value)} placeholder="e.g. TV repair, house cleaning, plumbing" required/></label>
        <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
        <label>About your service<textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="What do you do? Why should someone choose you?" rows={4}/></label>
        <div className="grid"><label>Starting price (KSh)<input value={price} onChange={e=>setPrice(e.target.value.replace(/[^0-9]/g,""))} inputMode="numeric" placeholder="1000"/></label><label>County<input value={county} onChange={e=>setCounty(e.target.value)} placeholder="Nairobi"/></label></div>
        <div className="grid"><label>Area / estate<input value={area} onChange={e=>setArea(e.target.value)} placeholder="Kilimani" required/></label><label>Road / nearby landmark<input value={road} onChange={e=>setRoad(e.target.value)} placeholder="Near Yaya Centre"/></label></div>
        <label>Proof of previous work <span className="hint">up to 7 photos</span><input type="file" accept="image/*" multiple onChange={e=>chooseFiles(e.target.files)}/></label>
        {files.length>0&&<div className="photos">{files.map((f,i)=><div key={f.name+i}><img src={URL.createObjectURL(f)} alt="Work sample"/><small>{i+1}</small></div>)}</div>}
        <p className="fileInfo">{files.length} photo(s) selected · {(totalSize/1024/1024).toFixed(1)} MB</p>
        {error&&<div className="error">{error}</div>}{success&&<div className="success">✓ {success}</div>}
        <button className="submit" disabled={loading}>{loading?"Creating your profile…":"Create my service profile →"}</button>
        <p className="fine">Your profile and service are stored securely. Work photos are marked for review before being treated as verified portfolio material.</p>
      </form>
    </section>
    <footer>Find Work. Grow Kenya.</footer>
    <style jsx>{`*{box-sizing:border-box}.page{min-height:100vh;background:#f4f7f4;color:#152019;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;padding-bottom:30px}.flag{height:6px;background:linear-gradient(to bottom,#000 0 25%,#fff 25% 38%,#bb0000 38% 62%,#fff 62% 75%,#006b3c 75%)}header{height:66px;background:#fff;border-bottom:1px solid #dde4de;display:flex;align-items:center;justify-content:space-between;padding:0 max(18px,calc((100% - 850px)/2))}.brand{border:0;background:none;font-size:21px;font-weight:900;cursor:pointer}.brand span{color:#16803d}.back{border:1px solid #d6dfd8;background:#fff;border-radius:9px;padding:9px 12px;font-weight:800;color:#166b36;cursor:pointer}.card{width:min(720px,calc(100% - 28px));margin:25px auto;background:#fff;border:1px solid #dce5de;border-radius:18px;padding:25px;box-shadow:0 14px 40px #1b2b1f14}.intro{display:flex;gap:13px;align-items:center;margin-bottom:22px}.icon{width:52px;height:52px;border-radius:14px;background:#e7f5eb;display:grid;place-items:center;font-size:25px}.intro h1{margin:0;font-size:27px}.intro p{margin:5px 0 0;color:#66736a;font-size:12px;line-height:1.4}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}label{display:block;font-size:11px;font-weight:900;margin:0 0 13px}input,select,textarea{display:block;width:100%;margin-top:6px;border:1px solid #d5ded7;border-radius:9px;padding:11px;font:inherit;font-size:12px;background:#fff;outline:none}input:focus,select:focus,textarea:focus{border-color:#16803d;box-shadow:0 0 0 2px #16803d18}.hint{font-weight:600;color:#758078;margin-left:4px}.photos{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin:-5px 0 5px}.photos div{position:relative}.photos img{display:block;width:100%;aspect-ratio:1;object-fit:cover;border-radius:7px}.photos small{position:absolute;right:4px;bottom:4px;background:#000b;color:#fff;border-radius:5px;padding:2px 5px}.fileInfo,.fine{font-size:10px;color:#758078}.error,.success{padding:10px;border-radius:8px;font-size:11px;margin:10px 0}.error{background:#fff0f0;border:1px solid #f2c4c4;color:#a50000}.success{background:#eef9f0;border:1px solid #c5e3cc;color:#176b35}.submit{width:100%;height:43px;border:0;border-radius:9px;background:#c90000;color:#fff;font-weight:900;cursor:pointer;margin-top:8px}.submit:disabled{opacity:.65;cursor:wait}footer{text-align:center;color:#6f7b72;font-size:10px}@media(max-width:620px){.grid{grid-template-columns:1fr}.photos{grid-template-columns:repeat(4,1fr)}header{padding:0 12px}.brand{font-size:18px}.card{padding:17px}.back{font-size:10px}}`}</style>
  </main>
}
