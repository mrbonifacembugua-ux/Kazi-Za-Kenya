"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    router.push("/");
  }

  return (
    <main className="loginPage">
      <div className="photoSkyline" aria-hidden="true" />
      <div className="photoFade" aria-hidden="true" />
      <div className="stripe stripeTop" aria-hidden="true"><span/><i/><b/><em/><strong/></div>
      <div className="stripe stripeBottom" aria-hidden="true"><span/><i/><b/><em/><strong/></div>

      <div className="flagScene" aria-hidden="true">
        <div className="flagPole" />
        <div className="flagCloth"><span/><i/><b/><em/><strong/><u/></div>
      </div>

      <div className="mainWrap">
        <header className="brandBlock">
          <div className="brandLogo" aria-hidden="true">
            <div className="person p1"><i/><span/></div>
            <div className="person p2"><i/><span/></div>
            <div className="person p3"><i/><span/></div>
            <div className="briefcase" />
          </div>
          <div className="brandWords">
            <div className="brandName"><span>Kazi</span> <b>za</b> <strong>Kenya</strong></div>
            <div className="brandTag">Find Work. Grow Kenya.</div>
            <div className="brandLine" />
          </div>
        </header>

        <section className="loginCard">
          <h1>Welcome <span>back</span></h1>
          <div className="titleRule"><i/><b>♦</b><em/></div>
          <p className="subTitle">Log in to Kazi za Kenya</p>

          <form onSubmit={submit}>
            <label htmlFor="identifier">Email or phone number</label>
            <div className="field">
              <span className="fieldIcon mailIcon" aria-hidden="true" />
              <input id="identifier" aria-label="Email or phone number" placeholder="Email or phone number" autoComplete="username" />
            </div>

            <label htmlFor="password">Password</label>
            <div className="field">
              <span className="fieldIcon lockIcon" aria-hidden="true" />
              <input id="password" aria-label="Password" type={showPassword ? "text" : "password"} placeholder="Password" autoComplete="current-password" />
              <button type="button" className="eye" onClick={() => setShowPassword(v => !v)} aria-label="Show or hide password"><span className="eyeShape" /></button>
            </div>

            <div className="options">
              <label className="remember">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <button type="button" className="forgot">Forgot password?</button>
            </div>

            <button className="loginBtn" type="submit">Log in <span>→</span></button>
            <div className="orRow"><i/><span>or</span><i/></div>
            <button type="button" className="createBtn"><span className="personOutline" />Create new account</button>
            <button type="button" className="backBtn" onClick={() => router.push("/")}>←&nbsp; Back to Kazi za Kenya</button>
          </form>
        </section>
      </div>

      <footer>
        <div className="footerBrand">
          <span className="footerLogo"><i/><b/><em/></span>
          <strong>Kazi <b>za</b> <em>Kenya</em></strong>
        </div>
        <div className="footerText">Building opportunities. <span>Empowering Kenya.</span></div>
        <span className="photoCredit">Skyline: Ephymbaya / Wikimedia Commons, CC BY-SA 4.0</span>
      </footer>

      <style jsx global>{`
        *{box-sizing:border-box}
        html,body{margin:0;width:100%;min-height:100%;font-family:Arial,Helvetica,sans-serif;color:#101010;background:#fff}
        body{overflow-x:hidden}
        button,input{font:inherit}

        .loginPage{position:relative;min-height:992px;overflow:hidden;background:#fff;padding-bottom:94px}
        .mainWrap{position:relative;z-index:6;display:flex;flex-direction:column;align-items:center;width:100%;padding-top:14px}

        .photoSkyline{position:absolute;z-index:0;left:0;right:0;bottom:94px;height:620px;background-image:url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Nairobi_skyline_from_Uhuru_Park.jpg/1280px-Nairobi_skyline_from_Uhuru_Park.jpg");background-size:cover;background-position:center 66%;filter:grayscale(1);opacity:.22}
        .photoFade{position:absolute;z-index:1;left:0;right:0;bottom:94px;height:680px;background:linear-gradient(180deg,rgba(255,255,255,.99) 0%,rgba(255,255,255,.94) 22%,rgba(255,255,255,.72) 54%,rgba(255,255,255,.50) 78%,rgba(255,255,255,.35) 100%);pointer-events:none}

        .brandBlock{display:flex;align-items:center;gap:18px;height:150px}
        .brandLogo{width:108px;height:108px;border:5px solid #111;border-radius:50%;background:#fff;position:relative;box-shadow:inset 0 -8px 0 #d30712,inset 0 -14px 0 #fff,inset 0 -21px 0 #087c3c}
        .person{position:absolute;top:22px}.person i{display:block;width:18px;height:18px;border-radius:50%;margin:auto}.person span{display:block;width:19px;height:27px;border-radius:9px 9px 3px 3px;margin-top:3px}.p1{left:18px}.p2{left:43px}.p3{left:68px}.p1 i,.p1 span{background:#d30712}.p2 i,.p2 span{background:#111}.p3 i,.p3 span{background:#087c3c}
        .briefcase{position:absolute;left:34px;top:55px;width:40px;height:30px;border:4px solid #111;border-radius:4px;background:#fff}.briefcase:before{content:"";position:absolute;width:14px;height:7px;border:3px solid #111;border-bottom:0;left:9px;top:-10px;border-radius:4px 4px 0 0}.briefcase:after{content:"";position:absolute;left:5px;right:5px;top:12px;border-top:3px solid #111}
        .brandName{font-size:53px;line-height:.95;font-weight:900;letter-spacing:-2.7px}.brandName b{color:#d30712}.brandName strong{color:#087c3c}.brandTag{text-align:center;font-size:23px;font-style:italic;margin-top:10px}.brandLine{width:260px;height:4px;margin:9px auto 0;background:linear-gradient(90deg,#111 0 30%,#d30712 30% 61%,#087c3c 61%);border-radius:99px;transform:skewX(-22deg)}

        .loginCard{width:710px;max-width:calc(100vw - 42px);padding:36px 46px 24px;background:rgba(255,255,255,.965);border:1px solid #cfd2d4;border-radius:26px;box-shadow:0 18px 48px rgba(0,0,0,.16);backdrop-filter:blur(2px)}
        .loginCard h1{text-align:center;font-size:46px;line-height:1;margin:0;font-weight:900;letter-spacing:-1.7px}.loginCard h1 span{color:#d30712}
        .titleRule{display:flex;align-items:center;justify-content:center;gap:14px;height:48px}.titleRule i,.titleRule em{display:block;width:107px;height:4px;border-radius:99px;background:#111}.titleRule em{background:#087c3c}.titleRule b{font-size:25px;color:#d30712}
        .subTitle{text-align:center;font-size:24px;color:#252d37;margin:0 0 26px}
        .loginCard form>label{display:block;font-size:18px;font-weight:800;margin:0 0 7px}
        .field{height:60px;border:2px solid #e0000b;border-radius:14px;background:#fff;display:flex;align-items:center;margin-bottom:20px}.fieldIcon{width:58px;height:100%;position:relative;flex:0 0 58px}.field input{flex:1;height:100%;border:0;outline:0;background:transparent;font-size:18px;color:#222;min-width:0}.field input::placeholder{color:#858c99}
        .mailIcon:before{content:"";position:absolute;left:20px;top:20px;width:24px;height:16px;border:3px solid #111;border-radius:3px}.mailIcon:after{content:"";position:absolute;left:23px;top:20px;width:18px;height:12px;border-left:2px solid #111;border-bottom:2px solid #111;transform:rotate(-45deg) skew(8deg,8deg)}
        .lockIcon:before{content:"";position:absolute;left:21px;top:24px;width:22px;height:20px;border:3px solid #111;border-radius:4px}.lockIcon:after{content:"";position:absolute;left:25px;top:14px;width:14px;height:14px;border:3px solid #111;border-bottom:0;border-radius:9px 9px 0 0}
        .eye{width:60px;height:100%;border:0;background:transparent;cursor:pointer;display:grid;place-items:center}.eyeShape{width:27px;height:17px;border:3px solid #111;border-radius:55% 45% 55% 45%;transform:rotate(45deg);position:relative}.eyeShape:after{content:"";position:absolute;width:7px;height:7px;border-radius:50%;background:#111;left:7px;top:2px}
        .options{display:flex;align-items:center;justify-content:space-between;min-height:47px}.remember{display:flex!important;align-items:center;gap:12px!important;margin:0!important;font-size:17px!important;font-weight:400!important}.remember input{appearance:none;width:28px;height:28px;border:2px solid #111;border-radius:4px;background:#fff;position:relative}.remember input:checked{background:#087c3c;border-color:#087c3c}.remember input:checked:after{content:"✓";position:absolute;color:#fff;font-size:20px;font-weight:900;left:5px;top:0}.forgot{border:0;background:transparent;color:#d30712;font-size:17px;font-weight:700;cursor:pointer}
        .loginBtn{width:100%;height:60px;border:0;border-radius:15px;background:linear-gradient(90deg,#d20712,#bf0010);color:#fff;font-size:23px;font-weight:800;cursor:pointer}.loginBtn span{font-size:31px;margin-left:14px;vertical-align:-2px}.orRow{height:51px;display:flex;align-items:center;gap:16px;color:#747b84;font-size:18px;font-weight:700}.orRow i{height:2px;background:#c8ccd0;flex:1}.createBtn{width:100%;height:57px;border:2px solid #087c3c;border-radius:14px;background:#fff;color:#087c3c;font-size:20px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:12px}.personOutline{width:23px;height:23px;border:3px solid #087c3c;border-radius:50%;position:relative;margin-bottom:7px}.personOutline:after{content:"";position:absolute;left:-6px;top:21px;width:30px;height:15px;border:3px solid #087c3c;border-radius:18px 18px 4px 4px;background:#fff}.backBtn{display:block;margin:16px auto 0;border:0;background:transparent;color:#d30712;font-size:17px;font-weight:800;cursor:pointer}

        footer{position:absolute;z-index:8;left:0;right:0;bottom:0;height:94px;background:linear-gradient(90deg,#0f1214,#15191d);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 31px}.footerBrand{display:flex;align-items:center;gap:12px}.footerLogo{width:46px;height:46px;border:3px solid #fff;border-radius:50%;position:relative;overflow:hidden;background:#fff}.footerLogo i,.footerLogo b,.footerLogo em{position:absolute;left:4px;right:4px;height:11px}.footerLogo i{top:7px;background:#111}.footerLogo b{top:18px;background:#d30712}.footerLogo em{top:29px;background:#087c3c}.footerBrand strong{font-size:29px}.footerBrand b{color:#d30712}.footerBrand em{font-style:normal;color:#087c3c}.footerText{font-size:19px;font-weight:700}.footerText span{color:#087c3c}.photoCredit{position:absolute;right:31px;bottom:7px;font-size:9px;color:#9da2a6}

        .stripe{position:absolute;z-index:3;pointer-events:none}.stripe span,.stripe i,.stripe b,.stripe em,.stripe strong{position:absolute;display:block;border-radius:50%}
        .stripeTop{left:-120px;top:-120px;width:700px;height:445px;transform:rotate(-14deg)}.stripeTop span{width:820px;height:180px;background:#111;top:0;left:-35px}.stripeTop i{width:820px;height:150px;background:#fff;top:48px;left:-17px}.stripeTop b{width:820px;height:137px;background:#d30712;top:68px;left:1px}.stripeTop em{width:820px;height:112px;background:#fff;top:100px;left:20px}.stripeTop strong{width:820px;height:100px;background:#087c3c;top:122px;left:39px}
        .stripeBottom{right:-145px;bottom:8px;width:700px;height:340px;transform:rotate(-17deg)}.stripeBottom span{width:770px;height:132px;background:#087c3c;top:28px;left:2px}.stripeBottom i{width:770px;height:110px;background:#fff;top:74px;left:22px}.stripeBottom b{width:770px;height:94px;background:#d30712;top:97px;left:42px}.stripeBottom em{width:770px;height:77px;background:#fff;top:123px;left:61px}.stripeBottom strong{width:770px;height:66px;background:#111;top:148px;left:80px}

        .flagScene{position:absolute;z-index:4;right:5.2%;top:215px;width:245px;height:330px;opacity:.34}.flagPole{position:absolute;right:0;top:0;width:5px;height:100%;background:#707780;border-radius:5px}.flagPole:before{content:"";position:absolute;width:13px;height:13px;border-radius:50%;background:#707780;left:-4px;top:-10px}.flagCloth{position:absolute;right:5px;top:33px;width:198px;height:120px;transform:skewY(4deg);overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,.12)}.flagCloth span,.flagCloth i,.flagCloth b,.flagCloth em,.flagCloth strong{display:block;width:100%}.flagCloth span{height:33%;background:#111}.flagCloth i{height:7px;background:#fff}.flagCloth b{height:26%;background:#d30712}.flagCloth em{height:7px;background:#fff}.flagCloth strong{height:33%;background:#087c3c}.flagCloth u{position:absolute;left:82px;top:31px;width:34px;height:58px;background:#d30712;border-radius:55% 45%;border:2px solid #fff;transform:rotate(0deg);text-decoration:none}.flagCloth u:after{content:"";position:absolute;left:15px;top:6px;width:4px;height:45px;background:#fff;border-radius:3px}

        @media(max-width:760px){
          .loginPage{min-height:900px;overflow:auto;padding-bottom:68px}.mainWrap{padding:18px 12px 30px}.brandBlock{height:auto;gap:9px;margin-bottom:18px}.brandLogo{width:66px;height:66px;border-width:3px;box-shadow:inset 0 -5px 0 #d30712,inset 0 -9px 0 #fff,inset 0 -14px 0 #087c3c}.person{top:14px;transform:scale(.65)}.p1{left:9px}.p2{left:25px}.p3{left:41px}.briefcase{transform:scale(.62);transform-origin:center;left:14px;top:29px}.brandName{font-size:31px;letter-spacing:-1.5px}.brandTag{font-size:15px;margin-top:5px}.brandLine{width:170px;height:3px;margin-top:5px}.loginCard{width:100%;padding:28px 22px 22px;border-radius:21px}.loginCard h1{font-size:35px}.subTitle{font-size:19px;margin-bottom:22px}.field{height:55px}.options{gap:10px}.forgot,.remember{font-size:14px!important}.createBtn{font-size:17px}footer{height:68px;padding:0 15px}.footerBrand strong{font-size:18px}.footerLogo{width:34px;height:34px}.footerText,.photoCredit{display:none}.stripeTop{transform:scale(.62) rotate(-14deg);transform-origin:top left}.stripeBottom{display:none}.flagScene{display:none}.photoSkyline{height:420px;bottom:68px;background-position:center bottom}.photoFade{height:500px;bottom:68px}}
      `}</style>
    </main>
  );
}
