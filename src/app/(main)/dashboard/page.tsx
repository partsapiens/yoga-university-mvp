import React from 'react';
import { AIFlowGenerator } from '@/components/flows/AIFlowGenerator';

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <AIFlowGenerator />
            </div>

            {/* Practice Statistics */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Practice Statistics</h2>
              {/* TODO: Implement practice statistics */}
              <p>Total Sessions: 0</p>
              <p>Time Practiced: 0 mins</p>
              <p>Current Streak: 0 days</p>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="card p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Sessions</h2>
            {/* TODO: Implement recent sessions list */}
            <p className="text-muted-foreground">No recent sessions.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Goals */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4">Your Goals</h2>
            {/* TODO: Implement goals tracking */}
            <p className="text-muted-foreground">No goals set.</p>
          </div>

          {/* Practice Calendar */}
          <div className="card p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Practice Calendar</h2>
            {/* TODO: Implement practice calendar/streak view */}
            <p className="text-muted-foreground">Calendar view coming soon.</p>
          </div>

          {/* Recommendations */}
          <div className="card p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Personalized Recommendations</h2>
            {/* TODO: Implement recommendations engine */}
            <p className="text-muted-foreground">No recommendations yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
