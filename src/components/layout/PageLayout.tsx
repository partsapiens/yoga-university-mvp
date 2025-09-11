import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, description, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>
          {description && <p className="text-lg text-muted-foreground mt-2">{description}</p>}
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
};
