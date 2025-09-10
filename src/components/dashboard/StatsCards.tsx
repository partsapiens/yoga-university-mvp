import { StatCard } from '@/components/dashboard/StatCard';
import { fetchStats } from '@/lib/api/dashboard';

export const StatsCards = async () => {
  const stats = await fetchStats();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
      <StatCard title="Total Sessions" value={stats.total_sessions} />
      <StatCard title="Minutes Practiced" value={stats.total_practice_time} />
      <StatCard title="Sessions This Week" value={stats.sessions_this_week} />
      <StatCard title={`Current Streak`} value={`${stats.current_streak} days`} />
    </div>
  );
};
