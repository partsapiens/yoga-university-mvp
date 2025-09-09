export type CoachIntent =
  | { name: 'pause' }
  | { name: 'resume' }
  | { name: 'next_pose' }
  | { name: 'repeat_pose' }
  | { name: 'slower' }
  | { name: 'faster' }
  | { name: 'how_long' }
  | { name: 'explain_pose' }
  | null;

const INTENT_MAP: { keywords: string[], intent: CoachIntent }[] = [
  { keywords: ['pause', 'hold', 'stop'], intent: { name: 'pause' } },
  { keywords: ['resume', 'play', 'continue', 'go'], intent: { name: 'resume' } },
  { keywords: ['next', 'skip'], intent: { name: 'next_pose' } },
  { keywords: ['repeat', 'again'], intent: { name: 'repeat_pose' } },
  { keywords: ['slower', 'slow down'], intent: { name: 'slower' } },
  { keywords: ['faster', 'speed up'], intent: { name: 'faster' } },
  { keywords: ['how long', 'duration'], intent: { name: 'how_long' } },
  { keywords: ['explain', 'why this pose', 'tell me more'], intent: { name: 'explain_pose' } },
];

export function parseCoachTranscript(transcript: string): CoachIntent {
  const normalized = transcript.toLowerCase().trim();

  for (const entry of INTENT_MAP) {
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword)) {
        return entry.intent;
      }
    }
  }

  return null;
}
