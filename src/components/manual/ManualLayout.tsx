'use client';

import React from 'react';

interface ManualLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}

export function ManualLayout({ children, title, breadcrumbs = [], className = '' }: ManualLayoutProps) {
  return (
    <div className={`min-h-screen ${className}`} style={{
      background: 'radial-gradient(1200px 800px at 10% -10%, #14202a 0%, transparent 40%), radial-gradient(1200px 800px at 100% 0%, #1a142a 0%, transparent 40%), #0b0d10',
      color: '#e9f1f7'
    }}>
      <div className="max-w-7xl mx-auto">
        <header className="pt-12 pb-6 px-5">
          {breadcrumbs.length > 0 && (
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                    {crumb.href ? (
                      <a 
                        href={crumb.href} 
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-gray-400">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="text-4xl font-extrabold tracking-wide leading-tight mt-2 mb-0">
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