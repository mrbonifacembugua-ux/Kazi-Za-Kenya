import { NextRequest, NextResponse } from "next/server";
import { normalizeDiscoveryPosts, type RawDiscoveryPost } from "../../../../lib/external-discovery";
import { BOOTSTRAP_SOURCE_POLICIES } from "../../../../lib/bootstrap-source-policy";

const X_RECENT_SEARCH_URL = "https://api.x.com/2/tweets/search/recent";
const BLUESKY_SEARCH_URL = "https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts";
const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";
const GOOGLE_NEWS_RSS_URL = "https://news.google.com/rss/search";

const X_QUERY = [
  "(mjengo OR fundi OR plumber OR electrician OR carpenter OR welder OR mechanic OR cleaner OR househelp OR driver OR rider OR waiter OR cook OR gardener OR mason OR painter OR kibarua)",
  '("looking for work" OR "looking for a job" OR "natafuta kazi" OR "nahitaji kazi" OR hiring OR needed OR required OR "job available" OR tunatafuta)',
  "(Kenya OR Nairobi OR Mombasa OR Kisumu OR Nakuru OR Eldoret OR Kiambu OR Thika OR Rongai OR Kitengela)",
  "-is:retweet",
].join(" ");

const BLUESKY_QUERIES = ["natafuta kazi Kenya", "fundi Kenya", "mjengo Kenya", "hiring Kenya plumber electrician driver cleaner", "looking for work Kenya driver cleaner mason"];

const INDEXED_SOCIAL_QUERIES = [
  '"natafuta kazi" OR "nahitaji kazi" OR "natafuta kibarua" fundi OR mjengo OR cleaner OR driver OR househelp OR plumber OR electrician',
  'hiring OR "job available" OR tunatafuta OR inahitajika fundi OR mason OR plumber OR electrician OR cleaner OR driver OR rider',
  'Nairobi OR Mombasa OR Kisumu OR Nakuru OR Eldoret OR Kiambu OR Thika fundi OR mjengo OR cleaner OR driver OR plumber',
];

type XPost = { id: string; text: string; author_id?: string; created_at?: string };
type XUser = { id: string; username?: string; name?: string };
type BlueskyPost = { uri: string; author?: { handle?: string; displayName?: string }; record?: { text?: string; createdAt?: string } };
type BraveResult = { title?: string; url?: string; description?: string; age?: string; page_age?: string };
type BravePayload = { web?: { results?: BraveResult[] } };

type DiscoveryResult = {
  source: string;
  configured: boolean;
  posts: RawDiscoveryPost[];
  error: string | null;
  method?: string;
};

async function discoverX(limit: number): Promise<DiscoveryResult> {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) return { source: "x", configured: false, posts: [], error: "X_BEARER_TOKEN is not configured", method: "official_api" };
  const url = new URL(X_RECENT_SEARCH_URL);
  url.searchParams.set("query", X_QUERY);
  url.searchParams.set("max_results", String(Math.max(10, Math.min(100, limit))));
  url.searchParams.set("tweet.fields", "created_at,author_id");
  url.searchParams.set("expansions", "author_id");
  url.searchParams.set("user.fields", "username,name");
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) return { source: "x", configured: true, posts: [], error: `X returned HTTP ${response.status}`, method: "official_api" };
  const payload = await response.json() as { data?: XPost[]; includes?: { users?: XUser[] } };
  const users = new Map((payload.includes?.users || []).map(user => [user.id, user]));
  const posts: RawDiscoveryPost[] = (payload.data || []).map(post => {
    const user = post.author_id ? users.get(post.author_id) : undefined;
    const username = user?.username || null;
    return { source_key: "x", source_name: "X", source_url: username ? `https://x.com/${username}/status/${post.id}` : `https://x.com/i/web/status/${post.id}`, text: post.text, posted_at: post.created_at || null, author_label: user?.name || username };
  });
  return { source: "x", configured: true, posts, error: null, method: "official_api" };
}

function blueskyUrl(post: BlueskyPost) {
  const handle = post.author?.handle;
  const rkey = post.uri.split("/").at(-1);
  return handle && rkey ? `https://bsky.app/profile/${handle}/post/${rkey}` : "https://bsky.app";
}

