"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OriginalHome from "./page-original";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button");
      if (!button) return;
      const text = button.textContent?.replace(/\s+/g, " ").trim() || "";
      if (text.includes("I need something") || text.includes("Post what I need")) {
        event.preventDefault();
        event.stopPropagation();
        router.push("/need-service");
        return;
      }
      if (text.includes("I offer a service") || text.includes("Post a service")) {
        event.preventDefault();
        event.stopPropagation();
        router.push("/offer-service");
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router]);

  return <OriginalHome />;
}
