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
