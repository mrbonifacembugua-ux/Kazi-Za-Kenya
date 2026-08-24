"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pnqmqxeuzcodnxdixnvc.supabase.co",
  "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l"
);

export default function LoginPage() {
  const [mode,setMode]=useState<"login"|"register">("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [remember,setRemember]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");

  async function submit(e:FormEvent){
    e.preventDefault(); setError(""); setMessage("");
    if(mode==="register" && password!==confirm){setError("Passwords do not match.");return;}
    setLoading(true);
    try{
      if(mode==="login"){
        const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
        if(error) throw error;
        window.location.replace("/");
        return;
      }
      const {data,error}=await supabase.auth.signUp({email:email.trim(),password});
      if(error) throw error;
      if(data.session){window.location.replace("/");return;}
      setMessage("Account created. Check your email to confirm your account, then log in.");
      setMode("login"); setPassword(""); setConfirm("");
    }catch(err){setError(err instanceof Error?err.message:"Unable to authenticate. Please try again.");}
    finally{setLoading(false);}
  }

  async function forgotPassword(){
    setError(""); setMessage("");
    if(!email.trim()){setError("Enter your email address first.");return;}
    setLoading(true);
    try{
      const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/login`});
      if(error) throw error;
      setMessage("Password reset instructions have been sent to your email.");
    }catch(err){setError(err instanceof Error?err.message:"Unable to send the reset email.");}
    finally{setLoading(false);}
  }

  return <main className="page">
    <div className="flag top"/><div className="soft left"/><div className="soft right"/>
    <div className="brand"><div><span>Kazi</span> <b>za</b> <strong>Kenya</strong></div><small>Find Work. Grow Kenya.</small><i/></div>
    <form className="card" onSubmit={submit}>
      <h1>{mode==="login"?<><span>Welcome</span> <b>back</b></>:<>Create <b>account</b></>}</h1>
      <div className="under"><span/><i/><em/></div>
      <p className="subtitle">{mode==="login"?"Log in to Kazi za Kenya":"Join Kazi za Kenya and connect with people nearby."}</p>
      <label>Email or phone number<input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
      <label>Password<input id="password" name="password" type="password" autoComplete={mode==="login"?"current-password":"new-password"} required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></label>
      {mode==="register"&&<label>Confirm password<input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={6} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm your password"/></label>}
      {error&&<div className="error" role="alert">{error}</div>}
      {message&&<div className="message" role="status">{message}</div>}
      {mode==="login"&&<div className="options"><label className="remember"><input id="rememberMe" name="rememberMe" type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/><span>Remember me</span></label><button type="button" className="forgot" onClick={forgotPassword} disabled={loading}>Forgot password?</button></div>}
      <button className="primary" type="submit" disabled={loading}>{loading?"Please wait…":mode==="login"?"Log in →":"Create account →"}</button>
      <div className="or"><span/>or<span/></div>
      <button className="create" type="button" onClick={()=>{setError("");setMessage("");setMode(mode==="login"?"register":"login")}}>{mode==="login"?"Create new account":"Already have an account? Log in"}</button>
      <button className="back" type="button" onClick={()=>window.location.assign("/")}>← Back to Kazi za Kenya</button>
    </form>
    <footer><span>Kazi za Kenya</span> — Building opportunities. Empowering Kenya.</footer>
    <style jsx>{`
      *{box-sizing:border-box}.page{min-height:100vh;background:#fbfbfa;display:flex;flex-direction:column;align-items:center;padding:0 18px 28px;position:relative;overflow:hidden;color:#0a0a0a;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.flag{position:absolute;left:0;right:0;height:6px;top:4px;background:linear-gradient(to bottom,#000 0 25%,#fff 25% 38%,#bb0000 38% 62%,#fff 62% 75%,#006b3c 75%)}.soft{position:absolute;border-radius:50%;background:#dce8e1;opacity:.95}.soft.left{width:270px;height:270px;left:-80px;top:-120px}.soft.right{width:300px;height:300px;right:-80px;bottom:-170px;background:#f1dada}.brand{margin-top:45px;text-align:center;z-index:1}.brand div{font-size:26px;font-weight:900;letter-spacing:-.8px}.brand div span{color:#000}.brand div b{color:#bb0000}.brand div strong{color:#006b3c}.brand small{display:block;font-size:11px;margin-top:7px;color:#233027}.brand i{display:block;width:73px;height:3px;margin:6px auto 0;background:linear-gradient(90deg,#000 0 34%,#bb0000 34% 67%,#006b3c 67%)}.card{z-index:2;width:min(346px,100%);margin-top:25px;background:#fff;border:1px solid #e1e1df;border-radius:15px;padding:31px 28px 26px;box-shadow:0 18px 45px #00000018}.card h1{text-align:center;margin:0;font-size:26px;letter-spacing:-.7px}.card h1 span{color:#000}.card h1 b{color:#bb0000}.under{height:3px;width:72px;margin:8px auto 8px;display:flex}.under span{flex:1;background:#000}.under i{flex:1;background:#bb0000}.under em{flex:1;background:#006b3c}.subtitle{text-align:center;font-size:11px;color:#59635c;margin:0 0 20px}.card>label{display:block;font-size:11px;font-weight:800;margin-bottom:13px}.card>label input{display:block;width:100%;height:34px;border:1px solid #14834a;border-radius:7px;padding:0 10px;margin-top:6px;outline:0;font-size:11px;background:#fff}.card>label:nth-of-type(2) input{border-color:#e10000}.card>label input:focus{box-shadow:0 0 0 2px #138a4522}.options{display:flex;align-items:center;justify-content:space-between;margin:-2px 0 16px;font-size:9px}.remember{display:flex!important;align-items:center;gap:5px;font-weight:400!important;margin:0!important}.remember input{width:10px;height:10px;margin:0}.forgot{border:0;background:none;color:#d00000;font-size:9px;font-weight:900;cursor:pointer}.forgot:disabled{opacity:.5}.primary{width:100%;height:38px;border:0;border-radius:7px;background:#c90000;color:#fff;font-weight:900;font-size:11px;cursor:pointer}.primary:disabled{opacity:.65}.or{display:flex;align-items:center;gap:9px;color:#777;font-size:10px;margin:16px 0}.or span{height:1px;background:#ddd;flex:1}.create{width:100%;height:38px;border:1px solid #008443;border-radius:7px;background:#fff;color:#006b3c;font-weight:900;font-size:10px;cursor:pointer}.back{display:block;margin:17px auto 0;border:0;background:none;color:#006b3c;font-size:10px;font-weight:900;cursor:pointer}.error,.message{border-radius:7px;padding:9px;font-size:10px;margin:-2px 0 10px}.error{background:#fff0f0;border:1px solid #f2bcbc;color:#b00000}.message{background:#eefaf1;border:1px solid #c6e4cf;color:#166534}footer{z-index:1;margin-top:18px;font-size:9px;color:#6b746d}footer span{font-weight:900;color:#006b3c}@media(max-width:600px){.brand{margin-top:34px}.card{margin-top:20px}.soft.left{width:180px;height:180px;left:-90px;top:-70px}.soft.right{width:220px;height:220px;right:-100px;bottom:-110px}}
    `}</style>
  </main>;
}
