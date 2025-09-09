import { Focus, PoseId } from '@/types/yoga';
import { FOCI, POSES, PRESETS } from '@/lib/yoga-data';

// --- Type Definitions ---
export type Intent =
  | { name: "play" }
  | { name: "pause" }
  | { name: "stop" }
  | { name: "next_pose" }
  | { name: "prev_pose" }
  | { name: "restart_flow" }
  | { name: "set_tempo_percent"; value: number }
  | { name: "set_tempo_adjust"; direction: 'up' | 'down'; value?: number }
  | { name: "set_time"; value: number }
  | { name: "set_intensity"; value: number }
  | { name: "set_focus"; value: Focus }
  | { name: "set_transition"; value: number }
  | { name: "set_cooldown"; value: number }
  | { name: "set_timing_mode"; value: 'seconds' | 'breaths' }
  | { name: "toggle"; key: "breathingCues" | "saferSequencing" | "saveToDevice"; value: boolean }
  | { name: "apply_preset"; value: string }
  | { name: "name_flow"; value: string }
  | { name: "save_flow" }
  | { name: "clarify"; message: string }
  | null;

type IntentObject = Exclude<Intent, null>;

// --- Normalization & Helpers ---
const normalize = (text: string): string => {
  return text.toLowerCase().replace(/[,.?!]/g, '');
};

const findClosestString = (target: string, candidates: readonly string[]): string | null => {
    if (!target) return null;
    let bestMatch = null;
    let minDistance = Infinity;
    for (const candidate of candidates) {
        // Simple substring check for now
        if (candidate.toLowerCase().includes(target)) return candidate;
    }
    return bestMatch;
}

const findPoseId = (text: string): PoseId | null => {
    const poseNames = POSES.map(p => p.name.toLowerCase());
    const found = findClosestString(text, poseNames);
    return POSES.find(p => p.name.toLowerCase() === found)?.id || null;
}

// --- Regex & Keyword Definitions ---
const INTENT_REGEX: { regex: RegExp, name: IntentObject['name'], slots?: (match: RegExpMatchArray) => any }[] = [
  { regex: /\b(play|start|begin|resume)\b/, name: 'play' },
  { regex: /\b(pause|hold)\b/, name: 'pause' },
  { regex: /\b(stop|end)\b/, name: 'stop' },
  { regex: /\b(next|skip)\b/, name: 'next_pose' },
  { regex: /\b(previous|back|last pose)\b/, name: 'prev_pose' },
  { regex: /\b(restart)\b/, name: 'restart_flow' },
  { regex: /\b(save flow)\b/, name: 'save_flow' },
  { regex: /name (?:this|the) flow (.+)/, name: 'name_flow', slots: m => ({ value: m[1] }) },
  { regex: /(?:tempo|speed) to (\d+)\s*p?/, name: 'set_tempo_percent', slots: m => ({ value: parseInt(m[1], 10) }) },
  { regex: /(?:slower|tempo down|decrease tempo)(?: by (\d+))?/, name: 'set_tempo_adjust', slots: m => ({ direction: 'down', value: m[1] ? parseInt(m[1], 10) : 10 }) },
  { regex: /(?:faster|tempo up|increase tempo)(?: by (\d+))?/, name: 'set_tempo_adjust', slots: m => ({ direction: 'up', value: m[1] ? parseInt(m[1], 10) : 10 }) },
  { regex: /(?:time|duration) to (\d+)/, name: 'set_time', slots: m => ({ value: parseInt(m[1], 10) }) },
  { regex: /(?:intensity|difficulty|effort) (?:to |)(\d)/, name: 'set_intensity', slots: m => ({ value: parseInt(m[1], 10) }) },
  { regex: /focus (?:to |on )?(\w+)/, name: 'set_focus', slots: m => ({ value: findClosestString(m[1], FOCI) }) },
  { regex: /transition to (\d+)/, name: 'set_transition', slots: m => ({ value: parseInt(m[1], 10) }) },
  { regex: /cooldown to (\d+)/, name: 'set_cooldown', slots: m => ({ value: parseInt(m[1], 10) }) },
  { regex: /timing mode (\w+)/, name: 'set_timing_mode', slots: m => ({ value: m[1].startsWith('sec') ? 'seconds' : 'breaths' }) },
  { regex: /(?:breathing|breath) cues (on|off)/, name: 'toggle', slots: m => ({ key: 'breathingCues', value: m[1] === 'on' }) },
  { regex: /(?:safer|safety) sequencing (on|off)/, name: 'toggle', slots: m => ({ key: 'saferSequencing', value: m[1] === 'on' }) },
  { regex: /save to device (on|off)/, name: 'toggle', slots: m => ({ key: 'saveToDevice', value: m[1] === 'on' }) },
  { regex: /apply preset (.+)/, name: 'apply_preset', slots: m => ({ value: findClosestString(m[1], PRESETS.map(p => p.name)) }) },
];

// --- Main Parser Function ---
export function parseTranscript(transcript: string): Intent {
  const normalized = normalize(transcript);

  for (const intent of INTENT_REGEX) {
    const match = normalized.match(intent.regex);
    if (match) {
      if (intent.slots) {
        const slots = intent.slots(match);
        // Basic slot validation
        if (Object.values(slots).some(v => v === null || v === undefined)) {
            return { name: 'clarify', message: `I heard the command, but couldn't understand the details. Please try again.` };
        }
        return { name: intent.name, ...slots };
      }
      return { name: intent.name } as Intent;
    }
  }

  return null; // No intent found
}
