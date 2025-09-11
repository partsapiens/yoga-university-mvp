// Reflow manual into clean, original HTML.
// Reads:  content/manual/pages/**/*.md
// Writes: dist/manual/index.html + dist/manual/chapters/<chXX>/index.html

import fs from "fs";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";
import { marked } from "marked";
import slugify from "slugify";

const PAGES_DIR = "content/manual/pages";
const DIST_DIR = "dist/manual";
const TEMPLATE = "manual/template.html";

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });
const tpl = () => fs.readFileSync(TEMPLATE, "utf8");
const out = (p, html) => { ensureDir(path.dirname(p)); fs.writeFileSync(p, html, "utf8"); console.log("✓", p); };

const stripImages = (html) =>
  html
    .replace(/<img\b[^>]*>/gi, `<div class="placeholder"><span>Figure placeholder</span></div>`)
    .replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, `<div class="placeholder"><span>Figure placeholder</span></div>`);

const groupByChapter = (files) => {
  const map = new Map();
  files.forEach((f) => {
    const base = path.basename(f).toLowerCase();
    let ch = null;
    let m = /^ch(\d+)_p(\d+)\.md$/.exec(base);
    if (m) ch = `ch${m[1].padStart(2, "0")}`;
    else {
      let m2 = /^page-(\d+)\.md$/.exec(base);
      if (m2) { const n = Number(m2[1]); const bucket = Math.floor((n - 1) / 20) + 1; ch = `ch${String(bucket).padStart(2, "0")}`; }
    }
    if (!ch) return;
    if (!map.has(ch)) map.set(ch, []);
    map.get(ch).push(f);
  });
  for (const [k, list] of map) list.sort((a,b)=>a.localeCompare(b, undefined, {numeric:true,sensitivity:"base"}));
  return map;
};

const heading = (html) => {
  const h1 = /<h1[^>]*>(.*?)<\/h1>/i.exec(html); if (h1) return h1[1];
  const h2 = /<h2[^>]*>(.*?)<\/h2>/i.exec(html); if (h2) return h2[1];
  return (html.replace(/<[^>]+>/g," ").split(".")[0] || "Section").slice(0,80);
};

const buildChapter = (chKey, pages, templateStr) => {
  const num = Number(chKey.replace("ch",""));
  const title = `Chapter ${num} — Study Mode`;
  let sections = `
  <section class="section">
    <div class="kicker">Chapter ${num}</div>
    <h1>${title}</h1>
    <p class="note">Transformed, reflowed study version. Not the original PDF layout. Images replaced with placeholders.</p>
    <div class="hr"></div>
  </section>`;
  const toc = [];

  pages.forEach((file, idx) => {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const html0 = marked.parse(content);
    const html = stripImages(html0);
    const sectionTitle = data?.section || data?.title || heading(html) || `Section ${idx+1}`;
    const anchor = slugify(sectionTitle, {lower:true, strict:true}) || `section-${idx+1}`;
    toc.push(`<a href="#${anchor}">${sectionTitle}</a>`);
    sections += `
    <section class="section" id="${anchor}">
      <div class="kicker">Section ${idx+1}</div>
      <h2>${sectionTitle}</h2>
      <div class="content">${html}</div>
    </section>`;
  });

  const body = `
    <section class="section">
      <div class="kicker">Contents</div>
      <div class="toc">${toc.join("\n")}</div>
    </section>
    ${sections}
  `;

  const html = templateStr
    .replace("{{TITLE}}", title)
    .replace("{{BODY}}", body)
    .replace("{{FOOTER}}", `End of ${title}`);

  const dir = path.join(DIST_DIR, "chapters", chKey);
  out(path.join(dir, "index.html"), html);
  return { key: chKey, title, href: `chapters/${chKey}/index.html` };
};

const buildIndex = (chapters, templateStr) => {
  const links = chapters.map(c => `<li><a href="${c.href}">${c.title}</a></li>`).join("\n");
  const body = `
  <section class="section">
    <h1>Manual — Reflowed Study Version</h1>
    <p class="note">Reflowed into a clean, original layout. Images replaced with placeholders.</p>
  </section>
  <section class="section">
    <h2>Chapters</h2>
    <ol>${links}</ol>
  </section>`;
  const html = templateStr
    .replace("{{TITLE}}","Manual — Reflowed")
    .replace("{{BODY}}", body)
    .replace("{{FOOTER}}","Built from content/manual/pages");
  out(path.join(DIST_DIR, "index.html"), html);
};

(async function main(){
  const files = await glob(`${PAGES_DIR}/**/*.md`, { nodir: true });
  if (!files.length) { console.error(`No markdown files found in ${PAGES_DIR}.`); process.exit(2); }
  const templateStr = tpl();
  const chapters = groupByChapter(files);
  const built = [];
  for (const [ch, list] of chapters) built.push(buildChapter(ch, list, templateStr));
  buildIndex(built, templateStr);
  console.log("✅ Reflow build complete.");
})();