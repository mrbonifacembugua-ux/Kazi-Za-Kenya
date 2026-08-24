"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://pnqmqxeuzcodnxdixnvc.supabase.co", "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l");

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setMessage(""); setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        router.replace("/"); router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        if (data.session) { router.replace("/"); router.refresh(); }
        else { setMessage("Account created. Check your email to confirm your account, then log in."); setMode("login"); }
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to authenticate. Please try again."); }
    finally { setLoading(false); }
  }

  return <main className="page"><form className="card" onSubmit={submit}>
    <button className="back" type="button" onClick={() => router.push("/")}>← Back to Kazi za Kenya</button>
    <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
    <p>Sign in to contact workers, respond to jobs and post requests.</p>
    <label>Email<input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" /></label>
    <label>Password<input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" /></label>
    {error && <div className="error" role="alert">{error}</div>}
    {message && <div className="message" role="status">{message}</div>}
    <button className="primary" type="submit" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button>
    <button className="switch" type="button" onClick={()=>{setError("");setMessage("");setMode(mode === "login" ? "register" : "login")}}>{mode === "login" ? "Need an account? Register" : "Already have an account? Log in"}</button>
  </form><style jsx>{`.page{min-height:100vh;background:#eef1ed;display:grid;place-items:center;padding:20px;font-family:Inter,system-ui,sans-serif;color:#17221b}.card{width:min(440px,100%);background:#fff;border:1px solid #dce4dc;border-radius:18px;padding:28px;box-shadow:0 20px 60px #0002}.back{border:0;background:none;color:#16803d;font-weight:800;cursor:pointer;padding:0;margin-bottom:22px}.card h1{margin:0 0 6px}.card p{color:#657168;font-size:13px;line-height:1.5;margin:0 0 22px}label{display:block;font-size:12px;font-weight:800;margin-bottom:12px}input{display:block;width:100%;margin-top:6px;padding:12px;border:1px solid #d8dfd9;border-radius:10px;outline:0;font:inherit}input:focus{border-color:#16803d}.primary{width:100%;padding:12px;border:0;border-radius:10px;background:#16803d;color:#fff;font-weight:800;cursor:pointer;margin-top:4px}.primary:disabled{opacity:.65;cursor:wait}.switch{width:100%;border:0;background:none;color:#16803d;font-weight:800;cursor:pointer;padding:14px 0 0}.error{background:#fff0f0;color:#b42318;border:1px solid #f4c7c7;border-radius:9px;padding:10px;font-size:12px;margin:4px 0 10px}.message{background:#eefaf1;color:#166534;border:1px solid #c8e6cf;border-radius:9px;padding:10px;font-size:12px;margin:4px 0 10px}`}</style></main>;
}
