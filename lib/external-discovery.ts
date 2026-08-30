export type DiscoveryKind = "job" | "worker";

export type RawDiscoveryPost = {
  source_key: string;
  source_name: string;
  source_url: string;
  text: string;
  posted_at: string | null;
  author_label?: string | null;
};

export type NormalizedDiscoveryItem = {
  kind: DiscoveryKind;
  source_key: string;
  source_name: string;
  source_url: string;
  source_posted_at: string | null;
  title: string;
  description: string;
  category: string;
  county: string;
  area: string | null;
  location_precision: "county" | "town" | "area";
  display_name: string | null;
  confidence: number;
};

const BLUE_COLLAR_CATEGORIES: Array<{ category: string; terms: string[] }> = [
  { category: "Construction", terms: ["mjengo", "mason", "masonry", "construction worker", "casual labour", "casual labor", "labourer", "laborer", "tiler", "roofer", "painter"] },
  { category: "Plumbing", terms: ["plumber", "plumbing", "fundi wa maji"] },
  { category: "Electrical", terms: ["electrician", "electrical", "fundi wa stima"] },
  { category: "Carpentry", terms: ["carpenter", "carpentry", "fundi mbao", "fundi wa mbao"] },
  { category: "Welding", terms: ["welder", "welding", "fundi chuma", "fundi wa chuma"] },
  { category: "Mechanic", terms: ["mechanic", "mechanic helper", "garage worker", "fundi gari", "fundi wa gari"] },
  { category: "Driving & Delivery", terms: ["driver", "delivery rider", "rider", "boda", "boda boda", "courier", "turnboy"] },
  { category: "Cleaning & Domestic", terms: ["cleaner", "cleaning", "househelp", "house help", "domestic worker", "housekeeper", "nanny"] },
  { category: "Hospitality", terms: ["waiter", "waitress", "cook", "chef", "kitchen helper", "hotel worker", "barista", "steward"] },
  { category: "Security", terms: ["security guard", "watchman", "guard"] },
  { category: "Farm & Gardening", terms: ["farm worker", "farmhand", "shamba", "gardener", "garden worker"] },
  { category: "Warehouse & Factory", terms: ["loader", "offloader", "warehouse worker", "packer", "factory worker", "store helper"] },
  { category: "Beauty & Personal Care", terms: ["barber", "hairdresser", "salon worker", "beautician", "nail technician"] },
  { category: "General Handyman", terms: ["handyman", "fundi", "technician", "repair worker"] },
];

const JOB_SIGNALS = [
  "hiring", "we are hiring", "needed", "required", "vacancy", "vacancies", "looking for a", "looking for an",
  "looking for workers", "looking for labourers", "looking for laborers", "tunatafuta", "inahitajika", "wanahitajika",
  "nahitaji fundi", "need a", "need an", "job available", "work available", "apply", "interested candidates",
];

const WORKER_SIGNALS = [
  "looking for work", "looking for a job", "seeking work", "seeking a job", "available for work", "available for jobs",
  "natafuta kazi", "nahitaji kazi", "niko available", "niko tayari kufanya kazi", "am available", "i am available",
  "fundi available", "ready to work", "any job", "kibarua", "natafuta kibarua",
];

const KENYA_LOCATIONS: Array<{ area: string; county: string }> = [
  { area: "Nairobi", county: "Nairobi" }, { area: "Kasarani", county: "Nairobi" }, { area: "Embakasi", county: "Nairobi" },
  { area: "Westlands", county: "Nairobi" }, { area: "Kibera", county: "Nairobi" }, { area: "Roysambu", county: "Nairobi" },
  { area: "Rongai", county: "Kajiado" }, { area: "Kitengela", county: "Kajiado" }, { area: "Kajiado", county: "Kajiado" },
  { area: "Kiambu", county: "Kiambu" }, { area: "Ruiru", county: "Kiambu" }, { area: "Thika", county: "Kiambu" },
  { area: "Juja", county: "Kiambu" }, { area: "Kikuyu", county: "Kiambu" }, { area: "Limuru", county: "Kiambu" },
  { area: "Mombasa", county: "Mombasa" }, { area: "Likoni", county: "Mombasa" }, { area: "Nyali", county: "Mombasa" },
  { area: "Nakuru", county: "Nakuru" }, { area: "Naivasha", county: "Nakuru" }, { area: "Gilgil", county: "Nakuru" },
  { area: "Kisumu", county: "Kisumu" }, { area: "Eldoret", county: "Uasin Gishu" }, { area: "Uasin Gishu", county: "Uasin Gishu" },
  { area: "Machakos", county: "Machakos" }, { area: "Athi River", county: "Machakos" }, { area: "Mlolongo", county: "Machakos" },
  { area: "Meru", county: "Meru" }, { area: "Nyeri", county: "Nyeri" }, { area: "Embu", county: "Embu" },
  { area: "Kakamega", county: "Kakamega" }, { area: "Bungoma", county: "Bungoma" }, { area: "Kericho", county: "Kericho" },
  { area: "Kisii", county: "Kisii" }, { area: "Narok", county: "Narok" }, { area: "Malindi", county: "Kilifi" },
  { area: "Kilifi", county: "Kilifi" }, { area: "Diani", county: "Kwale" }, { area: "Kwale", county: "Kwale" },
];

