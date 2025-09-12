import type { Focus } from "../types/yoga";
import { PoseId } from "../types/yoga";

// ⚠️ Pose data will come from Supabase later; using a small stub for now
export const POSES: Array<{ id: PoseId; name: string; sanskrit: string; intensity: number; groups: string[]; family: string; defaultSeconds: number; icon: string; plane: string; chakra: string }> = [
  { id: PoseId.Butterfly,   name: "Butterfly Pose",           sanskrit: "Baddha Konasana",                         intensity: 2, groups: ["Hips", "Groin"],                    family: "Seated",    defaultSeconds: 60, icon: "🦋", plane: "Sagittal", chakra: "Sacral" },
  { id: PoseId.ForwardFold, name: "Standing Forward Fold",     sanskrit: "Uttanāsana",                              intensity: 2, groups: ["Hamstrings", "Spine"],              family: "Standing",  defaultSeconds: 60, icon: "🧎", plane: "Sagittal", chakra: "Root" },
  { id: PoseId.DownDog,     name: "Downward Facing Dog",       sanskrit: "Adho Mukha Svanasana",                    intensity: 3, groups: ["Shoulders", "Hamstrings", "Spine"], family: "Inversion", defaultSeconds: 45, icon: "🐶", plane: "Sagittal", chakra: "Heart" },
  { id: PoseId.Warrior1Right,  name: "Warrior I (Right)",         sanskrit: "Virabhadrāsana I",                        intensity: 3, groups: ["Hips", "Quads", "Core"],            family: "Standing",  defaultSeconds: 45, icon: "🛡️", plane: "Sagittal", chakra: "Solar Plexus" },
  { id: PoseId.HighLungeRight, name: "High Lunge (Right)",        sanskrit: "Añjaneyāsana",                            intensity: 3, groups: ["Hips", "Quads"],                    family: "Standing",  defaultSeconds: 45, icon: "🏹", plane: "Sagittal", chakra: "Heart" },
  { id: PoseId.TwistLow,    name: "Revolved Low Lunge",        sanskrit: "Parivrtta Anjaneyasana",                  intensity: 4, groups: ["Spine", "Hips", "Core"],           family: "Twist",     defaultSeconds: 40, icon: "🌀", plane: "Transverse", chakra: "Solar Plexus" },
  { id: PoseId.Bridge,      name: "Bridge Pose",               sanskrit: "Setu Bandha Sarvāṅgāsana",                intensity: 2, groups: ["Spine", "Glutes"],                  family: "Backbend",  defaultSeconds: 60, icon: "🌉", plane: "Sagittal", chakra: "Heart" },
  { id: PoseId.Pigeon,      name: "Sleeping Pigeon",           sanskrit: "Eka Pada Rajakapotasana (prep)",          intensity: 2, groups: ["Hips", "Glutes"],                   family: "Hip Opener",defaultSeconds: 60, icon: "🕊️", plane: "Frontal", chakra: "Sacral" },
  { id: PoseId.Boat,        name: "Boat Pose",                 sanskrit: "Nāvāsana",                                intensity: 4, groups: ["Core", "Hip Flexors"],               family: "Core",      defaultSeconds: 40, icon: "🚤", plane: "Sagittal", chakra: "Solar Plexus" },
  { id: PoseId.Child,       name: "Child's Pose",              sanskrit: "Balasana",                                 intensity: 1, groups: ["Spine", "Hips"],                    family: "Rest",      defaultSeconds: 75, icon: "🛏️", plane: "Sagittal", chakra: "Root" },
];

