import React from 'react';
import { Suspense } from 'react';
import { CalendarStreak } from '@/components/dashboard/CalendarStreak';
import { SectionHeader } from '@/components/ui/SectionHeader';
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
    <div className="min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">Welcome to Yoga Flow University.</p>
      </div>
      
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <SectionHeader title="Recent Sessions" />
            <RecentSessions sessions={data.recentSessions} />
          </div>
          
          {/* 🤖 Progress Insights Section */}
          <div>
            <SectionHeader title="🤖 Progress Insights" />
            <AIInsightsDashboard sessions={data.practiceSessions} />
          </div>
          
          {/* Platform Intelligence Section */}
          <div>
            <SectionHeader title="Platform Intelligence" />
            <PlatformAnalytics />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <SectionHeader title="Connected Apps" />
              <IntegrationsStatus integrations={data.integrations} />
            </div>
            <div>
              <SectionHeader title="Recent Achievements" />
              <RecentAchievements />
            </div>
          </div>
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <SectionHeader title="Practice Snapshot" />
            <div className="grid gap-4">
              <Suspense fallback={<StatsSkeleton />}>
                <StatsCards />
              </Suspense>
              <CalendarStreak sessions={data.practiceSessions} />
            </div>
          </div>
          <div className="space-y-4">
            <GoalsCard goals={data.goals} />
            <RecommendationsCard items={data.recommendations} />
          </div>
        </div>
        
        {/* Notifications - Full Width Bottom */}
        <div id="notifications" className="lg:col-span-12">
          <SectionHeader title="Notifications" />
          <NotificationsPanel notifications={data.notifications} />
        </div>
      </section>
    </div>
    </div>
  );
};

export default DashboardPage;
