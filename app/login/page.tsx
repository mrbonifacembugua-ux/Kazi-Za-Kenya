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
      <div className="desktopStage">
        <img src={BG} alt="" className="bg" />
        <div className="cover subtitleCover" />
        <div className="cover labelEmailCover" />
        <div className="cover labelPassCover" />
        <div className="cover emailInner" />
        <div className="cover passInner" />
        <div className="cover rememberCover" />
        <div className="cover forgotCover" />
        <div className="cover loginClean" />
        <div className="cover separatorClean" />
        <div className="cover createClean" />
        <div className="cover backClean" />
        <div className="lineBox emailLine" />
        <div className="lineBox passLine" />
        <div className="lineBox createLine" />
        <div className="sep sepLeft" />
        <div className="sep sepRight" />
        <div className="subtitleText">Log in to Kazi za Kenya</div>
        <div className="label emailLabel">Email or phone number</div>
        <div className="label passwordLabel">Password</div>

        <svg className="svgIcon emailIcon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2.5" y="5" width="19" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.9" />
          <path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className="svgIcon lockIcon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 10V7.5a5 5 0 0 1 10 0V10" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          <rect x="5.5" y="10" width="13" height="10" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="12" cy="14.4" r="1.1" fill="currentColor" />
          <path d="M12 15.5v2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
        <svg className="svgIcon eyeIcon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
        </svg>

        <div className="buttonText loginText">Log in&nbsp;&nbsp; →</div>
        <div className="orText">or</div>
        <div className="createGroup">
          <svg className="accountIcon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="7.5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
            <path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
          <span>Create new account</span>
        </div>
        <div className="backText">←&nbsp;&nbsp; Back to Kazi za Kenya</div>

        <form onSubmit={submit} className="overlay" aria-label="Kazi za Kenya login form">
          <input className="field email" aria-label="Email or phone number" placeholder="Email or phone number" autoComplete="username" />
          <input className="field pass" aria-label="Password" placeholder="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" />
          <button type="button" className="hit eye" aria-label="Show or hide password" onClick={() => setShowPassword((v) => !v)} />
          <label className="remember">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span className={`checkbox ${remember ? "checked" : ""}`}>{remember ? "✓" : ""}</span>
            <span className="rememberText">Remember me</span>
          </label>
          <button type="button" className="hit forgot" onClick={() => router.push("/forgot-password")}>Forgot password?</button>
          <button type="submit" className="hit login" />
          <button type="button" className="hit create" onClick={() => router.push("/signup")} />
          <button type="button" className="hit back" onClick={() => router.push("/")} />
        </form>
      </div>

      <section className="mobileLogin" aria-label="Kazi za Kenya mobile login">
        <div className="mobileBrand">
          <div className="mobileLogoMark" aria-hidden="true">K</div>
          <div>
            <div className="mobileBrandName"><span>Kazi</span> <b>za</b> <strong>Kenya</strong></div>
            <div className="mobileTagline">Find Work. Grow Kenya.</div>
          </div>
        </div>

        <div className="mobileCard">
          <div className="mobileHeading">
            <h1>Welcome back</h1>
            <p>Log in to Kazi za Kenya</p>
          </div>

          <form onSubmit={submit} className="mobileForm">
            <label className="mobileFieldLabel" htmlFor="mobile-email">Email or phone number</label>
            <div className="mobileInputWrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <input id="mobile-email" type="text" placeholder="Email or phone number" autoComplete="username" />
            </div>

            <label className="mobileFieldLabel" htmlFor="mobile-password">Password</label>
            <div className="mobileInputWrap">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7.5a5 5 0 0 1 10 0V10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><rect x="5.5" y="10" width="13" height="10" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg>
              <input id="mobile-password" type={showPassword ? "text" : "password"} placeholder="Password" autoComplete="current-password" />
              <button className="mobileEye" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="mobileOptions">
              <label className="mobileRemember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <button type="button" className="mobileLink" onClick={() => router.push("/forgot-password")}>Forgot password?</button>
            </div>

            <button type="submit" className="mobileLoginButton">Log in <span>→</span></button>

            <div className="mobileDivider"><span>or</span></div>

            <button type="button" className="mobileCreateButton" onClick={() => router.push("/signup")}>Create new account</button>
            <button type="button" className="mobileBackButton" onClick={() => router.push("/")}>← Back to Kazi za Kenya</button>
          </form>
        </div>
      </section>

      <style jsx global>{`
        *{box-sizing:border-box}
        html,body{margin:0;width:100%;height:100%;background:#fff}
        body{overflow:hidden}
        .page{width:100vw;height:100vh;background:#fff;overflow:hidden}
        .desktopStage{position:relative;width:100vw;height:100vh;background:#fff;overflow:hidden}
        .mobileLogin{display:none}
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

        @media (max-width: 600px){
          html,body{min-height:100%;height:auto;background:#f6f8f6}
          body{overflow:auto}
          .page{width:100%;height:auto;min-height:100vh;overflow:visible;background:#f6f8f6}
          .desktopStage{display:none!important}
          .mobileLogin{display:flex;min-height:100vh;flex-direction:column;align-items:center;padding:24px 16px 28px;background:linear-gradient(180deg,#fff 0,#f6f8f6 42%,#eef5ef 100%);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:#17221b}
          .mobileBrand{width:min(100%,420px);display:flex;align-items:center;justify-content:center;gap:11px;margin:4px auto 22px;padding:4px 0}
          .mobileLogoMark{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:#fff;border:4px solid #16803d;box-shadow:inset 0 0 0 3px #e30613;color:#111;font-size:24px;font-weight:900;flex:none}
          .mobileBrandName{font-size:29px;line-height:1;font-weight:900;letter-spacing:-1px;white-space:nowrap}.mobileBrandName span{color:#111}.mobileBrandName b{color:#e30613}.mobileBrandName strong{color:#16803d}.mobileTagline{margin-top:5px;text-align:center;font-size:12px;font-weight:600;color:#54635a;letter-spacing:.02em}
          .mobileCard{width:min(100%,420px);background:#fff;border:1px solid #e2e8e3;border-radius:24px;padding:25px 20px 20px;box-shadow:0 14px 38px rgba(30,50,35,.10)}
          .mobileHeading{text-align:center;margin-bottom:22px}.mobileHeading h1{margin:0;font-size:27px;line-height:1.15;letter-spacing:-.5px}.mobileHeading p{margin:6px 0 0;color:#5d6a61;font-size:15px;font-weight:600}
          .mobileForm{display:flex;flex-direction:column}.mobileFieldLabel{font-size:14px;font-weight:800;margin:0 0 7px}.mobileInputWrap{height:54px;border:1.5px solid #cfd8d1;border-radius:13px;background:#fff;display:flex;align-items:center;padding:0 13px;gap:10px;margin-bottom:16px}.mobileInputWrap:focus-within{border-color:#16803d;box-shadow:0 0 0 3px rgba(22,128,61,.10)}.mobileInputWrap>svg{width:20px;height:20px;color:#637068;flex:none}.mobileInputWrap input{min-width:0;flex:1;border:0;outline:0;background:transparent;font-size:16px;color:#17221b}.mobileInputWrap input::placeholder{color:#7c877f;opacity:1}.mobileEye{border:0;background:transparent;color:#16803d;font-size:13px;font-weight:800;padding:10px 2px;cursor:pointer;flex:none}
          .mobileOptions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 20px;min-width:0}.mobileRemember{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:650;white-space:nowrap}.mobileRemember input{width:18px;height:18px;accent-color:#16803d}.mobileLink{border:0;background:transparent;color:#c8101b;font-size:13px;font-weight:750;padding:8px 0;cursor:pointer;white-space:nowrap}
          .mobileLoginButton,.mobileCreateButton{width:100%;min-height:52px;border-radius:13px;font-size:16px;font-weight:850;cursor:pointer}.mobileLoginButton{border:1px solid #e30613;background:#e30613;color:white;box-shadow:0 7px 16px rgba(227,6,19,.16)}.mobileLoginButton span{margin-left:5px}.mobileCreateButton{border:1.7px solid #16803d;background:#fff;color:#16803d}.mobileDivider{display:flex;align-items:center;gap:10px;margin:17px 0;color:#7b867f;font-size:12px}.mobileDivider:before,.mobileDivider:after{content:"";height:1px;background:#dde3de;flex:1}.mobileDivider span{padding:0 4px}.mobileBackButton{align-self:center;border:0;background:transparent;color:#c8101b;font-size:13px;font-weight:800;padding:17px 10px 5px;cursor:pointer}
        }

        @media (max-width: 360px){
          .mobileLogin{padding-left:12px;padding-right:12px}
          .mobileBrandName{font-size:25px}.mobileLogoMark{width:46px;height:46px;font-size:21px}.mobileCard{padding-left:16px;padding-right:16px;border-radius:20px}.mobileOptions{align-items:flex-start;flex-direction:column;gap:2px}.mobileLink{padding-left:26px}
        }
      `}</style>
    </main>
  );
}
