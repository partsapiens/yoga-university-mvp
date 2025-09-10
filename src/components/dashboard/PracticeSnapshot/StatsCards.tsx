"use client";

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { fetchStats } from '@/lib/api/dashboard';
import type { DashboardStats } from '@/types/dashboard';
import { StatsSkeleton } from './StatsSkeleton';

export const StatsCards = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchStats().then((s) => {
      if (mounted) setStats(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!stats) {
    return <StatsSkeleton />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
      <StatCard title="Total Sessions" value={stats.total_sessions} />
      <StatCard title="Minutes Practiced" value={stats.total_practice_time} />
      <StatCard title="Sessions This Week" value={stats.sessions_this_week} />
      <StatCard title="Current Streak" value={`${stats.current_streak} days`} />
    </div>
  );
};
