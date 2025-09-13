'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ManualLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}

export function ManualLayout({ children, title, breadcrumbs = [], className = '' }: ManualLayoutProps) {
  const { theme } = useTheme();
  
  return (
    <div 
      className={`min-h-screen transition-colors duration-200 ${className} ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100' 
          : 'bg-white text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <header className="pt-12 pb-6 px-5">
          {breadcrumbs.length > 0 && (
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className={`mx-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>/</span>}
                    {crumb.href ? (
                      <a 
                        href={crumb.href} 
                        className={`hover:underline ${
                          theme === 'dark' 
                            ? 'text-blue-400 hover:text-blue-300' 
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className={`text-4xl font-extrabold tracking-wide leading-tight mt-2 mb-0 ${
            theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
          }`}>
            {title}
          </h1>
        </header>
        
        <main className="px-5 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}