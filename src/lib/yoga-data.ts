import type { Focus, Pose } from "../types/yoga";
import { PoseId } from "../types/yoga";

// ⚠️ Pose data will come from Supabase later; using a small stub for now
export const POSES: Pose[] = [
  {
    id: PoseId.Butterfly, name: "Butterfly Pose", sanskrit: "Baddha Konasana", intensity: 2, groups: ["Hips"], family: "Seated", defaultSeconds: 60, icon: "🦋",
    description: "Opens the hips and groin areas.",
    benefits: ["Stretches inner thighs", "Improves posture", "Stimulates abdominal organs"],
    cues: ["Sit tall", "Hinge from your hips", "Keep your spine long"],
    plane: 'frontal'
  },
  {
    id: PoseId.ForwardFold, name: "Standing Forward Fold", sanskrit: "Uttanāsana", intensity: 2, groups: ["Hamstrings", "Spine"], family: "Standing", defaultSeconds: 60, icon: "🧎",
    description: "Stretches the hamstrings, calves, and hips.",
    benefits: "Calms the brain, Relieves stress and mild depression, Stretches hamstrings",
    cues: ["Bend your knees generously", "Let your head hang heavy"],
    plane: 'sagittal'
  },
  {
    id: PoseId.DownDog, name: "Downward Facing Dog", sanskrit: "Adho Mukha Svanasana", intensity: 3, groups: ["Shoulders", "Hamstrings", "Spine"], family: "Inversion", defaultSeconds: 45, icon: "🐶",
    description: "An all-over, rejuvenating stretch.",
    benefits: ["Energizes the body", "Stretches shoulders and hamstrings", "Strengthens arms and legs"],
    cues: ["Press firmly through your palms", "Lift your sit bones toward the ceiling"],
    plane: 'sagittal'
  },
  {
    id: PoseId.Warrior1Right, name: "Warrior I (Right)", sanskrit: "Virabhadrāsana I", intensity: 3, groups: ["Hips", "Core"], family: "Standing", defaultSeconds: 45, icon: "🛡️",
    description: "Builds strength and confidence.",
    benefits: ["Strengthens shoulders, arms, back", "Stretches thighs, calves, ankles"],
    cues: ["Ground your back foot", "Square your hips forward"],
    plane: 'frontal'
  },
  {
    id: PoseId.HighLungeRight, name: "High Lunge (Right)", sanskrit: "Añjaneyāsana", intensity: 3, groups: ["Hips", "Core"], family: "Standing", defaultSeconds: 45, icon: "🏹",
    description: "A deep stretch for the hip flexors.",
    benefits: ["Improves balance", "Strengthens legs and arms"],
    cues: ["Keep your front knee over your ankle", "Engage your core"],
    plane: 'sagittal'
  },
  {
    id: PoseId.TwistLow, name: "Revolved Low Lunge", sanskrit: "Parivrtta Anjaneyasana", intensity: 4, groups: ["Spine", "Hips", "Core"], family: "Twist", defaultSeconds: 40, icon: "🌀",
    description: "A deep twist that aids in digestion.",
    benefits: ["Improves spinal mobility", "Stretches hip flexors"],
    cues: ["Inhale to lengthen", "Exhale to twist"],
    plane: 'transverse'
  },
  {
    id: PoseId.Bridge, name: "Bridge Pose", sanskrit: "Setu Bandha Sarvāṅgāsana", intensity: 2, groups: ["Spine", "Core"], family: "Backbend", defaultSeconds: 60, icon: "🌉",
    description: "Stretches the chest, neck, and spine.",
    benefits: ["Strengthens the back", "Improves posture"],
    cues: ["Press your feet into the floor", "Lift your hips"],
    plane: 'sagittal'
  },
  {
    id: PoseId.Pigeon, name: "Sleeping Pigeon", sanskrit: "Eka Pada Rajakapotasana (prep)", intensity: 2, groups: ["Hips"], family: "Hip Opener", defaultSeconds: 60, icon: "🕊️",
    description: "A deep hip opener.",
    benefits: ["Releases tight hips", "Stretches glutes and piriformis"],
    cues: ["Keep your hips square", "Flex your front foot"],
    plane: 'frontal'
  },
  {
    id: PoseId.Boat, name: "Boat Pose", sanskrit: "Nāvāsana", intensity: 4, groups: ["Core", "Hips"], family: "Core", defaultSeconds: 40, icon: "🚤",
    description: "Strengthens the abdominal muscles.",
    benefits: ["Improves balance", "Builds core strength"],
    cues: ["Lift your chest", "Keep your spine straight"],
    plane: 'sagittal'
  },
  {
    id: PoseId.Child, name: "Child's Pose", sanskrit: "Balasana", intensity: 1, groups: ["Spine", "Hips"], family: "Rest", defaultSeconds: 75, icon: "🛏️",
    description: "A gentle resting pose.",
    benefits: ["Gently stretches hips and back", "Calms the mind"],
    cues: ["Rest your forehead on the mat", "Breathe into your back body"],
    plane: 'sagittal'
  },
];

export const FOCI: readonly Focus[] = ["Full-Body", "Hips", "Hamstrings", "Shoulders", "Core", "Spine", "Balance"];

export const PRESETS: { name: string; flow: PoseId[] }[] = [
  { name: "Quick Core 15", flow: [PoseId.Boat, PoseId.Boat, PoseId.Bridge, PoseId.DownDog, PoseId.Child] },
  { name: "Hip Opener 30", flow: [PoseId.Butterfly, PoseId.Pigeon, PoseId.Pigeon, PoseId.TwistLow, PoseId.ForwardFold, PoseId.Child] },
  { name: "Morning Wake Up", flow: [PoseId.Child, PoseId.ForwardFold, PoseId.DownDog, PoseId.Warrior1Right, PoseId.HighLungeRight, PoseId.Bridge, PoseId.Child] },
  { name: "Evening Cool Down", flow: [PoseId.Butterfly, PoseId.ForwardFold, PoseId.Pigeon, PoseId.TwistLow, PoseId.Child] },
];
