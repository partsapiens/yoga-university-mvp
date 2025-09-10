"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import type { NotificationItem } from '@/types/dashboard';
import { track } from '@/lib/telemetry';

interface NotificationsPanelProps {
  notifications: NotificationItem[];
}
const MAX_ITEMS = 50;

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  const [items, setItems] = useState(notifications.slice(0, MAX_ITEMS));

  const markDone = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    track('notification_action', { id, action: 'done' });
  };

  const snooze = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    track('notification_action', { id, action: 'snooze' });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState title="No notifications" />
        ) : (
          <ul className="space-y-2 text-sm" aria-label="Notifications">
            {items.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-2">
                <div>
                  <span>{n.message}</span>
                  <div className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => markDone(n.id)}>
                    Done
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => snooze(n.id)}>
                    Snooze
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
