import type { Focus, Pose } from "../types/yoga";
import { PoseId } from "../types/yoga";

// ⚠️ Pose data will come from Supabase later; using a small stub for now
export const POSES: Pose[] = [
  { id: PoseId.Butterfly,   name: "Butterfly Pose",           sanskrit: "Baddha Konasana",                         intensity: 2, groups: ["Hips", "Groin"],                    family: "Seated",    defaultSeconds: 60, icon: "🦋", description: "Opens the hips and groin areas. A great pose for improving flexibility in the inner thighs." },
  { id: PoseId.ForwardFold, name: "Standing Forward Fold",     sanskrit: "Uttanāsana",                              intensity: 2, groups: ["Hamstrings", "Spine"],              family: "Standing",  defaultSeconds: 60, icon: "🧎", description: "Stretches the hamstrings, calves, and hips. Helps to relieve stress and calm the brain." },
  { id: PoseId.DownDog,     name: "Downward Facing Dog",       sanskrit: "Adho Mukha Svanasana",                    intensity: 3, groups: ["Shoulders", "Hamstrings", "Spine"], family: "Inversion", defaultSeconds: 45, icon: "🐶", description: "An all-over, rejuvenating stretch. Builds strength in the arms and legs, and helps to lengthen the spine." },
  { id: PoseId.Warrior1Right,  name: "Warrior I (Right)",         sanskrit: "Virabhadrāsana I",                        intensity: 3, groups: ["Hips", "Quads", "Core"],            family: "Standing",  defaultSeconds: 45, icon: "🛡️", description: "Builds strength and confidence. Stretches the chest, lungs, shoulders, neck, belly, and groin." },
  { id: PoseId.HighLungeRight, name: "High Lunge (Right)",        sanskrit: "Añjaneyāsana",                            intensity: 3, groups: ["Hips", "Quads"],                    family: "Standing",  defaultSeconds: 45, icon: "🏹", description: "A deep stretch for the hip flexors and quadriceps. Improves balance and concentration." },
  { id: PoseId.TwistLow,    name: "Revolved Low Lunge",        sanskrit: "Parivrtta Anjaneyasana",                  intensity: 4, groups: ["Spine", "Hips", "Core"],           family: "Twist",     defaultSeconds: 40, icon: "🌀", description: "A deep twist that aids in digestion and helps to decompress the spine." },
  { id: PoseId.Bridge,      name: "Bridge Pose",               sanskrit: "Setu Bandha Sarvāṅgāsana",                intensity: 2, groups: ["Spine", "Glutes"],                  family: "Backbend",  defaultSeconds: 60, icon: "🌉", description: "Stretches the chest, neck, and spine. Calms the body and can help alleviate stress." },
  { id: PoseId.Pigeon,      name: "Sleeping Pigeon",           sanskrit: "Eka Pada Rajakapotasana (prep)",          intensity: 2, groups: ["Hips", "Glutes"],                   family: "Hip Opener",defaultSeconds: 60, icon: "🕊️", description: "A deep hip opener that releases tension in the hips and lower back. Great for after a long day of sitting." },
  { id: PoseId.Boat,        name: "Boat Pose",                 sanskrit: "Nāvāsana",                                intensity: 4, groups: ["Core", "Hip Flexors"],               family: "Core",      defaultSeconds: 40, icon: "🚤", description: "Strengthens the abdominal muscles, hip flexors, and spine." },
  { id: PoseId.Child,       name: "Child's Pose",              sanskrit: "Balasana",                                 intensity: 1, groups: ["Spine", "Hips"],                    family: "Rest",      defaultSeconds: 75, icon: "🛏️", description: "A gentle resting pose that calms the mind and stretches the hips, thighs, and ankles." },
];

export const FOCI: readonly Focus[] = ["Full-Body", "Hips", "Hamstrings", "Shoulders", "Core", "Spine", "Balance"];

// Presets (chips)
export const PRESETS: { name: string; flow: PoseId[] }[] = [
  { name: "Quick Core 15", flow: [PoseId.Boat, PoseId.Boat, PoseId.Bridge, PoseId.DownDog, PoseId.Child] },
  { name: "Hip Opener 30", flow: [PoseId.Butterfly, PoseId.Pigeon, PoseId.Pigeon, PoseId.TwistLow, PoseId.ForwardFold, PoseId.Child] },
  { name: "Morning Wake Up", flow: [PoseId.Child, PoseId.ForwardFold, PoseId.DownDog, PoseId.Warrior1Right, PoseId.HighLungeRight, PoseId.Bridge, PoseId.Child] },
  { name: "Evening Cool Down", flow: [PoseId.Butterfly, PoseId.ForwardFold, PoseId.Pigeon, PoseId.TwistLow, PoseId.Child] },
];