async function discoverBluesky(limit: number): Promise<DiscoveryResult> {
  const perQuery = Math.max(10, Math.min(25, Math.ceil(limit / BLUESKY_QUERIES.length)));
  const settled = await Promise.allSettled(BLUESKY_QUERIES.map(async query => {
    const url = new URL(BLUESKY_SEARCH_URL);
    url.searchParams.set("q", query); url.searchParams.set("limit", String(perQuery)); url.searchParams.set("sort", "latest");
    const response = await fetch(url, { headers: { "User-Agent": "KaziZaKenya/1.0 (+public job discovery)" }, cache: "no-store" });
    if (!response.ok) throw new Error(`Bluesky returned HTTP ${response.status}`);
    return ((await response.json()) as { posts?: BlueskyPost[] }).posts || [];
  }));
  const errors = settled.filter((r): r is PromiseRejectedResult => r.status === "rejected").map(r => r.reason instanceof Error ? r.reason.message : "Bluesky request failed");
  const found = settled.filter((r): r is PromiseFulfilledResult<BlueskyPost[]> => r.status === "fulfilled").flatMap(r => r.value);
  const seen = new Set<string>();
  const posts: RawDiscoveryPost[] = found.filter(post => { if (!post.uri || seen.has(post.uri)) return false; seen.add(post.uri); return true; }).slice(0, limit).map(post => ({ source_key: "bluesky", source_name: "Bluesky", source_url: blueskyUrl(post), text: post.record?.text || "", posted_at: post.record?.createdAt || null, author_label: post.author?.displayName || post.author?.handle || null }));
  return { source: "bluesky", configured: true, posts, error: errors.length === BLUESKY_QUERIES.length ? errors[0] : (errors.length ? `${errors.length} search request(s) failed` : null), method: "public_api" };
}

function hostnameMatches(rawUrl: string, platform: "facebook" | "tiktok") {
  try {
    const host = new URL(rawUrl).hostname.toLowerCase();
    if (platform === "facebook") return host === "facebook.com" || host.endsWith(".facebook.com");
    return host === "tiktok.com" || host.endsWith(".tiktok.com");
  } catch {
    return false;
  }
}

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