function compact(value: string) {
  return value.replace(/https?:\/\/\S+/gi, " ").replace(/\s+/g, " ").trim();
}

function includesTerm(haystack: string, term: string) {
  return haystack.includes(term.toLowerCase());
}

function detectCategory(text: string) {
  const lower = text.toLowerCase();
  for (const group of BLUE_COLLAR_CATEGORIES) {
    const matched = group.terms.find(term => includesTerm(lower, term));
    if (matched) return { category: group.category, matched };
  }
  return null;
}

function detectKind(text: string): { kind: DiscoveryKind; strength: number } | null {
  const lower = text.toLowerCase();
  const jobHits = JOB_SIGNALS.filter(signal => includesTerm(lower, signal)).length;
  const workerHits = WORKER_SIGNALS.filter(signal => includesTerm(lower, signal)).length;
  if (!jobHits && !workerHits) return null;
  if (workerHits > jobHits) return { kind: "worker", strength: Math.min(3, workerHits) };
  return { kind: "job", strength: Math.min(3, jobHits) };
}

function detectLocation(text: string) {
  const lower = text.toLowerCase();
  const location = KENYA_LOCATIONS.find(item => lower.includes(item.area.toLowerCase()));
  if (!location) return { county: "Kenya", area: null, precision: "county" as const, explicit: lower.includes("kenya") };
  if (location.area.toLowerCase() === location.county.toLowerCase()) {
    return { county: location.county, area: null, precision: "county" as const, explicit: true };
  }
  return { county: location.county, area: location.area, precision: "town" as const, explicit: true };
}

function titleFor(kind: DiscoveryKind, matchedTerm: string) {
  const role = matchedTerm.replace(/\b\w/g, letter => letter.toUpperCase());
  return kind === "job" ? `${role} opportunity` : `${role} available for work`;
}

function descriptionFor(kind: DiscoveryKind, category: string, area: string | null, county: string, sourceName: string) {
  const location = area ? `${area}, ${county}` : county;
  return kind === "job"
    ? `Public ${category.toLowerCase()} opportunity discovered on ${sourceName}, associated with ${location}. Open the original source for the full post and current details.`
    : `Public ${category.toLowerCase()} worker-availability post discovered on ${sourceName}, associated with ${location}. Open the original source for the full post and current details.`;
}

export function normalizeDiscoveryPost(post: RawDiscoveryPost): NormalizedDiscoveryItem | null {
  const cleaned = compact(post.text);
  if (cleaned.length < 18) return null;

  const category = detectCategory(cleaned);
  const kind = detectKind(cleaned);
  if (!category || !kind) return null;

  const location = detectLocation(cleaned);
  // Social discovery must not assume a post is Kenyan. Require Kenya itself or a recognized Kenyan place in the post.
  if (!location.explicit) return null;

  const confidence = Math.min(0.98, 0.66 + (kind.strength * 0.08) + (location.area ? 0.08 : 0));

  return {
    kind: kind.kind,
    source_key: post.source_key,
    source_name: post.source_name,
    source_url: post.source_url,
    source_posted_at: post.posted_at,
    title: titleFor(kind.kind, category.matched),
    description: descriptionFor(kind.kind, category.category, location.area, location.county, post.source_name),
    category: category.category,
    county: location.county,
    area: location.area,
    location_precision: location.precision,
    display_name: null,
    confidence: Number(confidence.toFixed(2)),
  };
}

export function normalizeDiscoveryPosts(posts: RawDiscoveryPost[]) {
  const seen = new Set<string>();
  return posts
    .map(normalizeDiscoveryPost)
    .filter((item): item is NormalizedDiscoveryItem => Boolean(item))
    .filter(item => {
      if (seen.has(item.source_url)) return false;
      seen.add(item.source_url);
      return true;
    });
}

export const BLUE_COLLAR_DISCOVERY_TERMS = BLUE_COLLAR_CATEGORIES.flatMap(group => group.terms);