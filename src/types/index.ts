export interface Pose {
  id: string;
  name: string;
  sanskrit: string;
  category: PoseCategory;
  level: DifficultyLevel;
  muscles: string[];
  icon: string;
  description: string;
  cues: string[];
  benefits: string[];
  meta: PoseMeta;
}

export interface PoseMeta {
  intensity: number;
  sides: 'bilateral' | 'unilateral';
  typicalHoldSec: number;
  counterposes: string[];
  warmsUp: string[];
  contraindications: string[];
  otherSide?: string;
  musclesEngaged: string[];
  musclesStretched: string[];
}

export type PoseCategory =
  | 'Standing' | 'Seated' | 'Backbend' | 'Forward Fold'
  | 'Twist' | 'Inversion' | 'Hip Opener' | 'Arm Balance'
  | 'Restorative' | 'Warm-up';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface FlowStep {
  poseId: string;
  holdSeconds: number;
  sides: 'both' | 'R' | 'L';
  order: number;
}

export interface Flow {
  id: string;
  title: string;
  owner_id: string;
  visibility: 'private' | 'public';
  steps: FlowStep[];
  goal: FlowGoal;
  class_type: ClassType;
  est_minutes: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type FlowGoal = 'Hips' | 'Shoulders' | 'Back' | 'Balance' | 'Calm' | 'Energize';
export type ClassType = 'C1' | 'C2' | 'HPF' | 'Sculpt' | 'Restorative';

export interface AIFlowSuggestion {
  poseId: string;
  why: string;
  type: 'progression' | 'counterpose' | 'reset' | 'build' | 'balance';
  score: number;
}

export interface FlowAnalytics {
  duration: number;
  intensity: 'Gentle' | 'Moderate' | 'Challenging' | 'Intense';
  poseCount: number;
  primaryFocus: string;
  bilateralBalance: boolean;
  suggestions: string[];
}
