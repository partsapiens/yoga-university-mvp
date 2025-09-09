import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getManifest, readChapter, neighborSlugs } from '@/lib/manual';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const manifest = getManifest();
  return manifest.chapters.map((c) => ({ slug: c.slug }));
}

export default function ManualChapter({ params }: Props) {
  const { slug } = params;
  const chapter = readChapter(slug);
  const manifest = getManifest();
  const neighbors = neighborSlugs(manifest, slug);

  return (
    <div className="prose mx-auto p-4">
      <h1>{chapter.data.title}</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{chapter.content}</ReactMarkdown>
      <hr />
      <div className="flex justify-between py-4 text-sm">
        {neighbors.prev ? (
          <Link href={`/manual/${neighbors.prev}`}>← Previous</Link>
        ) : (
          <span />
        )}
        <span>
          {neighbors.index} / {neighbors.total}
        </span>
        {neighbors.next ? (
          <Link href={`/manual/${neighbors.next}`}>Next →</Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

