/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PAGES_DIR = path.join(process.cwd(), "content/manual/pages");
const OUT_DIR = path.join(process.cwd(), "content/manual");
const TOC_PATH = path.join(process.cwd(), "content/manual/toc.json");

const BRAND_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bCorePower University\b/gi, "Yoga Flow University"],
  [/\bCorePower\b/gi, "Yoga Flow"],
  [/\bCPYU\b/gi, "YFU"],
  [/\bCPY\b/gi, "YF"],
];

function kebab(s: string) {
  return s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

function clean(s: string) {
  let t = s;
  t = t.replace(/\u00A0/g, " ").replace(/[ \t]+/g, " ").replace(/[ ]+\n/g, "\n");
  t = t.replace(/\b\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}\b/g, "");
  t = t.replace(/^\s*[A-Za-z]?\s*\d{1,3}\s*$/gm, "");
  t = t.replace(/([A-Z]{2,})([A-Z][a-z])/g, "$1 $2");
  t = t.replace(/•\s*/g, "- ");
  for (const [re, repl] of BRAND_REPLACEMENTS) t = t.replace(re, repl);
  t = t.replace(/\n{3,}/g, "\n\n").trim();
  return t;
}

type Toc = { title: string; chapters: { title: string; group?: string }[] };

function readAllPages(): string {
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`❌ Not found: ${PAGES_DIR}`);
    process.exit(1);
  }
  const files = fs
    .readdirSync(PAGES_DIR)
    .filter((f) => /\.md$/i.test(f))
    .sort((a, b) => a.localeCompare(b));
  const parts = files.map((f) => fs.readFileSync(path.join(PAGES_DIR, f), "utf8"));
  return parts.join("\n\n");
}

function stripGlobalJunk(s: string) {
  let t = s;
  t = t.replace(/(?:^|\n)\s*(?:Table of Contents|Contents)\s*\n[\s\S]*?(?=\n[A-Z].{0,80}\n)/gi, "\n");
  t = t.replace(/^(?=[^a-z]*\d)(?:(?:\d+\.){2,}\d+|\d+(?:\.\d+){2,})(?:[^\n]*)$/gim, "");
  t = t.replace(/This document contains[\s\S]*?Yoga Flow[\s\S]*?prohibited[\s\S]*?(?:\n|$)/gi, "");
  t = t.replace(/^\s*#?\s*Page\s+\d+\s*$/gim, "");
  return t;
}

function splitByTOC(full: string, toc: Toc) {
  const text = "\n" + clean(full) + "\n";
  const idxs: { title: string; start: number }[] = [];
  for (const ch of toc.chapters) {
    const title = ch.title.trim();
    const re = new RegExp(`\n(?:#{1,3}\s+)?${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\s*\n`, "i");
    const m = re.exec(text);
    if (m) idxs.push({ title, start: m.index + 1 });
  }
  idxs.sort((a, b) => a.start - b.start);
  const chunks: { title: string; body: string }[] = [];
  for (let i = 0; i < idxs.length; i++) {
    const cur = idxs[i], next = idxs[i + 1];
    const slice = text.slice(cur.start, next ? next.start : undefined).trim();
    chunks.push({ title: cur.title, body: slice });
  }
  return chunks;
}

function stripChunkTOC(s: string) {
  let t = s;
  t = t.replace(/^(?:[A-Z ]+)?\s*(?:\d+(?:\.\d+){2,})(?:\s*[A-Za-z]+)?[^\n]*$/gim, "");
  t = t.replace(/^\s*Contents\s*$/gim, "");
  t = t.replace(/This document contains[\s\S]*?Yoga Flow[\s\S]*?prohibited[\s\S]*?(?:\n|$)/gi, "");
  return t;
}

function writeChapters(chunks: { title: string; body: string }[], toc: Toc) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const backupDir = path.join(OUT_DIR, `_backup_${Date.now()}`);
  const existing = fs
    .readdirSync(OUT_DIR)
    .filter((d) => d !== "pages" && d !== "toc.json" && d !== "manifest.json");
  if (existing.length) {
    fs.mkdirSync(backupDir, { recursive: true });
    for (const d of existing) {
      fs.renameSync(path.join(OUT_DIR, d), path.join(backupDir, d));
    }
    console.log(`🗄️  Moved existing chapters to ${path.basename(backupDir)}`);
  }

  const manifest = {
    title: toc.title || "Yoga Teacher Training Manual",
    version: "v1",
    chapters: [] as {
      slug: string;
      title: string;
      group: string;
      order: number;
      summary?: string;
    }[],
  };

  chunks.forEach((ch, i) => {
    const group = toc.chapters.find((c) => c.title === ch.title)?.group || "Training";
    const slug = kebab(ch.title);
    const body = stripChunkTOC(ch.body).trim();
    const plain = body.replace(/[#>*_`]/g, "").replace(/\s+/g, " ").trim();
    const summary = plain.slice(0, 180) + (plain.length > 180 ? "…" : "");

    const dir = path.join(OUT_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });

    const md = matter.stringify(`# ${ch.title}\n\n${body}\n`, {
      title: ch.title,
      slug,
      group,
      order: i + 1,
      summary,
      tags: [],
    });
    fs.writeFileSync(path.join(dir, "index.md"), md, "utf8");
    manifest.chapters.push({ slug, title: ch.title, group, order: i + 1, summary });
  });

  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(`✅ Wrote ${manifest.chapters.length} chapters + manifest.json`);
}

(function main() {
  if (!fs.existsSync(TOC_PATH)) {
    console.error(`❌ Missing TOC file: ${TOC_PATH}`);
    process.exit(1);
  }
  const toc = JSON.parse(fs.readFileSync(TOC_PATH, "utf8")) as Toc;
  const full0 = readAllPages();
  const full = stripGlobalJunk(full0);
  const chunks = splitByTOC(full, toc);
  if (!chunks.length) {
    console.error("❌ No chapters found. Check toc titles match the text exactly.");
    process.exit(1);
  }
  writeChapters(chunks, toc);
})();

