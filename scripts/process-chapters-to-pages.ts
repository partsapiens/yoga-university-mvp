/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/manual");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");

// Brand replacements as specified in requirements
const BRAND_REPLACEMENTS: Array<[RegExp, string]> = [
  [/CorePower University/gi, "Yoga Flow University"],
  [/CorePower/gi, "Yoga Flow"],
  [/CPYU/gi, "YFU"],
  [/CPY/gi, "YF"],
];

function applyBrandReplacements(text: string): string {
  let result = text;
  for (const [pattern, replacement] of BRAND_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

interface ChapterMeta {
  slug: string;
  title: string;
  group: string;
  order: number;
  summary: string;
}

interface Manifest {
  title: string;
  version: string;
  chapters: ChapterMeta[];
}

async function processChaptersToPages() {
  console.log("🔄 Processing chapters to page-based manual...");

  // Read manifest
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error("❌ Manifest not found. Run npm run build:manual first");
    process.exit(1);
  }

  const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  console.log(`📖 Found ${manifest.chapters.length} chapters`);

  // Process each chapter
  let pageNumber = 1;
  const pages = [];

  for (const chapter of manifest.chapters) {
    console.log(`📄 Processing: ${chapter.title}`);
    
    const chapterDir = path.join(CONTENT_DIR, chapter.slug);
    const indexPath = path.join(chapterDir, "index.md");
    
    if (!fs.existsSync(indexPath)) {
      console.warn(`⚠️  Chapter file not found: ${indexPath}`);
      continue;
    }

    // Read chapter content
    const raw = fs.readFileSync(indexPath, "utf8");
    const { data, content } = matter(raw);
    
    // Apply brand replacements
    const processedTitle = applyBrandReplacements(chapter.title);
    const processedContent = applyBrandReplacements(content);
    const processedSummary = applyBrandReplacements(chapter.summary || "");

    // Split content into logical pages (for now, each chapter is one page)
    // In the future, this could split by headings, paragraphs, etc.
    const pageData = {
      page_number: pageNumber,
      title: processedTitle,
      content: processedContent,
      chapter: chapter.group,
      slug: chapter.slug,
      summary: processedSummary,
    };

    pages.push(pageData);
    pageNumber++;
  }

  console.log(`📚 Created ${pages.length} pages`);

  // Try Supabase if environment is configured
  let supabaseSuccess = false;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Clear existing pages
      const { error: deleteError } = await supabase
        .from('manual_pages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) {
        console.warn(`⚠️  Could not clear existing pages: ${deleteError.message}`);
      }

      // Insert new pages
      const { data: insertedPages, error: insertError } = await supabase
        .from('manual_pages')
        .insert(pages)
        .select();

      if (insertError) {
        console.error(`❌ Error inserting pages: ${insertError.message}`);
        throw insertError;
      }

      console.log(`✅ Successfully inserted ${insertedPages?.length || 0} pages into Supabase`);
      supabaseSuccess = true;
    } else {
      console.log("ℹ️  Supabase environment variables not configured, skipping database insert");
    }

  } catch (error) {
    console.warn(`⚠️  Supabase error occurred: ${error}`);
  }

  if (!supabaseSuccess) {
    console.log("📝 Writing pages to local JSON file...");
    
    // Write to local file
    const pagesDir = path.join(process.cwd(), "public/manual/pages-data");
    fs.mkdirSync(pagesDir, { recursive: true });
    
    fs.writeFileSync(
      path.join(pagesDir, "pages.json"),
      JSON.stringify(pages, null, 2),
      "utf8"
    );

    // Create individual page files for static serving
    pages.forEach(page => {
      const pageFile = `page_${String(page.page_number).padStart(3, '0')}.json`;
      fs.writeFileSync(
        path.join(pagesDir, pageFile),
        JSON.stringify(page, null, 2),
        "utf8"
      );
    });

    console.log(`✅ Pages written to ${pagesDir}`);
  }

  // Update public manifest for page-based system
  const pageManifest = {
    title: applyBrandReplacements(manifest.title),
    version: "v2", // Page-based version
    totalPages: pages.length,
    pages: pages.map(p => ({
      page_number: p.page_number,
      title: p.title,
      chapter: p.chapter,
      slug: p.slug,
      summary: p.summary
    }))
  };

  const publicManifestPath = path.join(process.cwd(), "public/manual/page-manifest.json");
  fs.writeFileSync(publicManifestPath, JSON.stringify(pageManifest, null, 2), "utf8");
  
  console.log(`✅ Page manifest written to ${publicManifestPath}`);
  console.log("🎉 Chapter to page processing complete!");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  processChaptersToPages().catch(console.error);
}

export { processChaptersToPages, applyBrandReplacements };