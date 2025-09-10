/* eslint-disable no-console */
import fs from "fs";
import path from "path";

const ROOT = "content/manual";

// Skip folders (none by default)
const SKIP = new Set<string>([]);

// Map common cues to H2 headings
const SECTION_CUES: Array<[RegExp, string | ((m: RegExpExecArray) => string)]> = [
  [/^\s*(?:SENSE\s*CHECK)\b[:\-]?\s*/i, "## Sense Check\n\n"],
  [/^\s*(?:YOUR\s*MANTRA|MANTRA)\b[:\-]?\s*/i, "## Mantra\n\n"],
  [/^\s*(?:GRATITUDE)\b[:\-]?\s*/i, "## Gratitude\n\n"],
  [/^\s*(?:INTENTION)\b[:\-]?\s*/i, "## Intention\n\n"],
  [/^\s*(?:PRANAYAMA|BREATH)\b[:\-]?\s*/i, "## Breath Practice\n\n"],
  [/^\s*(?:REFLECTION|JOURNAL(?:ING)?)\b[:\-]?\s*/i, "## Reflection\n\n"],
  [/^\s*(?:CONTRAINDICATIONS?)\b[:\-]?\s*/i, "## Contraindications\n\n"],
  [/^\s*(?:PART\s+(ONE|TWO|THREE|FOUR))\b[:\-]?\s*/i, (m) => `## ${m[0].trim().replace(/\s+/g, " ")}\n\n`],
];

function stripNavAndPages(s: string) {
  return s
    // lines that are just navigation links (Prev/Top/Next)
    .replace(/^\s*\[(?:←\s*)?Prev\]\([^)]*\).*\n?/gmi, "")
    .replace(/^\s*\[Top\]\([^)]*\).*\n?/gmi, "")
    .replace(/^\s*\[(?:Next\s*→?)\]\([^)]*\).*\n?/gmi, "")
    // headings like "Page 249" or "# Page 249"
    .replace(/^\s*#?\s*Page\s+\d+\s*$/gmi, "")
    // lone numbers / page counters
    .replace(/^\s*[A-Za-z]?\s*\d{1,4}\s*$/gm, "")
    // timecodes 1:05–1:10 or 1:05 - 1:10
    .replace(/\b\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}\b/g, "")
    // copyright artifacts like "© Yoga Flow YOGA 6.4 ..."
    .replace(/^\s*©[^\n]*$/gmi, "");
}

function fixSmashedCapsAndSpacing(s: string) {
  return s
    // “EXPERIENCEMeditation” → “EXPERIENCE Meditation”
    .replace(/([A-Z]{2,})([A-Z][a-z])/g, "$1 $2")
    // add space after punctuation when missing
    .replace(/([.,;:!?])([A-Za-z])/g, "$1 $2");
}

function bulletsFromHyphenRuns(s: string) {
  // normalize unicode bullets to hyphens
  let t = s.replace(/[•·]\s*/g, "- ");
  // ensure bullets start at line starts
  t = t.replace(/(?:^|\n)\s*-\s*/g, "\n- ");
  // inline " - item - item - item" → bullets
  t = t.replace(/((?:^|\n)[^\n]{3,}?)(?:\s-\s+[^\n]{2,}){2,}/g, (block) => {
    const parts = block.split(/\s-\s+/);
    const head = parts.shift()!;
    return [head, ...parts.map((p) => `- ${p.trim()}`)].join("\n");
  });
  return t;
}

function numberedListsFromRunOns(s: string) {
  let t = s;
  // break before digit-dot if glued to previous sentence
  t = t.replace(/(?<=\S)(\d{1,3})\.\s/g, "\n$1. ");
  // ensure each N. starts on its own line
  t = t.replace(/(?:^|\n)\s*(\d{1,3})\.\s*/g, "\n$1. ");
  // collapse multiple spaces after number
  t = t.replace(/(\n\d{1,3}\.)\s{2,}/g, "$1 ");
  return t;
}

function applySectionHeadings(s: string) {
  let out = s;
  for (const [cue, heading] of SECTION_CUES) {
    if (typeof heading === "string") {
      out = out.replace(cue, heading);
    } else {
      out = out.replace(cue, (match) => (heading as any)(match));
    }
  }
  return out;
}

function cleanWhitespace(s: string) {
  return s
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/[ ]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalize(front: string, body: string) {
  let t = body;
  t = stripNavAndPages(t);
  t = fixSmashedCapsAndSpacing(t);
  t = numberedListsFromRunOns(t);
  t = bulletsFromHyphenRuns(t);
  t = applySectionHeadings(t);
  t = cleanWhitespace(t);
  return front + t + "\n";
}

function run() {
  const entries = fs
    .readdirSync(ROOT)
    .filter((d) =>
      d !== "manifest.json" &&
      d !== "pages" &&
      !d.startsWith("_") &&
      fs.existsSync(path.join(ROOT, d, "index.md"))
    );

  let count = 0;
  for (const slug of entries) {
    if (SKIP.has(slug)) continue;
    const file = path.join(ROOT, slug, "index.md");
    const raw = fs.readFileSync(file, "utf8");

    const m = /^---[\s\S]*?---\n/.exec(raw);
    const front = m ? m[0] : "";
    const body = m ? raw.slice(m[0].length) : raw;

    const cleaned = normalize(front, body);
    fs.writeFileSync(file, cleaned, "utf8");
    console.log(`✅ normalized: ${slug}`);
    count++;
  }
  console.log(`\nDone. Normalized ${count} chapter(s).`);
}

run();
