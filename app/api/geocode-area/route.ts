import { NextResponse } from "next/server";

type GeocodeBody = {
  area?: string;
  region?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
};

function validCoordinate(latitude: number, longitude: number) {
  return Number.isFinite(latitude) && longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90;
}

function normalizeCountryCode(value: unknown) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GeocodeBody;
    const suppliedLatitude = Number(body.latitude);
    const suppliedLongitude = Number(body.longitude);

    // Reverse lookup is used only to confirm which country a shared device
    // position belongs to. The exact coordinates are not returned to the public UI.
    if (validCoordinate(suppliedLatitude, suppliedLongitude)) {
      const reverseUrl = new URL("https://nominatim.openstreetmap.org/reverse");
      reverseUrl.searchParams.set("lat", String(suppliedLatitude));
      reverseUrl.searchParams.set("lon", String(suppliedLongitude));
      reverseUrl.searchParams.set("format", "jsonv2");
      reverseUrl.searchParams.set("addressdetails", "1");
      reverseUrl.searchParams.set("zoom", "5");

      const reverseResponse = await fetch(reverseUrl, {
        headers: {
          "User-Agent": "AnyDayWork-Marketplace/0.1 (country verification)",
          "Accept-Language": "en",
        },
        cache: "no-store",
      });

      if (!reverseResponse.ok) {
        return NextResponse.json({ error: "Location lookup is temporarily unavailable." }, { status: 503 });
      }

      const result = (await reverseResponse.json()) as {
        display_name?: string;
        address?: { country?: string; country_code?: string };
      };
      const countryCode = normalizeCountryCode(result.address?.country_code);
      if (!countryCode) {
        return NextResponse.json({ error: "We could not identify the country for this position." }, { status: 404 });
      }

      return NextResponse.json({
        countryCode,
        countryName: result.address?.country || countryCode,
        displayName: result.display_name || result.address?.country || countryCode,
        source: "device",
      });
    }

    const area = (body.area || "").trim();
    const region = (body.region || "").trim();
    const countryCode = normalizeCountryCode(body.countryCode);

    if (!area) {
      return NextResponse.json({ error: "A location is required." }, { status: 400 });
    }

    const query = [area, region].filter(Boolean).join(", ");
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "4");
    if (countryCode) url.searchParams.set("countrycodes", countryCode.toLowerCase());

    const response = await fetch(url, {
      headers: {
        "User-Agent": "AnyDayWork-Marketplace/0.1 (area geocoding fallback)",
        "Accept-Language": "en",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Location lookup is temporarily unavailable." }, { status: 503 });
    }

    const results = (await response.json()) as Array<{
      lat?: string;
      lon?: string;
      display_name?: string;
      address?: { country_code?: string };
    }>;

    const match = countryCode
      ? (results.find(result => normalizeCountryCode(result.address?.country_code) === countryCode) || results[0])
      : results[0];

    if (!match) {
      return NextResponse.json({ error: "We could not locate that area." }, { status: 404 });
    }

    const latitude = Number(match.lat);
    const longitude = Number(match.lon);
    if (!validCoordinate(latitude, longitude)) {
      return NextResponse.json({ error: "The location service returned invalid coordinates." }, { status: 422 });
    }

    const resolvedCountryCode = normalizeCountryCode(match.address?.country_code) || countryCode;

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