// Extended pose library for comprehensive pose collection
export const EXTENDED_POSES = [
  // Standing Poses
  { name: "Mountain Pose", sanskrit: "Tadasana", intensity: 1, groups: ["Posture", "Foundation"], family: "Standing", defaultSeconds: 30, icon: "🏔️", plane: "Sagittal", chakra: "Root" },
  { name: "Tree Pose", sanskrit: "Vrksasana", intensity: 2, groups: ["Balance", "Core", "Hips"], family: "Standing", defaultSeconds: 45, icon: "🌲", plane: "Frontal", chakra: "Root" },
  { name: "Warrior II", sanskrit: "Virabhadrasana II", intensity: 3, groups: ["Legs", "Hips", "Core"], family: "Standing", defaultSeconds: 45, icon: "⚔️", plane: "Frontal", chakra: "Sacral" },
  { name: "Warrior III", sanskrit: "Virabhadrasana III", intensity: 4, groups: ["Balance", "Core", "Legs"], family: "Standing", defaultSeconds: 30, icon: "🏹", plane: "Sagittal", chakra: "Solar Plexus" },
  { name: "Triangle Pose", sanskrit: "Trikonasana", intensity: 2, groups: ["Hamstrings", "Hips", "Spine"], family: "Standing", defaultSeconds: 45, icon: "📐", plane: "Frontal", chakra: "Solar Plexus" },
  { name: "Extended Side Angle", sanskrit: "Utthita Parsvakonasana", intensity: 3, groups: ["Hips", "Side Body", "Legs"], family: "Standing", defaultSeconds: 45, icon: "📏", plane: "Frontal", chakra: "Heart" },
  { name: "Wide-Legged Forward Fold", sanskrit: "Prasarita Padottanasana", intensity: 2, groups: ["Hamstrings", "Hips", "Spine"], family: "Standing", defaultSeconds: 60, icon: "🤸", plane: "Sagittal", chakra: "Root" },
  { name: "Eagle Pose", sanskrit: "Garudasana", intensity: 3, groups: ["Balance", "Hips", "Shoulders"], family: "Standing", defaultSeconds: 30, icon: "🦅", plane: "Frontal", chakra: "Heart" },
  { name: "Chair Pose", sanskrit: "Utkatasana", intensity: 3, groups: ["Quads", "Core", "Ankles"], family: "Standing", defaultSeconds: 30, icon: "🪑", plane: "Sagittal", chakra: "Solar Plexus" },
  
  // Seated Poses
  { name: "Easy Pose", sanskrit: "Sukhasana", intensity: 1, groups: ["Hips", "Spine"], family: "Seated", defaultSeconds: 90, icon: "🧘", plane: "Sagittal", chakra: "Root" },
  { name: "Lotus Pose", sanskrit: "Padmasana", intensity: 4, groups: ["Hips", "Ankles", "Knees"], family: "Seated", defaultSeconds: 90, icon: "🪷", plane: "Frontal", chakra: "Crown" },
  { name: "Half Lotus", sanskrit: "Ardha Padmasana", intensity: 3, groups: ["Hips", "Ankles"], family: "Seated", defaultSeconds: 90, icon: "🌸", plane: "Frontal", chakra: "Heart" },
  { name: "Seated Forward Fold", sanskrit: "Paschimottanasana", intensity: 2, groups: ["Hamstrings", "Spine"], family: "Seated", defaultSeconds: 75, icon: "📖", plane: "Sagittal", chakra: "Sacral" },
  { name: "Bound Angle Pose", sanskrit: "Baddha Konasana", intensity: 2, groups: ["Hips", "Groin"], family: "Seated", defaultSeconds: 75, icon: "🦋", plane: "Frontal", chakra: "Sacral" },
  { name: "Cow Face Pose", sanskrit: "Gomukhasana", intensity: 3, groups: ["Hips", "Shoulders"], family: "Seated", defaultSeconds: 60, icon: "🐄", plane: "Frontal", chakra: "Heart" },
  { name: "Seated Twist", sanskrit: "Bharadvajasana", intensity: 2, groups: ["Spine", "Hips"], family: "Seated", defaultSeconds: 45, icon: "🌀", plane: "Transverse", chakra: "Solar Plexus" },
  
  // Backbends
  { name: "Cobra Pose", sanskrit: "Bhujangasana", intensity: 2, groups: ["Spine", "Shoulders", "Core"], family: "Backbend", defaultSeconds: 30, icon: "🐍", plane: "Sagittal", chakra: "Heart" },
  { name: "Upward Facing Dog", sanskrit: "Urdhva Mukha Svanasana", intensity: 3, groups: ["Shoulders", "Spine", "Core"], family: "Backbend", defaultSeconds: 30, icon: "🐕", plane: "Sagittal", chakra: "Heart" },
  { name: "Camel Pose", sanskrit: "Ustrasana", intensity: 4, groups: ["Spine", "Hip Flexors", "Shoulders"], family: "Backbend", defaultSeconds: 30, icon: "🐪", plane: "Sagittal", chakra: "Heart" },
  { name: "Wheel Pose", sanskrit: "Urdhva Dhanurasana", intensity: 5, groups: ["Spine", "Shoulders", "Legs"], family: "Backbend", defaultSeconds: 30, icon: "🎡", plane: "Sagittal", chakra: "Heart" },
  { name: "Fish Pose", sanskrit: "Matsyasana", intensity: 2, groups: ["Spine", "Neck", "Hip Flexors"], family: "Backbend", defaultSeconds: 45, icon: "🐟", plane: "Sagittal", chakra: "Throat" },
  
  // Inversions
  { name: "Headstand", sanskrit: "Sirsasana", intensity: 5, groups: ["Shoulders", "Core", "Balance"], family: "Inversion", defaultSeconds: 60, icon: "🤸‍♀️", plane: "Sagittal", chakra: "Crown" },
  { name: "Shoulderstand", sanskrit: "Sarvangasana", intensity: 4, groups: ["Shoulders", "Neck", "Core"], family: "Inversion", defaultSeconds: 60, icon: "🤸‍♂️", plane: "Sagittal", chakra: "Throat" },
  { name: "Legs Up Wall", sanskrit: "Viparita Karani", intensity: 1, groups: ["Legs", "Lower Back"], family: "Inversion", defaultSeconds: 300, icon: "🦵", plane: "Sagittal", chakra: "Heart" },
  { name: "Forearm Stand", sanskrit: "Pincha Mayurasana", intensity: 5, groups: ["Shoulders", "Core", "Balance"], family: "Inversion", defaultSeconds: 30, icon: "🦚", plane: "Sagittal", chakra: "Crown" },
  
  // Arm Balances
  { name: "Crow Pose", sanskrit: "Bakasana", intensity: 4, groups: ["Arms", "Core", "Balance"], family: "Arm Balance", defaultSeconds: 30, icon: "🐦", plane: "Sagittal", chakra: "Solar Plexus" },
  { name: "Side Crow", sanskrit: "Parsva Bakasana", intensity: 5, groups: ["Arms", "Core", "Obliques"], family: "Arm Balance", defaultSeconds: 30, icon: "🐦‍⬛", plane: "Transverse", chakra: "Solar Plexus" },
  { name: "Eight-Angle Pose", sanskrit: "Astavakrasana", intensity: 5, groups: ["Arms", "Core", "Hips"], family: "Arm Balance", defaultSeconds: 20, icon: "🕷️", plane: "Transverse", chakra: "Solar Plexus" },
  { name: "Firefly Pose", sanskrit: "Tittibhasana", intensity: 5, groups: ["Arms", "Hamstrings", "Core"], family: "Arm Balance", defaultSeconds: 20, icon: "🪲", plane: "Sagittal", chakra: "Solar Plexus" },
  
  // Hip Openers
  { name: "Pigeon Pose", sanskrit: "Eka Pada Rajakapotasana", intensity: 3, groups: ["Hips", "Hip Flexors"], family: "Hip Opener", defaultSeconds: 90, icon: "🕊️", plane: "Frontal", chakra: "Sacral" },
  { name: "Double Pigeon", sanskrit: "Agnistambhasana", intensity: 3, groups: ["Hips", "IT Band"], family: "Hip Opener", defaultSeconds: 75, icon: "🕊️🕊️", plane: "Frontal", chakra: "Sacral" },
  { name: "Lizard Pose", sanskrit: "Utthan Pristhasana", intensity: 3, groups: ["Hip Flexors", "Hamstrings"], family: "Hip Opener", defaultSeconds: 60, icon: "🦎", plane: "Sagittal", chakra: "Sacral" },
  { name: "Frog Pose", sanskrit: "Mandukasana", intensity: 4, groups: ["Hips", "Groin", "Adductors"], family: "Hip Opener", defaultSeconds: 90, icon: "🐸", plane: "Frontal", chakra: "Sacral" },
  
  // Twists
  { name: "Revolved Triangle", sanskrit: "Parivrtta Trikonasana", intensity: 4, groups: ["Spine", "Hamstrings", "Core"], family: "Twist", defaultSeconds: 45, icon: "🌪️", plane: "Transverse", chakra: "Solar Plexus" },
  { name: "Revolved Side Angle", sanskrit: "Parivrtta Parsvakonasana", intensity: 4, groups: ["Spine", "Hips", "Core"], family: "Twist", defaultSeconds: 45, icon: "🌀", plane: "Transverse", chakra: "Solar Plexus" },
  { name: "Seated Spinal Twist", sanskrit: "Marichyasana III", intensity: 3, groups: ["Spine", "Hips"], family: "Twist", defaultSeconds: 45, icon: "🌊", plane: "Transverse", chakra: "Solar Plexus" },
  
  // Core Poses
  { name: "Plank Pose", sanskrit: "Phalakasana", intensity: 3, groups: ["Core", "Shoulders", "Arms"], family: "Core", defaultSeconds: 45, icon: "📏", plane: "Sagittal", chakra: "Solar Plexus" },
  { name: "Side Plank", sanskrit: "Vasisthasana", intensity: 4, groups: ["Core", "Shoulders", "Obliques"], family: "Core", defaultSeconds: 30, icon: "📐", plane: "Frontal", chakra: "Solar Plexus" },
  { name: "Hollow Body", sanskrit: "Navasana Variation", intensity: 4, groups: ["Core", "Hip Flexors"], family: "Core", defaultSeconds: 30, icon: "⭕", plane: "Sagittal", chakra: "Solar Plexus" },
  
  // Restorative Poses
  { name: "Corpse Pose", sanskrit: "Savasana", intensity: 1, groups: ["Full Body", "Relaxation"], family: "Restorative", defaultSeconds: 300, icon: "💀", plane: "Sagittal", chakra: "Crown" },
  { name: "Supported Fish", sanskrit: "Matsyasana (Supported)", intensity: 1, groups: ["Heart", "Shoulders"], family: "Restorative", defaultSeconds: 180, icon: "🐠", plane: "Sagittal", chakra: "Heart" },
  { name: "Legs on Chair", sanskrit: "Viparita Karani (Variation)", intensity: 1, groups: ["Legs", "Lower Back"], family: "Restorative", defaultSeconds: 300, icon: "🪑", plane: "Sagittal", chakra: "Heart" },
  { name: "Supported Twist", sanskrit: "Bharadvajasana (Supported)", intensity: 1, groups: ["Spine", "Hips"], family: "Restorative", defaultSeconds: 180, icon: "🛏️", plane: "Transverse", chakra: "Heart" },
  
  // Sun Salutation Poses
  { name: "Upward Salute", sanskrit: "Urdhva Hastasana", intensity: 1, groups: ["Shoulders", "Side Body"], family: "Standing", defaultSeconds: 15, icon: "🙌", plane: "Sagittal", chakra: "Heart" },
  { name: "Half Lift", sanskrit: "Ardha Uttanasana", intensity: 2, groups: ["Hamstrings", "Spine"], family: "Standing", defaultSeconds: 15, icon: "📐", plane: "Sagittal", chakra: "Solar Plexus" },
  { name: "Low Lunge", sanskrit: "Anjaneyasana", intensity: 2, groups: ["Hip Flexors", "Quads"], family: "Standing", defaultSeconds: 30, icon: "🏃", plane: "Sagittal", chakra: "Sacral" },
  { name: "Four-Limbed Staff", sanskrit: "Chaturanga Dandasana", intensity: 4, groups: ["Arms", "Core", "Shoulders"], family: "Arm Balance", defaultSeconds: 15, icon: "📏", plane: "Sagittal", chakra: "Solar Plexus" },
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
