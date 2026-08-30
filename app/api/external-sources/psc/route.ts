import { NextResponse } from "next/server";

const PSC_ACTIVE_URL = "https://pscims.publicservice.go.ke/jobs/ActiveJobsAdverts.aspx";
const PSC_ORIGIN = "https://pscims.publicservice.go.ke";

type PscJob = {
  advert_number: string;
  title: string;
  ministry: string;
  vacancies: number | null;
  advert_category: string;
  source_posted_at: string | null;
  expires_at: string | null;
  source_url: string;
  description: string;
  category: string;
  county: "Kenya";
  area: null;
  latitude: null;
  longitude: null;
  location_precision: "county";
};

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function text(value: string) {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function kenyaDate(value: string, endOfDay = false) {
  const match = value.trim().match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = dd.padStart(2, "0");
  const month = mm.padStart(2, "0");
  return `${yyyy}-${month}-${day}T${endOfDay ? "23:59:59" : "00:00:00"}+03:00`;
}

function absoluteHref(href: string) {
  try {
    return new URL(decodeHtml(href), PSC_ORIGIN).toString();
  } catch {
    return null;
  }
}

function parseActiveJobs(html: string): PscJob[] {
  const rows = html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || [];
  const jobs: PscJob[] = [];
  const now = Date.now();

  for (const row of rows) {
    const cells = Array.from(row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)).map(match => text(match[1]));
    if (cells.length < 9) continue;

    const advertNumber = cells[0]?.trim();
    const position = cells[1]?.trim();
    const ministry = cells[3]?.trim();
    const vacanciesText = cells[4]?.replace(/[^0-9]/g, "");
    const advertCategory = cells[6]?.trim();
    const advertDate = cells[7]?.trim();
    const closeDate = cells[8]?.trim();
    if (!advertNumber || !position || !closeDate) continue;

    const hrefMatch = row.match(/href=["']([^"']*AdvertDetailsExt\.aspx[^"']*)["']/i);
    const sourceUrl = hrefMatch ? absoluteHref(hrefMatch[1]) : null;
    if (!sourceUrl) continue;

    const expiresAt = kenyaDate(closeDate, true);
    if (!expiresAt || new Date(expiresAt).getTime() <= now) continue;

    const vacancies = vacanciesText ? Number(vacanciesText) : null;
    const descriptionParts = [
      `PSC advert ${advertNumber}.`,
      vacancies !== null ? `${vacancies} vacanc${vacancies === 1 ? "y" : "ies"}.` : null,
      ministry ? `Organisation: ${ministry}.` : null,
      advertCategory ? `Advert category: ${advertCategory}.` : null,
    ].filter(Boolean);

    jobs.push({
      advert_number: advertNumber,
      title: position,
      ministry,
      vacancies,
      advert_category: advertCategory,
      source_posted_at: kenyaDate(advertDate),
      expires_at: expiresAt,
      source_url: sourceUrl,
      description: descriptionParts.join(" "),
      category: "Public Service",
      county: "Kenya",
      area: null,
      latitude: null,
      longitude: null,
      location_precision: "county",
    });
  }

  const seen = new Set<string>();
  return jobs.filter(job => {
    if (seen.has(job.source_url)) return false;
    seen.add(job.source_url);
    return true;
  });
}

export async function GET() {
  try {
    const response = await fetch(PSC_ACTIVE_URL, {
      headers: { "User-Agent": "KaziZaKenya/1.0 (+external job discovery)" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, source: "kenya_psc", error: `PSC returned HTTP ${response.status}` }, { status: 502 });
    }

    const html = await response.text();
    const jobs = parseActiveJobs(html);
    return NextResponse.json(
      { ok: true, source: "kenya_psc", source_name: "Kenya Public Service Commission", source_url: PSC_ACTIVE_URL, checked_at: new Date().toISOString(), count: jobs.length, jobs },
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600" } },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, source: "kenya_psc", error: error instanceof Error ? error.message : "PSC discovery failed" },
      { status: 502 },
    );
  }
}
