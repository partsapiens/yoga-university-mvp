import { PoseId } from './yoga';

export interface RecommendationInput {
  duration: number;
  intensity: number;
  mood: string;
  focuses: string[];
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
