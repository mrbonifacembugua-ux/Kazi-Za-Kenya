"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Opening your secure password reset…");

  useEffect(() => {
    let active = true;
    async function check() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (data.user) { setReady(true); setMessage(""); }
      else setMessage("This reset link is invalid or has expired. Please request a new password-reset email.");
    }
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") { setReady(true); setMessage(""); }
    });
    const timer = window.setTimeout(() => void check(), 500);
    return () => { active = false; clearTimeout(timer); listener.subscription.unsubscribe(); };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8) { setMessage("Use at least 8 characters for your new password."); return; }
    if (password !== confirm) { setMessage("The two passwords do not match."); return; }
    setBusy(true); setMessage("");
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    setMessage("Password changed successfully. You can now continue to Kazi za Kenya.");
    window.setTimeout(() => router.replace("/account"), 1200);
  }

  return <main><section><button className="back" onClick={() => router.push("/login")}>← Back to login</button><div className="brand">🇰🇪 Kazi za <b>Kenya</b></div><h1>Choose a new password</h1><p>Create a new password for your account. Your password is handled by our authentication system and is not stored in this page.</p>{message && <div className="msg">{message}</div>}{ready && <form onSubmit={submit}><label>New password<input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} /></label><label>Confirm new password<input required minLength={8} type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} /></label><button disabled={busy}>{busy ? "Changing password…" : "Change password"}</button></form>}{!ready && message.includes("expired") && <button className="request" onClick={() => router.push("/forgot-password")}>Request another reset link</button>}</section><style jsx>{`*{box-sizing:border-box}main{min-height:100vh;background:#f5f8f5;display:grid;place-items:center;padding:18px;font-family:Inter,system-ui;color:#17221b}section{width:min(520px,100%);background:#fff;border:1px solid #dce4dd;border-radius:20px;padding:30px;box-shadow:0 14px 45px #00000012}.back{border:0;background:none;color:#c91017;font-weight:750;cursor:pointer;padding:0 0 22px}.brand{font-size:21px;font-weight:850}.brand b{color:#16803d}h1{margin:24px 0 8px}p{color:#657168;line-height:1.55}.msg{background:#f0f7f2;padding:12px;border-radius:10px;font-size:13px;margin:16px 0}form,label{display:grid;gap:9px}form{gap:16px;margin-top:22px}label{font-size:13px;font-weight:800}input{height:48px;border:1px solid #ccd7cf;border-radius:11px;padding:0 13px;font:inherit}form button,.request{height:49px;border:0;border-radius:11px;background:#16803d;color:#fff;font-weight:850;cursor:pointer;width:100%;margin-top:10px}`}</style></main>;
}
