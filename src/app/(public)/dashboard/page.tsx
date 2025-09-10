import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { FeatureCard } from '@/components/dashboard/FeatureCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { fetchDashboardData } from '@/lib/api/dashboard';

const DashboardPage = async () => {
  const data = await fetchDashboardData();

  const features = [
    { title: 'Pose Library', description: 'Browse detailed instructions for each pose.' },
    { title: 'Create Flow', description: 'Generate a custom yoga flow using AI.' },
    { title: 'PDF Manual', description: 'Download the comprehensive practice manual.' },
  ];

  return (
    <PageLayout title="Dashboard" description="Welcome to Yoga Flow University.">
      <section className="mb-8">
        <SectionHeader title="Quick Start" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
      <section>
        <SectionHeader title="Your Practice" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default DashboardPage;
