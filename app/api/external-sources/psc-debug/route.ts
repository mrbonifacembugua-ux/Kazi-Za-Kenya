import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = "https://pscims.publicservice.go.ke/jobs/ActiveJobsAdverts.aspx";
    const response = await fetch(url, { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0 KaziZaKenyaSourceCheck/1.0" } });
    const html = await response.text();
    const advertIndex = html.toLowerCase().indexOf("142/2026");
    const detailIndex = html.toLowerCase().indexOf("advertdetailsext");
    const start = Math.max(0, advertIndex >= 0 ? advertIndex - 2500 : detailIndex >= 0 ? detailIndex - 2500 : 0);
    return NextResponse.json({ status: response.status, length: html.length, advertIndex, detailIndex, sample: html.slice(start, start + 7000) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "debug fetch failed" }, { status: 500 });
  }
}
