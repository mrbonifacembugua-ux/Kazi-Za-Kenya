import { NextRequest, NextResponse } from "next/server";
import { normalizeDiscoveryPosts, type RawDiscoveryPost } from "../../../../lib/external-discovery";

const X_RECENT_SEARCH_URL = "https://api.x.com/2/tweets/search/recent";

const X_QUERY = [
  "(mjengo OR fundi OR plumber OR electrician OR carpenter OR welder OR mechanic OR cleaner OR househelp OR driver OR rider OR waiter OR cook OR gardener OR mason OR painter OR kibarua)",
  '("looking for work" OR "looking for a job" OR "natafuta kazi" OR "nahitaji kazi" OR hiring OR needed OR required OR "job available" OR tunatafuta)',
  "(Kenya OR Nairobi OR Mombasa OR Kisumu OR Nakuru OR Eldoret OR Kiambu OR Thika OR Rongai OR Kitengela)",
  "-is:retweet",
].join(" ");

type XPost = {
  id: string;
  text: string;
  author_id?: string;
  created_at?: string;
};

type XUser = {
  id: string;
  username?: string;
  name?: string;
};

async function discoverX(limit: number) {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) {
    return { source: "x", configured: false, posts: [] as RawDiscoveryPost[], error: "X_BEARER_TOKEN is not configured" };
  }

  const url = new URL(X_RECENT_SEARCH_URL);
  url.searchParams.set("query", X_QUERY);
  url.searchParams.set("max_results", String(Math.max(10, Math.min(100, limit))));
  url.searchParams.set("tweet.fields", "created_at,author_id");
  url.searchParams.set("expansions", "author_id");
  url.searchParams.set("user.fields", "username,name");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return { source: "x", configured: true, posts: [] as RawDiscoveryPost[], error: `X returned HTTP ${response.status}` };
  }

  const payload = await response.json() as { data?: XPost[]; includes?: { users?: XUser[] } };
  const users = new Map((payload.includes?.users || []).map(user => [user.id, user]));
  const posts: RawDiscoveryPost[] = (payload.data || []).map(post => {
    const user = post.author_id ? users.get(post.author_id) : undefined;
    const username = user?.username || null;
    return {
      source_key: "x",
      source_name: "X",
      source_url: username ? `https://x.com/${username}/status/${post.id}` : `https://x.com/i/web/status/${post.id}`,
      text: post.text,
      posted_at: post.created_at || null,
      author_label: user?.name || username,
    };
  });

  return { source: "x", configured: true, posts, error: null as string | null };
}

export async function GET(request: NextRequest) {
  const requested = (request.nextUrl.searchParams.get("source") || "all").toLowerCase();
  const limitRaw = Number(request.nextUrl.searchParams.get("limit") || "50");
  const limit = Number.isFinite(limitRaw) ? Math.max(10, Math.min(100, Math.floor(limitRaw))) : 50;

  if (!['all', 'x'].includes(requested)) {
    return NextResponse.json({ ok: false, error: "Unsupported source" }, { status: 400 });
  }

  const results = [];
  if (requested === "all" || requested === "x") results.push(await discoverX(limit));

  const raw = results.flatMap(result => result.posts);
  const items = normalizeDiscoveryPosts(raw);
  const jobs = items.filter(item => item.kind === "job");
  const workers = items.filter(item => item.kind === "worker");

  return NextResponse.json({
    ok: true,
    checked_at: new Date().toISOString(),
    strategy: "blue_collar_social_discovery",
    sources: results.map(result => ({ source: result.source, configured: result.configured, fetched: result.posts.length, error: result.error })),
    count: items.length,
    jobs,
    workers,
  }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
