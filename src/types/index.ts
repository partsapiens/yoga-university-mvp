// 1. User Management
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    focusAreas: string[];
    practiceStyle: string[];
    limitations: string[];
    goals: string[];
    preferredDuration: number;
    practiceFrequency: 'daily' | 'weekly' | 'monthly';
  };
  createdAt: Date;
  updatedAt: Date;
}

// 2. Pose and Flow Data Structures
export interface Pose {
  id: string; // uuid
  slug: string; // text
  name: string; // text
  sanskrit?: string | null; // text
  category?: string | null; // text
  level?: 'beginner' | 'intermediate' | 'advanced' | null; // text
  plane?: 'sagittal' | 'frontal' | 'transverse' | null; // text
  thumbnail_url?: string | null; // text
  icon?: string | null; // text
  meta?: any; // jsonb
  cues?: string[] | null; // text[]
  benefits?: string[] | null; // text[]
  created_at: string; // timestamp with time zone
  hold_time?: number | null; // integer
  image_url?: string | null; // text
  instructions?: string | null; // text
  modifications?: string | null; // text
  contraindications?: string | null; // text
  anatomical_focus?: string[] | null; // text[]
  other_side_slug?: string | null; // text
}

export interface FlowPose {
  poseId: string;
  duration: number; // in seconds
  order: number;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  style: 'vinyasa' | 'hatha' | 'ashtanga' | 'power' | 'restorative';
  poses: FlowPose[];
  createdBy: string; // userId
  createdAt: Date;
  updatedAt: Date;
}

// 3. Practice Tracking
export interface PracticeSession {
  id: string;
  userId: string;
  flowId: string;
  date: Date;
  duration: number; // in minutes
  notes?: string;
  completed: boolean;
}

export interface ProgressMetrics {
  totalSessions: number;
  totalTimePracticed: number; // in minutes
  currentStreak: number; // in days
  longestStreak: number; // in days
}

// 4. AI Flow Generation
export interface AIGenerationParams {
  focusArea: 'flexibility' | 'strength' | 'balance' | 'mindfulness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  practiceStyle: 'vinyasa' | 'hatha' | 'power';
  duration: number; // in minutes
  physicalLimitations?: string[];
}

// 5. Learning Management System
export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id:string;
  title: string;
  videoUrl: string;
  description: string;
  duration: number; // in minutes
}
