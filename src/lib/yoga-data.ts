import type { Focus } from "../types/yoga";
import { PoseId } from "../types/yoga";

// ⚠️ Pose data will come from Supabase later; using a small stub for now
export const POSES: Array<{ id: PoseId; name: string; sanskrit: string; intensity: number; groups: string[]; family: string; defaultSeconds: number; icon: string }> = [
  { id: PoseId.Butterfly,   name: "Butterfly Pose",           sanskrit: "Baddha Konasana",                         intensity: 2, groups: ["Hips", "Groin"],                    family: "Seated",    defaultSeconds: 60, icon: "🦋" },
  { id: PoseId.ForwardFold, name: "Standing Forward Fold",     sanskrit: "Uttanāsana",                              intensity: 2, groups: ["Hamstrings", "Spine"],              family: "Standing",  defaultSeconds: 60, icon: "🧎" },
  { id: PoseId.DownDog,     name: "Downward Facing Dog",       sanskrit: "Adho Mukha Svanasana",                    intensity: 3, groups: ["Shoulders", "Hamstrings", "Spine"], family: "Inversion", defaultSeconds: 45, icon: "🐶" },
  { id: PoseId.Warrior1Right,  name: "Warrior I (Right)",         sanskrit: "Virabhadrāsana I",                        intensity: 3, groups: ["Hips", "Quads", "Core"],            family: "Standing",  defaultSeconds: 45, icon: "🛡️" },
  { id: PoseId.HighLungeRight, name: "High Lunge (Right)",        sanskrit: "Añjaneyāsana",                            intensity: 3, groups: ["Hips", "Quads"],                    family: "Standing",  defaultSeconds: 45, icon: "🏹" },
  { id: PoseId.TwistLow,    name: "Revolved Low Lunge",        sanskrit: "Parivrtta Anjaneyasana",                  intensity: 4, groups: ["Spine", "Hips", "Core"],           family: "Twist",     defaultSeconds: 40, icon: "🌀" },
  { id: PoseId.Bridge,      name: "Bridge Pose",               sanskrit: "Setu Bandha Sarvāṅgāsana",                intensity: 2, groups: ["Spine", "Glutes"],                  family: "Backbend",  defaultSeconds: 60, icon: "🌉" },
  { id: PoseId.Pigeon,      name: "Sleeping Pigeon",           sanskrit: "Eka Pada Rajakapotasana (prep)",          intensity: 2, groups: ["Hips", "Glutes"],                   family: "Hip Opener",defaultSeconds: 60, icon: "🕊️" },
  { id: PoseId.Boat,        name: "Boat Pose",                 sanskrit: "Nāvāsana",                                intensity: 4, groups: ["Core", "Hip Flexors"],               family: "Core",      defaultSeconds: 40, icon: "🚤" },
  { id: PoseId.Child,       name: "Child's Pose",              sanskrit: "Balasana",                                 intensity: 1, groups: ["Spine", "Hips"],                    family: "Rest",      defaultSeconds: 75, icon: "🛏️" },
];

export const FOCI: readonly Focus[] = ["Full-Body", "Hips", "Hamstrings", "Shoulders", "Core", "Spine", "Balance"];

// Presets (chips)
export const PRESETS: { name: string; flow: PoseId[] }[] = [
  { name: "Quick Core 15", flow: [PoseId.Boat, PoseId.Boat, PoseId.Bridge, PoseId.DownDog, PoseId.Child] },
  { name: "Hip Opener 30", flow: [PoseId.Butterfly, PoseId.Pigeon, PoseId.Pigeon, PoseId.TwistLow, PoseId.ForwardFold, PoseId.Child] },
  { name: "Morning Wake-Up", flow: [PoseId.Child, PoseId.ForwardFold, PoseId.DownDog, PoseId.Warrior1Right, PoseId.HighLungeRight, PoseId.Bridge, PoseId.Child] },
  { name: "Evening Unwind", flow: [PoseId.Butterfly, PoseId.ForwardFold, PoseId.Pigeon, PoseId.TwistLow, PoseId.Child] },
  { name: "Restorative 20", flow: [PoseId.Butterfly, PoseId.ForwardFold, PoseId.Child, PoseId.Child] },
  { name: "Power 45", flow: [PoseId.DownDog, PoseId.Warrior1Right, PoseId.HighLungeRight, PoseId.Boat, PoseId.Bridge, PoseId.TwistLow, PoseId.Child] },
];
