"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword,setShowPassword]=useState(false);
  const [remember,setRemember]=useState(false);
  const [message,setMessage]=useState("");

  function submit(e:FormEvent){
    e.preventDefault();
    setMessage("Login is ready visually. Account authentication will be connected next.");
  }

  return <main className="page">
    <div className="ribbons top" aria-hidden="true"><i/><b/><em/></div>
    <div className="ribbons bottom" aria-hidden="true"><i/><b/><em/></div>

    <div className="city" aria-hidden="true">
      <span className="roundTower"/><span className="building b1"/><span className="building b2"/><span className="building b3"/><span className="building b4"/><span className="building b5"/>
    </div>
    <div className="kenyaFlag" aria-hidden="true"><div className="cloth"><i/><b/><em/></div><span/></div>

    <div className="content">
      <header className="brand">
        <div className="logo"><div className="heads"><i/><b/><em/></div><span className="case">▣</span></div>
        <div className="brandText"><div className="name">Kazi <b>za</b> <strong>Kenya</strong></div><div className="tag">Find Work. Grow Kenya.</div><div className="stroke"/></div>
      </header>

      <section className="card">
        <h1>Welcome <span>back</span></h1>
        <div className="divider"><i/><b>♦</b><em/></div>
        <p className="subtitle">Log in to Kazi za Kenya</p>
        <form onSubmit={submit}>
          <label>Email or phone number</label>
          <div className="field"><span className="mail">▱</span><input aria-label="Email or phone number" placeholder="Email or phone number" autoComplete="username"/></div>
          <label>Password</label>
          <div className="field"><span className="lock">♙</span><input aria-label="Password" type={showPassword?"text":"password"} placeholder="Password" autoComplete="current-password"/><button type="button" className="eye" onClick={()=>setShowPassword(v=>!v)}>{showPassword?"◉":"◎"}</button></div>
          <div className="options"><label className="remember"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/><span>Remember me</span></label><button type="button" className="forgot" onClick={()=>setMessage("Password recovery will be connected with authentication.")}>Forgot password?</button></div>
          {message&&<div className="message">{message}</div>}
          <button className="login" type="submit">Log in <span>→</span></button>
          <div className="or"><i/><span>or</span><i/></div>
          <button type="button" className="create" onClick={()=>setMessage("Account creation will be connected next.")}><span>♙</span> Create new account</button>
          <button type="button" className="back" onClick={()=>router.push("/")}>←&nbsp; Back to Kazi za Kenya</button>
        </form>
      </section>
    </div>

    <footer><div className="footBrand"><span className="mini">●</span><strong>Kazi <b>za</b> <em>Kenya</em></strong></div><div className="footTag">Building opportunities. <span>Empowering Kenya.</span></div></footer>

    <style jsx global>{`
      *{box-sizing:border-box}html,body{margin:0;width:100%;min-height:100%;font-family:Arial,Helvetica,sans-serif;color:#111}button,input{font:inherit}.page{height:100vh;min-height:620px;position:relative;overflow:hidden;background:linear-gradient(#fff 0 68%,#f7f7f7 100%)}
      .content{position:relative;z-index:5;width:100%;height:calc(100vh - 70px);min-height:550px;display:flex;flex-direction:column;align-items:center;padding-top:14px}.brand{height:125px;display:flex;align-items:center;gap:18px}.logo{width:94px;height:94px;border:5px solid #080808;border-radius:50%;background:#fff;position:relative;display:grid;place-items:center;box-shadow:inset 0 -7px #d00812,inset 0 -13px #fff,inset 0 -20px #087b3c}.heads{position:absolute;top:18px;display:flex;gap:7px}.heads i,.heads b,.heads em{width:15px;height:15px;border-radius:50%;background:#d00812}.heads b{background:#080808}.heads em{background:#087b3c}.case{font-size:34px;margin-top:17px}.name{font-size:47px;line-height:1;font-weight:900;letter-spacing:-2.4px}.name b{color:#d00812}.name strong{color:#087b3c}.tag{text-align:center;font-size:21px;font-style:italic;margin-top:9px}.stroke{width:245px;height:4px;margin:9px auto 0;border-radius:9px;background:linear-gradient(90deg,#111 0 31%,#d00812 31% 62%,#087b3c 62%)}
      .card{width:710px;max-width:calc(100vw - 40px);margin-top:14px;padding:31px 46px 21px;border:1px solid #d3d5d7;border-radius:26px;background:rgba(255,255,255,.96);box-shadow:0 15px 36px rgba(0,0,0,.14)}.card h1{text-align:center;font-size:44px;line-height:1;margin:0;font-weight:900;letter-spacing:-1.5px}.card h1 span{color:#d00812}.divider{height:40px;display:flex;justify-content:center;align-items:center;gap:15px}.divider i,.divider em{width:105px;height:4px;border-radius:10px;background:#111}.divider em{background:#087b3c}.divider b{font-size:23px;color:#d00812}.subtitle{text-align:center;font-size:23px;color:#202936;margin:0 0 24px}.card form>label{display:block;font-size:18px;font-weight:800;margin-bottom:7px}.field{height:57px;border:2px solid #e0000b;border-radius:14px;display:flex;align-items:center;margin-bottom:18px;background:#fff}.field>span{width:58px;text-align:center;font-size:28px}.field input{height:100%;flex:1;border:0;outline:0;background:transparent;font-size:18px;color:#222;min-width:0}.field input::placeholder{color:#818897}.eye{width:60px;height:100%;border:0;background:transparent;font-size:29px;cursor:pointer}.options{height:43px;display:flex;align-items:center;justify-content:space-between}.remember{display:flex!important;align-items:center;gap:12px!important;margin:0!important;font-size:17px!important;font-weight:400!important}.remember input{width:27px;height:27px;accent-color:#087b3c}.forgot{border:0;background:transparent;color:#d00812;font-size:17px;font-weight:700;cursor:pointer}.message{font-size:12px;color:#9b1118;margin:-2px 0 5px}.login{width:100%;height:59px;border:0;border-radius:15px;background:linear-gradient(90deg,#d00812,#bd0010);color:white;font-size:23px;font-weight:800;cursor:pointer}.login span{font-size:31px;margin-left:12px;vertical-align:-2px}.or{height:48px;display:flex;align-items:center;gap:15px;color:#747b84;font-size:18px;font-weight:700}.or i{height:2px;background:#c8ccd0;flex:1}.create{width:100%;height:56px;border:2px solid #087b3c;border-radius:14px;background:white;color:#087b3c;font-size:20px;font-weight:800;cursor:pointer}.create span{font-size:27px;margin-right:9px}.back{display:block;margin:14px auto 0;border:0;background:transparent;color:#d00812;font-size:17px;font-weight:800;cursor:pointer}
      footer{position:absolute;z-index:8;left:0;right:0;bottom:0;height:70px;background:linear-gradient(90deg,#101316,#15191d);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 31px}.footBrand{display:flex;align-items:center;gap:11px}.mini{width:42px;height:42px;border:3px solid white;border-radius:50%;display:grid;place-items:center;color:#d00812;background:linear-gradient(#111 0 33%,#d00812 33% 66%,#087b3c 66%)}.footBrand strong{font-size:27px}.footBrand b{color:#d00812}.footBrand em{font-style:normal;color:#087b3c}.footTag{font-size:18px;font-weight:700}.footTag span{color:#087b3c}
      .ribbons{position:absolute;z-index:1;pointer-events:none}.ribbons.top{width:650px;height:320px;left:-180px;top:-155px;transform:rotate(-13deg)}.ribbons.bottom{width:650px;height:300px;right:-170px;bottom:-90px;transform:rotate(-16deg)}.ribbons i,.ribbons b,.ribbons em{position:absolute;display:block;width:760px;border-radius:50%;left:0}.ribbons.top i{height:175px;top:0;background:#0b0d0e;box-shadow:0 12px 0 #fff,0 28px 0 #d00812,0 43px 0 #fff,0 62px 0 #087b3c}.ribbons.bottom i{height:100px;top:10px;background:#087b3c;box-shadow:0 15px 0 #fff,0 32px 0 #d00812,0 48px 0 #fff,0 66px 0 #111}.ribbons b,.ribbons em{display:none}
      .city{position:absolute;z-index:0;left:0;right:0;bottom:70px;height:290px;opacity:.10;display:flex;align-items:flex-end;gap:18px;padding:0 55px}.building,.roundTower{display:block;background:#68717b;width:95px}.roundTower{height:230px;border-radius:48% 48% 3px 3px}.b1{height:145px}.b2{height:115px}.b3{height:190px;margin-left:auto}.b4{height:140px}.b5{height:105px}.kenyaFlag{position:absolute;z-index:1;right:6.5%;top:25%;height:300px;width:235px;opacity:.23}.kenyaFlag>span{position:absolute;right:0;top:0;width:5px;height:100%;background:#69717a;border-radius:5px}.cloth{position:absolute;right:5px;top:25px;width:190px;height:115px;transform:skewY(4deg);overflow:hidden}.cloth i,.cloth b,.cloth em{display:block;height:33.333%;width:100%}.cloth i{background:#111}.cloth b{background:#d00812;border-top:7px solid white;border-bottom:7px solid white}.cloth em{background:#087b3c}
      @media(max-height:760px) and (min-width:700px){.content{transform:scale(.78);transform-origin:top center;width:128.205%;margin-left:-14.102%;height:705px;padding-top:8px}.brand{height:118px}.card{margin-top:7px}.city{height:230px}.kenyaFlag{transform:scale(.8);transform-origin:top right}footer{height:56px}.page{min-height:620px}.ribbons.bottom{bottom:-120px}}
      @media(max-width:699px){.page{height:auto;min-height:100vh;overflow:auto;padding-bottom:70px}.content{height:auto;min-height:0;padding:18px 12px 30px}.brand{height:auto;gap:9px;margin-bottom:18px}.logo{width:64px;height:64px;border-width:3px}.heads{top:11px;transform:scale(.72)}.case{font-size:23px}.name{font-size:31px;letter-spacing:-1.5px}.tag{font-size:15px;margin-top:5px}.stroke{width:170px;height:3px;margin-top:5px}.card{margin:0;width:100%;padding:27px 22px 22px;border-radius:21px}.card h1{font-size:35px}.subtitle{font-size:19px;margin-bottom:22px}.field{height:55px}.options{gap:10px}.forgot,.remember{font-size:14px!important}.create{font-size:17px}footer{height:64px;padding:0 15px}.footBrand strong{font-size:18px}.mini{width:34px;height:34px}.footTag{display:none}.ribbons.top{transform:scale(.6) rotate(-13deg);transform-origin:top left}.ribbons.bottom{display:none}.city{display:none}.kenyaFlag{display:none}}
    `}</style>
  </main>
}
