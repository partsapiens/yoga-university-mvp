import { PoseId } from './yoga';

export interface RecommendationInput {
  focus: string;
  duration: number;
  intensity: number;
  mood: string;
  injuries?: string;
}

export interface Recommendation {
  name: string;
  poses: PoseId[];
  reason: string;
  actionUrl?: string;
}

export interface FormCheckInput {
  pose: PoseId;
  notes: string;
}

export interface FormFeedback {
  message: string;
}

// Meditation-specific AI types
export interface MeditationInput {
  mood: string;
  goal: string;
  duration: number; // in minutes
  experience: 'beginner' | 'intermediate' | 'advanced';
  style: 'mindfulness' | 'breathing' | 'body-scan' | 'loving-kindness' | 'sleep' | 'focus';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  pastSessions?: number;
  currentStreak?: number;
}

export interface MeditationScript {
  id: string;
  title: string;
  phases: MeditationPhase[];
  totalDuration: number;
  breathingPattern?: BreathingPattern;
}

export interface MeditationPhase {
  id: string;
  name: 'intro' | 'settle' | 'breathwork' | 'main' | 'close';
  duration: number; // in seconds
  script: string;
  breathingCue?: string;
  voiceSettings?: {
    pace: 'slow' | 'normal' | 'fast';
    tone: 'gentle' | 'encouraging' | 'neutral';
  };
}

export interface BreathingPattern {
  name: string;
  inhale: number;
  hold1?: number;
  exhale: number;
  hold2?: number;
  description: string;
}
