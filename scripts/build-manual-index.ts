import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';

async function build() {
  const base = path.join(process.cwd(), 'content/manual');
  const dirs = fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
    .map((d) => d.name);

  const items: any[] = [];

  for (const dir of dirs) {
    const file = path.join(base, dir, 'index.md');
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    const plain = (await remark().use(strip).process(content)).toString().replace(/\s+/g, ' ').trim();
    items.push({
      slug: data.slug,
      title: data.title,
      group: data.group,
      summary: data.summary,
      content: plain,
    });
  }

  const outDir = path.join(process.cwd(), 'public/manual');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'search-index.json'), JSON.stringify(items, null, 2));
}

build();

