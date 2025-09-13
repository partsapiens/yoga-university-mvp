'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  
  return (
    <nav 
      className={`sticky top-4 h-fit rounded-2xl p-4 transition-colors duration-200 ${className} ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700' 
          : 'bg-gray-50 border border-gray-200 shadow-sm'
      }`}
      aria-label="Table of contents"
    >
      {chapterNavigation && (
        <div className={`mb-6 pb-4 ${
          theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'
        }`}>
          <h3 className={`text-sm font-semibold mb-3 ${
            theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
          }`}>Manual Navigation</h3>
          <div className="space-y-1">
            <Link 
              href="/manual" 
              className={`block text-sm rounded px-2 py-1 transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Manual Index
            </Link>
            {chapterNavigation.chapters.map((chapter) => (
              <div key={chapter.id}>
                {chapter.id === chapterNavigation.current ? (
                  <span className={`block text-sm font-medium px-2 py-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {chapter.title}
                  </span>
                ) : (
                  <Link 
                    href={chapter.href}
                    className={`block text-sm rounded px-2 py-1 transition-colors ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
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
        <h3 className={`text-sm font-semibold mb-3 ${
          theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
        }`}>On this page</h3>
        <div className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-sm rounded px-2 py-1 transition-colors ${
                item.level === 3 ? 'ml-3' : ''
              } ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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