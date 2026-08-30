import { NextRequest, NextResponse } from "next/server";
import { normalizeDiscoveryPosts, type RawDiscoveryPost } from "../../../../lib/external-discovery";

const GOOGLE_NEWS_RSS_URL = "https://news.google.com/rss/search";

const OPEN_WEB_QUERIES = [
  '("house help needed" OR "cleaner needed" OR "driver needed" OR "rider needed" OR "casual workers needed" OR "labourers needed" OR "fundi needed" OR "mason needed" OR "plumber needed" OR "electrician needed") Kenya when:30d',
  '(tunatafuta OR inahitajika OR wanahitajika) (fundi OR mjengo OR cleaner OR househelp OR driver OR rider OR plumber OR electrician OR carpenter OR welder OR mechanic) Kenya when:30d',
  '("job available" OR hiring OR vacancy) (cleaner OR driver OR rider OR cook OR waiter OR gardener OR mason OR plumber OR electrician OR carpenter OR welder OR mechanic) (Nairobi OR Kiambu OR Mombasa OR Nakuru OR Kisumu OR Eldoret) when:30d',
  '("natafuta kazi" OR "nahitaji kazi" OR "natafuta kibarua" OR "looking for work") (fundi OR mjengo OR cleaner OR househelp OR driver OR rider OR plumber OR electrician OR carpenter OR welder OR mechanic) Kenya when:30d',
];

type RssLead = {
  title: string;
  description: string;
  link: string;
  publisher: string | null;
  publishedAt: string | null;
};

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value: string) {
  return decodeXml(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]).trim() : "";
}

function isExcludedHost(rawUrl: string) {
  try {
    const host = new URL(rawUrl).hostname.toLowerCase();
    return ["facebook.com", "tiktok.com", "telegram.org", "t.me", "x.com"].some(domain => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

async function fetchQuery(query: string, perQuery: number): Promise<RssLead[]> {
  const url = new URL(GOOGLE_NEWS_RSS_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("hl", "en-KE");
  url.searchParams.set("gl", "KE");
  url.searchParams.set("ceid", "KE:en");

  const response = await fetch(url, {
    headers: { "User-Agent": "KaziZaKenya/1.0 (+public open-web job discovery)" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Open-web RSS returned HTTP ${response.status}`);

  const xml = await response.text();
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return itemBlocks.slice(0, perQuery).map(block => {
    const title = stripTags(extractTag(block, "title"));
    const description = stripTags(extractTag(block, "description"));
    const link = extractTag(block, "link");
    const publisher = stripTags(extractTag(block, "source")) || null;
    const publishedAt = extractTag(block, "pubDate") || null;
    return { title, description, link, publisher, publishedAt };
  });
}

export async function GET(request: NextRequest) {
  const limitRaw = Number(request.nextUrl.searchParams.get("limit") || "50");
  const limit = Number.isFinite(limitRaw) ? Math.max(10, Math.min(100, Math.floor(limitRaw))) : 50;
  const perQuery = Math.max(5, Math.min(25, Math.ceil(limit / OPEN_WEB_QUERIES.length)));

  const settled = await Promise.allSettled(OPEN_WEB_QUERIES.map(query => fetchQuery(query, perQuery)));
  const errors = settled
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map(result => result.reason instanceof Error ? result.reason.message : "Open-web discovery request failed");
  const leads = settled
    .filter((result): result is PromiseFulfilledResult<RssLead[]> => result.status === "fulfilled")
    .flatMap(result => result.value);

  const seen = new Set<string>();
  const rawPosts: RawDiscoveryPost[] = leads
    .filter(lead => {
      if (!lead.link || seen.has(lead.link) || isExcludedHost(lead.link)) return false;
      seen.add(lead.link);
      return true;
    })
    .slice(0, limit)
    .map(lead => ({
      source_key: "openweb_indexed",
      source_name: lead.publisher ? `${lead.publisher} (public web index)` : "Public web index",
      source_url: lead.link,
      text: `${lead.title}. ${lead.description}`.trim(),
      posted_at: lead.publishedAt,
      author_label: null,
    }));

  const items = normalizeDiscoveryPosts(rawPosts);

  return NextResponse.json({
    ok: true,
    checked_at: new Date().toISOString(),
    strategy: "zero_cost_open_web_bootstrap_discovery",
    method: "public_rss_index",
    fetched: rawPosts.length,
    count: items.length,
    jobs: items.filter(item => item.kind === "job"),
    workers: items.filter(item => item.kind === "worker"),
    errors,
    note: "Read-only discovery. No database writes are performed by this endpoint.",
  }, { headers: { "Cache-Control": "private, no-store" } });
}
