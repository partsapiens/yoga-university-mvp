"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import type { UserGoal } from '@/types/dashboard';
import { useEffect } from 'react';
import { track } from '@/lib/telemetry';

interface GoalsCardProps {
  goals: UserGoal[];
}

export const GoalsCard: React.FC<GoalsCardProps> = ({ goals }) => {
  useEffect(() => {
    if (goals.length > 0) track('goal_viewed');
  }, [goals.length]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Goals</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <EmptyState title="No goals set" description="Set a goal to stay motivated." />
        ) : (
          <ul className="space-y-4">
            {goals.map((goal) => (
              <li key={goal.id}>
                <div className="mb-1 text-sm font-medium">{goal.title}</div>
                <div className="text-xs text-muted-foreground">Target: {goal.target}</div>
                {goal.dueDate && (
                  <div className="text-xs text-muted-foreground">Due: {new Date(goal.dueDate).toLocaleDateString()}</div>
                )}
                <ProgressBar value={goal.progress} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
