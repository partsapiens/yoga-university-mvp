// Types for the user-provided Flow Builder page.
// These are based on the stub data and may differ from the main app types.

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

export type SecondsOverrides = Record<number, number>; // key: index in flow

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

