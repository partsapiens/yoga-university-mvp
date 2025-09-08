// Types for the user-provided Flow Builder page.
// These are based on the stub data and may differ from the main app types.

export type Focus = "Full-Body" | "Hips" | "Hamstrings" | "Shoulders" | "Core" | "Spine" | "Balance";

export type SecondsOverrides = Record<number, number>; // key: index in flow

export type SavedFlow = {
  id: string;
  name: string;
  flow: string[];
  overrides: SecondsOverrides;
};

export type TimingMode = "seconds" | "breaths";
