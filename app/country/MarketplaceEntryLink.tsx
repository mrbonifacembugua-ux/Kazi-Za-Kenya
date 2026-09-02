"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

const COUNTRY_STORAGE_KEY = "anydaywork-marketplace-country";
const POST_LOGIN_NEXT_KEY = "anydaywork-post-login-next";

function countryFromHref(href: string) {
  try {
    const url = new URL(href, "https://anydaywork.local");
    const code = (url.searchParams.get("country") || "").trim().toUpperCase();
    return /^[A-Z]{2}$/.test(code) ? code : "";
  } catch {
    return "";
  }
}

export default function MarketplaceEntryLink({ href, className, children }: Props) {
  const router = useRouter();

  async function openMarketplace(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const next = href.startsWith("/") && !href.startsWith("//") ? href : "/";
    const country = countryFromHref(next);

    try {
      if (country) window.localStorage.setItem(COUNTRY_STORAGE_KEY, country);
      window.localStorage.setItem(POST_LOGIN_NEXT_KEY, next);
    } catch {}

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      try { window.localStorage.removeItem(POST_LOGIN_NEXT_KEY); } catch {}
      router.push(next);
      return;
    }

    router.push(`/login?next=${encodeURIComponent(next)}`);
  }

  return (
    <a href={href} className={className} onClick={openMarketplace}>
      {children}
    </a>
  );
}
