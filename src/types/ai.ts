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
