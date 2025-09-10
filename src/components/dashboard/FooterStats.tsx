"use client";

import { useEffect, useState } from 'react';
import { fetchVisitorCount } from '@/lib/api/visitors';
import { track } from '@/lib/telemetry';

export const FooterStats = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const c = await fetchVisitorCount();
      setCount(c);
      track('visitor_count_loaded', { count: c });
    }
    load();
  }, []);

  return (
    <footer className="mt-8 text-center text-sm text-muted-foreground">
      <div aria-live="polite">Yogis inspired: {count ?? '...'}</div>
      <div className="mt-2 space-x-4">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/about">About</a>
      </div>
    </footer>
  );
};
