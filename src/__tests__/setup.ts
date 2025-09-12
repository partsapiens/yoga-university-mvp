import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

console.log('Supabase URL from setup.ts:', process.env.NEXT_PUBLIC_SUPABASE_URL);


// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    query: {},
    pathname: '/',
  }),
}));

// Mock Next.js image component
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', props);
  },
}));

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
  },
  writable: true,
});

// Mock window.SpeechSynthesisUtterance
(global as any).SpeechSynthesisUtterance = vi.fn().mockImplementation(() => ({
  onstart: null,
  onend: null,
  onerror: null,
}));