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

        <div className="cover labelEmailCover" />
        <div className="cover labelPassCover" />
        <div className="cover emailCover" />
        <div className="cover passCover" />
        <div className="cover rememberCover" />
        <div className="cover forgotCover" />
        <div className="cover loginWordCover" />
        <div className="cover orCover" />
        <div className="cover createWordCover" />
        <div className="cover backWordCover" />

        <div className="lineBox emailLine" />
        <div className="lineBox passLine" />
        <div className="lineBox createLine" />
        <div className="sep sepLeft" />
        <div className="sep sepRight" />

        <div className="label emailLabel">Email or phone number</div>
        <div className="label passwordLabel">Password</div>
        <div className="buttonText loginText">Log in&nbsp;&nbsp; →</div>
        <div className="smallText orText">or</div>
        <div className="buttonText createText">Create new account</div>
        <div className="buttonText backText">←&nbsp;&nbsp; Back to Kazi za Kenya</div>

        <form onSubmit={submit} className="overlay" aria-label="Kazi za Kenya login form">
          <input className="field email" aria-label="Email or phone number" placeholder="Email or phone number" autoComplete="username" />
          <input className="field pass" aria-label="Password" placeholder="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" />
          <button type="button" className="hit eye" aria-label="Show or hide password" onClick={() => setShowPassword(v => !v)} />
          <label className="remember" aria-label="Remember me">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            <span>Remember me</span>
          </label>
          <button type="button" className="hit forgot" aria-label="Forgot password">Forgot password?</button>
          <button type="submit" className="hit login" aria-label="Log in" />
          <button type="button" className="hit create" aria-label="Create new account" />
          <button type="button" className="hit back" aria-label="Back to Kazi za Kenya" onClick={() => router.push("/")} />
        </form>
      </div>
      <style jsx global>{`
        *{box-sizing:border-box}
        html,body{margin:0;width:100%;height:100%;background:#fff}
        body{overflow:hidden}
        .page{width:100vw;height:100vh;background:#fff;overflow:hidden}
        .stage{position:relative;width:100vw;height:100vh;overflow:hidden;background:#fff}
        .bg{position:absolute;left:0;top:0;width:100%;height:110.7027%;display:block;object-fit:fill;object-position:top center;user-select:none;pointer-events:none;filter:none!important;transform:none!important;backface-visibility:visible;image-rendering:auto;-webkit-image-rendering:optimize-contrast}

        .cover{position:absolute;z-index:2;background:#fff;pointer-events:none}
        .labelEmailCover{left:29.45%;top:39.65%;width:17.2%;height:3.55%}
        .labelPassCover{left:29.45%;top:52.95%;width:9.6%;height:3.55%}
        .emailCover{left:33.00%;top:43.55%;width:35.2%;height:5.95%}
        .passCover{left:33.00%;top:57.15%;width:32.0%;height:5.95%}
        .rememberCover{left:32.05%;top:66.25%;width:12.3%;height:4.10%}
        .forgotCover{left:59.15%;top:66.25%;width:13.1%;height:4.10%}
        .loginWordCover{left:45.4%;top:73.35%;width:9.5%;height:4.5%;background:#e30609}
        .orCover{left:48.35%;top:80.65%;width:3.3%;height:3.8%}
        .createWordCover{left:40.7%;top:86.45%;width:18.8%;height:4.8%}
        .backWordCover{left:40.0%;top:92.65%;width:20.8%;height:4.7%}

        .lineBox{position:absolute;z-index:2;pointer-events:none;border-radius:12px;background:transparent}
        .emailLine{left:29.7%;top:42.95%;width:41.55%;height:7.25%;border:2px solid rgba(214,25,31,.72)}
        .passLine{left:29.7%;top:56.60%;width:41.55%;height:7.25%;border:2px solid rgba(214,25,31,.72)}
        .createLine{left:29.7%;top:84.15%;width:41.55%;height:7.45%;border:2px solid rgba(0,128,60,.62)}
        .sep{position:absolute;z-index:2;top:81.96%;height:1px;background:rgba(105,105,105,.34);pointer-events:none}
        .sepLeft{left:29.8%;width:18.2%}.sepRight{left:52%;width:19.2%}

        .label,.smallText,.buttonText{position:absolute;z-index:3;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;white-space:nowrap}
        .label{background:#fff;color:#111;font-size:clamp(11px,1.02vw,15px);font-weight:700;line-height:1.15;padding:1px 3px}
        .emailLabel{left:29.75%;top:40.45%}
        .passwordLabel{left:29.75%;top:53.75%}
        .buttonText{pointer-events:none;font-weight:600;line-height:1;transform:translate(-50%,-50%)}
        .loginText{left:50.1%;top:75.45%;color:#fff;background:#e30609;font-size:clamp(13px,1.32vw,19px);padding:3px 12px;border-radius:3px}
        .orText{left:50%;top:81.65%;transform:translateX(-50%);background:#fff;color:#444;font-size:clamp(10px,.9vw,14px);padding:1px 8px}
        .createText{left:50.2%;top:88.15%;color:#07823f;background:#fff;font-size:clamp(13px,1.22vw,18px);padding:3px 10px}
        .backText{left:50.25%;top:94.55%;color:#df0b0b;background:#fff;font-size:clamp(10px,.98vw,14px);padding:2px 8px}

        .overlay{position:absolute;inset:0;z-index:4}
        .field{position:absolute;border:0;outline:0;background:transparent;color:#222;font:500 clamp(11px,1.02vw,16px) Arial,Helvetica,sans-serif;padding:0 .6%;caret-color:#111;-webkit-font-smoothing:antialiased}
        .field::placeholder{color:#5f5f5f;opacity:1}
        .field:focus{box-shadow:none}
        .email{left:33.45%;top:43.40%;width:34.7%;height:6.92%}
        .pass{left:33.45%;top:57.01%;width:31.4%;height:6.92%;padding-right:2%}
        .hit{position:absolute;border:0;background:transparent;cursor:pointer;padding:0;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}
        .eye{left:67%;top:57.01%;width:4.2%;height:6.92%}
        .remember{position:absolute;left:29.7%;top:66.09%;width:14.2%;height:4.65%;cursor:pointer;font:500 clamp(10px,.95vw,14px) Arial,Helvetica,sans-serif;display:flex;align-items:center;color:#111;-webkit-font-smoothing:antialiased}
        .remember input{position:absolute;left:0;top:0;width:24%;height:100%;opacity:0;cursor:pointer}.remember span{margin-left:24%;background:#fff;padding:2px 3px;white-space:nowrap}
        .forgot{left:59.2%;top:66.09%;width:13.0%;height:4.65%;color:#df0b0b;font-size:clamp(10px,.95vw,14px);font-weight:500;background:#fff}
        .login{left:29.8%;top:71.96%;width:41.4%;height:7.09%}
        .create{left:29.8%;top:84.58%;width:41.4%;height:7.09%}
        .back{left:38.5%;top:92.66%;width:23%;height:4.43%}
      `}</style>
    </main>
  );
}
