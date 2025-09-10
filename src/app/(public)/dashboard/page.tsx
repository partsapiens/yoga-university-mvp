import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Suspense } from 'react';
import { HeaderBar } from '@/components/dashboard/HeaderBar';
import { HeroQuickStart } from '@/components/dashboard/HeroQuickStart';
import { AIRecommendation } from '@/components/dashboard/AIRecommendation';
import { AIFormChecker } from '@/components/dashboard/AIFormChecker';
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
      <section>
        <SectionHeader title="Practice Snapshot" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Suspense fallback={<StatsSkeleton />}>
            {/* @ts-expect-error Async Server Component */}
            <StatsCards />
          </Suspense>
          <CalendarStreak sessions={data.practiceSessions} />
        </div>
      </section>
      <section className="mt-8">
        <SectionHeader title="AI Zone" />
        <div className="grid gap-4 lg:grid-cols-2">
          <AIRecommendation />
          <AIFormChecker />
        </div>
      </section>
      <section className="mt-8">
        <SectionHeader title="Recent Sessions" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentSessions sessions={data.recentSessions} />
          </div>
          <div className="grid gap-4">
            <GoalsCard goals={data.goals} />
            <RecommendationsCard items={data.recommendations} />
          </div>
        </div>
      </section>
      <section className="mt-8">
        <SectionHeader title="Integrations & Notifications" />
        <div className="grid gap-4 lg:grid-cols-2">
          <IntegrationsStatus integrations={data.integrations} />
          <NotificationsPanel notifications={data.notifications} />
        </div>
      </section>
      <FooterStats />
    </PageLayout>
  );
};

export default DashboardPage;
