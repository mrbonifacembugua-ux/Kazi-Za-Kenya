"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminShortcut() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      setChecking(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!active) return;
      if (!userData.user) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      const { data, error } = await supabase.rpc("admin_is_authorized");
      if (!active) return;
      setIsAdmin(!error && data === true);
      setChecking(false);
    }

    void checkAdmin();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void checkAdmin(), 0);
    });

    const onVisible = () => {
      if (document.visibilityState === "visible") void checkAdmin();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (checking || !isAdmin) return null;

  return (
    <div className="adminShortcut" role="navigation" aria-label="Administrator access">
      <div>
        <strong>Administrator account</strong>
        <span>You are signed in as an authorized AnyDayWork administrator.</span>
      </div>
      <button type="button" onClick={() => router.push("/admin")}>⚙ Open Admin Dashboard</button>
      <style jsx>{`
        .adminShortcut{max-width:900px;margin:0 auto 14px;background:#fff;border:1px solid #cfe1d3;border-radius:14px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:14px;box-shadow:0 8px 24px rgba(27,43,31,.08);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#17221b}
        .adminShortcut strong{display:block;color:#176b35;font-size:14px}.adminShortcut span{display:block;color:#68756d;font-size:12px;margin-top:2px}.adminShortcut button{border:0;background:#16803d;color:#fff;border-radius:10px;padding:10px 14px;font-weight:850;cursor:pointer;white-space:nowrap}
        @media(max-width:640px){.adminShortcut{margin:0 12px 12px;align-items:stretch;flex-direction:column}.adminShortcut button{width:100%}}
      `}</style>
    </div>
  );
}
