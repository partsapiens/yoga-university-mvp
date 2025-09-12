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

// Enhanced AI Selector Input
export interface AISelectInput {
  userText: string;
  timeOfDay: string;
  preferredDuration?: number;
  recentSessions?: Array<{style: string, completed: boolean, rating?: number}>;
  userMood?: 'stressed' | 'tired' | 'anxious' | 'energetic' | 'neutral';
}

// Enhanced AI Selector Output
export interface AISelectOutput {
  style: string;
  duration: number;
  breathingPattern: {inhale: number, hold: number, exhale: number};
  rationale: string;
  visualTheme: 'calm-blue' | 'energizing-gold' | 'grounding-green';
  confidence: number;
}

// Enhanced Script Generation Input
export interface AIScriptInput {
  style: string;
  duration: number;
  userPreferences: {
    voiceTone: 'gentle' | 'confident' | 'warm';
    guidanceLevel: 'minimal' | 'moderate' | 'detailed';
    personalTouchpoints: string[];
  };
  sessionHistory: Array<{scriptId: string, rating?: number, completed: boolean}>;
  userContext?: string;
}

// Enhanced Script Generation Output
export interface AIScriptOutput {
  scriptId: string;
  intro: string;
  breathingCues: Array<{phase: string, text: string, duration: number}>;
  transitions: string[];
  outro: string;
  backgroundMusicSuggestion: string;
  estimatedWords: number;
}

// Session Insights Input
export interface AIInsightsInput {
  sessionData: {
    style: string;
    duration: number;
    completed: boolean;
    userFeedback?: string;
    completionTime: number;
    userRating?: number;
  };
  userJourney: {
    totalSessions: number;
    weeklyAverage: number;
    preferredStyles: string[];
    progressMetrics: object;
  };
}

// Session Insights Output
export interface AIInsightsOutput {
  immediateRecap: string;
  insights: string[];
  nextRecommendation: {
    suggestion: string;
    reasoning: string;
    recommendedTime: string;
  };
  journeyProgress: {
    milestone?: string;
    encouragement: string;
    skillsDeveloped: string[];
  };
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

// Enhanced recommendation types
export interface MeditationRecommendation {
  id: string;
  title: string;
  description: string;
  duration: number;
  style: string;
  confidence: number;
  reasoning: string;
  tags: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  breathingPattern?: BreathingPattern;
  personalizedFor?: {
    mood?: string;
    energyLevel?: 'low' | 'medium' | 'high';
    stressLevel?: 'low' | 'medium' | 'high';
    experience?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface UserMeditationProfile {
  preferredDurations: number[];
  favoriteStyles: string[];
  typicalMeditationTimes: string[];
  completionRate: number;
  averageRating: number;
  recentMoods: string[];
  meditationGoals: string[];
  lastRecommendationDate?: string;
}

export interface RecommendationContext {
  timeOfDay: string;
  dayOfWeek: string;
  userProfile: UserMeditationProfile;
  recentSessions: Array<{
    style: string;
    duration: number;
    completed: boolean;
    rating?: number;
    timestamp: string;
    mood?: string;
  }>;
  currentMood?: string;
  availableTime?: number;
}
