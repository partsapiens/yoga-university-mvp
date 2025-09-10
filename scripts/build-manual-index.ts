/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT = path.join(process.cwd(), "content/manual");
const OUT = path.join(process.cwd(), "public/manual/search-index.json");

const manifest = JSON.parse(fs.readFileSync(path.join(CONTENT, "manifest.json"), "utf8"));
const entries = manifest.chapters.map((ch:any) => {
  const md = fs.readFileSync(path.join(CONTENT, ch.slug, "index.md"), "utf8");
  const { content } = matter(md);
  const plain = content.replace(/[\#>*_`]/g, "").replace(/\s+/g, " ").trim();
  return { slug: ch.slug, title: ch.title, group: ch.group, summary: ch.summary, content: plain };
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(entries), "utf8");
console.log(`✅ search-index.json (${entries.length})`);
