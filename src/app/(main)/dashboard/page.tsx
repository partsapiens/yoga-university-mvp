import React from 'react';
import { Suspense } from 'react';
import { CalendarStreak } from '@/components/dashboard/CalendarStreak';
import { fetchDashboardData } from '@/lib/api/dashboard';
import { RecentSessions } from '@/components/dashboard/RecentSessions';
import { GoalsCard } from '@/components/dashboard/GoalsCard';
import { RecommendationsCard } from '@/components/dashboard/RecommendationsCard';
import { IntegrationsStatus } from '@/components/dashboard/IntegrationsStatus';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { StatsSkeleton } from '@/components/dashboard/StatsSkeleton';
import { RecentAchievements } from '@/components/dashboard/RecentAchievements';
import { AIInsightsDashboard } from '@/components/dashboard/AIInsightsDashboard';
import { PlatformAnalytics } from '@/components/dashboard/PlatformAnalytics';

const DashboardPage = async () => {
  const data = await fetchDashboardData();
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-1">Welcome back, let's get practicing.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <main className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Practice Snapshot</h2>
            <Suspense fallback={<StatsSkeleton />}>
              <StatsCards />
            </Suspense>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Recent Sessions</h2>
            <RecentSessions sessions={data.recentSessions} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">AI Progress Insights</h2>
            <AIInsightsDashboard sessions={data.practiceSessions} />
          </section>
        </main>
        
        {/* Sidebar Column */}
        <aside className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Practice Streak</h2>
            <CalendarStreak sessions={data.practiceSessions} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Goals</h2>
            <GoalsCard goals={data.goals} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
            <RecommendationsCard items={data.recommendations} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Notifications</h2>
            <NotificationsPanel notifications={data.notifications} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Recent Achievements</h2>
            <RecentAchievements />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Connected Apps</h2>
            <IntegrationsStatus integrations={data.integrations} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Platform Intelligence</h2>
            <PlatformAnalytics />
          </section>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
