import { POSES } from "./yoga-data";
import { PoseId } from "../types/yoga";
import type { Focus, SecondsOverrides } from "../types/yoga";

export function dotBar(value: number) {
  return Array.from({ length: 5 }, (_, i) => (i < value ? "●" : "○")).join("");
}

export function buildCues(poseId: PoseId, breathingOn = true) {
  const breath = breathingOn ? (t: string) => ` ${t}` : () => "";
  switch (poseId) {
    case PoseId.DownDog: return `Press palms, lift hips back and up.${breath("Inhale lengthen; exhale soften your neck.")}`;
    case PoseId.ForwardFold: return `Long spine, hinge from hips, crown heavy.${breath("Inhale half lift; exhale fold.")}`;
    case PoseId.Warrior1Right: return `Root back heel, bend front knee, reach high.${breath("Inhale rise; exhale square the hips.")}`;
    case PoseId.HighLungeRight: return `Back heel high, ribs knit, tail long.${breath("Steady breath in and out.")}`;
    case PoseId.TwistLow: return `Lengthen then rotate from navel up.${breath("Inhale lengthen; exhale twist.")}`;
    case PoseId.Bridge: return `Press heels, lift hips, shoulders tuck.${breath("Smooth inhalations and exhalations.")}`;
    case PoseId.Pigeon: return `Square hips, flex front foot, fold.${breath("Slow down the breath.")}`;
    case PoseId.Boat: return `Lift chest, core on, shins parallel.${breath("Steady, even breath.")}`;
    case PoseId.Child: return `Hips to heels, forehead down.${breath("Breathe into back body.")}`;
    case PoseId.Butterfly:
    default: return `Soles together, knees wide, hinge from hips.${breath("Inhale length; exhale soften.")}`;
  }
}
const COUNTERPOSE: Record<string, PoseId[]> = { backbend: [PoseId.ForwardFold, PoseId.Child], twist: [PoseId.ForwardFold, PoseId.Child] };

function familyOf(id: PoseId) { return POSES.find((p) => p.id === id)?.family?.toLowerCase() || ""; }
function needsCounter(id: PoseId) { const fam = familyOf(id); if (/backbend/i.test(fam)) return COUNTERPOSE.backbend; if (/twist/i.test(fam)) return COUNTERPOSE.twist; return []; }
function isUnsafeBackToBack(prev: PoseId, next: PoseId) { const pf = familyOf(prev), nf = familyOf(next); return (/twist/i.test(pf) && /backbend/i.test(nf)) || (/backbend/i.test(pf) && /twist/i.test(nf)); }

export function coachTip(prevId: PoseId | undefined, id: PoseId, nextId: PoseId | undefined) {
  const fam = familyOf(id);
  if (prevId && isUnsafeBackToBack(prevId, id)) return "Neutral pose inserted to protect the spine.";
  if (/twist/.test(fam)) return "Twist after lengthening to protect discs; return to neutral afterward.";
  if (/backbend/.test(fam)) return "Backbend follows prep; counter with a fold or child's pose.";
  if (/inversion|down_dog/.test(id)) return "Inversion-lite to elongate spine and reset breath.";
  return "Balances sequence based on focus and intensity.";
}

export function baseDurationsFromTable(flowIds: PoseId[]) { return flowIds.map((id) => POSES.find((p) => p.id === id)?.defaultSeconds ?? 45); }
export function applyOverridesByIndex(base: number[], overrides: SecondsOverrides) { const out = base.slice(); Object.keys(overrides).forEach((k) => { const idx = Number(k); const v = overrides[idx]; if (Number.isFinite(v) && v > 0 && idx >= 0 && idx < out.length) out[idx] = Math.floor(v); }); return out; }
export function reindexOverridesAfterRemoval(old: SecondsOverrides, removedIndex: number): SecondsOverrides { const out: SecondsOverrides = {}; Object.entries(old).forEach(([k, v]) => { const i = Number(k); if (i < removedIndex) out[i] = v as number; else if (i > removedIndex) out[i - 1] = v as number; }); return out; }

