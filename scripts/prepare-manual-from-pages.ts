import fs from 'fs';
import path from 'path';

function normalize(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\u2022/g, '-')
    .split('\n')
    .filter((line) => !/\[(Top|Next|Prev)/i.test(line))
    .join('\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n\n');
}

function brandReplace(text: string): string {
  return text
    .replace(/CorePower University/gi, 'Yoga Flow University')
    .replace(/CorePower/gi, 'Yoga Flow')
    .replace(/CPYU/gi, 'YFU')
    .replace(/CPY/gi, 'YF');
}

function isTitleCase(line: string): boolean {
  const words = line.trim().split(/\s+/);
  if (words.length === 0 || words.length > 12) return false;
  return words.every((w) => /[A-Za-z]/.test(w) && w[0] === w[0].toUpperCase());
}

function detectHeading(line: string): string | null {
  const h = line.match(/^#{1,2}\s+(.+)/);
  if (h) {
    const title = h[1].trim();
    if (/^Page\s+\d+/i.test(title)) return null;
    return title;
  }
  if (/^[0-9]+$/.test(line.trim())) return null;
  if (
    line.trim().length > 0 &&
    line === line.toUpperCase() &&
    /[A-Z]/.test(line) &&
    !/PAGE\s+\d+/i.test(line)
  )
    return line.trim();
  return null;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const groups: [string, string[]][] = [
  ['Training', ['intention', 'journaling', 'exam', 'business', 'alliance', 'setup']],
  [
    'Teacher Toolkit',
    [
      'essentials',
      'environment',
      'blueprint',
      'formula',
      'cue',
      'theme',
      'alignment',
      'demo',
      'music',
      'sequencing',
      'teaching',
    ],
  ],
  [
    'Postures',
    [
      'sequence',
      'series',
      'salutation',
      'script',
      'integration',
      'triangle',
      'hip',
      'spine',
      'surrender',
      'crescent',
      'balancing',
    ],
  ],
  ['Assists and Options', ['assist', 'props', 'contraindications', 'options', 'challenges']],
  [
    'Anatomy',
    [
      'anatomy',
      'bones',
      'spine',
      'joints',
      'fascia',
      'ligaments',
      'tendons',
      'muscles',
      'nervous',
      'breath',
    ],
  ],
  [
    'History and Philosophy',
    [
      'sankalpa',
      'sutra',
      '8 limb',
      'yamas',
      'niyamas',
      'sanskrit',
      'pranayama',
      'bandhas',
      'chakras',
      'om',
    ],
  ],
  [
    'Self-Paced Lectures',
    [
      'history',
      'trauma',
      'kleshas',
      'cultural',
      'implicit',
      'pregnancy',
      'mythology',
      'ayurveda',
      'koshas',
    ],
  ],
];

function inferGroup(title: string, body: string): string {
  const haystack = `${title} ${body}`.toLowerCase();
  for (const [group, keywords] of groups) {
    if (keywords.some((k) => haystack.includes(k))) return group;
  }
  return 'Training';
}

const pagesDir = path.join(process.cwd(), 'content/manual/pages');
const manualDir = path.join(process.cwd(), 'content/manual');

const files = fs
  .readdirSync(pagesDir)
  .filter((f) => f.startsWith('page-'))
  .sort();

const joined = files
  .map((f) => fs.readFileSync(path.join(pagesDir, f), 'utf8'))
  .join('\n');

let text = brandReplace(normalize(joined));

const lines = text.split('\n');
const chapterMap = new Map<string, { title: string; body: string[] }>();
const orderKeys: string[] = [];
let currentKey: string | null = null;

for (const line of lines) {
  const heading = detectHeading(line);
  if (heading) {
    const key = heading.toLowerCase();
    if (!chapterMap.has(key)) {
      chapterMap.set(key, { title: heading, body: [] });
      orderKeys.push(key);
    }
    currentKey = key;
  } else if (currentKey) {
    chapterMap.get(currentKey)!.body.push(line);
  }
}

const chapters = orderKeys.map((key) => ({
  title: chapterMap.get(key)!.title,
  body: chapterMap.get(key)!.body.join('\n').trim(),
}));

const manifestChapters: any[] = [];
let order = 1;
const usedSlugs = new Set<string>();

for (const ch of chapters) {
  let slug = slugify(ch.title);
  if (!slug) slug = `section-${order}`;
  while (usedSlugs.has(slug)) {
    slug = `${slug}-${order}`;
  }
  usedSlugs.add(slug);
  const dir = path.join(manualDir, slug);
  if (fs.existsSync(dir)) {
    const backupDir = path.join(
      manualDir,
      '_backup',
      `${slug}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    );
    fs.mkdirSync(path.dirname(backupDir), { recursive: true });
    fs.renameSync(dir, backupDir);
  }
  fs.mkdirSync(dir, { recursive: true });

  const group = inferGroup(ch.title, ch.body);
  const summary = ch.body.replace(/\s+/g, ' ').slice(0, 180);
  const frontMatter =
    '---\n' +
    `title: '${ch.title.replace(/'/g, "''")}'\n` +
    `slug: '${slug}'\n` +
    `group: '${group}'\n` +
    `order: ${order}\n` +
    `summary: '${summary.replace(/'/g, "''")}'\n` +
    'tags: []\n' +
    '---\n\n';
  fs.writeFileSync(path.join(dir, 'index.md'), frontMatter + ch.body.trim() + '\n');
  manifestChapters.push({ slug, title: ch.title, group, order, summary });
  order++;
}

const manifest = {
  title: 'Yoga Teacher Training Manual',
  version: 'v1',
  chapters: manifestChapters,
};

fs.writeFileSync(
  path.join(manualDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

const rawDir = path.join(manualDir, '_pages_raw');
if (fs.existsSync(rawDir)) {
  const backup = `${rawDir}-${Date.now()}`;
  fs.renameSync(rawDir, backup);
}
fs.renameSync(pagesDir, rawDir);

console.log(`Generated ${chapters.length} chapters.`);

