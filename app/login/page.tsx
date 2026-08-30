"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const NAIROBI_IMAGE =
  "https://images.unsplash.com/photo-1693902997450-7e912c0d3554?auto=format&fit=crop&fm=jpg&q=82&w=2200";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const identifier = email.trim();
    if (!identifier || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (!identifier.includes("@")) {
      setError("For now, please log in with your email address.");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });
    setLoading(false);

    if (authError) {
      setError("We could not log you in. Check your email and password and try again.");
      return;
    }

    if (remember) window.localStorage.setItem("anydaywork-remembered-email", identifier);
    else window.localStorage.removeItem("anydaywork-remembered-email");

    router.replace("/");
    router.refresh();
  }

  function socialComingSoon(provider: string) {
    window.alert(`${provider} sign-in is not connected yet. Please use your email and password for now.`);
  }

  return (
    <main className="adwPage">
      <section className="adwHero">
        <div className="adwPhoto" aria-hidden="true" />
        <div className="adwFade" aria-hidden="true" />

        <div className="adwHeroContent">
          <button className="adwBrand" type="button" onClick={() => router.push("/")} aria-label="AnyDayWork home">
            <span className="any">Any</span><span className="day">Day</span><span className="work">Work</span>
          </button>
          <p className="adwTagline">Find work near you. Any day.</p>

          <div className="adwPitch">
            <h1>Find work<br />near you. <span>Any day.</span></h1>
            <p className="adwCopy">Connecting skilled workers with<br className="desktopBreak" /> people who need work done.</p>
            <p className="adwSimple"><b>Simple.</b> <strong>Fast.</strong> <em>Reliable.</em></p>

            <div className="adwBenefits">
              <div className="adwBenefit">
                <div className="adwBenefitIcon pin" aria-hidden="true">●</div>
                <div><b>Near you</b><span>Jobs in your area</span></div>
              </div>
              <div className="adwBenefit">
                <div className="adwBenefitIcon bolt" aria-hidden="true">⚡</div>
                <div><b>Quick</b><span>Get things done</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="adwBottom">
          <div className="adwEveryoneIcon" aria-hidden="true">◎</div>
          <div><b>For Everyone</b><span>Anyone can find<br />or offer work</span></div>
        </div>
      </section>

      <section className="adwLoginSide">
        <div className="adwCard">
          <div className="adwCardHeader">
            <h2>Welcome Back!</h2>
            <div className="adwTricolor" aria-hidden="true"><i /><i /><i /></div>
            <p>Log in to your AnyDayWork account</p>
          </div>

          <form className="adwForm" onSubmit={submit}>
            <label className="adwField">
              <span className="fieldIcon" aria-hidden="true">✉</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="username"
                aria-label="Email address"
              />
            </label>

            <label className="adwField">
              <span className="fieldIcon" aria-hidden="true">▣</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                aria-label="Password"
              />
              <button className="eyeButton" type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </label>

            <div className="adwOptions">
              <label className="adwRemember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <button type="button" className="adwLink" onClick={() => router.push("/forgot-password")}>Forgot password?</button>
            </div>

            {error ? <div className="adwError" role="alert">{error}</div> : null}

            <button className="adwLoginButton" type="submit" disabled={loading}>
              {loading ? "Logging in…" : "Log In"}
            </button>

            <div className="adwDivider"><span>or continue with</span></div>

            <div className="adwSocials" aria-label="Social sign-in options">
              <button type="button" onClick={() => socialComingSoon("Google")} aria-label="Google sign-in coming soon">G</button>
              <button type="button" onClick={() => socialComingSoon("Facebook")} aria-label="Facebook sign-in coming soon">f</button>
              <button type="button" onClick={() => socialComingSoon("Apple")} aria-label="Apple sign-in coming soon">●</button>
            </div>

            <p className="adwSignup">Don&apos;t have an account? <button type="button" onClick={() => router.push("/signup")}>Sign Up</button></p>
          </form>
        </div>
      </section>

      <style jsx global>{`
        *{box-sizing:border-box}
        html,body{margin:0;min-height:100%;background:#fff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:#080808}
        button,input{font:inherit}
        button{touch-action:manipulation}
        .adwPage{min-height:100vh;display:grid;grid-template-columns:minmax(0,62%) minmax(420px,38%);background:#fff;overflow:hidden}
        .adwHero{position:relative;min-height:100vh;overflow:hidden;background:#fff}
        .adwPhoto{position:absolute;inset:8% -10% 9% 34%;background-image:url("${NAIROBI_IMAGE}");background-size:cover;background-position:48% center;filter:saturate(.92) contrast(.96)}
        .adwFade{position:absolute;inset:0;background:linear-gradient(90deg,#fff 0%,#fff 26%,rgba(255,255,255,.94) 36%,rgba(255,255,255,.56) 49%,rgba(255,255,255,.02) 72%),linear-gradient(180deg,rgba(255,255,255,.9) 0%,rgba(255,255,255,.08) 23%,rgba(255,255,255,0) 70%)}
        .adwHeroContent{position:relative;z-index:2;padding:3.2vw 0 12rem 3.5vw;max-width:900px}
        .adwBrand{border:0;background:transparent;padding:0;cursor:pointer;font-weight:850;letter-spacing:-.055em;font-size:clamp(38px,4.3vw,70px);line-height:.95}.adwBrand .any{color:#050505}.adwBrand .day{color:#e20b12}.adwBrand .work{color:#078430}
        .adwTagline{margin:.6rem 0 0;font-size:clamp(16px,1.55vw,26px);font-weight:500}
        .adwPitch{margin-top:clamp(3rem,5.8vh,5.6rem)}
        .adwPitch h1{margin:0;max-width:680px;font-size:clamp(52px,5.6vw,92px);line-height:.94;letter-spacing:-.055em;font-weight:850}.adwPitch h1 span{color:#e20b12}
        .adwCopy{font-size:clamp(18px,1.7vw,28px);line-height:1.45;margin:1.6rem 0 0;font-weight:450}
        .adwSimple{font-style:normal;font-size:clamp(18px,1.55vw,26px);margin:.55rem 0 0}.adwSimple strong{color:#e20b12}.adwSimple em{color:#078430;font-style:normal;font-weight:800}
        .adwBenefits{display:grid;gap:1.5rem;margin-top:2.2rem}.adwBenefit{display:flex;align-items:center;gap:1.05rem}.adwBenefitIcon{width:60px;height:60px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 7px 22px rgba(0,0,0,.11);font-size:30px}.adwBenefitIcon.pin{color:#078430;font-size:0}.adwBenefitIcon.pin:before{content:"";width:24px;height:31px;background:#078430;border-radius:55% 55% 55% 0;transform:rotate(-45deg);display:block;position:relative}.adwBenefitIcon.pin:after{content:"";width:8px;height:8px;border-radius:50%;background:#fff;position:absolute}.adwBenefitIcon.bolt{color:#078430}.adwBenefit div:last-child{display:flex;flex-direction:column;gap:.14rem}.adwBenefit b{font-size:clamp(18px,1.4vw,24px)}.adwBenefit span{font-size:clamp(14px,1.05vw,18px)}
        .adwBottom{position:absolute;z-index:3;left:0;right:0;bottom:0;height:clamp(130px,16vh,180px);background:#0b0d0c;color:#fff;display:flex;align-items:center;justify-content:center;gap:1rem;padding-left:26%;clip-path:ellipse(78% 76% at 48% 100%)}.adwBottom b,.adwBottom span{display:block}.adwBottom b{font-size:18px}.adwBottom span{font-size:15px;line-height:1.35;margin-top:.35rem}.adwEveryoneIcon{font-size:50px;line-height:1}
        .adwLoginSide{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2.1vw;background:linear-gradient(145deg,#f7fbff 0%,#fff 70%)}
        .adwCard{width:min(100%,560px);background:#fff;border-radius:28px;box-shadow:0 18px 55px rgba(18,33,52,.16);padding:clamp(30px,3vw,54px)}
        .adwCardHeader{text-align:center}.adwCardHeader h2{margin:0;font-size:clamp(34px,3.1vw,50px);letter-spacing:-.035em}.adwCardHeader p{margin:1.25rem 0 2.5rem;font-size:clamp(15px,1.15vw,19px)}
        .adwTricolor{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;width:72%;margin:1.2rem auto 0}.adwTricolor i{display:block;height:4px;border-radius:8px}.adwTricolor i:nth-child(1){background:#050505}.adwTricolor i:nth-child(2){background:#e20b12}.adwTricolor i:nth-child(3){background:#078430}
        .adwForm{display:grid;gap:1rem}.adwField{height:74px;border:1.5px solid #d6d9de;border-radius:12px;display:flex;align-items:center;padding:0 1rem;gap:.8rem;background:#fff;transition:.2s}.adwField:focus-within{border-color:#078430;box-shadow:0 0 0 3px rgba(7,132,48,.09)}.fieldIcon{width:30px;font-size:24px;color:#333}.adwField input{border:0;outline:0;flex:1;min-width:0;font-size:17px;background:transparent}.adwField input::placeholder{color:#a0a4aa}.eyeButton{border:0;background:transparent;color:#555;font-weight:650;cursor:pointer;padding:.5rem}
        .adwOptions{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin:.35rem 0}.adwRemember{display:flex;align-items:center;gap:.55rem;cursor:pointer;white-space:nowrap}.adwRemember input{width:20px;height:20px;accent-color:#078430}.adwLink{border:0;background:transparent;color:#078430;cursor:pointer;padding:.3rem 0}.adwError{font-size:14px;color:#b00020;background:#fff3f4;border:1px solid #ffd5da;border-radius:9px;padding:.7rem .85rem}
        .adwLoginButton{height:72px;border:0;border-radius:10px;background:#078430;color:#fff;font-size:23px;font-weight:700;cursor:pointer;margin-top:.25rem;box-shadow:0 7px 18px rgba(7,132,48,.16)}.adwLoginButton:hover{background:#066f2a}.adwLoginButton:disabled{opacity:.65;cursor:wait}
        .adwDivider{display:flex;align-items:center;gap:1rem;margin:.65rem 0}.adwDivider:before,.adwDivider:after{content:"";height:1px;background:#d7dadd;flex:1}.adwDivider span{font-size:15px;white-space:nowrap}
        .adwSocials{display:flex;justify-content:center;gap:2.1rem}.adwSocials button{width:66px;height:66px;border-radius:50%;border:1px solid #dfe2e6;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.04);cursor:pointer;font-weight:800;font-size:25px}.adwSocials button:nth-child(1){color:#4285f4}.adwSocials button:nth-child(2){color:#1877f2}.adwSocials button:nth-child(3){color:#000}
        .adwSignup{text-align:center;margin:1.2rem 0 0;font-size:17px}.adwSignup button{border:0;background:transparent;color:#078430;font-weight:750;cursor:pointer;padding:.2rem}
        @media(max-width:900px){
          .adwPage{display:block;min-height:100vh;overflow:auto;background:#f7faf8}.adwHero{min-height:310px;height:auto}.adwPhoto{inset:0;background-position:center 42%;opacity:.55}.adwFade{background:linear-gradient(90deg,#fff 0%,rgba(255,255,255,.9) 58%,rgba(255,255,255,.45) 100%),linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,.2))}.adwHeroContent{padding:28px 24px 42px}.adwBrand{font-size:44px}.adwTagline{font-size:16px}.adwPitch{margin-top:2rem}.adwPitch h1{font-size:44px;line-height:.98}.adwCopy{font-size:17px;margin-top:1rem}.adwSimple{font-size:17px}.adwBenefits{display:none}.adwBottom{display:none}.adwLoginSide{min-height:auto;padding:0 16px 28px;background:#f7faf8}.adwCard{margin-top:-18px;position:relative;z-index:4;border-radius:22px;padding:28px 20px;box-shadow:0 12px 34px rgba(18,33,52,.13)}.adwCardHeader h2{font-size:34px}.adwCardHeader p{margin:1rem 0 1.6rem}.adwField{height:62px}.adwLoginButton{height:60px;font-size:20px}.adwSocials{gap:1.3rem}.adwSocials button{width:56px;height:56px}.desktopBreak{display:none}
        }
        @media(max-width:430px){.adwPitch h1{font-size:39px}.adwBrand{font-size:40px}.adwOptions{align-items:flex-start}.adwRemember,.adwLink{font-size:14px}.adwSocials{gap:.8rem}.adwSignup{font-size:15px}}
      `}</style>
    </main>
  );
}
