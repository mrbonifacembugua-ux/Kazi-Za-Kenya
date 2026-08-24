"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <main className="page">
      <section className="card">
        <button className="back" type="button" onClick={() => router.push("/")}>← Back to Kazi za Kenya</button>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p>Sign in to contact workers, respond to jobs and post requests.</p>
        <label>Email<input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
        <label>Password<input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Your password" /></label>
        <button className="primary" type="button" onClick={() => alert("Authentication is the next step. The website itself is now working.")}>{mode === "login" ? "Log in" : "Create account"}</button>
        <button className="switch" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Need an account? Register" : "Already have an account? Log in"}</button>
      </section>
      <style jsx>{`
        .page{min-height:100vh;background:#eef1ed;display:grid;place-items:center;padding:20px;font-family:Inter,system-ui,sans-serif;color:#17221b}.card{width:min(440px,100%);background:#fff;border:1px solid #dce4dc;border-radius:18px;padding:28px;box-shadow:0 20px 60px #0002}.back{border:0;background:none;color:#16803d;font-weight:800;cursor:pointer;padding:0;margin-bottom:22px}.card h1{margin:0 0 6px}.card p{color:#657168;font-size:13px;line-height:1.5;margin:0 0 22px}label{display:block;font-size:12px;font-weight:800;margin-bottom:12px}input{display:block;width:100%;margin-top:6px;padding:12px;border:1px solid #d8dfd9;border-radius:10px;outline:0;font:inherit}input:focus{border-color:#16803d}.primary{width:100%;padding:12px;border:0;border-radius:10px;background:#16803d;color:#fff;font-weight:800;cursor:pointer;margin-top:4px}.switch{width:100%;border:0;background:none;color:#16803d;font-weight:800;cursor:pointer;padding:14px 0 0}
      `}</style>
    </main>
  );
}
