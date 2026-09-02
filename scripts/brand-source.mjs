import fs from "node:fs";

const replacements = [
  {
    path: "app/page.tsx",
    pairs: [
      ["🇰🇪 Kazi za <span>Kenya</span>", "<span className=\"adw-any\">Any</span><span className=\"adw-day\">Day</span><span className=\"adw-work\">Work</span>"],
      ["Kazi za Kenya connects people who", "AnyDayWork connects people who"],
      ["Keep communication inside Kazi za\\r\\n        Kenya until you are comfortable meeting.", "Keep communication inside AnyDayWork until you are comfortable meeting."],
      ["Keep communication inside Kazi za\n        Kenya until you are comfortable meeting.", "Keep communication inside AnyDayWork until you are comfortable meeting."]
    ]
  },
  {
    path: "app/layout.tsx",
    pairs: [
      ['title: "Kazi za Kenya"', 'title: "AnyDayWork — Find work near you. Any day."']
    ]
  }
];

for (const target of replacements) {
  if (!fs.existsSync(target.path)) continue;
  let source = fs.readFileSync(target.path, "utf8");
  for (const [from, to] of target.pairs) {
    source = source.replaceAll(from, to);
  }
  fs.writeFileSync(target.path, source, "utf8");
}

console.log("AnyDayWork source branding applied before Next.js build.");
