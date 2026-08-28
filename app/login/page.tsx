"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import bg1 from "./bg1";
import bg2 from "./bg2";
import bg3 from "./bg3";
import bg4 from "./bg4";
import bg5 from "./bg5";
import bg6 from "./bg6";

const BG = `data:image/webp;base64,${bg1}${bg2}${bg3}${bg4}${bg5}${bg6}`;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    router.push("/");
  }

  return (
    <main className="page">
      <div className="stage">
        <img src={BG} alt="" className="bg" />

        <div className="sharp brandName"><span>Kazi</span> <b>za</b> <strong>Kenya</strong></div>
        <div className="sharp brandTag">Find Work. Grow Kenya.</div>
        <div className="sharp welcome">Welcome <span>back</span></div>
        <div className="sharp subtitle">Log in to Kazi za Kenya</div>
        <div className="sharp emailLabel">Email or phone number</div>
        <div className="sharp passwordLabel">Password</div>

        <form onSubmit={submit} className="overlay" aria-label="Kazi za Kenya login form">
          <input className="field email" aria-label="Email or phone number" placeholder="Email or phone number" autoComplete="username" />
          <input className="field pass" aria-label="Password" placeholder="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" />
          <button type="button" className="hit eye" aria-label="Show or hide password" onClick={() => setShowPassword(v => !v)} />
          <label className="remember" aria-label="Remember me">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            <span>Remember me</span>
          </label>
          <button type="button" className="hit forgot" aria-label="Forgot password">Forgot password?</button>
          <button type="submit" className="hit login" aria-label="Log in"><span>Log in&nbsp;&nbsp; →</span></button>
          <div className="sharp orText">or</div>
          <button type="button" className="hit create" aria-label="Create new account"><span>Create new account</span></button>
          <button type="button" className="hit back" aria-label="Back to Kazi za Kenya" onClick={() => router.push("/")}><span>←&nbsp;&nbsp; Back to Kazi za Kenya</span></button>
        </form>
      </div>
      <style jsx global>{`
        *{box-sizing:border-box}
        html,body{margin:0;width:100%;height:100%;background:#fff}
        body{overflow:hidden}
        .page{width:100vw;height:100vh;background:#fff;overflow:hidden}
        .stage{position:relative;width:100vw;height:100vh;overflow:hidden;background:#fff}
        .bg{position:absolute;left:0;top:0;width:100%;height:110.7027%;display:block;object-fit:fill;object-position:top center;user-select:none;pointer-events:none;filter:none!important;transform:none!important;backface-visibility:visible;image-rendering:auto}
        .overlay{position:absolute;inset:0}

        .sharp{position:absolute;z-index:3;font-family:Arial,Helvetica,sans-serif;line-height:1;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
        .brandName{left:42.2%;top:3.2%;padding:2px 6px;background:#fff;font-size:clamp(24px,2.85vw,42px);font-weight:900;letter-spacing:-1.4px;white-space:nowrap}.brandName b{color:#df0808}.brandName strong{color:#087d3b}
        .brandTag{left:45.6%;top:11.9%;padding:1px 5px;background:#fff;font-size:clamp(13px,1.45vw,22px);font-style:italic;white-space:nowrap}
        .welcome{left:50%;top:22.4%;transform:translateX(-50%);padding:2px 8px;background:#fff;font-size:clamp(27px,3.05vw,45px);font-weight:900;letter-spacing:-1px;white-space:nowrap}.welcome span{color:#df0808}
        .subtitle{left:50%;top:34.5%;transform:translateX(-50%);padding:2px 6px;background:#fff;font-size:clamp(14px,1.55vw,23px);white-space:nowrap}
        .emailLabel{left:29.8%;top:40.45%;padding:1px 3px;background:#fff;font-size:clamp(10px,1.05vw,15px);font-weight:800;white-space:nowrap}
        .passwordLabel{left:29.8%;top:53.7%;padding:1px 3px;background:#fff;font-size:clamp(10px,1.05vw,15px);font-weight:800;white-space:nowrap}

        .field{position:absolute;z-index:4;border:0;outline:0;background:#fff;color:#222;font:500 clamp(11px,1.04vw,16px) Arial,Helvetica,sans-serif;padding:0 .65%;caret-color:#111;-webkit-font-smoothing:antialiased}
        .field::placeholder{color:#777;opacity:1}
        .field:focus{box-shadow:none}
        .email{left:33.5%;top:43.40%;width:36.0%;height:6.92%}
        .pass{left:33.5%;top:57.01%;width:32.9%;height:6.92%;padding-right:2%}
        .hit{position:absolute;z-index:4;border:0;background:transparent;cursor:pointer;padding:0;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}
        .eye{left:67%;top:57.01%;width:4.2%;height:6.92%}
        .remember{position:absolute;z-index:4;left:29.7%;top:66.09%;width:14.5%;height:4.65%;cursor:pointer;font:500 clamp(10px,.96vw,14px) Arial,Helvetica,sans-serif;display:flex;align-items:center;-webkit-font-smoothing:antialiased}
        .remember input{position:absolute;left:0;top:0;width:24%;height:100%;opacity:0;cursor:pointer}.remember span{margin-left:25%;background:#fff;padding:2px 4px;white-space:nowrap}
        .forgot{left:59.1%;top:66.09%;width:12.8%;height:4.65%;color:#df0808;font-size:clamp(10px,.96vw,14px);font-weight:500;background:#fff}
        .login{left:29.8%;top:71.96%;width:41.4%;height:7.09%;color:#fff;font-size:clamp(14px,1.35vw,20px);font-weight:800}.login span{background:#e4070a;padding:4px 16px;border-radius:4px}
        .orText{left:50%;top:81.8%;transform:translateX(-50%);padding:1px 8px;background:#fff;color:#555;font-size:clamp(10px,.95vw,14px)}
        .create{left:29.8%;top:84.58%;width:41.4%;height:7.09%;color:#07803d;font-size:clamp(13px,1.25vw,19px);font-weight:800}.create span{background:#fff;padding:3px 10px}
        .back{left:38.5%;top:92.66%;width:23%;height:4.43%;color:#df0808;font-size:clamp(10px,1vw,15px);font-weight:600}.back span{background:#fff;padding:2px 8px;white-space:nowrap}
      `}</style>
    </main>
  );
}
