import { Navigation } from '@/components/layout/Navigation';
import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  );
}
