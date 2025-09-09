import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ChapterMeta {
  slug: string;
  title: string;
  group: string;
  order: number;
  summary: string;
}

export interface Manifest {
  title: string;
  version: string;
  chapters: ChapterMeta[];
}

export function getManifest(): Manifest {
  const file = path.join(process.cwd(), 'content/manual/manifest.json');
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Manifest;
}

export function listGroups(): string[] {
  const manifest = getManifest();
  return Array.from(new Set(manifest.chapters.map((c) => c.group)));
}

export function readChapter(slug: string) {
  const file = path.join(process.cwd(), 'content/manual', slug, 'index.md');
  const raw = fs.readFileSync(file, 'utf8');
  return matter(raw);
}

export function neighborSlugs(manifest: Manifest, slug: string) {
  const idx = manifest.chapters.findIndex((c) => c.slug === slug);
  return {
    prev: idx > 0 ? manifest.chapters[idx - 1].slug : null,
    next: idx < manifest.chapters.length - 1 ? manifest.chapters[idx + 1].slug : null,
    index: idx + 1,
    total: manifest.chapters.length,
  };
}

