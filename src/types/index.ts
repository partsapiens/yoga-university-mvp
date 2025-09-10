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
// Database pose type matching Supabase schema
export interface DatabasePose {
  id: string;
  name: string;
  sanskrit_name: string | null;
  category: 'standing' | 'seated' | 'supine' | 'prone' | 'backbend' | 'forward_fold' | 'twist' | 'inversion' | 'arm_balance' | 'hip_opener' | 'core' | 'balance' | 'restorative' | 'meditation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  benefits: string[];
  contraindications: string[];
  instructions: string[];
  image_url: string | null;
  video_url: string | null;
  anatomy_focus: string[];
  energy_level: 'low' | 'medium' | 'high';
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Legacy Pose interface for backward compatibility
export interface Pose {
  id: string;
  name:string;
  sanskritName: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  // Enhanced metadata for AI suggestions
  categories: ('standing' | 'seated' | 'inversion' | 'restorative' | 'arm-balance' | 'back-bend' | 'hip-opener' | 'twist' | 'forward-bend')[];
  intensity: number; // Scale of 1-10
  isUnilateral: boolean;
  planeOfMotion?: 'sagittal' | 'frontal' | 'transverse';

  benefits: string[];
  contraindications: string[];

  relatedPoseIds?: {
    counter?: string[];
    preparation?: string[];
    followUp?: string[];
  };
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
