/* eslint-disable no-console */
import fs from "fs";
import path from "path";

const ROOT = "content/manual";

function isChapterDir(d: string) {
  return (
    d !== "manifest.json" &&
    d !== "pages" &&
    !d.startsWith("_") &&
    fs.existsSync(path.join(ROOT, d, "index.md"))
  );
}

// --- helpers ---
function dropNavPageAndLegal(s: string) {
  return s
    .replace(/^\s*\[(?:←\s*)?Prev\]\([^)]*\).*\n?/gim, "")
    .replace(/^\s*\[Top\]\([^)]*\).*\n?/gim, "")
    .replace(/^\s*\[(?:Next\s*→?)\]\([^)]*\).*\n?/gim, "")
    .replace(/^\s*#?\s*Page\s+\d+\s*$/gim, "")
    .replace(/^\s*[A-Za-z]?\s*\d{1,4}\s*$/gm, "")
    .replace(/\b\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}\b/g, "")
    .replace(/This document contains[\s\S]*?Yoga Flow[\s\S]*?prohibited[\s\S]*?(?:\n|$)/gi, "");
}

function removeTOCNumberBlobs(s: string) {
  return s.replace(/^(?=[^a-z]*\d)(?:(?:\d+\.){2,}\d+|\d+(?:\.\d+){2,})(?:[^\n]*)$/gim, "");
}

function ensureSingleH1(front: string, body: string) {
  const match = /^---[\s\S]*?\btitle:\s*"?([^"\n]+)"?[\s\S]*?---\n/.exec(front);
  const title = match ? match[1].trim() : "";
  let t = body.replace(/^#\s+.*\n/, "").trimStart();
  return title ? `# ${title}\n\n${t}` : t;
}

function fixJoinsAndLists(s: string) {
  let t = s;
  t = t.replace(/([.,;:!?])([A-Za-z])/g, "$1 $2");
  t = t.replace(/([A-Z]{2,})([A-Z][a-z])/g, "$1 $2");
  t = t.replace(/([a-z])([A-Z])/g, "$1 $2");
  t = t.replace(/([A-Za-z])(\d)/g, "$1 $2").replace(/(\d)([A-Za-z])/g, "$1 $2");
  t = t.replace(/^(?:\s*[•·]\s*)/gm, "- ");
  t = t.replace(/((?:^|\n)[^\n]{3,}?)(?:\s-\s+[^\n]{2,}){2,}/g, (block) => {
    const parts = block.split(/\s-\s+/);
    const head = parts.shift()!;
    return [head, ...parts.map((p) => `- ${p.trim()}`)].join("\n");
  });
  t = t.replace(/(?<=\S)(\d{1,3})\.\s/g, "\n$1. ");
  t = t.replace(/(?:^|\n)\s*(\d{1,3})\.\s*/g, "\n$1. ");
  t = t.replace(/(\n\d{1,3}\.)\s{2,}/g, "$1 ");
  return t;
}

function promoteCommonHeadings(s: string) {
  const cues: Array<[RegExp, string | ((m: string) => string)]> = [
    [/^\s*(?:SENSE\s*CHECK)\b[:\-]?\s*/i, "## Sense Check\n\n"],
    [/^\s*(?:YOUR\s*MANTRA|MANTRA)\b[:\-]?\s*/i, "## Mantra\n\n"],
    [/^\s*(?:GRATITUDE)\b[:\-]?\s*/i, "## Gratitude\n\n"],
    [/^\s*(?:INTENTION)\b[:\-]?\s*/i, "## Intention\n\n"],
    [/^\s*(?:PRANAYAMA|BREATH)\b[:\-]?\s*/i, "## Breath Practice\n\n"],
    [/^\s*(?:REFLECTION|JOURNAL(?:ING)?)\b[:\-]?\s*/i, "## Reflection\n\n"],
    [/^\s*(?:CONTRAINDICATIONS?)\b[:\-]?\s*/i, "## Contraindications\n\n"],
    [/^\s*(?:PART\s+(ONE|TWO|THREE|FOUR))\b[:\-]?\s*/i, (m) => `## ${m[0].trim()}\n\n`],
  ];
  let out = s;
  for (const [re, h] of cues) {
    out = (out as any).replace(re, typeof h === "string" ? h : (m: string) => (h as any)(m));
  }
  return out;
}

function tidyWhitespace(s: string) {
  return (
    s
      .replace(/\u00A0/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/[ ]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() + "\n"
  );
}

function processOne(file: string) {
  const raw = fs.readFileSync(file, "utf8");
  const fm = /^---[\s\S]*?---\n/.exec(raw);
  const front = fm ? fm[0] : "";
  let body = fm ? raw.slice(fm[0].length) : raw;

  body = dropNavPageAndLegal(body);
  body = removeTOCNumberBlobs(body);
  body = ensureSingleH1(front, body);
  body = fixJoinsAndLists(body);
  body = promoteCommonHeadings(body);
  body = tidyWhitespace(body);

  fs.writeFileSync(file, front + body, "utf8");
}

(function run() {
  const slugs = fs.readdirSync(ROOT).filter(isChapterDir);
  let n = 0;
  for (const slug of slugs) {
    processOne(path.join(ROOT, slug, "index.md"));
    console.log("✅ cleaned:", slug);
    n++;
  }
  console.log(`\nDone. Cleaned ${n} chapters.`);
})();

