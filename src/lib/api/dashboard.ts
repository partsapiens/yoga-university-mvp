import {
  DashboardData,
  DashboardStats,
  PracticeSession,
  UserGoal,
  RecommendationItem,
  IntegrationStatus,
  NotificationItem,
} from '@/types/dashboard';

export async function fetchStats(): Promise<DashboardStats> {
  try {
    const res = await fetch('/api/dashboard/stats', { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch {
    return {
      total_sessions: 42,
      total_practice_time: 1234,
      sessions_this_week: 3,
      current_streak: 7,
    };
  }
}

async function fetchPracticeSessions(): Promise<PracticeSession[]> {
  try {
    const res = await fetch('/api/practice-sessions?limit=10', {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return await res.json();
  } catch {
    const today = new Date();
    return Array.from({ length: 5 }, (_, i) => ({
      id: `${i}`,
      flowName: `Flow ${i + 1}`,
      duration: 30,
      completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - i).toISOString(),
    }));
  }
}

async function fetchGoals(): Promise<UserGoal[]> {
  return [
    { id: 'goal1', title: 'Practice 3x per week', target: '3 sessions', progress: 40, dueDate: undefined },
    { id: 'goal2', title: 'Hold plank for 2 minutes', target: '2 min plank', progress: 70, dueDate: undefined },
  ];
}

async function fetchRecommendations(): Promise<RecommendationItem[]> {
  return [
    { id: 'rec1', title: 'Restorative Flow', reason: 'You practiced intensely yesterday', actionUrl: '/flows/restorative' },
    { id: 'rec2', title: 'Hip Opener Series', reason: 'Focus on hip mobility', actionUrl: '/flows/hips' },
  ];
}

async function fetchIntegrations(): Promise<IntegrationStatus[]> {
  return [
    { id: 'supabase', name: 'Supabase', connected: false },
    { id: 'google-drive', name: 'Google Drive', connected: false },
    { id: 'google-calendar', name: 'Google Calendar', connected: false },
    { id: 'apple-health', name: 'Apple Health', connected: false },
    { id: 'strava', name: 'Strava', connected: false },
    { id: 'notion', name: 'Notion', connected: false },
    { id: 'instagram', name: 'Instagram', connected: false },
    { id: 'twitter', name: 'Twitter', connected: false },
    { id: 'youtube', name: 'YouTube', connected: false },
  ];
}

async function fetchNotifications(): Promise<NotificationItem[]> {
  return [
    { id: 'note1', message: 'Welcome to Yoga Flow University!', createdAt: new Date().toISOString(), read: false },
  ];
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const [practiceSessions, goals, recommendations, integrations, notifications] = await Promise.all([
    fetchPracticeSessions(),
    fetchGoals(),
    fetchRecommendations(),
    fetchIntegrations(),
    fetchNotifications(),
  ]);
  const recentSessions = practiceSessions.slice(0, 5);
  return { practiceSessions, recentSessions, goals, recommendations, integrations, notifications };
}
