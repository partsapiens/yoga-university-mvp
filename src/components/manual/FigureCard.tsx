'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface FigureCardProps {
  title?: string;
  children: React.ReactNode;
  caption?: string;
  className?: string;
}

export function FigureCard({ title, children, caption, className = '' }: FigureCardProps) {
  const { theme } = useTheme();
  
  return (
    <figure 
      className={`rounded-xl p-4 my-6 transition-colors duration-200 ${className} ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/20 border border-slate-600' 
          : 'bg-gray-50 border border-gray-200 shadow-sm'
      }`}
    >
      {title && (
        <h4 className={`text-sm font-medium mb-3 ${
          theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
        }`}>{title}</h4>
      )}
      <div className="flex justify-center">
        {children}
      </div>
      {caption && (
        <figcaption className={`text-xs text-center mt-3 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}