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
    status: "research_only",
    discovery: "approved_or_indexed_public_routes_only",
    reason: "High-priority Kenyan bootstrap source, but Kazi must not automate Facebook pages, groups, or posts through unauthorized scraping.",
  },
  {
    key: "tiktok",
    label: "TikTok",
    status: "research_only",
    discovery: "approved_api_or_permitted_public_routes_only",
    reason: "High-priority Kenyan bootstrap source; broad public-video Research API access is restricted and unauthorized crawling is not used.",
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
