import Link from 'next/link';
import { getManifest } from '@/lib/manual';
import ManualSearch from './search';

export default function ManualPage() {
  const manifest = getManifest();
  const groups = Array.from(new Set(manifest.chapters.map((c) => c.group)));

  return (
    <div className="prose mx-auto p-4">
      <h1>{manifest.title}</h1>
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

