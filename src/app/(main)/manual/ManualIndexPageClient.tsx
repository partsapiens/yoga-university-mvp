'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';

interface ManualIndexPageClientProps {
  toc: string;
  pages: { id: string; title: string }[];
}

const ManualIndexPageClient: React.FC<ManualIndexPageClientProps> = ({ toc, pages }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPages = pages.filter(page =>
    `${page.id} ${page.title}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-4">Yoga Teacher Training Manual</h1>
      <Input
        type="text"
        placeholder="Search manual..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8"
      />
      {searchTerm ? (
        <ul>
          {filteredPages.length > 0 ? (
            filteredPages.map(page => (
              <li key={page.id}>
                <Link href={`/manual/${page.id}`}>
                  {page.title}
                </Link>
              </li>
            ))
          ) : (
            <li>No pages found.</li>
          )}
        </ul>
      ) : (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: toc }} />
      )}
    </div>
  );
};

export default ManualIndexPageClient;
