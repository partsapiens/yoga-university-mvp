import type { Focus } from "@/types/yoga";

// ⚠️ Pose data will come from Supabase later; using a small stub for now
export const POSES = [
  { id: "butterfly",   name: "Butterfly Pose",           sanskrit: "Baddha Konasana",                         intensity: 2, groups: ["Hips", "Groin"],                    family: "Seated",    defaultSeconds: 60, icon: "🦋" },
  { id: "forward_fold",name: "Standing Forward Fold",     sanskrit: "Uttanāsana",                              intensity: 2, groups: ["Hamstrings", "Spine"],              family: "Standing",  defaultSeconds: 60, icon: "🧎" },
  { id: "down_dog",    name: "Downward Facing Dog",       sanskrit: "Adho Mukha Svanasana",                    intensity: 3, groups: ["Shoulders", "Hamstrings", "Spine"], family: "Inversion", defaultSeconds: 45, icon: "🐶" },
  { id: "warrior1_r",  name: "Warrior I (Right)",         sanskrit: "Virabhadrāsana I",                        intensity: 3, groups: ["Hips", "Quads", "Core"],            family: "Standing",  defaultSeconds: 45, icon: "🛡️" },
  { id: "high_lunge_r",name: "High Lunge (Right)",        sanskrit: "Añjaneyāsana",                            intensity: 3, groups: ["Hips", "Quads"],                    family: "Standing",  defaultSeconds: 45, icon: "🏹" },
  { id: "twist_low",   name: "Revolved Low Lunge",        sanskrit: "Parivrtta Anjaneyasana",                  intensity: 4, groups: ["Spine", "Hips", "Core"],           family: "Twist",     defaultSeconds: 40, icon: "🌀" },
  { id: "bridge",      name: "Bridge Pose",               sanskrit: "Setu Bandha Sarvāṅgāsana",                intensity: 2, groups: ["Spine", "Glutes"],                  family: "Backbend",  defaultSeconds: 60, icon: "🌉" },
  { id: "pigeon",      name: "Sleeping Pigeon",           sanskrit: "Eka Pada Rajakapotasana (prep)",          intensity: 2, groups: ["Hips", "Glutes"],                   family: "Hip Opener",defaultSeconds: 60, icon: "🕊️" },
  { id: "boat",        name: "Boat Pose",                 sanskrit: "Nāvāsana",                                intensity: 4, groups: ["Core", "Hip Flexors"],               family: "Core",      defaultSeconds: 40, icon: "🚤" },
  { id: "child",       name: "Child's Pose",              sanskrit: "Balasana",                                 intensity: 1, groups: ["Spine", "Hips"],                    family: "Rest",      defaultSeconds: 75, icon: "🛏️" },
];

export const FOCI: readonly Focus[] = ["Full-Body", "Hips", "Hamstrings", "Shoulders", "Core", "Spine", "Balance"];

// Presets (chips)
export const PRESETS: { name: string; flow: string[] }[] = [
  { name: "Quick Core 15", flow: ["boat", "boat", "bridge", "down_dog", "child"] },
  { name: "Hip Opener 30", flow: ["butterfly", "pigeon", "pigeon", "twist_low", "forward_fold", "child"] },
  { name: "Morning Wake Up", flow: ["child", "forward_fold", "down_dog", "warrior1_r", "high_lunge_r", "bridge", "child"] },
  { name: "Evening Cool Down", flow: ["butterfly", "forward_fold", "pigeon", "twist_low", "child"] },
];
