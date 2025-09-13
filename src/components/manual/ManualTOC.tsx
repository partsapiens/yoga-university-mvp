'use client';

import React from 'react';
import Link from 'next/link';

interface TOCItem {
  id: string;
  title: string;
  level?: number;
}

interface ManualTOCProps {
  items: TOCItem[];
  chapterNavigation?: {
    current: string;
    chapters: { id: string; title: string; href: string }[];
  };
  className?: string;
}

export function ManualTOC({ items, chapterNavigation, className = '' }: ManualTOCProps) {
  return (
    <nav 
      className={`sticky top-4 h-fit rounded-2xl p-4 ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
        border: '1px solid #26303a'
      }}
      aria-label="Table of contents"
    >
      {chapterNavigation && (
        <div className="mb-6 pb-4 border-b border-gray-600">
          <h3 className="text-sm font-semibold text-teal-300 mb-3">Manual Navigation</h3>
          <div className="space-y-1">
            <Link 
              href="/manual" 
              className="block text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded px-2 py-1 transition-colors"
            >
              Manual Index
            </Link>
            {chapterNavigation.chapters.map((chapter) => (
              <div key={chapter.id}>
                {chapter.id === chapterNavigation.current ? (
                  <span className="block text-sm font-medium text-white px-2 py-1">
                    {chapter.title}
                  </span>
                ) : (
                  <Link 
                    href={chapter.href}
                    className="block text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded px-2 py-1 transition-colors"
                  >
                    {chapter.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-semibold text-teal-300 mb-3">On this page</h3>
        <div className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded px-2 py-1 transition-colors ${
                item.level === 3 ? 'ml-3' : ''
              }`}
            >
              {item.title}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}