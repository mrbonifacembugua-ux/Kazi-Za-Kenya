"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "anydaywork-marketplace-country";

function selectedCountryName() {
  const select = document.querySelector<HTMLSelectElement>(".anyday-country-picker select");
  const option = select?.selectedOptions?.[0];
  const name = (option?.textContent || "").trim();
  if (name) return name;

  try {
    const code = String(window.localStorage.getItem(STORAGE_KEY) || "").trim().toUpperCase();
    return code === "KE" ? "Kenya" : code;
  } catch {
    return "Kenya";
  }
}

function setReactInputValue(input: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  descriptor?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

export default function MarketplaceCountryUiSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let lastAppliedLocation = "Nairobi, Kenya";
    let timer = 0;

    const apply = () => {
      const country = selectedCountryName();
      if (!country) return;

      const locationInputs = Array.from(document.querySelectorAll<HTMLInputElement>("input"));
      const locationInput = locationInputs.find((input) => {
        const value = (input.value || "").trim();
        const placeholder = (input.placeholder || "").toLowerCase();
        return value === "Nairobi, Kenya" || value === lastAppliedLocation || placeholder.includes("area") || placeholder.includes("location");
      });

      if (locationInput) {
        const current = (locationInput.value || "").trim();
        if (current === "Nairobi, Kenya" || current === lastAppliedLocation) {
          setReactInputValue(locationInput, country);
          lastAppliedLocation = country;
        }
      }

      document.querySelectorAll<HTMLElement>(".kzk-live-wrap button").forEach((button) => {
        const text = (button.textContent || "").replace(/\s+/g, " ").trim();
        if (/Anywhere in /i.test(text)) button.textContent = `🌍 Anywhere in ${country}`;
      });

      document.querySelectorAll<HTMLElement>(".kzk-live-wrap small, .kzk-live-wrap .note").forEach((node) => {
        const text = node.textContent || "";
        if (text.includes("across Kenya")) node.textContent = text.replace(/across Kenya/g, `across ${country}`);
        if (text.includes("Anywhere in Kenya")) node.textContent = (node.textContent || "").replace(/Anywhere in Kenya/g, `Anywhere in ${country}`);
      });
    };

    const onCountryChanged = () => {
      window.setTimeout(apply, 0);
      window.setTimeout(apply, 150);
      window.setTimeout(apply, 500);
    };

    window.addEventListener("anydaywork:country-changed", onCountryChanged);
    apply();
    timer = window.setInterval(apply, 5000);

    return () => {
      window.removeEventListener("anydaywork:country-changed", onCountryChanged);
      window.clearInterval(timer);
    };
  }, [pathname]);

  return null;
}
