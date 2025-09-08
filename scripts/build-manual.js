const fs = require('fs');
const path = require('path');
const { remark } = require('remark');
const html = require('remark-html');

const srcDir = path.join(process.cwd(), 'content', 'manual', 'pages');
const outDir = path.join(process.cwd(), 'public', 'manual', 'pages');
const manifestPath = path.join(process.cwd(), 'public', 'manual', 'manifest.json');
const assetsDir = path.join(process.cwd(), 'public', 'manual', 'assets');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md')).sort();
const pages = [];

files.forEach((filename, idx) => {
  const fullPath = path.join(srcDir, filename);
  const markdown = fs.readFileSync(fullPath, 'utf8');
  const [body] = markdown.split('\n---');
  const result = remark().use(html.default).processSync(body);
  const pageNum = String(idx + 1).padStart(3, '0');
  const outFile = `page_${pageNum}.html`;
  fs.writeFileSync(path.join(outDir, outFile), result.toString(), 'utf8');
  pages.push(`pages/${outFile}`);
});

fs.writeFileSync(manifestPath, JSON.stringify({ pages }, null, 2));
console.log(`Generated ${pages.length} pages.`);
