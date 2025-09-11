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

  // Format content to fix the "wall of text" issue
  const formatContent = (content: string) => {
    if (!content) return content;
    
    // Add proper paragraph breaks and formatting for Sanskrit terms and key concepts
    let formatted = content
      // Split long run-on sentences into paragraphs
      .replace(/([.!?])\s*([A-Z][a-z])/g, '$1\n\n$2')
      // Handle Sanskrit terms with proper formatting
      .replace(/([a-z])([A-Z][a-z]*)/g, '$1 $2')
      // Add space before capital letters that follow lowercase
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Fix specific patterns like "chakrasChakra" 
      .replace(/chakras([A-Z])/g, 'chakras. $1')
      // Add breaks before common section starters
      .replace(/(INBALANCE|OUTOFBALANCE|sanskrit:|meaning:|location:|color:|essence:|governs:|actions:|postures)/g, '\n\n**$1**')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Clean up excessive line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n');

    return formatted;
  };

  // Calculate reading time
  const readingTime = Math.ceil(formatContent(content).split(' ').length / 200);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <article className="prose prose-neutral lg:prose-lg max-w-none manual-content">
        <header className="mb-8">
          <h1 className="mb-4">{frontMatter.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Chapter {nav.index + 1} of {nav.total}</span>
            <span>•</span>
            <span>~{readingTime} min read</span>
            <span>•</span>
            <span className="capitalize">{frontMatter.group || 'Manual'}</span>
          </div>
        </header>
        
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({children}) => (
              <p className="mb-6 leading-relaxed text-justify">
                {children}
              </p>
            ),
            strong: ({children}) => (
              <strong className="font-semibold text-blue-700 dark:text-blue-300">
                {children}
              </strong>
            ),
            em: ({children}) => (
              <em className="italic text-purple-600 dark:text-purple-400 font-medium">
                {children}
              </em>
            ),
            h2: ({children}) => (
              <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                {children}
              </h2>
            ),
            h3: ({children}) => (
              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100">
                {children}
              </h3>
            )
          }}
        >
          {formatContent(content)}
        </ReactMarkdown>
      </article>

      <nav className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {nav.prev ? (
          <Link 
            href={`/manual/${nav.prev.slug}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ← {nav.prev.title}
          </Link>
        ) : <span />}
        
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500">{nav.index + 1} / {nav.total}</span>
          <Link 
            href="/manual" 
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Table of Contents
          </Link>
        </div>
        
        {nav.next ? (
          <Link 
            href={`/manual/${nav.next.slug}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {nav.next.title} →
          </Link>
        ) : <span />}
      </nav>
    </div>
  );
}

