export type Focus = "Full-Body" | "Hips" | "Hamstrings" | "Shoulders" | "Core" | "Spine" | "Balance";

export enum PoseId {
  Butterfly = "butterfly",
  ForwardFold = "forward_fold",
  DownDog = "down_dog",
  Warrior1Right = "warrior1_r",
  HighLungeRight = "high_lunge_r",
  TwistLow = "twist_low",
  Bridge = "bridge",
  Pigeon = "pigeon",
  Boat = "boat",
  Child = "child",
}

export type Pose = {
  id: PoseId;
  name: string;
  sanskrit: string;
  defaultSeconds: number;
  icon: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  groups: Focus[];
  family: "Standing" | "Seated" | "Backbend" | "Twist" | "Inversion" | "Rest" | "Hip Opener" | "Core" | string;
  description?: string;
};

export type SecondsOverrides = Record<number, number>;

export type SavedFlow = {
  id: string;
  name: string;
  flow: PoseId[];
  overrides: SecondsOverrides;
};

export enum TimingMode {
  Seconds = "seconds",
  Breaths = "breaths",
}
