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
  const { frontMatter, content } = readChapter(params.slug);
  const nav = neighborSlugs(manifest, params.slug);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <article className="prose prose-neutral lg:prose-lg max-w-none">
        <h1>{frontMatter.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>

      <nav className="mt-10 pt-6 border-t flex items-center justify-between">
        {nav.prev ? <Link href={`/manual/${nav.prev.slug}`}>← {nav.prev.title}</Link> : <span />}
        <span className="text-xs text-gray-500">{nav.index + 1} / {nav.total}</span>
        {nav.next ? <Link href={`/manual/${nav.next.slug}`}>{nav.next.title} →</Link> : <span />}
      </nav>
    </div>
  );
}

