import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getManifest, neighborSlugs, readChapter } from '@/lib/manual';
import Link from 'next/link';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const manifest = getManifest();
  return manifest.chapters.map((c) => ({ slug: c.slug }));
}

export default function ChapterPage({ params }: Props) {
  const manifest = getManifest();
  const { content } = readChapter(params.slug);
  const nav = neighborSlugs(manifest, params.slug);
  const groups = Array.from(new Set(manifest.chapters.map((c) => c.group)));

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 flex">
        <aside className="hidden lg:block w-64 pr-8 sticky top-10 h-[calc(100vh-5rem)] overflow-y-auto">
          {groups.map((g) => (
            <div key={g} className="mb-6">
              <h2 className="text-sm font-semibold mb-2">{g}</h2>
              <ul className="space-y-1">
                {manifest.chapters
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <li key={c.slug} className={c.slug === params.slug ? 'font-semibold' : ''}>
                      <Link href={`/manual/${c.slug}`}>{c.title}</Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </aside>
        <article className="prose prose-neutral lg:prose-lg max-w-none flex-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white/80 backdrop-blur py-4">
        <nav className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          {nav.prev ? <Link href={`/manual/${nav.prev.slug}`}>← {nav.prev.title}</Link> : <span />}
          <span className="text-xs text-gray-500">{nav.index + 1} / {nav.total}</span>
          {nav.next ? <Link href={`/manual/${nav.next.slug}`}>{nav.next.title} →</Link> : <span />}
        </nav>
      </footer>
    </>
  );
}