function extractPlatformUrl(value: string, platform: "facebook" | "tiktok") {
  const decoded = decodeXml(value);
  const urls = decoded.match(/https?:\/\/[^\s"'<>]+/gi) || [];
  return urls.map(url => url.replace(/&amp;/g, "&")).find(url => hostnameMatches(url, platform)) || null;
}

async function discoverFreeIndexedSocial(platform: "facebook" | "tiktok", limit: number): Promise<DiscoveryResult> {
  const domain = platform === "facebook" ? "facebook.com" : "tiktok.com";
  const sourceName = platform === "facebook" ? "Facebook" : "TikTok";
  const perQuery = Math.max(5, Math.min(20, Math.ceil(limit / INDEXED_SOCIAL_QUERIES.length)));

  const settled = await Promise.allSettled(INDEXED_SOCIAL_QUERIES.map(async baseQuery => {
    const url = new URL(GOOGLE_NEWS_RSS_URL);
    url.searchParams.set("q", `site:${domain} (${baseQuery}) Kenya when:30d`);
    url.searchParams.set("hl", "en-KE");
    url.searchParams.set("gl", "KE");
    url.searchParams.set("ceid", "KE:en");
    const response = await fetch(url, {
      headers: { "User-Agent": "KaziZaKenya/1.0 (+public indexed job discovery)" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Public index RSS returned HTTP ${response.status}`);
    const xml = await response.text();
    const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
    return itemBlocks.slice(0, perQuery).map(block => {
      const title = stripTags(extractTag(block, "title"));
      const descriptionRaw = extractTag(block, "description");
      const description = stripTags(descriptionRaw);
      const directUrl = extractPlatformUrl(`${descriptionRaw} ${extractTag(block, "link")}`, platform);
      const pubDate = extractTag(block, "pubDate");
      return { title, description, directUrl, pubDate };
    });
  }));

  const errors = settled.filter((r): r is PromiseRejectedResult => r.status === "rejected").map(r => r.reason instanceof Error ? r.reason.message : "Public index RSS request failed");
  const found = settled.filter((r): r is PromiseFulfilledResult<Array<{ title: string; description: string; directUrl: string | null; pubDate: string }>> => r.status === "fulfilled").flatMap(r => r.value);
  const seen = new Set<string>();
  const posts: RawDiscoveryPost[] = found
    .filter(item => {
      if (!item.directUrl || seen.has(item.directUrl)) return false;
      seen.add(item.directUrl);
      return true;
    })
    .slice(0, limit)
    .map(item => ({
      source_key: `${platform}_indexed_free`,
      source_name: `${sourceName} (public index)`,
      source_url: item.directUrl || "",
      text: `${item.title}. ${item.description}`.trim(),
      posted_at: item.pubDate || null,
      author_label: null,
    }));

  return {
    source: platform,
    configured: true,
    posts,
    error: errors.length === INDEXED_SOCIAL_QUERIES.length ? errors[0] : (errors.length ? `${errors.length} public index request(s) failed` : null),
    method: "free_public_index_rss",
  };
}

async function discoverIndexedSocial(platform: "facebook" | "tiktok", limit: number): Promise<DiscoveryResult> {
  const token = process.env.BRAVE_SEARCH_API_KEY;
  if (!token) return discoverFreeIndexedSocial(platform, limit);

  const domain = platform === "facebook" ? "facebook.com" : "tiktok.com";
  const sourceName = platform === "facebook" ? "Facebook" : "TikTok";
  const perQuery = Math.max(5, Math.min(20, Math.ceil(limit / INDEXED_SOCIAL_QUERIES.length)));
  const settled = await Promise.allSettled(INDEXED_SOCIAL_QUERIES.map(async baseQuery => {
    const url = new URL(BRAVE_WEB_SEARCH_URL);
    url.searchParams.set("q", `site:${domain} (${baseQuery}) Kenya`);
    url.searchParams.set("count", String(perQuery));
    url.searchParams.set("country", "KE");
    url.searchParams.set("search_lang", "en");
    url.searchParams.set("safesearch", "strict");
    url.searchParams.set("freshness", "pm");
    const response = await fetch(url, {
      headers: { Accept: "application/json", "X-Subscription-Token": token },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Brave Search returned HTTP ${response.status}`);
    const payload = await response.json() as BravePayload;
    return payload.web?.results || [];
  }));

  const errors = settled.filter((r): r is PromiseRejectedResult => r.status === "rejected").map(r => r.reason instanceof Error ? r.reason.message : "Indexed social search failed");
  const found = settled.filter((r): r is PromiseFulfilledResult<BraveResult[]> => r.status === "fulfilled").flatMap(r => r.value);
  const seen = new Set<string>();
  const posts: RawDiscoveryPost[] = found
    .filter(result => {
      const rawUrl = result.url || "";
      if (!rawUrl || !hostnameMatches(rawUrl, platform) || seen.has(rawUrl)) return false;
      seen.add(rawUrl);
      return true;
    })
    .slice(0, limit)
    .map(result => ({
      source_key: `${platform}_indexed`,
      source_name: `${sourceName} (public web index)`,
      source_url: result.url || "",
      text: `${result.title || ""}. ${result.description || ""}`.trim(),
      posted_at: result.page_age || null,
      author_label: null,
    }));

  return { source: platform, configured: true, posts, error: errors.length === INDEXED_SOCIAL_QUERIES.length ? errors[0] : (errors.length ? `${errors.length} indexed search request(s) failed` : null), method: "brave_public_web_index" };
}

export async function GET(request: NextRequest) {
  const requested = (request.nextUrl.searchParams.get("source") || "all").toLowerCase();
  const limitRaw = Number(request.nextUrl.searchParams.get("limit") || "50");
  const limit = Number.isFinite(limitRaw) ? Math.max(10, Math.min(100, Math.floor(limitRaw))) : 50;
  if (!["all", "x", "bluesky", "facebook", "tiktok"].includes(requested)) return NextResponse.json({ ok: false, error: "Unsupported source" }, { status: 400 });

  const results: DiscoveryResult[] = [];
  if (requested === "all" || requested === "x") results.push(await discoverX(limit));
  if (requested === "all" || requested === "facebook") results.push(await discoverIndexedSocial("facebook", limit));
  if (requested === "all" || requested === "tiktok") results.push(await discoverIndexedSocial("tiktok", limit));
  if (requested === "all" || requested === "bluesky") results.push(await discoverBluesky(limit));

  const items = normalizeDiscoveryPosts(results.flatMap(result => result.posts));
  return NextResponse.json({
    ok: true,
    checked_at: new Date().toISOString(),
    strategy: "bootstrap_blue_collar_social_discovery",
    bootstrap_sources: BOOTSTRAP_SOURCE_POLICIES,
    sources: results.map(result => ({ source: result.source, configured: result.configured, method: result.method, fetched: result.posts.length, error: result.error })),
    count: items.length,
    jobs: items.filter(item => item.kind === "job"),
    workers: items.filter(item => item.kind === "worker"),
  }, { headers: { "Cache-Control": "private, no-store" } });
}
