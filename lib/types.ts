export type Pose = {
  id: string;
  slug: string;
  name: string;
  category: string;
  level: "Beginner"|"Intermediate"|"Advanced";
  plane: "Frontal"|"Sagittal"|"Transverse";
  thumbnailUrl?: string;
  musclesEngaged: string[];
  musclesStretched: string[];
  cues: string[];
  benefits: string[];
  injuries: string[];
  variations?: string[];
  counterposeIds?: string[];
};

export type FlowStep = {
  poseId: string;
  holdSeconds?: number;
  reps?: number;
  sides?: "both"|"R"|"L";
  customCue?: string;
};

export type Flow = {
  id: string;
  ownerId: string;
  title: string;
  visibility: "private"|"unlisted"|"public";
  estMinutes?: number;
  tags?: string[];
  steps: FlowStep[];
};
