'use client';

import React from 'react';

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
  const HeadingTag = level;
  
  const baseStyles = `
    rounded-2xl p-6 mb-6
  `;
  
  const sectionStyles = level === 'h2' ? `
    ${baseStyles}
  ` : 'mb-6';
  
  const sectionBackground = level === 'h2' ? {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
    border: '1px solid #26303a'
  } : {};

  return (
    <section 
      id={id} 
      className={`${sectionStyles} ${className}`}
      style={sectionBackground}
    >
      <HeadingTag 
        className={`
          ${level === 'h2' ? 'text-xl font-semibold text-teal-300 mt-0 mb-3' : ''}
          ${level === 'h3' ? 'text-lg font-medium text-blue-400 mt-6 mb-3' : ''}
          ${level === 'h4' ? 'text-base font-medium text-gray-300 mt-4 mb-2' : ''}
        `}
      >
        {title}
      </HeadingTag>
      <div className="prose prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
}