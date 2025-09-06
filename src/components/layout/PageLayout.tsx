import React from 'react';
import { Navigation } from './Navigation';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, description, children }) => {
  return (
    <div>
      <Navigation />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>
          {description && <p className="text-lg text-muted-foreground mt-2">{description}</p>}
        </div>
        {children}
      </main>
    </div>
  );
};
