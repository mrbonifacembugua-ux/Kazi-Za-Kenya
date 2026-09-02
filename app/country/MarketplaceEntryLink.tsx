"use client";

import type { ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

function showAnyDayWorkShield() {
  if (typeof document === "undefined") return;
  if (document.getElementById("adw-marketplace-entry-shield")) return;

  const shield = document.createElement("div");
  shield.id = "adw-marketplace-entry-shield";
  shield.setAttribute("role", "status");
  shield.setAttribute("aria-label", "Opening AnyDayWork marketplace");
  shield.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:2147483647",
    "display:flex",
    "flex-direction:column",
    "align-items:center",
    "justify-content:center",
    "gap:12px",
    "background:#fff",
    "font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
  ].join(";");

  const brand = document.createElement("div");
  brand.style.cssText = "display:flex;align-items:center;font-size:clamp(34px,7vw,52px);font-weight:950;line-height:1;letter-spacing:-.05em";

  const any = document.createElement("span");
  any.textContent = "Any";
  any.style.color = "#111";

  const day = document.createElement("span");
  day.textContent = "Day";
  day.style.color = "#d21e26";

  const work = document.createElement("span");
  work.textContent = "Work";
  work.style.color = "#08783b";

  const tagline = document.createElement("div");
  tagline.textContent = "Find work near you. Any day.";
  tagline.style.cssText = "color:#657168;font-size:14px;font-weight:650";

  brand.append(any, day, work);
  shield.append(brand, tagline);
  document.body.appendChild(shield);

  window.setTimeout(() => {
    document.getElementById("adw-marketplace-entry-shield")?.remove();
  }, 1800);
}

export default function MarketplaceEntryLink({ href, className, children }: Props) {
  return (
    <a
      href={href}
      className={className}
      onPointerDown={showAnyDayWorkShield}
      onClick={showAnyDayWorkShield}
    >
      {children}
    </a>
  );
}
