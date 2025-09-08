import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const MANUAL_DIR = path.join(ROOT, "content", "manual");

export async function readIndexMd() {
  const p = path.join(MANUAL_DIR, "index.md");
  return fs.readFile(p, "utf8");
}

export async function listPages() {
  const dir = path.join(MANUAL_DIR, "pages");
  const files = (await fs.readdir(dir)).filter(f => f.endsWith(".md")).sort();
  return files.map(f => ({ slug: f.replace(/\.md$/, ""), file: path.join(dir, f) }));
}

export async function readPage(slug: string) {
  const file = path.join(MANUAL_DIR, "pages", `${slug}.md`);
  return fs.readFile(file, "utf8");
}
