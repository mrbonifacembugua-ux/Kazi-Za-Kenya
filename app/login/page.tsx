"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import bg1 from "./bg1"; import bg2 from "./bg2"; import bg3 from "./bg3"; import bg4 from "./bg4"; import bg5 from "./bg5"; import bg6 from "./bg6";
const BG=`data:image/webp;base64,${bg1}${bg2}${bg3}${bg4}${bg5}${bg6}`;

export default function LoginPage(){
 const router=useRouter(); const [showPassword,setShowPassword]=useState(false); const [remember,setRemember]=useState(false);
 function submit(e:FormEvent){e.preventDefault();router.push("/")}
 return <main className="page"><div className="stage"><img src={BG} alt="" className="bg"/>
  <div className="cover subtitleCover"/><div className="cover labelEmailCover"/><div className="cover labelPassCover"/>
  <div className="cover emailInner"/><div className="cover passInner"/><div className="cover rememberCover"/><div className="cover forgotCover"/>
  <div className="cover loginClean"/><div className="cover separatorClean"/><div className="cover createClean"/><div className="cover backClean"/>
  <div className="lineBox emailLine"/><div className="lineBox passLine"/><div className="lineBox createLine"/>
  <div className="sep sepLeft"/><div className="sep sepRight"/>
  <div className="subtitleText">Log in to Kazi za Kenya</div><div className="label emailLabel">Email or phone number</div><div className="label passwordLabel">Password</div>

  <svg className="svgIcon emailIcon" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.9"/><path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
  <svg className="svgIcon lockIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7.5a5 5 0 0 1 10 0V10" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/><rect x="5.5" y="10" width="13" height="10" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.9"/><circle cx="12" cy="14.4" r="1.1" fill="currentColor"/><path d="M12 15.5v2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
  <svg className="svgIcon eyeIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.9"/></svg>

  <div className="buttonText loginText">Log in&nbsp;&nbsp; →</div><div className="orText">or</div>
  <div className="createGroup"><svg className="accountIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.9"/><path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg><span>Create new account</span></div>
  <div className="backText">←&nbsp;&nbsp; Back to Kazi za Kenya</div>
  <form onSubmit={submit} className="overlay" aria-label="Kazi za Kenya login form">
   <input className="field email" aria-label="Email or phone number" placeholder="Email or phone number" autoComplete="username"/>
   <input className="field pass" aria-label="Password" placeholder="Password" type={showPassword?"text":"password"} autoComplete="current-password"/>
   <button type="button" className="hit eye" aria-label="Show or hide password" onClick={()=>setShowPassword(v=>!v)}/>
   <label className="remember"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/><span className={`checkbox ${remember?"checked":""}`}>{remember?"✓":""}</span><span className="rememberText">Remember me</span></label>
   <button type="button" className="hit forgot">Forgot password?</button><button type="submit" className="hit login"/><button type="button" className="hit create"/><button type="button" className="hit back" onClick={()=>router.push("/")}/>
  </form>
 </div><style jsx global>{`
 *{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:#fff}body{overflow:hidden}.page,.stage{width:100vw;height:100vh;background:#fff;overflow:hidden}.stage{position:relative}
 .bg{position:absolute;left:0;top:0;width:100%;height:110.7027%;object-fit:fill;object-position:top center;user-select:none;pointer-events:none;image-rendering:auto}
 .cover{position:absolute;z-index:2;background:#fff;pointer-events:none}.subtitleCover{left:39.8%;top:32.35%;width:21%;height:4.9%}.labelEmailCover{left:29.3%;top:39.2%;width:18%;height:3.9%}.labelPassCover{left:29.3%;top:52.5%;width:10.5%;height:3.9%}
 .emailInner{left:30.15%;top:43.25%;width:40.5%;height:6.65%}.passInner{left:30.15%;top:56.9%;width:40.5%;height:6.6%}.rememberCover{left:29.25%;top:65.65%;width:16%;height:5%}.forgotCover{left:58.5%;top:65.65%;width:14.3%;height:5%}
 .loginClean{left:29.9%;top:72.35%;width:41.2%;height:6.45%;background:#e30609;border-radius:8px}.separatorClean{left:29.45%;top:80.15%;width:41.9%;height:4.8%}.createClean{left:30.05%;top:84.55%;width:40.9%;height:6.7%;border-radius:9px}.backClean{left:37.5%;top:92%;width:25%;height:5.6%}
 .lineBox{position:absolute;z-index:2;border-radius:12px;background:transparent;pointer-events:none}.emailLine{left:29.7%;top:42.95%;width:41.55%;height:7.25%;border:2px solid rgba(214,25,31,.88)}.passLine{left:29.7%;top:56.60%;width:41.55%;height:7.25%;border:2px solid rgba(214,25,31,.88)}.createLine{left:29.7%;top:84.15%;width:41.55%;height:7.45%;border:2px solid rgba(0,128,60,.82)}
 .sep{position:absolute;z-index:3;top:82%;height:1px;background:rgba(95,95,95,.3)}.sepLeft{left:29.8%;width:18.5%}.sepRight{left:51.7%;width:18.5%}
 .subtitleText,.label,.buttonText,.orText,.createGroup,.backText{position:absolute;z-index:3;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;-webkit-font-smoothing:antialiased;white-space:nowrap}.subtitleText{left:50%;top:34.45%;transform:translate(-50%,-50%);font-size:clamp(14px,1.52vw,22px);font-weight:500}.label{font-size:clamp(11px,1vw,15px);font-weight:700}.emailLabel{left:29.75%;top:40.05%}.passwordLabel{left:29.75%;top:53.35%}
 .buttonText{transform:translate(-50%,-50%);font-weight:600}.loginText{left:50%;top:75.45%;color:#fff;font-size:clamp(13px,1.3vw,19px)}.orText{left:50%;top:81.62%;transform:translateX(-50%);font-size:clamp(10px,.88vw,14px);color:#444;background:#fff;padding:1px 10px}
 .createGroup{left:50%;top:87.9%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:8px;color:#07823f;font-size:clamp(13px,1.2vw,18px);font-weight:600}.accountIcon{width:19px;height:19px;display:block;flex:none}.backText{left:50%;top:94.35%;transform:translate(-50%,-50%);color:#d9090d;font-size:clamp(11px,1vw,15px);font-weight:600}
 .svgIcon{position:absolute;z-index:3;pointer-events:none;color:#444;display:block}.emailIcon{left:30.55%;top:44.6%;width:1.9%;height:3.7%}.lockIcon{left:30.5%;top:57.85%;width:2.0%;height:4.4%}.eyeIcon{left:67.25%;top:58.45%;width:2.45%;height:3.3%}
 .overlay{position:absolute;inset:0;z-index:4}.field{position:absolute;border:0;outline:0;background:transparent;color:#222;font:500 clamp(11px,1.02vw,16px) Inter,system-ui,"Segoe UI",Arial,sans-serif;padding:0 .6%}.field::placeholder{color:#444;opacity:1}.email{left:33.45%;top:43.40%;width:34.7%;height:6.92%}.pass{left:33.45%;top:57.01%;width:31.4%;height:6.92%}.hit{position:absolute;border:0;background:transparent;cursor:pointer;padding:0}.eye{left:67%;top:57.01%;width:4.2%;height:6.92%}
 .remember{position:absolute;left:29.7%;top:66.1%;width:14.6%;height:4.45%;display:flex;align-items:center;cursor:pointer;font:500 clamp(10px,.94vw,14px) Inter,system-ui,"Segoe UI",Arial,sans-serif}.remember input{position:absolute;opacity:0}.checkbox{width:15%;aspect-ratio:1/1;border:2px solid #444;border-radius:2px;background:#fff;display:flex;align-items:center;justify-content:center;color:#07823f;font-weight:700;line-height:1}.checkbox.checked{border-color:#07823f}.rememberText{margin-left:5%;white-space:nowrap}.forgot{left:58.45%;top:66.2%;width:13.6%;height:4.35%;color:#d9090d;font:500 clamp(10px,.94vw,14px) Inter,system-ui,"Segoe UI",Arial,sans-serif;background:#fff}.login{left:29.8%;top:71.96%;width:41.4%;height:7.09%}.create{left:29.8%;top:84.58%;width:41.4%;height:7.09%}.back{left:38%;top:92.3%;width:24%;height:4.8%}
 `}</style></main>
}
