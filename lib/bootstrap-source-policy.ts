export type BootstrapSourceStatus = "active" | "research_only" | "blocked" | "low_signal";

export type BootstrapSourcePolicy = {
  key: string;
  label: string;
  status: BootstrapSourceStatus;
  discovery: string;
  reason: string;
};

// This registry is intentionally conservative. Kazi may only automate a source
// when the discovery route is permitted for the intended commercial bootstrap use.
export const BOOTSTRAP_SOURCE_POLICIES: BootstrapSourcePolicy[] = [
  {
    key: "x",
    label: "X",
    status: "active",
    discovery: "official_api",
    reason: "Recent Search connector is implemented; activation requires a server-side credential and applicable content-display rights.",
  },
  {
    key: "facebook",
    label: "Facebook",
    status: "active",
    discovery: "independent_public_web_index",
    reason: "High-priority Kenyan bootstrap source. Kazi searches an independent web index for already-public Facebook URLs and does not log in, crawl private groups, or bypass Facebook controls.",
  },
  {
    key: "tiktok",
    label: "TikTok",
    status: "active",
    discovery: "independent_public_web_index",
    reason: "High-priority Kenyan bootstrap source. Kazi searches an independent web index for already-public TikTok URLs instead of performing unauthorized direct crawling.",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    status: "blocked",
    discovery: "none",
    reason: "Private/group conversations are not a public discovery corpus and are not crawled.",
  },
  {
    key: "bluesky",
    label: "Bluesky",
    status: "low_signal",
    discovery: "public_api",
    reason: "Public connector works, but live testing showed weak Kenyan blue-collar signal, so it is not used to seed inventory automatically.",
  },
];
