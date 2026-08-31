import { NextResponse } from "next/server";

type GeocodeBody = {
  area?: string;
  region?: string;
  countryCode?: string;
};

const COUNTRY_NAMES: Record<string, string> = {
  KE: "Kenya",
  UG: "Uganda",
  TZ: "Tanzania",
  RW: "Rwanda",
  BI: "Burundi",
  SS: "South Sudan",
  ET: "Ethiopia",
  SO: "Somalia",
  DJ: "Djibouti",
  ER: "Eritrea",
};

function validCoordinate(latitude: number, longitude: number) {
  return Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GeocodeBody;
    const area = (body.area || "").trim();
    const region = (body.region || "").trim();
    const suppliedCountryCode = (body.countryCode || "").trim().toUpperCase();
    const countryCode = /^[A-Z]{2}$/.test(suppliedCountryCode) ? suppliedCountryCode : "";

    if (!area) {
      return NextResponse.json({ error: "A location is required." }, { status: 400 });
    }

    const countryName = countryCode ? (COUNTRY_NAMES[countryCode] || countryCode) : "";
    const query = [area, region, countryName].filter(Boolean).join(", ");
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "4");
    if (countryCode) url.searchParams.set("countrycodes", countryCode.toLowerCase());

    const response = await fetch(url, {
      headers: {
        "User-Agent": "KaziZaKenya-Marketplace/0.1 (area geocoding fallback)",
        "Accept-Language": "en",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Location lookup is temporarily unavailable." }, { status: 503 });
    }

    const results = (await response.json()) as Array<{ lat?: string; lon?: string; display_name?: string; address?: { country_code?: string } }>;
    const match = countryCode
      ? (results.find(result => (result.address?.country_code || "").toUpperCase() === countryCode) || results[0])
      : results[0];
    if (!match) {
      return NextResponse.json({ error: "We could not locate that area." }, { status: 404 });
    }

    const latitude = Number(match.lat);
    const longitude = Number(match.lon);
    if (!validCoordinate(latitude, longitude)) {
      return NextResponse.json({ error: "The location service returned invalid coordinates." }, { status: 422 });
    }

    const resolvedCountryCode = (match.address?.country_code || countryCode || "").toUpperCase();

    return NextResponse.json({
      latitude,
      longitude,
      source: "area",
      countryCode: resolvedCountryCode,
      displayName: match.display_name || query,
      approximate: true,
    });
  } catch {
    return NextResponse.json({ error: "We could not look up that area." }, { status: 400 });
  }
}
