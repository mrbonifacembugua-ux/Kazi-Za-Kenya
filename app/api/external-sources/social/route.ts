import { NextRequest, NextResponse } from "next/server";
import { normalizeDiscoveryPosts, type RawDiscoveryPost } from "../../../../lib/external-discovery";
import { BOOTSTRAP_SOURCE_POLICIES } from "../../../../lib/bootstrap-source-policy";

const X_RECENT_SEARCH_URL = "https://api.x.com/2/tweets/search/recent";
const BLUESKY_SEARCH_URL = "https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts";

const X_QUERY = [
  "(mjengo OR fundi OR plumber OR electrician OR carpenter OR welder OR mechanic OR cleaner OR househelp OR driver OR rider OR waiter OR cook OR gardener OR mason OR painter OR kibarua)",
  '("looking for work" OR "looking for a job" OR "natafuta kazi" OR "nahitaji kazi" OR hiring OR needed OR required OR "job available" OR tunatafuta)',
  "(Kenya OR Nairobi OR Mombasa OR Kisumu OR Nakuru OR Eldoret OR Kiambu OR Thika OR Rongai OR Kitengela)",
  "-is:retweet",
].join(" ");

const BLUESKY_QUERIES = ["natafuta kazi Kenya", "fundi Kenya", "mjengo Kenya", "hiring Kenya plumber electrician driver cleaner", "looking for work Kenya driver cleaner mason"];

type XPost = { id: string; text: string; author_id?: string; created_at?: string };
type XUser = { id: string; username?: string; name?: string };
type BlueskyPost = { uri: string; author?: { handle?: string; displayName?: string }; record?: { text?: string; createdAt?: string } };

async function discoverX(limit: number) {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) return { source: "x", configured: false, posts: [] as RawDiscoveryPost[], error: "X_BEARER_TOKEN is not configured" };
  const url = new URL(X_RECENT_SEARCH_URL);
  url.searchParams.set("query", X_QUERY);
  url.searchParams.set("max_results", String(Math.max(10, Math.min(100, limit))));
  url.searchParams.set("tweet.fields", "created_at,author_id");
  url.searchParams.set("expansions", "author_id");
  url.searchParams.set("user.fields", "username,name");
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) return { source: "x", configured: true, posts: [] as RawDiscoveryPost[], error: `X returned HTTP ${response.status}` };
  const payload = await response.json() as { data?: XPost[]; includes?: { users?: XUser[] } };
  const users = new Map((payload.includes?.users || []).map(user => [user.id, user]));
  const posts: RawDiscoveryPost[] = (payload.data || []).map(post => {
    const user = post.author_id ? users.get(post.author_id) : undefined;
    const username = user?.username || null;
    return { source_key: "x", source_name: "X", source_url: username ? `https://x.com/${username}/status/${post.id}` : `https://x.com/i/web/status/${post.id}`, text: post.text, posted_at: post.created_at || null, author_label: user?.name || username };
  });
  return { source: "x", configured: true, posts, error: null as string | null };
}

function blueskyUrl(post: BlueskyPost) {
  const handle = post.author?.handle;
  const rkey = post.uri.split("/").at(-1);
  return handle && rkey ? `https://bsky.app/profile/${handle}/post/${rkey}` : "https://bsky.app";
}

async function discoverBluesky(limit: number) {
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
  return { source: "bluesky", configured: true, posts, error: errors.length === BLUESKY_QUERIES.length ? errors[0] : (errors.length ? `${errors.length} search request(s) failed` : null) };
}

export async function GET(request: NextRequest) {
  const requested = (request.nextUrl.searchParams.get("source") || "all").toLowerCase();
  const limitRaw = Number(request.nextUrl.searchParams.get("limit") || "50");
  const limit = Number.isFinite(limitRaw) ? Math.max(10, Math.min(100, Math.floor(limitRaw))) : 50;
  if (!["all", "x", "bluesky"].includes(requested)) return NextResponse.json({ ok: false, error: "Unsupported source" }, { status: 400 });
  const results = [];
  if (requested === "all" || requested === "x") results.push(await discoverX(limit));
  if (requested === "all" || requested === "bluesky") results.push(await discoverBluesky(limit));
  const items = normalizeDiscoveryPosts(results.flatMap(result => result.posts));
  return NextResponse.json({ ok: true, checked_at: new Date().toISOString(), strategy: "bootstrap_blue_collar_social_discovery", bootstrap_sources: BOOTSTRAP_SOURCE_POLICIES, sources: results.map(result => ({ source: result.source, configured: result.configured, fetched: result.posts.length, error: result.error })), count: items.length, jobs: items.filter(item => item.kind === "job"), workers: items.filter(item => item.kind === "worker") }, { headers: { "Cache-Control": "private, no-store" } });
}
