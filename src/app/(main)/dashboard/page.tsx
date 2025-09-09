import React from 'react';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { PracticeStats } from '@/components/dashboard/PracticeStats';
import { RecentSessions } from '@/components/dashboard/RecentSessions';
import { Goals } from '@/components/dashboard/Goals';
import { PracticeCalendar } from '@/components/dashboard/PracticeCalendar';
import { Recommendations } from '@/components/dashboard/Recommendations';

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main column */}
        <main className="lg:col-span-2 flex flex-col gap-8">
          <QuickActions />
          <PracticeStats />
          <RecentSessions />
        </main>

        {/* Sidebar */}
        <aside className="flex flex-col gap-8">
          <Goals />
          <PracticeCalendar />
          <Recommendations />
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
