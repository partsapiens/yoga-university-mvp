export interface DashboardStats {
  total_sessions: number;
  total_practice_time: number; // minutes
  sessions_this_week: number;
  current_streak: number; // days
}

export interface PracticeSession {
  id: string;
  completedAt: string; // ISO date string
  duration: number; // minutes
  flowName: string;
}

export interface UserGoal {
  id: string;
  title: string;
  target: string;
  progress: number; // 0-100
  dueDate?: string; // ISO date
}

export interface RecommendationItem {
  id: string;
  title: string;
  reason: string;
  actionUrl?: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  connected: boolean;
  lastSyncedAt?: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  createdAt: string; // ISO date string
  read: boolean;
}

export interface DashboardData {
  practiceSessions: PracticeSession[];
  recentSessions: PracticeSession[];
  goals: UserGoal[];
  recommendations: RecommendationItem[];
  integrations: IntegrationStatus[];
  notifications: NotificationItem[];
}
