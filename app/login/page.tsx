"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function BrandLogo({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={small ? "brandSvg brandSvgSmall" : "brandSvg"}
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <circle cx="60" cy="56" r="47" fill="#fff" stroke="#111" strokeWidth="5" />
      <circle cx="34" cy="43" r="9" fill="#d6000f" />
      <circle cx="60" cy="36" r="10" fill="#111" />
      <circle cx="86" cy="43" r="9" fill="#087d3d" />
      <path d="M20 78V61c0-8 6-14 14-14s14 6 14 14v17" fill="#d6000f" />
      <path d="M46 75V54c0-9 6-15 14-15s14 6 14 15v21" fill="#111" />
      <path d="M72 78V61c0-8 6-14 14-14s14 6 14 14v17" fill="#087d3d" />
      <rect x="38" y="65" width="44" height="29" rx="4" fill="#fff" stroke="#111" strokeWidth="5" />
      <path d="M50 65v-7c0-5 4-8 10-8s10 3 10 8v7" fill="none" stroke="#111" strokeWidth="5" />
      <path d="M39 78h43" stroke="#111" strokeWidth="4" />
      <rect x="56" y="75" width="8" height="8" rx="1" fill="#fff" stroke="#111" strokeWidth="2" />
      <path d="M20 89c12 13 26 20 40 20 16 0 31-7 41-21" fill="none" stroke="#d6000f" strokeWidth="5" strokeLinecap="round" />
      <path d="M25 84c12 11 23 15 35 15 14 0 26-4 36-15" fill="none" stroke="#087d3d" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("Login is ready visually. Account authentication will be connected next.");
  }

  return (
    <main className="loginStage">
      <img
        className="skylinePhoto"
        src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Nairobi_skyline_from_Uhuru_Park.jpg?width=2200"
        alt=""
        aria-hidden="true"
      />
      <div className="skylineWash" aria-hidden="true" />

      <div className="ribbon ribbonTop" aria-hidden="true">
        <span className="rbBlack" />
        <span className="rbWhite1" />
        <span className="rbRed" />
        <span className="rbWhite2" />
        <span className="rbGreen" />
      </div>

      <div className="ribbon ribbonBottom" aria-hidden="true">
        <span className="rbGreen" />
        <span className="rbWhite1" />
        <span className="rbRed" />
        <span className="rbWhite2" />
        <span className="rbBlack" />
      </div>

      <div className="flagWrap" aria-hidden="true">
        <div className="flagPole" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kenya.svg" alt="" />
      </div>

      <div className="pageContent">
        <header className="brandHeader">
          <BrandLogo />
          <div className="brandCopy">
            <div className="brandTitle"><span>Kazi</span> <b>za</b> <strong>Kenya</strong></div>
            <div className="brandTagline">Find Work. Grow Kenya.</div>
            <div className="brandUnderline" />
          </div>
        </header>

        <section className="loginCard">
          <h1>Welcome <span>back</span></h1>
          <div className="headingRule"><i /><b>♦</b><em /></div>
          <p className="cardSubtitle">Log in to Kazi za Kenya</p>

          <form onSubmit={submit}>
            <label htmlFor="identifier">Email or phone number</label>
            <div className="inputFrame">
              <span className="mailIcon" aria-hidden="true">✉</span>
              <input id="identifier" placeholder="Email or phone number" autoComplete="username" />
            </div>

            <label htmlFor="password">Password</label>
            <div className="inputFrame">
              <span className="lockIcon" aria-hidden="true">▣</span>
              <input id="password" type={showPassword ? "text" : "password"} placeholder="Password" autoComplete="current-password" />
              <button className="eyeBtn" type="button" onClick={() => setShowPassword(v => !v)} aria-label="Show or hide password">{showPassword ? "◉" : "◎"}</button>
            </div>

            <div className="optionsRow">
              <label className="rememberRow">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <button type="button" className="forgotBtn" onClick={() => setMessage("Password recovery will be connected with authentication.")}>Forgot password?</button>
            </div>

            {message && <div className="message">{message}</div>}

            <button className="loginBtn" type="submit">Log in <span>→</span></button>
            <div className="orRow"><i /><span>or</span><i /></div>
            <button className="createBtn" type="button" onClick={() => setMessage("Account creation will be connected next.")}><span className="userIcon">♙</span> Create new account</button>
            <button className="backBtn" type="button" onClick={() => router.push("/")}>←&nbsp;&nbsp; Back to Kazi za Kenya</button>
          </form>
        </section>
      </div>

      <footer className="loginFooter">
        <div className="footerBrand"><BrandLogo small /><strong>Kazi <b>za</b> <em>Kenya</em></strong></div>
        <div className="footerSlogan">Building opportunities. <span>Empowering Kenya.</span></div>
      </footer>

      <style jsx global>{`
        *{box-sizing:border-box}
        html,body{margin:0;width:100%;min-height:100%;font-family:Arial,Helvetica,sans-serif;color:#111;background:#fff}
        body{overflow-x:hidden}
        button,input{font:inherit}

        .loginStage{position:relative;width:100%;min-height:910px;overflow:hidden;background:#fff;padding-bottom:86px}
        .skylinePhoto{position:absolute;z-index:0;left:0;right:0;bottom:86px;width:100%;height:66%;object-fit:cover;object-position:center 58%;filter:saturate(.62) contrast(.85) brightness(1.12);opacity:.72}
        .skylineWash{position:absolute;z-index:1;inset:0 0 86px 0;background:linear-gradient(180deg,rgba(255,255,255,.96) 0%,rgba(255,255,255,.84) 23%,rgba(255,255,255,.55) 52%,rgba(255,255,255,.27) 76%,rgba(255,255,255,.18) 100%);pointer-events:none}

        .pageContent{position:relative;z-index:5;display:flex;flex-direction:column;align-items:center;padding-top:16px}
        .brandHeader{display:flex;align-items:center;gap:18px;height:145px}
        .brandSvg{width:112px;height:112px;display:block;flex:0 0 auto}
        .brandCopy{text-align:center}
        .brandTitle{font-size:54px;line-height:.98;font-weight:900;letter-spacing:-2.8px;white-space:nowrap}.brandTitle b{color:#d6000f}.brandTitle strong{color:#087d3d}.brandTitle span{color:#111}
        .brandTagline{font-size:23px;font-style:italic;margin-top:9px}
        .brandUnderline{width:270px;height:5px;margin:10px auto 0;background:linear-gradient(90deg,#9b0000 0 48%,#087d3d 52% 100%);border-radius:100% 0 100% 0;transform:skewX(-22deg)}

        .loginCard{width:722px;max-width:calc(100vw - 40px);background:rgba(255,255,255,.95);border:1px solid #cfd1d4;border-radius:26px;box-shadow:0 18px 42px rgba(0,0,0,.17);padding:30px 43px 22px;backdrop-filter:blur(2px)}
        .loginCard h1{text-align:center;margin:0;font-size:48px;line-height:1;font-weight:900;letter-spacing:-1.8px}.loginCard h1 span{color:#d6000f}
        .headingRule{height:50px;display:flex;align-items:center;justify-content:center;gap:16px}.headingRule i,.headingRule em{display:block;width:108px;height:4px;border-radius:8px;background:#111}.headingRule em{background:#087d3d}.headingRule b{color:#d6000f;font-size:27px;line-height:1}
        .cardSubtitle{text-align:center;margin:0 0 26px;font-size:24px;color:#202733}
        .loginCard form>label{display:block;margin:0 0 7px;font-size:18px;font-weight:800}
        .inputFrame{height:64px;border:2px solid #e0000b;border-radius:14px;background:#fff;display:flex;align-items:center;margin-bottom:22px}.inputFrame>span{width:58px;text-align:center;color:#111}.mailIcon{font-size:27px}.lockIcon{font-size:25px}.inputFrame input{height:100%;flex:1;border:0;outline:0;background:transparent;padding:0 8px 0 0;font-size:18px;color:#222;min-width:0}.inputFrame input::placeholder{color:#7f8794}.eyeBtn{width:62px;height:100%;border:0;background:transparent;color:#111;font-size:31px;cursor:pointer}
        .optionsRow{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:15px}.rememberRow{display:flex!important;align-items:center;gap:12px!important;margin:0!important;font-size:17px!important;font-weight:400!important}.rememberRow input{appearance:none;width:29px;height:29px;border:2px solid #111;border-radius:4px;background:#fff;position:relative;cursor:pointer}.rememberRow input:checked{background:#087d3d;border-color:#087d3d}.rememberRow input:checked:after{content:"✓";position:absolute;left:5px;top:0;color:#fff;font-size:20px;font-weight:900}.forgotBtn{border:0;background:transparent;color:#d6000f;font-size:17px;cursor:pointer}.message{font-size:12px;color:#9a1118;margin:-2px 0 6px}
        .loginBtn{width:100%;height:65px;border:0;border-radius:15px;background:linear-gradient(90deg,#d5000d,#c4000a);color:white;font-size:24px;font-weight:800;cursor:pointer}.loginBtn span{font-size:31px;margin-left:16px;vertical-align:-2px}
        .orRow{height:52px;display:flex;align-items:center;gap:16px;color:#707984;font-size:18px;font-weight:700}.orRow i{height:2px;flex:1;background:#c7ccd0}
        .createBtn{width:100%;height:59px;border:2px solid #087d3d;border-radius:14px;background:#fff;color:#087d3d;font-size:21px;font-weight:800;cursor:pointer}.userIcon{font-size:29px;margin-right:9px}
        .backBtn{display:block;margin:16px auto 0;border:0;background:transparent;color:#d6000f;font-size:18px;cursor:pointer}

        .ribbon{position:absolute;z-index:2;pointer-events:none}.ribbon span{position:absolute;display:block;border-radius:50%}
        .ribbonTop{left:-135px;top:-138px;width:700px;height:470px;transform:rotate(-14deg)}
        .ribbonTop .rbBlack{width:850px;height:184px;left:-45px;top:0;background:#0e1113}.ribbonTop .rbWhite1{width:850px;height:155px;left:-28px;top:51px;background:#fff}.ribbonTop .rbRed{width:850px;height:140px;left:-10px;top:72px;background:#d70010}.ribbonTop .rbWhite2{width:850px;height:116px;left:9px;top:105px;background:#fff}.ribbonTop .rbGreen{width:850px;height:103px;left:28px;top:128px;background:#087d3d}
        .ribbonBottom{right:-170px;bottom:-64px;width:760px;height:355px;transform:rotate(-17deg)}
        .ribbonBottom .rbGreen{width:830px;height:138px;left:0;top:24px;background:#087d3d}.ribbonBottom .rbWhite1{width:830px;height:116px;left:20px;top:72px;background:#fff}.ribbonBottom .rbRed{width:830px;height:99px;left:40px;top:96px;background:#d70010}.ribbonBottom .rbWhite2{width:830px;height:81px;left:60px;top:124px;background:#fff}.ribbonBottom .rbBlack{width:830px;height:68px;left:81px;top:151px;background:#101214}

        .flagWrap{position:absolute;z-index:3;right:4.8%;top:198px;width:265px;height:330px;opacity:.50;pointer-events:none}.flagWrap img{position:absolute;right:10px;top:18px;width:215px;height:auto;transform:rotate(-2deg);filter:saturate(.82)}.flagPole{position:absolute;right:0;top:0;width:5px;height:100%;background:#8b9096;border-radius:6px}.flagPole:before{content:"";position:absolute;left:-5px;top:-7px;width:15px;height:15px;border-radius:50%;background:#8b9096}

        .loginFooter{position:absolute;z-index:8;left:0;right:0;bottom:0;height:86px;background:linear-gradient(90deg,#0d1012,#15191d);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 32px}.footerBrand{display:flex;align-items:center;gap:10px}.brandSvgSmall{width:50px;height:50px}.footerBrand strong{font-size:29px}.footerBrand b{color:#d6000f}.footerBrand em{font-style:normal;color:#087d3d}.footerSlogan{font-size:19px;font-weight:700}.footerSlogan span{color:#087d3d}

        @media(max-width:900px){.flagWrap{right:-35px;opacity:.28}.brandTitle{font-size:43px}.brandSvg{width:90px;height:90px}.brandHeader{height:128px}.ribbonTop{left:-250px}.loginCard{width:min(710px,calc(100vw - 30px))}}
        @media(max-width:650px){.loginStage{min-height:940px;padding-bottom:68px}.pageContent{padding:14px 10px 28px}.brandHeader{height:auto;margin-bottom:18px;gap:9px}.brandSvg{width:66px;height:66px}.brandTitle{font-size:31px;letter-spacing:-1.5px}.brandTagline{font-size:15px;margin-top:5px}.brandUnderline{width:170px;height:3px;margin-top:5px}.loginCard{padding:27px 22px 22px;border-radius:21px}.loginCard h1{font-size:35px}.headingRule{height:40px}.headingRule i,.headingRule em{width:80px;height:3px}.cardSubtitle{font-size:19px;margin-bottom:22px}.inputFrame{height:56px}.optionsRow{gap:8px}.forgotBtn,.rememberRow{font-size:14px!important}.createBtn{font-size:17px}.flagWrap{display:none}.skylinePhoto{bottom:68px;height:52%;opacity:.5}.ribbonBottom{display:none}.loginFooter{height:68px;padding:0 15px}.footerBrand strong{font-size:18px}.brandSvgSmall{width:38px;height:38px}.footerSlogan{display:none}}
      `}</style>
    </main>
  );
}
