"use client";

import { useState, useEffect } from 'react';
import { NotificationItem } from '@/types/dashboard';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // For now, we'll use the same mock data as the dashboard
      // In a real app, this would be an API call
      const now = new Date();
      const today = new Date(now.getTime());
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const mockNotifications: NotificationItem[] = [
        { 
          id: 'note1', 
          message: 'Welcome to Yoga Flow University! Start your journey with a beginner flow.', 
          createdAt: weekAgo.toISOString(), 
          read: false 
        },
        { 
          id: 'note2', 
          message: 'Daily practice reminder: Take 15 minutes for yourself today.', 
          createdAt: today.toISOString(), 
          read: false 
        },
        { 
          id: 'note3', 
          message: 'Congratulations! You reached a 3-day practice streak milestone.', 
          createdAt: yesterday.toISOString(), 
          read: true 
        },
        { 
          id: 'note4', 
          message: 'New achievement unlocked: First Warrior Pose mastered!', 
          createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
          read: false 
        },
        { 
          id: 'note5', 
          message: 'Weekly progress update: You practiced 4 sessions this week.', 
          createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), 
          read: true 
        },
      ];
      
      setNotifications(mockNotifications);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: fetchNotifications,
  };
};