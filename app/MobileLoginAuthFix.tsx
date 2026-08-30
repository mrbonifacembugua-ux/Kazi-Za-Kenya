"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function MobileLoginAuthFix() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/login") return;

    async function handleSubmit(event: Event) {
      const form = event.target as HTMLFormElement | null;
      if (!form?.classList.contains("mobileForm")) return;

      event.preventDefault();
      event.stopPropagation();

      const identifier = (form.querySelector("#mobile-email") as HTMLInputElement | null)?.value.trim() || "";
      const password = (form.querySelector("#mobile-password") as HTMLInputElement | null)?.value || "";
      const remember = (form.querySelector('.mobileRemember input[type="checkbox"]') as HTMLInputElement | null)?.checked || false;
      const submitButton = form.querySelector(".mobileLoginButton") as HTMLButtonElement | null;

      if (!identifier || !password) {
        window.alert("Please enter your email and password.");
        return;
      }

      if (!identifier.includes("@")) {
        window.alert("For now, please log in with your email address. Phone login will be added later.");
        return;
      }

      const originalText = submitButton?.textContent || "Log in →";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Logging in…";
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });

      if (error) {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
        window.alert("We could not log you in. Check your email and password, or confirm your email if you just registered.");
        return;
      }

      if (remember) window.localStorage.setItem("kzk-remembered-email", identifier);
      else window.localStorage.removeItem("kzk-remembered-email");

      router.replace("/");
      router.refresh();
    }

    document.addEventListener("submit", handleSubmit, true);
    return () => document.removeEventListener("submit", handleSubmit, true);
  }, [pathname, router]);

  return null;
}
