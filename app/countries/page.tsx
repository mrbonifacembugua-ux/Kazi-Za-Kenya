import type { Metadata } from "next";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const metadata: Metadata = {
  title: "Browse Countries | AnyDayWork",
  description:
    "Browse AnyDayWork country pages to find local workers, jobs and practical services around the world.",
  alternates: {
    canonical: "https://anydaywork.vercel.app/countries",
  },
};

function countryNameFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function CountriesPage() {
  const countryDir = join(process.cwd(), "app", "country");
  const countries = readdirSync(countryDir)
    .filter((name) => {
      try {
        return statSync(join(countryDir, name)).isDirectory();
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.localeCompare(b));

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8f7",
        color: "#17221b",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "36px 20px 56px",
      }}
    >
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <a
          href="/"
          style={{
            display: "inline-block",
            marginBottom: 20,
            color: "#16803d",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          ← AnyDayWork marketplace
        </a>

        <h1 style={{ margin: "0 0 10px", fontSize: "clamp(30px, 5vw, 46px)" }}>
          AnyDayWork around the world
        </h1>
        <p
          style={{
            margin: "0 0 28px",
            maxWidth: 720,
            color: "#5f6f65",
            lineHeight: 1.6,
          }}
        >
          Choose a country to explore local workers, jobs and practical services.
        </p>

        <nav
          aria-label="AnyDayWork country pages"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 10,
          }}
        >
          {countries.map((slug) => (
            <a
              key={slug}
              href={`/country/${slug}`}
              style={{
                display: "block",
                padding: "12px 14px",
                background: "#ffffff",
                border: "1px solid #dfe7e1",
                borderRadius: 10,
                color: "#174d2c",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {countryNameFromSlug(slug)}
            </a>
          ))}
        </nav>
      </section>
    </main>
  );
}