export function moveOverrides(old: SecondsOverrides, from: number, to: number): SecondsOverrides {
    const out: SecondsOverrides = {};
    const n = Math.max(...Object.keys(old).map(Number).concat([-1])) + 1;
    for (let i = 0; i < n; i++) {
        const val = old[i];
        if (val == null) continue;
        let j = i;
        if (i === from) {
            j = to;
        } else if (from < to && i > from && i <= to) {
            j = i - 1;
        } else if (to < from && i >= to && i < from) {
            j = i + 1;
        }
        out[j] = val;
    }
    return out;
}

export function computeTotalRemaining(currentIndex: number, remainingInCurrent: number, durations: number[], transitionSec: number, flowLen: number, cooldownSec: number, inCooldown: boolean) {
  const tail = durations.slice(Math.max(0, currentIndex + (inCooldown ? 1 : 0))).reduce((a, b) => a + b, 0);
  const remainingTransitions = Math.max(0, (flowLen - 1 - (inCooldown ? flowLen : currentIndex))) * transitionSec;
  return Math.max(0, Math.floor(remainingInCurrent + tail + remainingTransitions + (inCooldown ? 0 : cooldownSec)));
}

export function tempoAdjust(seconds: number, tempo: number) {
  return Math.max(1, Math.round(seconds / Math.max(0.25, Math.min(4, tempo))));
}

function templateSunA(): PoseId[] { return [PoseId.Child, PoseId.DownDog, PoseId.ForwardFold, PoseId.HighLungeRight, PoseId.Warrior1Right, PoseId.DownDog, PoseId.ForwardFold, PoseId.Child]; }

export function applySafetyAdjustments(seq: PoseId[]): PoseId[] {
  const out: PoseId[] = [];
  for (let i = 0; i < seq.length; i++) {
    const cur = seq[i]; const prev = out[out.length - 1];
    if (prev && isUnsafeBackToBack(prev, cur)) out.push(PoseId.ForwardFold);
    out.push(cur);
    const counters = needsCounter(cur);
    if (counters.length && (i === seq.length - 1 || isUnsafeBackToBack(cur, seq[i + 1]))) out.push(counters[0]);
  }
  return out;
}

/**
 * Helper function to select random poses from a pool (fallback for transition selection)
 */
function selectRandomPoses(poses: any[], count: number): any[] {
  if (!poses || poses.length === 0) return [];
  
  const shuffled = [...poses].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, poses.length));
}

/**
 * Calculate transition compatibility score between two poses
 * Higher score means better/easier transition
 */
export function calculateTransitionScore(fromPose: any, toPose: any): number {
  if (!fromPose || !toPose) return 0;

  let score = 0;

  // Check if poses have direct transition relationship
  if (fromPose.transitions_out?.includes(toPose.slug) || fromPose.transitions_out?.includes(toPose.id)) {
    score += 10; // Strong direct transition
  }
  
  if (toPose.transitions_in?.includes(fromPose.slug) || toPose.transitions_in?.includes(fromPose.id)) {
    score += 10; // Strong incoming transition
  }

  // Check related next poses
  if (fromPose.related_next_slugs?.includes(toPose.slug) || fromPose.related_next_slugs?.includes(toPose.id)) {
    score += 5; // Good sequence relationship
  }

  // Same category bonus (easier transitions within same pose family)
  if (fromPose.category === toPose.category) {
    score += 3;
  }

  // Same plane of movement bonus
  if (fromPose.plane === toPose.plane) {
    score += 2;
  }

  // Similar intensity levels (avoid big jumps in difficulty)
  const intensityDiff = Math.abs((fromPose.intensity || 3) - (toPose.intensity || 3));
  if (intensityDiff <= 1) {
    score += 2;
  } else if (intensityDiff >= 3) {
    score -= 2; // Penalize big intensity jumps
  }

  // Check if transition requires safety intervention
  if (isTransitionUnsafe(fromPose, toPose)) {
    score -= 5; // Penalize unsafe transitions
  }

  return Math.max(0, score); // Ensure non-negative score
}

/**
 * Check if a transition between poses is unsafe and requires intervention
 */
function isTransitionUnsafe(fromPose: any, toPose: any): boolean {
  if (!fromPose || !toPose) return false;

  const fromFamily = (fromPose.family || fromPose.category || '').toLowerCase();
  const toFamily = (toPose.family || toPose.category || '').toLowerCase();

  // Existing unsafe patterns from applySafetyAdjustments logic
  return (/twist/i.test(fromFamily) && /backbend/i.test(toFamily)) || 
         (/backbend/i.test(fromFamily) && /twist/i.test(toFamily));
}

