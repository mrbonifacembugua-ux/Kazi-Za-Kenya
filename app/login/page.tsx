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

        <div className="cover subtitleCover" />
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
        <div className="cover emailIconCover" />
        <div className="cover lockIconCover" />
        <div className="cover eyeIconCover" />
        <div className="cover checkboxCover" />

        <div className="lineBox emailLine" />
        <div className="lineBox passLine" />
        <div className="lineBox createLine" />
        <div className="sep sepLeft" />
        <div className="sep sepRight" />

        <div className="subtitleText">Log in to Kazi za Kenya</div>
        <div className="label emailLabel">Email or phone number</div>
        <div className="label passwordLabel">Password</div>
        <div className="icon emailIcon" aria-hidden="true" />
        <div className="icon lockIcon" aria-hidden="true" />
        <div className="icon eyeIcon" aria-hidden="true" />
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
            <span className={`checkbox ${remember ? "checked" : ""}`}>{remember ? "✓" : ""}</span>
            <span className="rememberText">Remember me</span>
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
        .subtitleCover{left:40.2%;top:32.55%;width:19.6%;height:4.4%}
        .labelEmailCover{left:29.35%;top:39.35%;width:17.6%;height:3.75%}
        .labelPassCover{left:29.35%;top:52.65%;width:10.0%;height:3.75%}
        .emailCover{left:32.70%;top:43.35%;width:35.9%;height:6.15%}
        .passCover{left:32.70%;top:56.95%;width:32.7%;height:6.15%}
        .rememberCover{left:30.95%;top:65.75%;width:14.2%;height:4.85%}
        .forgotCover{left:58.65%;top:65.75%;width:14.0%;height:4.85%}
        .loginWordCover{left:43.7%;top:72.65%;width:12.6%;height:5.55%;background:#e30609}
        .orCover{left:47.7%;top:80.25%;width:4.6%;height:4.35%}
        .createWordCover{left:38.4%;top:85.55%;width:23.3%;height:5.9%}
        .backWordCover{left:37.9%;top:91.85%;width:24.5%;height:5.8%}
        .emailIconCover{left:29.95%;top:43.95%;width:3.1%;height:5.1%}
        .lockIconCover{left:29.95%;top:57.55%;width:3.1%;height:5.2%}
        .eyeIconCover{left:66.85%;top:57.65%;width:3.25%;height:5.15%}
        .checkboxCover{left:29.35%;top:65.7%;width:2.6%;height:4.95%}

        .lineBox{position:absolute;z-index:2;pointer-events:none;border-radius:12px;background:transparent}
        .emailLine{left:29.7%;top:42.95%;width:41.55%;height:7.25%;border:2px solid rgba(214,25,31,.84)}
        .passLine{left:29.7%;top:56.60%;width:41.55%;height:7.25%;border:2px solid rgba(214,25,31,.84)}
        .createLine{left:29.7%;top:84.15%;width:41.55%;height:7.45%;border:2px solid rgba(0,128,60,.76)}
        .sep{position:absolute;z-index:3;top:81.96%;height:1px;background:rgba(95,95,95,.28);pointer-events:none}
        .sepLeft{left:29.8%;width:18.7%}.sepRight{left:51.5%;width:18.7%}

        .subtitleText,.label,.smallText,.buttonText{position:absolute;z-index:3;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;white-space:nowrap}
        .subtitleText{left:50%;top:34.45%;transform:translate(-50%,-50%);background:#fff;color:#1c1c1c;font-size:clamp(14px,1.52vw,22px);font-weight:500;padding:2px 6px}
        .label{background:#fff;color:#111;font-size:clamp(11px,1vw,15px);font-weight:700;line-height:1.15;padding:1px 3px}
        .emailLabel{left:29.75%;top:40.1%}
        .passwordLabel{left:29.75%;top:53.4%}
        .buttonText{pointer-events:none;font-weight:600;line-height:1;transform:translate(-50%,-50%)}
        .loginText{left:50%;top:75.45%;color:#fff;background:transparent;font-size:clamp(13px,1.3vw,19px);padding:0}
        .orText{left:50%;top:81.65%;transform:translateX(-50%);background:#fff;color:#4a4a4a;font-size:clamp(10px,.88vw,14px);padding:1px 9px}
        .createText{left:50%;top:88.15%;color:#07823f;background:#fff;font-size:clamp(13px,1.2vw,18px);padding:3px 12px}
        .backText{left:50%;top:94.55%;color:#df0b0b;background:#fff;font-size:clamp(10px,.96vw,14px);padding:2px 10px}

        .icon{position:absolute;z-index:3;pointer-events:none}
        .emailIcon{left:30.7%;top:45.05%;width:1.55%;height:2.7%;border:1.8px solid #4e4e4e;border-radius:2px}
        .emailIcon:before,.emailIcon:after{content:"";position:absolute;top:38%;width:58%;height:1.8px;background:#4e4e4e}.emailIcon:before{left:1%;transform:rotate(32deg);transform-origin:left center}.emailIcon:after{right:1%;transform:rotate(-32deg);transform-origin:right center}
        .lockIcon{left:30.78%;top:58.7%;width:1.25%;height:2.7%;border:1.8px solid #4e4e4e;border-radius:2px}
        .lockIcon:before{content:"";position:absolute;left:16%;top:-60%;width:68%;height:68%;border:1.8px solid #4e4e4e;border-bottom:0;border-radius:10px 10px 0 0}
        .lockIcon:after{content:"";position:absolute;left:46%;top:34%;width:1.8px;height:6px;background:#4e4e4e;border-radius:2px}
        .eyeIcon{left:67.55%;top:58.9%;width:1.85%;height:2.25%;border:1.8px solid #4e4e4e;border-radius:50%/60%}
        .eyeIcon:before{content:"";position:absolute;left:50%;top:50%;width:23%;height:36%;transform:translate(-50%,-50%);border:1.8px solid #4e4e4e;border-radius:50%}

        .overlay{position:absolute;inset:0;z-index:4}
        .field{position:absolute;border:0;outline:0;background:transparent;color:#222;font:500 clamp(11px,1.02vw,16px) Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;padding:0 .6%;caret-color:#111;-webkit-font-smoothing:antialiased}
        .field::placeholder{color:#4f4f4f;opacity:1}
        .field:focus{box-shadow:none}
        .email{left:33.45%;top:43.40%;width:34.7%;height:6.92%}
        .pass{left:33.45%;top:57.01%;width:31.4%;height:6.92%;padding-right:2%}
        .hit{position:absolute;border:0;background:transparent;cursor:pointer;padding:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;-webkit-font-smoothing:antialiased}
        .eye{left:67%;top:57.01%;width:4.2%;height:6.92%}
        .remember{position:absolute;left:29.7%;top:66.12%;width:14.6%;height:4.45%;cursor:pointer;font:500 clamp(10px,.94vw,14px) Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;display:flex;align-items:center;color:#111;-webkit-font-smoothing:antialiased}
        .remember input{position:absolute;opacity:0;pointer-events:none}
        .checkbox{width:15%;height:58%;border:1.8px solid #555;border-radius:2px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:clamp(8px,.72vw,11px);font-weight:700;color:#07823f;line-height:1}
        .checkbox.checked{border-color:#07823f}
        .rememberText{margin-left:6%;background:#fff;padding:2px 4px;white-space:nowrap}
        .forgot{left:58.8%;top:66.18%;width:13.4%;height:4.35%;color:#df0b0b;font-size:clamp(10px,.94vw,14px);font-weight:500;background:#fff}
        .login{left:29.8%;top:71.96%;width:41.4%;height:7.09%}
        .create{left:29.8%;top:84.58%;width:41.4%;height:7.09%}
        .back{left:38.5%;top:92.66%;width:23%;height:4.43%}
      `}</style>
    </main>
  );
}
