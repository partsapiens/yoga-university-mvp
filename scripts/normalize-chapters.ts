/* eslint-disable no-console */
import fs from "fs";
import path from "path";

const ROOT = "content/manual";

// Slugs to skip (none by default)
const SKIP = new Set<string>([]);

// Section cue → H2 heading (tune as needed)
const SECTION_CUES: Array<[RegExp, string]> = [
  [/^\s*(?:SENSE\s*CHECK)\b[:\-]?\s*/i, "## Sense Check\n\n"],
  [/^\s*(?:MANTRA|YOUR\s*MANTRA)\b[:\-]?\s*/i, "## Mantra\n\n"],
  [/^\s*(?:GRATITUDE)\b[:\-]?\s*/i, "## Gratitude\n\n"],
  [/^\s*(?:INTENTION)\b[:\-]?\s*/i, "## Intention\n\n"],
  [/^\s*(?:BREATH|PRANAYAMA)\b[:\-]?\s*/i, "## Breath Practice\n\n"],
  [/^\s*(?:REFLECTION|JOURNAL(?:ING)?)\b[:\-]?\s*/i, "## Reflection\n\n"],
  [/^\s*(?:CONTRAINDICATIONS?)\b[:\-]?\s*/i, "## Contraindications\n\n"],
  [/^\s*(?:TEACHING AND CLASS ESSENTIALS)\b[:\-]?\s*/im, "## Teaching and Class Essentials\n\n"],
];

// Utility cleaners
function cleanWhitespace(s: string) {
  return s
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/[ ]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripPageArtifacts(s: string) {
  return s
    // Remove "Page 273" style lines
    .replace(/^\s*Page\s+\d+\s*$/gmi, "")
    // Remove lone numbers/letters lines
    .replace(/^\s*[A-Za-z]?\s*\d{1,4}\s*$/gm, "")
    // Remove timecodes like 1:05–1:10 / 1:05 - 1:10
    .replace(/\b\d{1,2}:\d{2}\s*[\u2013-]\s*\d{1,2}:\d{2}\b/g, "");
}

function fixSmashedCaps(s: string) {
  // “EXPERIENCEMeditation” → “EXPERIENCE Meditation”
  return s.replace(/([A-Z]{2,})([A-Z][a-z])/g, "$1 $2");
}

function bulletsFromHyphenRuns(s: string) {
  // Convert “- word - word - word” runs into proper list lines
  return s
    .replace(/(?:^|\n)\s*-\s*/g, "\n- ")
    // Turn inline hyphen-separated items into bullets if clearly a list block
    .replace(/((?:^|\n)[A-Za-z].{0,120})(?:\s*-\s+[^\n]{2,}){2,}/g, (block) => {
      // split on " - " and rejoin as bullets
      const parts = block.split(/\s-\s+/);
      const first = parts.shift()!;
      return [first, ...parts.map(p => `- ${p.trim()}`)].join("\n");
    });
}

function addSectionHeadings(s: string) {
  let out = s;
  for (const [cue, heading] of SECTION_CUES) {
    out = out.replace(cue, heading);
  }
  return out;
}

function ensureSpacing(s: string) {
  // Add space after punctuation where missing
  return s.replace(/([.,;:!?])([A-Za-z])/g, "$1 $2");
}

function ensureSingleH1(front: string, body: string) {
  const titleMatch = /^---[\s\S]*?\btitle:\s*"?([^"\n]+)"?[\s\S]*?---\n/.exec(front);
  const title = titleMatch ? titleMatch[1].trim() : "";
  if (!title) return body;
  const esc = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let t = body.replace(new RegExp(`^(#\\s+)?${esc}\\s*\\n`, "i"), "");
  return `# ${title}\n\n${t}`;
}

function normalize(front: string, body: string) {
  let t = body;
  t = stripPageArtifacts(t);
  t = fixSmashedCaps(t);
  t = ensureSpacing(t);
  t = addSectionHeadings(t);
  t = bulletsFromHyphenRuns(t);
  t = ensureSingleH1(front, t);
  t = cleanWhitespace(t);
  return front + t + "\n";
}

function run() {
  const entries = fs
    .readdirSync(ROOT)
    .filter((d) => d !== "manifest.json" && d !== "pages" && !d.startsWith("_"));

  for (const slug of entries) {
    if (SKIP.has(slug)) continue;
    const file = path.join(ROOT, slug, "index.md");
    if (!fs.existsSync(file)) continue;

    const raw = fs.readFileSync(file, "utf8");

    // Split front-matter (--- ... ---) and body
    const m = /^---[\s\S]*?---\n/.exec(raw);
    const front = m ? m[0] : "";
    const body = m ? raw.slice(m[0].length) : raw;

    const cleaned = normalize(front, body);
    fs.writeFileSync(file, cleaned, "utf8");
    console.log(`✅ normalized: ${slug}`);
  }
}

run();
