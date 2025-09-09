import React from 'react';

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card text-card-foreground rounded-2xl border shadow-sm p-6">
    {children}
  </div>
);

// Placeholder data
const recentSessions = [
  { id: 1, date: '2025-09-08', name: 'Morning Wake Up', duration: '15 min' },
  { id: 2, date: '2025-09-07', name: 'Hip Opener 30', duration: '30 min' },
  { id: 3, date: '2025-09-06', name: 'Quick Core 15', duration: '15 min' },
];

export function RecentSessions() {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Recent Sessions</h2>
      {recentSessions.length > 0 ? (
        <ul className="space-y-3">
          {recentSessions.map(session => (
            <li key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-semibold">{session.name}</p>
                <p className="text-sm text-muted-foreground">{session.date}</p>
              </div>
              <p className="font-medium text-muted-foreground">{session.duration}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No recent sessions.</p>
      )}
    </Card>
  );
}
