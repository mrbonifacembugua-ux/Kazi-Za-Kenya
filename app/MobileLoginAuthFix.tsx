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
      const isMobile = form?.classList.contains("mobileForm") || false;
      const isDesktop = form?.classList.contains("overlay") || false;
      if (!form || (!isMobile && !isDesktop)) return;

      event.preventDefault();
      event.stopPropagation();

      const identifier = isMobile
        ? (form.querySelector("#mobile-email") as HTMLInputElement | null)?.value.trim() || ""
        : (form.querySelector(".field.email") as HTMLInputElement | null)?.value.trim() || "";

      const password = isMobile
        ? (form.querySelector("#mobile-password") as HTMLInputElement | null)?.value || ""
        : (form.querySelector(".field.pass") as HTMLInputElement | null)?.value || "";

      const remember = isMobile
        ? (form.querySelector('.mobileRemember input[type="checkbox"]') as HTMLInputElement | null)?.checked || false
        : (form.querySelector('.remember input[type="checkbox"]') as HTMLInputElement | null)?.checked || false;

      const mobileSubmitButton = form.querySelector(".mobileLoginButton") as HTMLButtonElement | null;
      const desktopSubmitButton = form.querySelector(".hit.login") as HTMLButtonElement | null;
      const submitButton = isMobile ? mobileSubmitButton : desktopSubmitButton;

      if (!identifier || !password) {
        window.alert("Please enter your email and password.");
        return;
      }

      if (!identifier.includes("@")) {
        window.alert("For now, please log in with your email address. Phone login will be added later.");
        return;
      }

      const originalText = mobileSubmitButton?.textContent || "Log in →";
      if (submitButton) submitButton.disabled = true;
      if (mobileSubmitButton) mobileSubmitButton.textContent = "Logging in…";

      const { error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });

      if (error) {
        if (submitButton) submitButton.disabled = false;
        if (mobileSubmitButton) mobileSubmitButton.textContent = originalText;
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
