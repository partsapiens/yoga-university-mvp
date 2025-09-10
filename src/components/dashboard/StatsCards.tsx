import { StatCard } from '@/components/dashboard/StatCard';
import { fetchStats } from '@/lib/api/dashboard';

export const StatsCards = async () => {
  const stats = await fetchStats();
  
  // Calculate progress percentages based on goals
  const sessionGoal = 20; // Weekly goal
  const timeGoal = 150; // Weekly goal in minutes
  const streakGoal = 7; // 7-day streak goal
  
  const sessionsProgress = Math.min((stats.sessions_this_week / sessionGoal) * 100, 100);
  const timeProgress = Math.min((stats.total_practice_time / timeGoal) * 100, 100);
  const streakProgress = Math.min((stats.current_streak / streakGoal) * 100, 100);
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
      <StatCard 
        title="Total Sessions" 
        value={stats.total_sessions}
        subtitle={`${stats.sessions_this_week} this week`}
        trend={stats.sessions_this_week > 0 ? 'up' : 'neutral'}
      />
      <StatCard 
        title="Minutes Practiced" 
        value={stats.total_practice_time}
        progress={timeProgress}
        subtitle={`${Math.round(timeProgress)}% of weekly goal`}
        trend={timeProgress > 50 ? 'up' : timeProgress > 25 ? 'neutral' : 'down'}
      />
      <StatCard 
        title="Sessions This Week" 
        value={stats.sessions_this_week}
        progress={sessionsProgress}
        subtitle={`${stats.sessions_this_week}/${sessionGoal} weekly goal`}
        trend={sessionsProgress > 50 ? 'up' : 'neutral'}
      />
      <StatCard 
        title="Current Streak" 
        value={`${stats.current_streak} days`}
        progress={streakProgress}
        subtitle={stats.current_streak >= 7 ? 'Great momentum!' : 'Keep going!'}
        trend={stats.current_streak >= 3 ? 'up' : 'neutral'}
      />
    </div>
  );
};
