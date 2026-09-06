import { NextRequest, NextResponse, NextFetchEvent } from "next/server";

const SUPABASE_URL = "https://pnqmqxeuzcodnxdixnvc.supabase.co";
const SUPABASE_KEY = "sb_publishable_GWBhAF05Qg7mEsqzjKfxJQ_HmyNsn3l";
const VISITOR_COOKIE = "adw_visitor";

function visitorId(request: NextRequest) {
  const existing = request.cookies.get(VISITOR_COOKIE)?.value;
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return { id: existing, isNew: false };
  return { id: crypto.randomUUID(), isNew: true };
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const response = NextResponse.next();
  const { id, isNew } = visitorId(request);
  if (isNew) {
    response.cookies.set(VISITOR_COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/"
    });
  }

  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin")) {
    event.waitUntil(
      fetch(`${SUPABASE_URL}/rest/v1/rpc/record_page_view`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ p_visitor_id: id, p_path: path })
      }).catch(() => undefined)
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$).*)"]
};
