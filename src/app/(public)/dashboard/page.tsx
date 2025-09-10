import React, { Suspense } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { HeaderBar } from '@/components/dashboard/HeaderBar';
import HeroQuickStart from '@/components/dashboard/HeroQuickStart';
import { AIRecommendation } from '@/components/dashboard/AIZone/AIRecommendation';
import { AIFormChecker } from '@/components/dashboard/AIZone/AIFormChecker';
import { CalendarStreak } from '@/components/dashboard/CalendarStreak';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { fetchDashboardData } from '@/lib/api/dashboard';
import { RecentSessions } from '@/components/dashboard/RecentSessions';
import { GoalsCard } from '@/components/dashboard/GoalsCard';
import { RecommendationsCard } from '@/components/dashboard/RecommendationsCard';
import { IntegrationsStatus } from '@/components/dashboard/IntegrationsStatus';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { FooterStats } from '@/components/dashboard/FooterStats';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { StatsSkeleton } from '@/components/dashboard/StatsSkeleton';

const DashboardPage = async () => {
  const data = await fetchDashboardData();
  const unread = data.notifications.filter((n) => !n.read).length;

  return (
    <PageLayout title="Dashboard" description="Welcome to Yoga Flow University.">
      <HeaderBar unreadCount={unread} />
      <HeroQuickStart />
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <div>
            <SectionHeader title="AI Zone" />
            <div className="grid gap-4 lg:grid-cols-2">
              <AIRecommendation />
              <AIFormChecker />
            </div>
          </div>
          <div>
            <SectionHeader title="Recent Sessions" />
            <RecentSessions sessions={data.recentSessions} />
          </div>
        </div>
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
        <div className="lg:col-span-6 space-y-4">
          <SectionHeader title="Connected Apps" />
          <IntegrationsStatus integrations={data.integrations} />
        </div>
        <div className="lg:col-span-6 space-y-4">
          <SectionHeader title="Notifications" />
          <NotificationsPanel notifications={data.notifications} />
        </div>
      </section>
      <FooterStats />
    </PageLayout>
  );
};

export default DashboardPage;
