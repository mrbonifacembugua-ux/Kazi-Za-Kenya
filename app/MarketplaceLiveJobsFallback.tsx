"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MarketplaceLiveJobsFallback() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let stopped = false;
    let attempts = 0;

    const timer = window.setInterval(() => {
      if (stopped) return;
      attempts += 1;

      const live = document.querySelector<HTMLElement>(".kzk-live-wrap");
      if (!live) {
        if (attempts > 80) window.clearInterval(timer);
        return;
      }

      const note = Array.from(live.querySelectorAll<HTMLElement>(".note")).find((node) =>
        /no live jobs match|no located jobs are within/i.test(node.textContent || "")
      );

      if (!note) {
        if (live.querySelector(".job")) window.clearInterval(timer);
        return;
      }

      const buttons = Array.from(live.querySelectorAll<HTMLButtonElement>(".modes button"));
      const anywhere = buttons.find((button) => /anywhere in kenya/i.test(button.textContent || ""));

      if (anywhere && !anywhere.classList.contains("on")) anywhere.click();
      window.clearInterval(timer);
    }, 250);

    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [pathname]);

  return null;
}
