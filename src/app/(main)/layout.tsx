import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import FloatingAIChat from '@/components/FloatingAIChat';
import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingAIChat />
    </div>
  );
}
