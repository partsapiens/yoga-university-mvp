import fs from "node:fs/promises";
import path from "node:path";
const ROOT = process.cwd();
const MANUAL_DIR = path.join(ROOT, "content", "manual");
const PAGES_DIR = path.join(MANUAL_DIR, "pages");
const OUT = path.join(ROOT, "public", "manual-index.json");

const files = (await fs.readdir(PAGES_DIR)).filter(f => f.endsWith(".md")).sort();
const docs = [];
for (const f of files) {
  const slug = f.replace(/\.md$/, "");
  const raw = await fs.readFile(path.join(PAGES_DIR, f), "utf8");
  const title = (raw.match(/^#\s+(.+)$/m) || [,"Untitled"])[1];
  // Strip markdown for index
  const text = raw
    .replace(/^#.+$/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  docs.push({ slug, title, text: text.slice(0, 50000) });
}
await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, JSON.stringify(docs));
console.log(`Wrote index with ${docs.length} pages -> ${OUT}`);
