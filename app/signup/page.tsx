"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const PUBLIC_APP_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "https://kazi-za-kenya.vercel.app";
const COUNTRY_STORAGE_KEY = "anydaywork-marketplace-country";

function safeNextPath(){if(typeof window==="undefined")return"/";const value=new URLSearchParams(window.location.search).get("next")||"/";return value.startsWith("/")&&!value.startsWith("//")?value:"/"}
function confirmationRedirect(next:string){const url=new URL("/login",PUBLIC_APP_ORIGIN);url.searchParams.set("confirmed","1");if(next!=="/")url.searchParams.set("next",next);return url.toString()}
function signupCountryCode(){if(typeof window==="undefined")return"";try{const code=String(window.localStorage.getItem(COUNTRY_STORAGE_KEY)||"").trim().toUpperCase();return /^[A-Z]{2}$/.test(code)?code:""}catch{return""}}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [role, setRole] = useState<"customer" | "provider" | "both">("both");
  const [busy,setBusy]=useState(false);
  const [resending,setResending]=useState(false);
  const [awaitingConfirmation,setAwaitingConfirmation]=useState(false);
  const [message,setMessage]=useState("");
  const [next,setNext]=useState("/");
  useEffect(()=>setNext(safeNextPath()),[]);

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setBusy(true);setMessage("");
    const countryCode=signupCountryCode();
    const {data,error}=await supabase.auth.signUp({
      email:email.trim(),password,
      options:{emailRedirectTo:confirmationRedirect(next),data:{full_name:fullName.trim(),phone:phone.trim(),role,...(countryCode?{country_code:countryCode}:{})}},
    });
    setBusy(false);
    if(error){setMessage(error.message);return;}
    if(data.session){router.push(next);router.refresh();}
    else{setAwaitingConfirmation(true);setMessage("Account created. Check your email and press Confirm Email. After confirmation, you will return to AnyDayWork and can log in.");}
  }

  async function resendConfirmation(){
    const cleanEmail=email.trim();
    if(!cleanEmail){setMessage("Enter your email address first.");return;}
    setResending(true);setMessage("");
    const {error}=await supabase.auth.resend({type:"signup",email:cleanEmail,options:{emailRedirectTo:confirmationRedirect(next)}});
    setResending(false);
    if(error){setMessage(error.message);return;}
    setMessage("A new confirmation email has been sent. Please use the newest email to confirm your account.");
  }

  const loginHref=next==="/"?"/login":`/login?next=${encodeURIComponent(next)}`;
  return (
    <main className="page"><section className="card">
      <button className="back" onClick={()=>router.push(loginHref)}>← Back to login</button>
      <div className="brand"><span>Any</span><strong>DayWork</strong></div>
      <h1>Create your account</h1><p className="intro">One account can hire workers, offer services, or do both.</p>
      <form onSubmit={submit} autoComplete="on">
        <label>Full name<input required name="name" autoComplete="name" value={fullName} onChange={(e)=>setFullName(e.target.value)}/></label>
        <label>Email address<input required name="email" type="email" autoComplete="username" value={email} onChange={(e)=>setEmail(e.target.value)}/></label>
        <label>Phone number <small>(optional)</small><input name="tel" type="tel" autoComplete="tel" value={phone} onChange={(e)=>setPhone(e.target.value)}/></label>
        <label>Password<div className="passwordWrap"><input required name="password" minLength={8} type={showPassword?"text":"password"} autoComplete="new-password" value={password} onChange={(e)=>setPassword(e.target.value)}/><button type="button" className="passwordToggle" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Hide password":"Show password"} aria-pressed={showPassword}>{showPassword?"Hide":"Show"}</button></div></label>
        <fieldset><legend>I want to</legend><button type="button" className={role==="customer"?"selected":""} onClick={()=>setRole("customer")}>Hire workers</button><button type="button" className={role==="provider"?"selected":""} onClick={()=>setRole("provider")}>Find work</button><button type="button" className={role==="both"?"selected":""} onClick={()=>setRole("both")}>Do both</button></fieldset>
        {message&&<div className="message">{message}</div>}
        <button className="submit" disabled={busy}>{busy?"Creating account…":"Create account"}</button>
        {awaitingConfirmation&&<button type="button" className="resend" disabled={resending} onClick={resendConfirmation}>{resending?"Sending…":"Resend confirmation email"}</button>}
      </form>
      <p className="login">Already confirmed? <button onClick={()=>router.push(loginHref)}>Log in</button></p>
    </section><style jsx>{`*{box-sizing:border-box}.page{min-height:100vh;background:linear-gradient(135deg,#f6faf7,#fff);display:grid;place-items:center;padding:28px;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#171717}.card{width:min(560px,100%);background:#fff;border:1px solid #dfe6e1;border-radius:22px;padding:32px;box-shadow:0 18px 55px rgba(0,0,0,.09)}.back{border:0;background:none;color:#c91017;font-weight:700;cursor:pointer;padding:0 0 22px}.brand{font-size:24px;font-weight:900}.brand span{font-size:24px;margin-right:0;color:#171717}.brand strong{color:#07843e}h1{font-size:30px;margin:22px 0 6px}.intro{color:#626b65;margin:0 0 24px}form{display:grid;gap:16px}label{font-weight:750;font-size:14px;display:grid;gap:7px}small{font-weight:500;color:#777}input{height:48px;border:1px solid #cfd8d2;border-radius:11px;padding:0 13px;font:inherit;outline:none}input:focus{border-color:#07843e;box-shadow:0 0 0 3px rgba(7,132,62,.1)}.passwordWrap{position:relative}.passwordWrap input{width:100%;padding-right:72px}.passwordToggle{position:absolute;right:8px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:#067236;font-weight:800;cursor:pointer;padding:8px}fieldset{border:0;padding:0;margin:2px 0;display:flex;gap:8px;flex-wrap:wrap}legend{font-size:14px;font-weight:750;margin-bottom:8px}fieldset button{border:1px solid #ccd6cf;background:#fff;border-radius:999px;padding:10px 14px;font-weight:700;cursor:pointer}.selected{background:#eaf7ef!important;border-color:#07843e!important;color:#067236}.submit{height:50px;border:0;border-radius:11px;background:#07843e;color:#fff;font-size:16px;font-weight:800;cursor:pointer}.submit:disabled,.resend:disabled{opacity:.6}.resend{height:46px;border:1px solid #07843e;border-radius:11px;background:#fff;color:#067236;font-size:15px;font-weight:800;cursor:pointer}.message{padding:11px 13px;background:#f5f7f5;border-radius:9px;font-size:14px}.login{text-align:center;color:#666;margin:20px 0 0}.login button{border:0;background:none;color:#c91017;font-weight:800;cursor:pointer}@media(max-width:520px){.card{padding:23px}.page{padding:14px}h1{font-size:26px}}`}</style></main>
  );
}
