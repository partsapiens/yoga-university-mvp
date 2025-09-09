'use client';

import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';

interface Item {
  slug: string;
  title: string;
  summary: string;
  content: string;
  group: string;
}

export default function ManualSearch() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Item[]>([]);
  const [results, setResults] = useState<Item[]>([]);

  useEffect(() => {
    fetch('/manual/search-index.json')
      .then((r) => r.json())
      .then((d) => setData(d as Item[]));
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const fuse = new Fuse(data, { keys: ['title', 'content'] });
    setResults(fuse.search(query).map((r) => r.item).slice(0, 10));
  }, [query, data]);

  return (
    <div>
      <input
        className="w-full border p-2 mb-4"
        type="search"
        placeholder="Search manual..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="mb-4">
          {results.map((r) => (
            <li key={r.slug}>
              <Link href={`/manual/${r.slug}`}>{r.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

