"use client";

import { useEffect, useState } from 'react';
import { getVisitorCount } from '@/lib/api/dashboard';
import { track } from '@/lib/telemetry';
import { Skeleton } from '@/components/ui';

export const FooterStats = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const c = await getVisitorCount();
      setCount(c);
      setLoading(false);
      if (c !== null) track('visitor_count_loaded', { count: c });
    }
    load();
  }, []);

  return (
    <footer className="mt-8 text-center text-sm text-muted-foreground">
      <div aria-live="polite">
        {loading ? (
          <Skeleton className="inline-block h-4 w-24" />
        ) : (
          <>Yogis inspired: {count ?? '—'}</>
        )}
      </div>
      <div className="mt-2 space-x-4">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/about">About</a>
      </div>
    </footer>
  );
};
