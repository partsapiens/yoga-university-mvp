import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const manualDirectory = path.join(process.cwd(), 'content/manual');

export function getManualPages() {
  const pagesDirectory = path.join(manualDirectory, 'pages');
  const filenames = fs.readdirSync(pagesDirectory);

  const pages = filenames.map(filename => {
    const id = filename.replace(/\.md$/, '');
    const fullPath = path.join(pagesDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const match = matterResult.content.trim().match(/^#\s+(.*)/);
    const title = match ? match[1].trim() : id;

    return {
      id,
      title,
      ...matterResult.data,
    };
  });

  return pages.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    } else {
      return 1;
    }
  });
}

export async function getManualPage(id: string) {
  const fullPath = path.join(manualDirectory, 'pages', `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  const match = matterResult.content.trim().match(/^#\s+(.*)/);
  const title = match ? match[1].trim() : id;

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    title,
    contentHtml,
    ...matterResult.data,
  };
}

export async function getTableOfContents() {
    const fullPath = path.join(manualDirectory, 'index.md');
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
        contentHtml,
    };
}
