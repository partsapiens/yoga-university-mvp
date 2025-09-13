'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ManualSectionProps {
  id: string;
  title: string;
  level?: 'h2' | 'h3' | 'h4';
  children: React.ReactNode;
  className?: string;
}

export function ManualSection({ 
  id, 
  title, 
  level = 'h2', 
  children, 
  className = '' 
}: ManualSectionProps) {
  const { theme } = useTheme();
  const HeadingTag = level;
  
  const baseStyles = `
    rounded-2xl p-6 mb-6 transition-colors duration-200
  `;
  
  const sectionStyles = level === 'h2' ? `
    ${baseStyles}
    ${theme === 'dark' 
      ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700' 
      : 'bg-gray-50 border border-gray-200 shadow-sm'
    }
  ` : 'mb-6';

  return (
    <section 
      id={id} 
      className={`${sectionStyles} ${className}`}
    >
      <HeadingTag 
        className={`
          ${level === 'h2' ? `text-xl font-semibold mt-0 mb-3 ${
            theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
          }` : ''}
          ${level === 'h3' ? `text-lg font-medium mt-6 mb-3 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
          }` : ''}
          ${level === 'h4' ? `text-base font-medium mt-4 mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }` : ''}
        `}
      >
        {title}
      </HeadingTag>
      <div className={`prose max-w-none ${
        theme === 'dark' ? 'prose-invert' : 'prose-gray'
      }`}>
        {children}
      </div>
    </section>
  );
}