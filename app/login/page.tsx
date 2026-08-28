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
          <label className="remember" aria-label="Remember me"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /></label>
          <button type="button" className="hit forgot" aria-label="Forgot password" />
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
        .overlay{position:absolute;inset:0}
        .field{position:absolute;border:0;outline:0;background:transparent;color:#222;font:500 clamp(10px,1.15vw,18px) Arial,Helvetica,sans-serif;padding:0 1%;caret-color:#111}
        .field:focus{box-shadow:inset 0 0 0 2px rgba(0,0,0,.08);border-radius:12px}
        .email{left:33.5%;top:43.40%;width:37.7%;height:6.92%}
        .pass{left:33.5%;top:57.01%;width:33.6%;height:6.92%;padding-right:3%}
        .hit{position:absolute;border:0;background:transparent;cursor:pointer;padding:0}
        .eye{left:67%;top:57.01%;width:4.2%;height:6.92%}
        .remember{position:absolute;left:29.7%;top:66.09%;width:13.2%;height:4.65%;cursor:pointer}
        .remember input{position:absolute;left:0;top:0;width:24%;height:100%;opacity:0;cursor:pointer}
        .forgot{left:60.5%;top:66.09%;width:11.2%;height:4.65%}
        .login{left:29.8%;top:71.96%;width:41.4%;height:7.09%}
        .create{left:29.8%;top:84.58%;width:41.4%;height:7.09%}
        .back{left:40.5%;top:92.66%;width:18.9%;height:4.43%}
      `}</style>
    </main>
  );
}
