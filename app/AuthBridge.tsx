"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AuthBridge() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/login") return;

    async function handleSubmit(event: Event) {
      const form = event.target as HTMLFormElement | null;
      if (!form || form.getAttribute("aria-label") !== "Kazi za Kenya login form") return;

      event.preventDefault();
      event.stopPropagation();

      const emailInput = form.querySelector('input[aria-label="Email or phone number"]') as HTMLInputElement | null;
      const passwordInput = form.querySelector('input[aria-label="Password"]') as HTMLInputElement | null;
      const identifier = emailInput?.value.trim() ?? "";
      const password = passwordInput?.value ?? "";

      if (!identifier || !password) {
        window.alert("Please enter your email and password.");
        return;
      }

      // Email/password is the first production authentication method. Phone login
      // can be added later with OTP without changing the finished login artwork.
      if (!identifier.includes("@")) {
        window.alert("For now, please log in with your email address. Phone login will be added later.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email: identifier, password });
      if (error) {
        window.alert(error.message);
        return;
      }

      router.push("/");
      router.refresh();
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button") as HTMLButtonElement | null;
      if (!button) return;

      if (button.classList.contains("create")) {
        event.preventDefault();
        event.stopPropagation();
        router.push("/signup");
      }
    }

    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname, router]);

  return null;
}
