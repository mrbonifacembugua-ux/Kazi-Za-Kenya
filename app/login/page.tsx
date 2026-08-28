"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("Login is ready visually. Account authentication will be connected next.");
  }

  return (
    <main className="loginPage">
      <div className="stripe stripeTop" aria-hidden="true"><span/><i/><b/><em/><strong/></div>
      <div className="stripe stripeBottom" aria-hidden="true"><span/><i/><b/><em/><strong/></div>

      <div className="skyline" aria-hidden="true">
        <span className="tower round"/>
        <span className="tower t2"/>
        <span className="tower t3"/>
        <span className="tower t4"/>
        <span className="tower t5"/>
        <span className="tower t6"/>
      </div>

      <div className="flagScene" aria-hidden="true">
        <div className="flagPole"/>
        <div className="flagCloth"><span/><i/><b/><em/><strong/></div>
      </div>

      <div className="mainWrap">
        <header className="brandBlock">
          <div className="brandLogo" aria-hidden="true">
            <div className="person p1"><i/><span/></div>
            <div className="person p2"><i/><span/></div>
            <div className="person p3"><i/><span/></div>
            <div className="briefcase"/>
          </div>
          <div className="brandWords">
            <div className="brandName"><span>Kazi</span> <b>za</b> <strong>Kenya</strong></div>
            <div className="brandTag">Find Work. Grow Kenya.</div>
            <div className="brandLine"/>
          </div>
        </header>

        <section className="loginCard">
          <h1>Welcome <span>back</span></h1>
          <div className="titleRule"><i/><b>◆</b><em/></div>
          <p className="subTitle">Log in to Kazi za Kenya</p>

          <form onSubmit={submit}>
            <label>Email or phone number</label>
            <div className="field">
              <span className="fieldIcon">✉</span>
              <input aria-label="Email or phone number" placeholder="Email or phone number" autoComplete="username"/>
            </div>

            <label>Password</label>
            <div className="field">
              <span className="fieldIcon">♙</span>
              <input aria-label="Password" type={showPassword ? "text" : "password"} placeholder="Password" autoComplete="current-password"/>
              <button type="button" className="eye" onClick={() => setShowPassword(v => !v)} aria-label="Show or hide password">{showPassword ? "◉" : "◎"}</button>
            </div>

            <div className="options">
              <label className="remember">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/>
                <span>Remember me</span>
              </label>
              <button type="button" className="forgot" onClick={() => setMessage("Password recovery will be connected with authentication.")}>Forgot password?</button>
            </div>

            {message && <div className="message">{message}</div>}

            <button className="loginBtn" type="submit">Log in <span>→</span></button>
            <div className="orRow"><i/><span>or</span><i/></div>
            <button type="button" className="createBtn" onClick={() => setMessage("Account creation will be connected next.")}><span>♙</span> Create new account</button>
            <button type="button" className="backBtn" onClick={() => router.push("/")}>←&nbsp; Back to Kazi za Kenya</button>
          </form>
        </section>
      </div>

      <footer>
        <div className="footerBrand"><span className="footerLogo">●</span><strong>Kazi <b>za</b> <em>Kenya</em></strong></div>
        <div className="footerText">Building opportunities. <span>Empowering Kenya.</span></div>
      </footer>

      <style jsx global>{`
        *{box-sizing:border-box}
        html,body{margin:0;width:100%;min-height:100%;font-family:Arial,Helvetica,sans-serif;color:#111;background:#fff}
        body{overflow-x:hidden}
        button,input{font:inherit}

        .loginPage{position:relative;min-height:1000px;overflow:hidden;background:linear-gradient(180deg,#fff 0%,#fff 58%,#f5f5f5 100%);padding-bottom:78px}
        .mainWrap{position:relative;z-index:5;display:flex;flex-direction:column;align-items:center;width:100%;padding-top:16px}

        .brandBlock{display:flex;align-items:center;gap:18px;height:132px}
        .brandLogo{width:102px;height:102px;border:5px solid #111;border-radius:50%;background:#fff;position:relative;box-shadow:inset 0 -8px 0 #d30712,inset 0 -14px 0 #fff,inset 0 -21px 0 #087c3c}
        .person{position:absolute;top:24px}.person i{display:block;width:17px;height:17px;border-radius:50%;margin:auto}.person span{display:block;width:17px;height:25px;border-radius:8px 8px 3px 3px;margin-top:3px}.p1{left:19px}.p2{left:42px}.p3{left:65px}.p1 i,.p1 span{background:#d30712}.p2 i,.p2 span{background:#111}.p3 i,.p3 span{background:#087c3c}
        .briefcase{position:absolute;left:34px;top:54px;width:36px;height:28px;border:4px solid #111;border-radius:4px;background:#fff}.briefcase:before{content:"";position:absolute;width:13px;height:7px;border:3px solid #111;border-bottom:0;left:8px;top:-10px;border-radius:4px 4px 0 0}.briefcase:after{content:"";position:absolute;left:5px;right:5px;top:11px;border-top:3px solid #111}
        .brandName{font-size:50px;line-height:.95;font-weight:900;letter-spacing:-2.5px}.brandName b{color:#d30712}.brandName strong{color:#087c3c}.brandTag{text-align:center;font-size:22px;font-style:italic;margin-top:9px}.brandLine{width:250px;height:4px;margin:9px auto 0;background:linear-gradient(90deg,#111 0 30%,#d30712 30% 60%,#087c3c 60%);border-radius:99px;transform:skewX(-22deg)}

        .loginCard{width:710px;max-width:calc(100vw - 44px);padding:37px 46px 24px;background:rgba(255,255,255,.97);border:1px solid #cfd2d4;border-radius:25px;box-shadow:0 18px 45px rgba(0,0,0,.14)}
        .loginCard h1{text-align:center;font-size:46px;line-height:1;margin:0;font-weight:900;letter-spacing:-1.7px}.loginCard h1 span{color:#d30712}
        .titleRule{display:flex;align-items:center;justify-content:center;gap:14px;height:47px}.titleRule i,.titleRule em{display:block;width:107px;height:4px;border-radius:99px;background:#111}.titleRule em{background:#087c3c}.titleRule b{font-size:25px;color:#d30712}
        .subTitle{text-align:center;font-size:24px;color:#232c38;margin:0 0 25px}
        .loginCard form>label{display:block;font-size:18px;font-weight:800;margin:0 0 7px}
        .field{height:60px;border:2px solid #e0000b;border-radius:14px;background:#fff;display:flex;align-items:center;margin-bottom:20px}.fieldIcon{width:58px;text-align:center;font-size:27px}.field input{flex:1;height:100%;border:0;outline:0;background:transparent;font-size:18px;color:#222;min-width:0}.field input::placeholder{color:#858c99}.eye{width:60px;height:100%;border:0;background:transparent;font-size:30px;cursor:pointer}
        .options{display:flex;align-items:center;justify-content:space-between;min-height:46px}.remember{display:flex!important;align-items:center;gap:12px!important;margin:0!important;font-size:17px!important;font-weight:400!important}.remember input{width:28px;height:28px;accent-color:#087c3c}.forgot{border:0;background:transparent;color:#d30712;font-size:17px;font-weight:700;cursor:pointer}.message{font-size:12px;color:#9b1118;margin:-1px 0 6px}
        .loginBtn{width:100%;height:60px;border:0;border-radius:15px;background:linear-gradient(90deg,#d20712,#bf0010);color:#fff;font-size:23px;font-weight:800;cursor:pointer}.loginBtn span{font-size:31px;margin-left:14px;vertical-align:-2px}.orRow{height:51px;display:flex;align-items:center;gap:16px;color:#747b84;font-size:18px;font-weight:700}.orRow i{height:2px;background:#c8ccd0;flex:1}.createBtn{width:100%;height:57px;border:2px solid #087c3c;border-radius:14px;background:#fff;color:#087c3c;font-size:20px;font-weight:800;cursor:pointer}.createBtn span{font-size:28px;margin-right:8px}.backBtn{display:block;margin:16px auto 0;border:0;background:transparent;color:#d30712;font-size:17px;font-weight:800;cursor:pointer}

        footer{position:absolute;z-index:8;left:0;right:0;bottom:0;height:78px;background:linear-gradient(90deg,#0f1214,#15191d);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 31px}.footerBrand{display:flex;align-items:center;gap:12px}.footerLogo{width:46px;height:46px;border:3px solid #fff;border-radius:50%;display:grid;place-items:center;color:#d30712;background:linear-gradient(#111 0 32%,#d30712 32% 65%,#087c3c 65%)}.footerBrand strong{font-size:29px}.footerBrand b{color:#d30712}.footerBrand em{font-style:normal;color:#087c3c}.footerText{font-size:19px;font-weight:700}.footerText span{color:#087c3c}

        .stripe{position:absolute;z-index:1;pointer-events:none}.stripe span,.stripe i,.stripe b,.stripe em,.stripe strong{position:absolute;display:block;border-radius:50%}
        .stripeTop{left:-100px;top:-132px;width:690px;height:450px;transform:rotate(-14deg)}.stripeTop span{width:800px;height:180px;background:#111;top:0;left:-35px}.stripeTop i{width:800px;height:151px;background:#fff;top:48px;left:-18px}.stripeTop b{width:800px;height:137px;background:#d30712;top:69px;left:-2px}.stripeTop em{width:800px;height:112px;background:#fff;top:101px;left:16px}.stripeTop strong{width:800px;height:100px;background:#087c3c;top:123px;left:34px}
        .stripeBottom{right:-135px;bottom:-66px;width:700px;height:340px;transform:rotate(-17deg)}.stripeBottom span{width:770px;height:132px;background:#087c3c;top:28px;left:2px}.stripeBottom i{width:770px;height:110px;background:#fff;top:74px;left:22px}.stripeBottom b{width:770px;height:94px;background:#d30712;top:97px;left:42px}.stripeBottom em{width:770px;height:77px;background:#fff;top:123px;left:61px}.stripeBottom strong{width:770px;height:66px;background:#111;top:148px;left:80px}

        .skyline{position:absolute;left:0;right:0;bottom:78px;height:390px;z-index:0;opacity:.13;display:flex;align-items:flex-end;gap:16px;padding:0 52px}.tower{display:block;background:#7a828a;width:102px}.round{height:270px;border-radius:48% 48% 4px 4px}.t2{height:190px}.t3{height:150px}.t4{height:250px;margin-left:auto}.t5{height:185px}.t6{height:135px}
        .flagScene{position:absolute;z-index:1;right:5.5%;top:21%;width:240px;height:330px;opacity:.30}.flagPole{position:absolute;right:0;top:0;width:5px;height:100%;background:#707780;border-radius:5px}.flagCloth{position:absolute;right:5px;top:34px;width:195px;height:118px;transform:skewY(4deg);overflow:hidden}.flagCloth span,.flagCloth i,.flagCloth b,.flagCloth em,.flagCloth strong{display:block;width:100%}.flagCloth span{height:33%;background:#111}.flagCloth i{height:7px;background:#fff}.flagCloth b{height:26%;background:#d30712}.flagCloth em{height:7px;background:#fff}.flagCloth strong{height:33%;background:#087c3c}

        @media(max-width:760px){
          .loginPage{min-height:900px;overflow:auto;padding-bottom:68px}.mainWrap{padding:18px 12px 30px}.brandBlock{height:auto;gap:9px;margin-bottom:18px}.brandLogo{width:66px;height:66px;border-width:3px;box-shadow:inset 0 -5px 0 #d30712,inset 0 -9px 0 #fff,inset 0 -14px 0 #087c3c}.person{top:14px;transform:scale(.65)}.p1{left:9px}.p2{left:25px}.p3{left:41px}.briefcase{transform:scale(.62);transform-origin:center;left:14px;top:29px}.brandName{font-size:31px;letter-spacing:-1.5px}.brandTag{font-size:15px;margin-top:5px}.brandLine{width:170px;height:3px;margin-top:5px}.loginCard{width:100%;padding:28px 22px 22px;border-radius:21px}.loginCard h1{font-size:35px}.subTitle{font-size:19px;margin-bottom:22px}.field{height:55px}.options{gap:10px}.forgot,.remember{font-size:14px!important}.createBtn{font-size:17px}footer{height:64px;padding:0 15px}.footerBrand strong{font-size:18px}.footerLogo{width:34px;height:34px}.footerText{display:none}.stripeTop{transform:scale(.62) rotate(-14deg);transform-origin:top left}.stripeBottom{display:none}.skyline,.flagScene{display:none}}
      `}</style>
    </main>
  );
}
