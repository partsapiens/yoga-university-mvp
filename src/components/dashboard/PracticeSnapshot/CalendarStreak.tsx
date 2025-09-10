"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PracticeSession } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface CalendarStreakProps {
  sessions: PracticeSession[];
}

const getLastNDays = (n: number) => {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

export const CalendarStreak: React.FC<CalendarStreakProps> = ({ sessions }) => {
  const days = getLastNDays(35);
  const sessionDates = sessions.map((s) => s.completedAt.slice(0, 10));
  const set = new Set(sessionDates);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div
              key={day}
              title={day}
              className={cn(
                'h-3 w-3 rounded-sm',
                set.has(day) ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-primary" />
            <span>Practice</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-muted" />
            <span>Rest</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarStreak;
