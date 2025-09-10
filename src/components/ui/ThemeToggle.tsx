"use client";

import { useEffect } from 'react';
import { Toggle } from './Toggle';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { track } from '@/lib/telemetry';

export const ThemeToggle = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('yoga_theme', 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Toggle
      checked={theme === 'dark'}
      onCheckedChange={(checked) => {
        setTheme(checked ? 'dark' : 'light');
        track('toggle_theme', { theme: checked ? 'dark' : 'light' });
      }}
      label="Dark Mode"
      aria-label="Toggle dark mode"
    />
  );
};
