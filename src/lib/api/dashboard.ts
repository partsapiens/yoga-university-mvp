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
      total_sessions: 0,
      total_practice_time: 0,
      sessions_this_week: 0,
      current_streak: 0,
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
    const flowTypes = ['vinyasa', 'hatha', 'restorative', 'power', 'yin'];
    const difficulties: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
    const flowNames = [
      'Morning Energizer', 'Evening Wind Down', 'Core Strength', 
      'Hip Opener', 'Heart Opener', 'Stress Relief', 
      'Power Flow', 'Gentle Stretch', 'Flow 9', 'Flow 10'
    ];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      flowName: flowNames[i] || `Flow ${i + 1}`,
      duration: 20 + Math.floor(Math.random() * 40), // 20-60 minutes
      completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - i).toISOString(),
      type: flowTypes[i % flowTypes.length],
      difficulty: difficulties[i % difficulties.length],
      completed: Math.random() > 0.1, // 90% completion rate
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
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  return [
    { id: 'supabase', name: 'Supabase', connected: true, lastSyncedAt: hourAgo.toISOString() },
    { id: 'google-drive', name: 'Google Drive', connected: true, lastSyncedAt: yesterday.toISOString() },
    { id: 'google-calendar', name: 'Google Calendar', connected: false },
    { id: 'apple-health', name: 'Apple Health', connected: true, lastSyncedAt: lastWeek.toISOString() },
    { id: 'strava', name: 'Strava', connected: false },
    { id: 'notion', name: 'Notion', connected: false },
    { id: 'instagram', name: 'Instagram', connected: false },
    { id: 'twitter', name: 'Twitter', connected: false },
    { id: 'youtube', name: 'YouTube', connected: false },
  ];
}

async function fetchNotifications(): Promise<NotificationItem[]> {
  const now = new Date();
  const today = new Date(now.getTime());
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return [
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
