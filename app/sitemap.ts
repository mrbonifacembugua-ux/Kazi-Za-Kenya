import type { MetadataRoute } from "next";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = "https://anydaywork.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const countryDir = join(process.cwd(), "app", "country");
  const countryPages = readdirSync(countryDir)
    .filter((name) => {
      try {
        return statSync(join(countryDir, name)).isDirectory();
      } catch {
        return false;
      }
    })
    .map((slug) => ({
      url: `${SITE_URL}/country/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...countryPages,
  ];
}
