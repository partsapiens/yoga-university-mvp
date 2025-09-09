import React from 'react';

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card text-card-foreground rounded-2xl border shadow-sm p-6">
    {children}
  </div>
);

const StatItem = ({ label, value, icon }: { label: string, value: string | number, icon: string }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
        <div className="text-3xl mb-1">{icon}</div>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
    </div>
);

export function PracticeStats() {
  // Placeholder data
  const stats = {
    totalSessions: 28,
    timePracticed: '4h 30m',
    currentStreak: 5,
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Practice Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatItem label="Total Sessions" value={stats.totalSessions} icon="🧘" />
        <StatItem label="Time Practiced" value={stats.timePracticed} icon="⏰" />
        <StatItem label="Current Streak" value={`${stats.currentStreak} days`} icon="🔥" />
      </div>
    </Card>
  );
}
