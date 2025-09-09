"use client"; // Required for context providers

import { Navigation } from '@/components/layout/Navigation';
import { VoiceUIProvider } from '@/context/VoiceUIContext';
import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <VoiceUIProvider>
      <div>
        <Navigation />
        <main>
          {children}
        </main>
      </div>
    </VoiceUIProvider>
  );
}