/**
 * Find the best next poses from a pool based on transition compatibility
 */
export function selectBestTransitionPoses(currentPose: any, candidatePoses: any[], count: number): any[] {
  if (!candidatePoses || candidatePoses.length === 0) return [];
  if (!currentPose) return selectRandomPoses(candidatePoses, count);

  // Score each candidate pose
  const scoredPoses = candidatePoses.map(pose => ({
    pose,
    score: calculateTransitionScore(currentPose, pose)
  }));

  // Sort by score (descending) and add some randomness for variety
  scoredPoses.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (scoreDiff === 0) {
      return Math.random() - 0.5; // Random for equal scores
    }
    return scoreDiff;
  });

  // Select top candidates but introduce some randomness to avoid predictability
  const topCandidates = Math.min(count * 2, scoredPoses.length);
  const selected: any[] = [];
  
  for (let i = 0; i < count && i < candidatePoses.length; i++) {
    // Bias toward higher scored poses but allow some variety
    const maxIndex = Math.min(topCandidates, scoredPoses.length);
    const weightedIndex = Math.floor(Math.random() * Math.random() * maxIndex);
    
    if (scoredPoses[weightedIndex] && !selected.includes(scoredPoses[weightedIndex].pose)) {
      selected.push(scoredPoses[weightedIndex].pose);
      scoredPoses.splice(weightedIndex, 1); // Remove to avoid duplicates
    }
  }

  // Fill remaining slots with random selection if needed
  while (selected.length < count && scoredPoses.length > 0) {
    const randomIndex = Math.floor(Math.random() * scoredPoses.length);
    selected.push(scoredPoses[randomIndex].pose);
    scoredPoses.splice(randomIndex, 1);
  }

  return selected;
}

/**
 * Suggest transition poses when direct transition is difficult
 */
export function suggestTransitionPose(fromPose: any, toPose: any, availablePoses: any[]): any | null {
  if (!fromPose || !toPose || calculateTransitionScore(fromPose, toPose) >= 5) {
    return null; // No transition needed for good transitions
  }

  // Look for poses that can bridge the gap
  const bridgePoses = availablePoses.filter(pose => {
    const fromBridge = calculateTransitionScore(fromPose, pose);
    const bridgeTo = calculateTransitionScore(pose, toPose);
    return fromBridge >= 3 && bridgeTo >= 3;
  });

  if (bridgePoses.length === 0) {
    // Fallback to neutral poses
    const neutralPoses = availablePoses.filter(pose => 
      ['restorative', 'neutral', 'standing'].includes(pose.category) ||
      pose.slug === 'childs-pose' || pose.slug === 'mountain-pose'
    );
    return neutralPoses.length > 0 ? neutralPoses[0] : null;
  }

  // Return the best bridging pose
  return selectBestTransitionPoses(fromPose, bridgePoses, 1)[0] || null;
}

export function smartGenerate(totalMinutes: number, intensity: number, focus: Focus): PoseId[] {
  let seq = templateSunA();
  const bodyPool: PoseId[] = [PoseId.Warrior1Right, PoseId.HighLungeRight, PoseId.TwistLow, PoseId.Boat, PoseId.Bridge, PoseId.Pigeon, PoseId.DownDog, PoseId.ForwardFold];
  const bias = (id: PoseId) => { const p = POSES.find((x) => x.id === id); return focus === "Full-Body" ? 1 : (p?.groups.includes(focus) ? 2 : 1); };
  const targetCount = Math.max(6, Math.round((totalMinutes * 60) / 45));
  while (seq.length < targetCount) {
    const w = bodyPool.map((id)=>bias(id)); const sum = w.reduce((a,b)=>a+b,0); let r = Math.random()*sum; let pick=0; while(r>=w[pick]){r-=w[pick]; pick++;}
    seq.push(bodyPool[pick]);
    seq = applySafetyAdjustments(seq);
  }
  return applySafetyAdjustments(seq).slice(0, Math.max(targetCount, 6));
}
