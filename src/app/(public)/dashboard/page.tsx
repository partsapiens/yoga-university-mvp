import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { FeatureCard } from '@/components/dashboard/FeatureCard';
import { StatCard } from '@/components/dashboard/StatCard';
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
import { Activity, Timer, Calendar, Flame, BookOpen, PlusCircle, FileText } from 'lucide-react';

const DashboardPage = async () => {
  const data = await fetchDashboardData();
  const unread = data.notifications.filter((n) => !n.read).length;

  const features = [
    { title: 'Pose Library', description: 'Browse detailed instructions for each pose.', href: '/poses', icon: BookOpen },
    { title: 'Create Flow', description: 'Generate a custom yoga flow using AI.', href: '/flows/create', icon: PlusCircle },
    { title: 'PDF Manual', description: 'Download the comprehensive practice manual.', href: '/manual', icon: FileText },
  ];

  return (
    <PageLayout title="Dashboard" description="Welcome to Yoga Flow University.">
      <HeaderBar unreadCount={unread} />
      <HeroQuickStart />
      <section className="mb-8">
        <SectionHeader title="Quick Start" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
      <section>
        <SectionHeader title="Practice Snapshot" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <StatCard title="Total Sessions" value={data.stats.total_sessions} icon={Activity} />
            <StatCard title="Minutes Practiced" value={data.stats.total_practice_time} icon={Timer} />
            <StatCard title="Sessions This Week" value={data.stats.sessions_this_week} icon={Calendar} />
            <StatCard title="Current Streak" value={`${data.stats.current_streak} days`} icon={Flame} />
          </div>
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
