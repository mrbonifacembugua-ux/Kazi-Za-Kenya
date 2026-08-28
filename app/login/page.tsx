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
        <form onSubmit={submit} className="overlay" aria-label="Kazi za Kenya login form">
          <input className="field email" aria-label="Email or phone number" autoComplete="username" />
          <input className="field pass" aria-label="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" />
          <button type="button" className="hit eye" aria-label="Show or hide password" onClick={() => setShowPassword(v => !v)} />
          <label className="remember" aria-label="Remember me">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
          </label>
          <button type="button" className="hit forgot" aria-label="Forgot password" />
          <button type="submit" className="hit login" aria-label="Log in" />
          <button type="button" className="hit create" aria-label="Create new account" />
          <button type="button" className="hit back" aria-label="Back to Kazi za Kenya" onClick={() => router.push("/")} />
        </form>
      </div>
      <style jsx global>{`
        *{box-sizing:border-box}
        html,body{margin:0;background:#fff}
        body{overflow-x:auto}
        .page{min-height:100vh;background:#fff}
        .stage{position:relative;width:100vw;min-width:960px;aspect-ratio:3/2;margin:0 auto}
        .bg{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:fill;user-select:none;pointer-events:none}
        .overlay{position:absolute;inset:0}
        .field{position:absolute;border:0;outline:0;background:transparent;color:#222;font:500 1.15vw Arial,Helvetica,sans-serif;padding:0 1vw;caret-color:#111}
        .field:focus{box-shadow:inset 0 0 0 2px rgba(0,0,0,.08);border-radius:12px}
        .email{left:33.5%;top:39.2%;width:37.7%;height:6.25%}
        .pass{left:33.5%;top:51.5%;width:33.6%;height:6.25%;padding-right:3vw}
        .hit{position:absolute;border:0;background:transparent;cursor:pointer;padding:0}
        .eye{left:67%;top:51.5%;width:4.2%;height:6.25%}
        .remember{position:absolute;left:29.7%;top:59.7%;width:13.2%;height:4.2%;cursor:pointer}
        .remember input{position:absolute;left:0;top:0;width:24%;height:100%;opacity:0;cursor:pointer}
        .forgot{left:60.5%;top:59.7%;width:11.2%;height:4.2%}
        .login{left:29.8%;top:65%;width:41.4%;height:6.4%}
        .create{left:29.8%;top:76.4%;width:41.4%;height:6.4%}
        .back{left:40.5%;top:83.7%;width:18.9%;height:4%}
        @media(max-width:959px){.stage{width:960px}.field{font-size:16px}}
      `}</style>
    </main>
  );
}
