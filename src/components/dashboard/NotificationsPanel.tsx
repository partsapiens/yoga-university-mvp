"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { NotificationItem } from '@/types/dashboard';
import { track } from '@/lib/telemetry';
import { Check, Clock, X, Settings, Bell } from 'lucide-react';

interface NotificationsPanelProps {
  notifications: NotificationItem[];
}

const MAX_ITEMS = 50;

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  const [items, setItems] = useState(notifications.slice(0, MAX_ITEMS));
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredItems = items.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    track('notification_action', { id, action: 'mark_read' });
  };

  const markAsUnread = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)));
    track('notification_action', { id, action: 'mark_unread' });
  };

  const dismiss = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    track('notification_action', { id, action: 'dismiss' });
  };

  const snooze = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    track('notification_action', { id, action: 'snooze' });
  };

  const markAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    track('notification_action', { action: 'mark_all_read', count: items.filter(n => !n.read).length });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    
    const diffDays = Math.floor(diffMinutes / 1440);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (notification: NotificationItem) => {
    if (notification.message.toLowerCase().includes('milestone')) return '🎉';
    if (notification.message.toLowerCase().includes('reminder')) return '⏰';
    if (notification.message.toLowerCase().includes('achievement')) return '🏆';
    if (notification.message.toLowerCase().includes('welcome')) return '👋';
    return '💡';
  };

  const isActionable = (notification: NotificationItem) => {
    return notification.message.toLowerCase().includes('reminder') || 
           notification.message.toLowerCase().includes('milestone') ||
           notification.message.toLowerCase().includes('achievement');
  };

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              Notifications
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Demo</span>
            </CardTitle>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex rounded-md border">
              {(['all', 'unread', 'read'] as const).map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? 'default' : 'ghost'}
                  size="sm"
                  className="px-2 py-1 text-xs"
                  onClick={() => setFilter(filterType)}
                >
                  {filterType}
                </Button>
              ))}
            </div>
            {unreadCount > 0 && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <EmptyState 
            title={filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
            description={filter === 'all' 
              ? 'You\'re all caught up! New notifications will appear here.' 
              : `You have no ${filter} notifications.`
            }
          />
        ) : (
          <ul className="space-y-2 text-sm" aria-label="Notifications">
            {filteredItems.map((n) => (
              <li 
                key={n.id} 
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  n.read ? 'bg-card' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <span className="text-lg">{getNotificationIcon(n)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`${n.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {n.message}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(n.createdAt)}
                    </span>
                    {isActionable(n) && (
                      <Button 
                        size="sm" 
                        variant="link" 
                        className="h-auto p-0 text-xs text-blue-600"
                      >
                        Take action
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!n.read ? (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => markAsRead(n.id)}
                      className="h-7 w-7 p-0"
                      title="Mark as read"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => markAsUnread(n.id)}
                      className="h-7 w-7 p-0"
                      title="Mark as unread"
                    >
                      <Bell className="h-3 w-3" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => snooze(n.id)}
                    className="h-7 w-7 p-0"
                    title="Snooze"
                  >
                    <Clock className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => dismiss(n.id)}
                    className="h-7 w-7 p-0"
                    title="Dismiss"
                  >
                    <X className="h-3 w-3" />
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
