import { POSES } from "./yoga-data";
import type { Focus, SecondsOverrides } from "@/types/yoga";

export function dotBar(value: number) {
  return Array.from({ length: 5 }, (_, i) => (i < value ? "●" : "○")).join("");
}

export function buildCues(poseId: string, breathingOn = true) {
  const breath = breathingOn ? (t: string) => ` ${t}` : () => "";
  switch (poseId) {
    case "down_dog": return `Press palms, lift hips back and up.${breath("Inhale lengthen; exhale soften your neck.")}`;
    case "forward_fold": return `Long spine, hinge from hips, crown heavy.${breath("Inhale half lift; exhale fold.")}`;
    case "warrior1_r": return `Root back heel, bend front knee, reach high.${breath("Inhale rise; exhale square the hips.")}`;
    case "high_lunge_r": return `Back heel high, ribs knit, tail long.${breath("Steady breath in and out.")}`;
    case "twist_low": return `Lengthen then rotate from navel up.${breath("Inhale lengthen; exhale twist.")}`;
    case "bridge": return `Press heels, lift hips, shoulders tuck.${breath("Smooth inhalations and exhalations.")}`;
    case "pigeon": return `Square hips, flex front foot, fold.${breath("Slow down the breath.")}`;
    case "boat": return `Lift chest, core on, shins parallel.${breath("Steady, even breath.")}`;
    case "child": return `Hips to heels, forehead down.${breath("Breathe into back body.")}`;
    case "butterfly":
    default: return `Soles together, knees wide, hinge from hips.${breath("Inhale length; exhale soften.")}`;
  }
}

const COUNTERPOSE: Record<string, string[]> = { backbend: ["forward_fold", "child"], twist: ["forward_fold", "child"] };

function familyOf(id: string) { return POSES.find((p) => p.id === id)?.family?.toLowerCase() || ""; }
function needsCounter(id: string) { const fam = familyOf(id); if (/backbend/i.test(fam)) return COUNTERPOSE.backbend; if (/twist/i.test(fam)) return COUNTERPOSE.twist; return []; }
function isUnsafeBackToBack(prev: string, next: string) { const pf = familyOf(prev), nf = familyOf(next); return (/twist/i.test(pf) && /backbend/i.test(nf)) || (/backbend/i.test(pf) && /twist/i.test(nf)); }

export function coachTip(prevId: string | undefined, id: string, nextId: string | undefined) {
  const fam = familyOf(id);
  if (prevId && isUnsafeBackToBack(prevId, id)) return "Neutral pose inserted to protect the spine.";
  if (/twist/.test(fam)) return "Twist after lengthening to protect discs; return to neutral afterward.";
  if (/backbend/.test(fam)) return "Backbend follows prep; counter with a fold or child's pose.";
  if (/inversion|down_dog/.test(id)) return "Inversion-lite to elongate spine and reset breath.";
  return "Balances sequence based on focus and intensity.";
}

export function baseDurationsFromTable(flowIds: string[]) { return flowIds.map((id) => POSES.find((p) => p.id === id)?.defaultSeconds ?? 45); }
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

function templateSunA(): string[] { return ["child", "down_dog", "forward_fold", "high_lunge_r", "warrior1_r", "down_dog", "forward_fold", "child"]; }

export function applySafetyAdjustments(seq: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < seq.length; i++) {
    const cur = seq[i]; const prev = out[out.length - 1];
    if (prev && isUnsafeBackToBack(prev, cur)) out.push("forward_fold");
    out.push(cur);
    const counters = needsCounter(cur);
    if (counters.length && (i === seq.length - 1 || isUnsafeBackToBack(cur, seq[i + 1]))) out.push(counters[0]);
  }
  return out;
}

export function smartGenerate(totalMinutes: number, intensity: number, focus: Focus): string[] {
  let seq = templateSunA();
  const bodyPool = ["warrior1_r", "high_lunge_r", "twist_low", "boat", "bridge", "pigeon", "down_dog", "forward_fold"];
  const bias = (id: string) => { const p = POSES.find((x) => x.id === id); return focus === "Full-Body" ? 1 : (p?.groups.includes(focus) ? 2 : 1); };
  const targetCount = Math.max(6, Math.round((totalMinutes * 60) / 45));
  while (seq.length < targetCount) {
    const w = bodyPool.map((id)=>bias(id)); const sum = w.reduce((a,b)=>a+b,0); let r = Math.random()*sum; let pick=0; while(r>=w[pick]){r-=w[pick]; pick++;}
    seq.push(bodyPool[pick]);
    seq = applySafetyAdjustments(seq);
  }
  return applySafetyAdjustments(seq).slice(0, Math.max(targetCount, 6));
}
