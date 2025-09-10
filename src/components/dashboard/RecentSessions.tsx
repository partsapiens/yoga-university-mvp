import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import type { PracticeSession } from '@/types/dashboard';
import { track } from '@/lib/telemetry';

interface RecentSessionsProps {
  sessions: PracticeSession[];
}

const MAX_ITEMS = 50;

export const RecentSessions: React.FC<RecentSessionsProps> = ({ sessions }) => {
  const items = sessions.slice(0, MAX_ITEMS);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState title="No recent sessions" description="Your latest practice sessions will appear here." />
        ) : (
          <ul className="space-y-2 text-sm" aria-label="Recent sessions">
            {items.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{s.flowName}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(s.completedAt).toLocaleDateString()} • {s.duration}m
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => track('session_card_clicked', { id: s.id, action: 'play' })}>
                    Play
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => track('session_card_clicked', { id: s.id, action: 'edit' })}>
                    Edit
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
