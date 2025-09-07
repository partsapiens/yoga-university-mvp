const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { JSDOM } = require('jsdom');

// --- Configuration ---
const DEFAULT_INPUT_FILE = 'manual.html';
const DEFAULT_OUTPUT_DIR = 'public/manual';

// --- Helper Functions ---

/**
 * Parses command-line arguments for --in and --out flags.
 * @returns {{inputFile: string, outputDir: string}}
 */
function getArgs() {
  const args = process.argv.slice(2);
  const inputFileArg = args.find(arg => arg.startsWith('--in='));
  const outputDirArg = args.find(arg => arg.startsWith('--out='));

  const inputFile = inputFileArg ? inputFileArg.split('=')[1] : DEFAULT_INPUT_FILE;
  const outputDir = outputDirArg ? outputDirArg.split('=')[1] : DEFAULT_OUTPUT_DIR;

  return { inputFile, outputDir };
}

/**
 * Ensures the output directories exist.
 * @param {string} outputDir - The base output directory.
 * @param {string} pagesDir - The subdirectory for page text files.
 */
function ensureDirectories(outputDir, pagesDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
}

/**
 * Extracts text content from an HTML element, preserving some structure.
 * @param {Element} element - The HTML element to extract text from.
 * @returns {string}
 */
function extractText(element) {
  let text = '';
  // Replace some block elements with newlines to preserve structure
  element.querySelectorAll('h1, h2, h3, p, li').forEach(el => {
    text += el.textContent.trim() + '\n';
  });
  // Clean up extra whitespace and newlines
  return text.replace(/\s\s+/g, ' ').replace(/\n\n+/g, '\n').trim();
}

// --- Main Execution ---

function main() {
  console.log('Starting manual preparation script...');

  const { inputFile, outputDir } = getArgs();
  const pagesDir = path.join(outputDir, 'pages');

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found at "${inputFile}"`);
    console.error('Please place your manual HTML file at the root of the project or specify its path with --in=<path>');
    process.exit(1);
  }

  ensureDirectories(outputDir, pagesDir);

  const htmlContent = fs.readFileSync(inputFile, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Page splitting strategy:
  // The provided HTML uses `<section class="page" id="page-X">` for each page.
  // This is a reliable delimiter to split the content correctly.
  const pageSections = document.querySelectorAll('section.page');

  if (pageSections.length === 0) {
    console.error('Error: Could not find any page sections in the input file. Make sure it contains `<section class="page">` elements.');
    process.exit(1);
  }

  const manifest = {
    title: "CPYU 200HR Power Yoga",
    version: "v1",
    pages: pageSections.length,
    files: [],
    generatedAt: new Date().toISOString(),
  };

  console.log(`Found ${pageSections.length} pages. Processing...`);

  pageSections.forEach((section, index) => {
    const pageNum = index + 1;
    const pageText = extractText(section);
    const pageFileName = `page_${String(pageNum).padStart(3, '0')}.txt`;
    const pageFilePath = path.join(pagesDir, pageFileName);

    // Calculate SHA1 hash of the content
    const hash = crypto.createHash('sha1').update(pageText).digest('hex');

    fs.writeFileSync(pageFilePath, pageText, { encoding: 'utf-8' });

    manifest.files.push({
      i: pageNum,
      file: `pages/${pageFileName}`,
      chars: pageText.length,
      sha1: hash,
    });
  });

  const manifestFilePath = path.join(outputDir, 'manifest.json');
  fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2), { encoding: 'utf-8' });

  console.log(`✅ Successfully processed ${manifest.pages} pages.`);
  console.log(`Manifest written to: ${manifestFilePath}`);
  console.log(`Page files written to: ${pagesDir}`);
}

main();
