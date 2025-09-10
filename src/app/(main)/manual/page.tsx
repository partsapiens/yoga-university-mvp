import Link from 'next/link';
import { getManifest } from '@/lib/manual';
import ManualSearch from './search';
import { BookOpen, FileText } from 'lucide-react';

export default function ManualPage() {
  const manifest = getManifest();
  const groups = Array.from(new Set(manifest.chapters.map((c) => c.group)));

  return (
    <div className="prose mx-auto p-4">
      <h1>{manifest.title}</h1>
      
      {/* Manual Access Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 not-prose">
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold m-0">Page-by-Page Manual</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Enhanced reader with page navigation, dark mode, bookmarks, and table of contents.
          </p>
          <Link
            href="/manual/page/1"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors no-underline"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Start Reading
          </Link>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <BookOpen className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold m-0">Chapter-Based View</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Browse by topics and chapters for quick access to specific content.
          </p>
          <div className="text-blue-600 font-medium">Browse below ↓</div>
        </div>
      </div>
      
      <ManualSearch />
      
      {groups.map((g) => (
        <div key={g}>
          <h2>{g}</h2>
          <ul>
            {manifest.chapters
              .filter((c) => c.group === g)
              .map((c) => (
                <li key={c.slug}>
                  <Link href={`/manual/${c.slug}`}>{c.title}</Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

