"use client";

import { Toggle } from './Toggle';
import { useTheme } from '@/contexts/ThemeContext';
import { track } from '@/lib/telemetry';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Toggle
      checked={theme === 'dark'}
      onCheckedChange={(checked) => {
        toggleTheme();
        track('toggle_theme', { theme: checked ? 'dark' : 'light' });
      }}
      label="Dark Mode"
      aria-label="Toggle dark mode"
    />
  );
};
