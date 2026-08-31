"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type PhotoSet = [string, string, string];

const crop = (id: string, extra = "") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=600&q=82${extra}`;

const sameThree = (url: string): PhotoSet => [url, url, url];

const PHOTOS: Record<string, PhotoSet> = {
  electrician: [
    crop("photo-1621905251189-08b45d6a269e", "&crop=faces"),
    crop("photo-1621905251189-08b45d6a269e", "&crop=entropy"),
    crop("photo-1621905251189-08b45d6a269e"),
  ],
  mechanic: [
    crop("photo-1486262715619-67b85e0b08d3"),
    crop("photo-1530046339160-ce3e530c7d2f"),
    crop("photo-1487754180451-c456f719a1fc"),
  ],
  bicycle: sameThree("https://unsplash.com/photos/A7Qi_0oqOqA/download?force=true"),
  tailor: [
    crop("photo-1687422808289-e721259c9eb4", "&crop=faces"),
    crop("photo-1687422808289-e721259c9eb4", "&crop=entropy"),
    crop("photo-1687422808289-e721259c9eb4"),
  ],
  carpenter: [
    crop("photo-1769353086138-19ee65291a04", "&crop=faces"),
    crop("photo-1769353086138-19ee65291a04", "&crop=entropy"),
    crop("photo-1769353086138-19ee65291a04"),
  ],
  cook: [
    crop("photo-1556911220-bff31c812dba"),
    crop("photo-1504674900247-0877df9cc836"),
    crop("photo-1547592180-85f173990554"),
  ],
  coffee: sameThree("https://unsplash.com/photos/vUfPn1JDZKI/download?force=true"),
  cleaner: [
    crop("photo-1581578731548-c64695cc6952"),
    crop("photo-1527515637462-cff94eecc1ac"),
    crop("photo-1563453392212-326f5e854473"),
  ],
  hair: [
    crop("photo-1560066984-138dadb4c035"),
    crop("photo-1522337660859-02fbefca4702"),
    crop("photo-1595476108010-b4d1f102b1b1"),
  ],
  construction: [
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Construction%20Work%20in%20Kenya.jpg?width=900",
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Masions%20working%20at%20residential%20house%20construction%20site.jpg?width=900",
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Men%20at%20work%20in%20a%20residential%20house%20construction%20site.jpg?width=900",
  ],
  warehouse: sameThree("https://unsplash.com/photos/1ghTMoMU7-A/download?force=true"),
  solar: sameThree("https://unsplash.com/photos/513dBrMJ_5w/download?force=true"),
  phone: sameThree("https://unsplash.com/photos/PZLgTUAhxMM/download?force=true"),
  ac: sameThree("https://unsplash.com/photos/l_Vn4HlFQVw/download?force=true"),
  retail: [
    crop("photo-1441986300917-64674bd600d8"),
    crop("photo-1604719312566-8912e9227c6a"),
    crop("photo-1555529669-e69e7aa0ba9a"),
  ],
};

function normalize(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function keyFor(text: string) {
  const q = normalize(text);
  if (!q) return "";
  if (q.includes("air-conditioning") || q.includes("air conditioning") || q.includes("cooling")) return "ac";
  if (q.includes("mobile-phone") || q.includes("mobile phone") || q.includes("phone repair") || q.includes("smartphone")) return "phone";
  if (q.includes("solar")) return "solar";
  if (q.includes("bicycle")) return "bicycle";
  if (q.includes("motorcycle")) return "mechanic";
  if (q.includes("mechanic") || q.includes("garage") || q.includes("vehicle") || q.includes("workshop")) return "mechanic";
  if (q.includes("electric") || q.includes("wiring")) return "electrician";
  if (q.includes("tailor") || q.includes("sewing") || q.includes("garment") || q.includes("stitch") || q.includes("alteration")) return "tailor";
  if (q.includes("carpenter") || q.includes("furniture") || q.includes("woodwork")) return "carpenter";
  if (q.includes("coffee")) return "coffee";
  if (q.includes("bakery") || q.includes("baker") || q.includes("cook") || q.includes("kitchen") || q.includes("restaurant") || q.includes("café") || q.includes("cafe") || q.includes("cater")) return "cook";
  if (q.includes("clean") || q.includes("housekeeping") || q.includes("guesthouse")) return "cleaner";
  if (q.includes("hair") || q.includes("salon") || q.includes("beauty") || q.includes("henna")) return "hair";
  if (q.includes("mason") || q.includes("construction") || q.includes("building") || q.includes("brick") || q.includes("renovation")) return "construction";
  if (q.includes("warehouse") || q.includes("freight") || q.includes("cargo") || q.includes("loading") || q.includes("logistics")) return "warehouse";
  if (q.includes("shop") || q.includes("retail") || q.includes("market") || q.includes("boutique") || q.includes("vendor")) return "retail";
  return "";
}

function applyPhotos(modal: HTMLElement) {
  const isJob = modal.classList.contains("anyday-job-modal");
  const roleText = isJob
    ? modal.querySelector<HTMLElement>(".anyday-job-detail b")?.textContent || ""
    : modal.querySelector<HTMLElement>(".anyday-worker-identity p")?.textContent || "";

  const key = keyFor(roleText);
  const photos = PHOTOS[key];
  if (!photos) return;

  modal.querySelectorAll<HTMLImageElement>(".anyday-work-grid .anyday-work-photo img").forEach((img, index) => {
    const next = photos[Math.min(index, photos.length - 1)] || photos[0];
    if (img.dataset.anydayMatchedPhoto === next) return;
    img.dataset.anydayMatchedPhoto = next;
    img.referrerPolicy = "no-referrer";
    img.src = next;
    img.alt = `${roleText || "Work"} — illustrative matching work example ${index + 1}`;
  });
}

export default function MarketplaceDemoPhotoFix() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    let queued = 0;

    const apply = () => {
      document.querySelectorAll<HTMLElement>(".anyday-worker-modal").forEach(applyPhotos);
    };

    const schedule = () => {
      window.clearTimeout(queued);
      queued = window.setTimeout(apply, 10);
    };

    apply();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", schedule, true);

    return () => {
      window.clearTimeout(queued);
      observer.disconnect();
      document.removeEventListener("click", schedule, true);
    };
  }, [pathname]);

  return null;
}
