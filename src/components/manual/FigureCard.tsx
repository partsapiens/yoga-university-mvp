'use client';

import React from 'react';

interface FigureCardProps {
  title?: string;
  children: React.ReactNode;
  caption?: string;
  className?: string;
}

export function FigureCard({ title, children, caption, className = '' }: FigureCardProps) {
  return (
    <figure 
      className={`rounded-xl p-4 my-6 ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
        border: '1px solid #2a3642'
      }}
    >
      {title && (
        <h4 className="text-sm font-medium text-teal-300 mb-3">{title}</h4>
      )}
      <div className="flex justify-center">
        {children}
      </div>
      {caption && (
        <figcaption className="text-xs text-gray-400 text-center mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}