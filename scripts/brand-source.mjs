import fs from "node:fs";
import path from "node:path";

const APP_ROOT = "app";
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const SKIP_FILES = new Set([
  path.normalize("app/AnyDayWorkBranding.tsx"),
  path.normalize("app/AnyDayWorkStartupGuard.tsx"),
]);

function sourceFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...sourceFiles(full));
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

function brandedMarkup(file) {
  if (path.extname(file) === ".html") {
    return '<span class="adw-any">Any</span><span class="adw-day">Day</span><span class="adw-work">Work</span>';
  }
  return '<span className="adw-any">Any</span><span className="adw-day">Day</span><span className="adw-work">Work</span>';
}

function applyBranding(file) {
  if (!fs.existsSync(file) || SKIP_FILES.has(path.normalize(file))) return false;
  const original = fs.readFileSync(file, "utf8");
  let source = original;
  const logo = brandedMarkup(file);

  // Replace the old visible logo before the plain-text sweep so split markup cannot survive.
  source = source.replaceAll("🇰🇪 Kazi za <span>Kenya</span>", logo);
  source = source.replaceAll("Kazi za <span>Kenya</span>", logo);
  source = source.replaceAll("🇰🇪 Kazi za <b>Kenya</b>", logo);
  source = source.replaceAll("Kazi za <b>Kenya</b>", logo);

  // Remove remaining user-facing legacy brand mentions while preserving geographic Kenya references.
  source = source.replace(/Kazi\s+za\s+Kenya/gi, "AnyDayWork");

  // Keep first-load metadata aligned with the product identity.
  source = source.replace(
    'title: "AnyDayWork",\n  description: "Find work. Get things done."',
    'title: "AnyDayWork — Find work near you. Any day.",\n  description: "Find local workers, jobs and practical services near you with AnyDayWork."'
  );
  source = source.replaceAll(
    "<title>AnyDayWork — Find someone nearby</title>",
    "<title>AnyDayWork — Find work near you. Any day.</title>"
  );
  source = source.replaceAll(
    "<title>Kazi za Kenya — Find someone nearby</title>",
    "<title>AnyDayWork — Find work near you. Any day.</title>"
  );

  if (source === original) return false;
  fs.writeFileSync(file, source, "utf8");
  return true;
}

const targets = [...sourceFiles(APP_ROOT), "index.html"];
let changed = 0;
for (const file of targets) if (applyBranding(file)) changed += 1;

console.log(`AnyDayWork branding sweep applied before Next.js build (${changed} source file${changed === 1 ? "" : "s"} updated).`);
