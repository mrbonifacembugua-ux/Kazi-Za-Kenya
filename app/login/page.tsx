"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    if (!identifier.trim() || !password.trim()) {
      setMessage("Enter your email or phone number and password.");
      return;
    }

    if (mode === "register") {
      if (password.length < 6) {
        setMessage("Use a password with at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setMessage("The passwords do not match.");
        return;
      }
      setMessage("Account form is ready. We will connect real account creation when authentication is enabled.");
      return;
    }

    router.push("/");
  }

  return (
    <main className="login-page">
      <div className="kenya-swoop swoop-top" aria-hidden="true">
        <span className="s-black" />
        <span className="s-white-a" />
        <span className="s-red" />
        <span className="s-white-b" />
        <span className="s-green" />
      </div>

      <div className="kenya-swoop swoop-bottom" aria-hidden="true">
        <span className="s-green" />
        <span className="s-white-a" />
        <span className="s-red" />
        <span className="s-white-b" />
        <span className="s-black" />
      </div>

      <div className="skyline" aria-hidden="true">
        <div className="tower tower-one"><i /></div>
        <div className="tower tower-two"><i /></div>
        <div className="tower tower-three"><i /></div>
        <div className="tower tower-four"><i /></div>
        <div className="tower tower-five"><i /></div>
        <div className="tower tower-six"><i /></div>
        <div className="tower tower-seven"><i /></div>
        <div className="tower tower-eight"><i /></div>
      </div>

      <div className="flag-scene" aria-hidden="true">
        <span className="flag-pole" />
        <div className="flag">
          <span className="flag-black" />
          <span className="flag-white-one" />
          <span className="flag-red" />
          <span className="flag-white-two" />
          <span className="flag-green" />
          <b>◈</b>
        </div>
      </div>

      <header className="login-brand" aria-label="Kazi za Kenya">
        <div className="brand-mark">
          <div className="mark-people">● ● ●</div>
          <div className="mark-case">▣</div>
        </div>
        <div>
          <div className="brand-name">
            <span>Kazi</span> <b>za</b> <strong>Kenya</strong>
          </div>
          <div className="brand-tagline">Find Work. Grow Kenya.</div>
          <div className="brand-stroke" />
        </div>
      </header>

      <section className="login-card">
        <div className="card-heading">
          {mode === "login" ? (
            <h1>Welcome <span>back</span></h1>
          ) : (
            <h1>Create <span>account</span></h1>
          )}
          <div className="heading-divider">
            <i className="left-line" />
            <b>◆</b>
            <i className="right-line" />
          </div>
          <p>{mode === "login" ? "Log in to Kazi za Kenya" : "Join Kazi za Kenya"}</p>
        </div>

        <form onSubmit={submit}>
          <label className="field-label" htmlFor="identifier">Email or phone number</label>
          <div className="input-shell">
            <span className="input-icon">✉</span>
            <input
              id="identifier"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Email or phone number"
              autoComplete="username"
            />
          </div>

          <label className="field-label" htmlFor="password">Password</label>
          <div className="input-shell">
            <span className="input-icon">▣</span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            <button
              type="button"
              className="eye-button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? "◉" : "◎"}
            </button>
          </div>

          {mode === "register" && (
            <>
              <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
              <div className="input-shell">
                <span className="input-icon">▣</span>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
              </div>
            </>
          )}

          {mode === "login" && (
            <div className="login-options">
              <label className="remember-row">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="forgot-button"
                onClick={() => setMessage("Password recovery will be connected when authentication is enabled.")}
              >
                Forgot password?
              </button>
            </div>
          )}

          {message && <div className="form-message" role="status">{message}</div>}

          <button className="login-button" type="submit">
            {mode === "login" ? "Log in" : "Create account"} <span>→</span>
          </button>

          <div className="or-row"><i /> <span>or</span> <i /></div>

          <button
            className="create-button"
            type="button"
            onClick={() => {
              setMode((current) => current === "login" ? "register" : "login");
              setMessage("");
              setPassword("");
              setConfirmPassword("");
            }}
          >
            <span className="person-icon">♙</span>
            {mode === "login" ? "Create new account" : "Already have an account? Log in"}
          </button>

          <button className="back-button" type="button" onClick={() => router.push("/")}>← Back to Kazi za Kenya</button>
        </form>
      </section>

      <footer className="login-footer">
        <div className="footer-brand">
          <span className="mini-logo">🇰🇪</span>
          <strong>Kazi <b>za</b> <em>Kenya</em></strong>
        </div>
        <div className="footer-copy">Building opportunities. <span>Empowering Kenya.</span></div>
      </footer>

      <style jsx global>{`
        *{box-sizing:border-box}
        html,body{margin:0;min-height:100%;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#101010}
        body{background:#fafafa}
        button,input{font:inherit}
        .login-page{position:relative;min-height:100vh;overflow:hidden;background:linear-gradient(180deg,#fff 0%,#fbfbfb 62%,#f2f2f2 100%);padding:22px 18px 94px;display:flex;flex-direction:column;align-items:center}
        .kenya-swoop{position:absolute;z-index:1;pointer-events:none;overflow:hidden}
        .swoop-top{left:-95px;top:-95px;width:670px;height:390px;transform:rotate(-13deg)}
        .swoop-bottom{right:-110px;bottom:22px;width:620px;height:300px;transform:rotate(-17deg)}
        .kenya-swoop span{position:absolute;display:block;border-radius:100%}
        .swoop-top .s-black{width:760px;height:165px;left:-85px;top:-80px;background:#111}
        .swoop-top .s-white-a{width:760px;height:140px;left:-75px;top:-22px;background:#fff}
        .swoop-top .s-red{width:760px;height:126px;left:-55px;top:-3px;background:#d10009}
        .swoop-top .s-white-b{width:760px;height:105px;left:-34px;top:30px;background:#fff}
        .swoop-top .s-green{width:760px;height:95px;left:-12px;top:49px;background:#087b39}
        .swoop-bottom .s-green{width:700px;height:118px;right:-80px;bottom:106px;background:#087b39}
        .swoop-bottom .s-white-a{width:700px;height:99px;right:-57px;bottom:72px;background:#fff}
        .swoop-bottom .s-red{width:700px;height:89px;right:-39px;bottom:46px;background:#d10009}
        .swoop-bottom .s-white-b{width:700px;height:72px;right:-17px;bottom:20px;background:#fff}
        .swoop-bottom .s-black{width:700px;height:67px;right:6px;bottom:-4px;background:#111}
        .login-brand{position:relative;z-index:5;display:flex;align-items:center;gap:18px;margin-top:0;text-align:left}
        .brand-mark{width:98px;height:98px;border:5px solid #111;border-radius:50%;position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;background:white;box-shadow:inset 0 -7px 0 #d4000b, inset 0 -13px 0 #fff, inset 0 -19px 0 #087b39}
        .mark-people{font-size:15px;font-weight:900;letter-spacing:2px;color:#111;margin-top:-8px}.mark-people::first-letter{color:#d10009}.mark-case{font-size:34px;line-height:1;margin-top:0}
        .brand-name{font-size:47px;line-height:1;font-weight:950;letter-spacing:-2.1px}.brand-name b{color:#d4000b}.brand-name strong{color:#087b39}.brand-tagline{font-size:22px;font-style:italic;margin-top:10px;text-align:center}.brand-stroke{height:4px;width:245px;margin:10px auto 0;background:linear-gradient(90deg,#111 0 28%,#d4000b 28% 59%,#087b39 59%);border-radius:99px;transform:skewX(-22deg)}
        .login-card{position:relative;z-index:6;margin-top:34px;width:min(710px,92vw);background:rgba(255,255,255,.95);border:1px solid #d2d4d6;border-radius:27px;box-shadow:0 22px 55px rgba(0,0,0,.16);padding:36px 46px 26px;backdrop-filter:blur(8px)}
        .card-heading{text-align:center}.card-heading h1{font-size:45px;line-height:1.05;letter-spacing:-1.5px;margin:0;font-weight:950}.card-heading h1 span{color:#d3000b}.heading-divider{display:flex;align-items:center;justify-content:center;gap:14px;margin:14px auto 12px}.heading-divider i{display:block;width:105px;height:4px;border-radius:99px}.heading-divider .left-line{background:#111}.heading-divider .right-line{background:#087b39}.heading-divider b{font-size:28px;color:#d3000b;line-height:1}.card-heading p{margin:0 0 26px;font-size:23px;color:#202a36;font-weight:500}
        form{width:100%}.field-label{display:block;font-weight:850;font-size:18px;margin:0 0 7px}.input-shell{height:59px;border:2px solid #dd0710;border-radius:14px;display:flex;align-items:center;background:#fff;margin-bottom:20px;box-shadow:inset 0 1px 2px rgba(0,0,0,.04)}.input-icon{width:54px;display:grid;place-items:center;font-size:26px;color:#111}.input-shell input{flex:1;border:0;outline:0;background:transparent;height:100%;font-size:18px;padding:0 8px;color:#111;min-width:0}.input-shell input::placeholder{color:#808795}.eye-button{border:0;background:transparent;width:58px;height:100%;cursor:pointer;font-size:31px;color:#111}.login-options{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:4px 0 18px}.remember-row{display:flex;align-items:center;gap:12px;font-size:17px}.remember-row input{appearance:none;width:28px;height:28px;border:2px solid #111;border-radius:5px;background:#fff;cursor:pointer;position:relative}.remember-row input:checked{background:#087b39;border-color:#087b39}.remember-row input:checked::after{content:"✓";position:absolute;color:#fff;font-size:21px;font-weight:900;left:5px;top:-1px}.forgot-button{border:0;background:none;color:#d3000b;font-size:17px;font-weight:800;cursor:pointer}.login-button{width:100%;height:61px;border:0;border-radius:15px;background:linear-gradient(90deg,#d0000b,#bd0008);color:#fff;font-size:23px;font-weight:900;cursor:pointer;box-shadow:0 6px 14px rgba(180,0,0,.18)}.login-button span{font-size:31px;margin-left:14px;vertical-align:-2px}.login-button:hover{filter:brightness(.96)}.or-row{display:flex;align-items:center;gap:15px;color:#6f7580;font-weight:700;font-size:18px;margin:17px 0}.or-row i{height:2px;flex:1;background:#c7cbd0}.create-button{width:100%;min-height:58px;border:2px solid #087b39;border-radius:14px;background:white;color:#087b39;font-weight:900;font-size:20px;cursor:pointer;padding:8px 14px}.person-icon{font-size:30px;margin-right:9px}.back-button{display:block;margin:16px auto 0;border:0;background:transparent;color:#d3000b;font-weight:850;font-size:17px;cursor:pointer}.form-message{margin:-4px 0 14px;padding:10px 12px;border-radius:9px;background:#fff5f5;border:1px solid #f1c5c5;color:#9f1515;font-size:14px;line-height:1.4}
        .skyline{position:absolute;left:0;right:0;bottom:70px;height:360px;z-index:0;opacity:.12;display:flex;align-items:flex-end;gap:10px;padding:0 36px}.tower{background:#77808b;width:8%;min-width:54px;position:relative}.tower i{position:absolute;inset:13px 12px;background:repeating-linear-gradient(180deg,transparent 0 13px,#fff 13px 17px)}.tower-one{height:265px;border-radius:50% 50% 8px 8px}.tower-two{height:185px}.tower-three{height:150px}.tower-four{height:235px}.tower-five{height:170px;margin-left:auto}.tower-six{height:275px}.tower-seven{height:175px}.tower-eight{height:145px}.flag-scene{position:absolute;right:8.5%;top:230px;width:220px;height:300px;opacity:.23;z-index:2;pointer-events:none}.flag-pole{position:absolute;right:20px;top:0;width:5px;height:290px;background:#6d7378;border-radius:5px}.flag-pole::before{content:"";position:absolute;left:-5px;top:-10px;width:15px;height:15px;border-radius:50%;background:#6d7378}.flag{position:absolute;right:25px;top:18px;width:155px;height:102px;overflow:hidden;clip-path:polygon(0 0,100% 9%,92% 94%,0 100%);box-shadow:0 3px 8px #0002}.flag span{display:block;width:100%;position:absolute;left:0}.flag-black{top:0;height:31px;background:#111}.flag-white-one{top:31px;height:5px;background:#fff}.flag-red{top:36px;height:31px;background:#bb0010}.flag-white-two{top:67px;height:5px;background:#fff}.flag-green{top:72px;height:31px;background:#087b39}.flag b{position:absolute;left:65px;top:34px;color:#fff;font-size:27px;z-index:2}
        .login-footer{position:absolute;z-index:7;left:0;right:0;bottom:0;height:76px;background:linear-gradient(90deg,#101112,#191b1d);display:flex;align-items:center;justify-content:space-between;padding:0 34px;color:#fff}.footer-brand{display:flex;align-items:center;gap:10px}.mini-logo{font-size:33px}.footer-brand strong{font-size:27px}.footer-brand b{color:#d3000b}.footer-brand em{color:#087b39;font-style:normal}.footer-copy{font-size:19px;font-weight:750}.footer-copy span{color:#087b39}
        @media(max-width:900px){.swoop-top{width:500px;height:300px}.brand-name{font-size:37px}.brand-mark{width:78px;height:78px}.brand-tagline{font-size:18px}.login-card{margin-top:28px;width:min(680px,95vw);padding:30px 30px 24px}.flag-scene{opacity:.13;right:2%}.footer-copy{font-size:15px}}
        @media(max-width:620px){.login-page{padding:18px 12px 104px}.swoop-top{left:-170px;top:-125px;transform:rotate(-18deg)}.swoop-bottom{right:-250px;bottom:18px}.login-brand{gap:10px;margin-top:11px}.brand-mark{width:62px;height:62px;border-width:3px}.mark-people{font-size:10px}.mark-case{font-size:23px}.brand-name{font-size:28px;letter-spacing:-1.2px}.brand-tagline{font-size:14px;margin-top:5px}.brand-stroke{width:150px;height:3px;margin-top:5px}.login-card{margin-top:25px;border-radius:20px;padding:25px 18px 20px}.card-heading h1{font-size:35px}.heading-divider i{width:65px}.card-heading p{font-size:18px;margin-bottom:22px}.field-label{font-size:15px}.input-shell{height:54px}.input-shell input{font-size:16px}.login-options{align-items:flex-start}.remember-row,.forgot-button{font-size:14px}.login-button{height:56px;font-size:20px}.create-button{font-size:16px}.back-button{font-size:15px}.flag-scene{display:none}.skyline{bottom:78px;height:260px;padding:0 8px}.login-footer{height:86px;padding:0 16px;gap:8px}.footer-brand strong{font-size:18px}.mini-logo{font-size:25px}.footer-copy{font-size:12px;text-align:right;max-width:180px}}
      `}</style>
    </main>
  );
}
