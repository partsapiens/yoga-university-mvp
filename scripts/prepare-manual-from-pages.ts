/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PAGES_DIR = path.join(process.cwd(), "content/manual/pages");
const OUT_DIR   = path.join(process.cwd(), "content/manual");
const TOC_PATH  = path.join(process.cwd(), "content/manual/toc.json");

const BRAND_REPLACEMENTS: Array<[RegExp, string]> = [
  [/CorePower University/gi, "Yoga Flow University"],
  [/CorePower/gi,            "Yoga Flow"],
  [/CPYU/gi,                 "YFU"],
  [/CPY/gi,                  "YF"],
];

function kebab(s:string){ return s.toLowerCase().replace(/[^\w\s-]/g,"").trim().replace(/\s+/g,"-"); }

function clean(s:string){
  let t = s;
  t = t.replace(/\u00A0/g," ").replace(/[ \t]+/g," ").replace(/[ ]+\n/g,"\n");
  t = t.replace(/\b\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2}\b/g, ""); // remove timecodes like 1:05–1:10
  t = t.replace(/^\s*[A-Za-z]?\s*\d{1,3}\s*$/gm, "");            // lone page/line numbers
  t = t.replace(/([A-Z]{2,})([A-Z][a-z])/g, "$1 $2");            // smashed CAPSWORDS
  t = t.replace(/•\s*/g, "- ");                                  // bullets
  for (const [re, repl] of BRAND_REPLACEMENTS) t = t.replace(re, repl);
  t = t.replace(/\n{3,}/g, "\n\n").trim();
  return t;
}

type Toc = { title:string; chapters: { title:string; group?:string }[] };

function readAllPages(): string {
  if (!fs.existsSync(PAGES_DIR)) { console.error(`❌ Not found: ${PAGES_DIR}`); process.exit(1); }
  const files = fs.readdirSync(PAGES_DIR).filter(f => /\.md$/i.test(f)).sort((a,b)=> a.localeCompare(b));
  const parts = files.map(f => fs.readFileSync(path.join(PAGES_DIR,f),"utf8"));
  return parts.join("\n\n");
}

function splitByTOC(full:string, toc: Toc){
  const cleaned = clean(full);
  const lower = cleaned.toLowerCase();
  const idxs: { title:string; start:number }[] = [];
  let cursor = 0;
  for (const ch of toc.chapters) {
    const titleLower = ch.title.toLowerCase();
    const i = lower.indexOf(titleLower, cursor);
    if (i !== -1) {
      idxs.push({ title: ch.title, start: i });
      cursor = i;
    }
  }
  const chunks: { title:string; body:string }[] = [];
  for (let i=0;i<idxs.length;i++){
    const cur = idxs[i];
    const next = idxs[i+1];
    const start = cur.start + cur.title.length;
    const slice = cleaned.slice(start, next ? next.start : undefined).trim();
    chunks.push({ title: cur.title, body: slice });
  }
  return chunks;
}

function writeChapters(chunks: {title:string; body:string}[], toc:Toc){
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const backupDir = path.join(OUT_DIR, `_backup_${Date.now()}`);
  const existing = fs.readdirSync(OUT_DIR).filter(d => d !== "pages" && d !== "toc.json" && d !== "manifest.json" && !d.startsWith("_backup_"));
  if (existing.length){
    fs.mkdirSync(backupDir, { recursive: true });
    for (const d of existing){ fs.renameSync(path.join(OUT_DIR, d), path.join(backupDir, d)); }
    console.log(`🗄️  Moved existing chapters to ${path.basename(backupDir)}`);
  }

  const manifest = {
    title: toc.title || "Yoga Teacher Training Manual",
    version: "v1",
    chapters: [] as { slug:string; title:string; group:string; order:number; summary?:string }[]
  };

  chunks.forEach((ch, i)=>{
    const group = (toc.chapters.find(c => c.title === ch.title)?.group) || "Training";
    const slug  = kebab(ch.title);
    const body  = ch.body.trim();
    const plain = body.replace(/[#>*_`]/g,"").replace(/\s+/g," ").trim();
    const summary = plain.slice(0, 180) + (plain.length>180 ? "…" : "");

    const dir = path.join(OUT_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });

    const md = matter.stringify(`# ${ch.title}\n\n${body}\n`, {
      title: ch.title, slug, group, order: i+1, summary, tags: []
    });
    fs.writeFileSync(path.join(dir, "index.md"), md, "utf8");
    manifest.chapters.push({ slug, title: ch.title, group, order: i+1, summary });
  });

  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(`✅ Wrote ${manifest.chapters.length} chapters + manifest.json`);
}

(function main(){
  if (!fs.existsSync(TOC_PATH)) { console.error(`❌ Missing TOC file: ${TOC_PATH}`); process.exit(1); }
  const toc = JSON.parse(fs.readFileSync(TOC_PATH,"utf8")) as Toc;
  const full = readAllPages();
  const chunks = splitByTOC(full, toc);
  if (!chunks.length) { console.error("❌ No chapters found. Check toc titles match the text exactly."); process.exit(1); }
  writeChapters(chunks, toc);
})();
