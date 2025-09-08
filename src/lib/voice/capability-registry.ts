import { Intent } from './nlu';
import { Focus, PoseId, TimingMode } from '@/types/yoga';

// The AppContext contains all the state setters and handlers from the main page.
// This allows the capability registry to be decoupled from the React component itself.
export interface AppContext {
  player: {
    play: () => void;
    pause: () => void;
    stop: () => void;
    next: () => void;
    prev: () => void;
    restart: () => void;
    setRate: (rate: number) => void;
    adjustRate: (adj: number) => void;
  };
  flow: {
    setMinutes: (n: number) => void;
    setIntensity: (n: number) => void;
    setFocus: (f: Focus) => void;
    setTransition: (n: number) => void;
    setCooldown: (n: number) => void;
    setTimingMode: (m: TimingMode) => void;
    toggle: (k: "breathingCues" | "saferSequencing" | "saveToDevice") => void;
    applyPreset: (p: PoseId[]) => void;
    setName: (n: string) => void;
    save: () => void;
  };
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export async function executeIntent(intent: Intent, ctx: AppContext): Promise<string> {
  if (!intent) return "I didn't quite catch that.";

  switch (intent.name) {
    case 'play': ctx.player.play(); return "Playing.";
    case 'pause': ctx.player.pause(); return "Paused.";
    case 'stop': ctx.player.stop(); return "Flow stopped.";
    case 'next_pose': ctx.player.next(); return "Next pose.";
    case 'prev_pose': ctx.player.prev(); return "Previous pose.";
    case 'restart_flow': ctx.player.restart(); return "Restarting flow.";

    case 'set_tempo_percent':
      const rate = clamp(intent.value / 100, 0.5, 2.0);
      ctx.player.setRate(rate);
      return `Tempo set to ${intent.value}%.`;

    case 'set_tempo_adjust':
      ctx.player.adjustRate(intent.direction === 'up' ? 0.25 : -0.25);
      return `Tempo ${intent.direction === 'up' ? 'increased' : 'decreased'}.`;

    case 'set_time':
      ctx.flow.setMinutes(clamp(intent.value, 10, 90));
      return `Time set to ${intent.value} minutes.`;

    case 'set_intensity':
      ctx.flow.setIntensity(clamp(intent.value, 1, 5));
      return `Intensity set to ${intent.value}.`;

    case 'set_focus':
      ctx.flow.setFocus(intent.value);
      return `Focus set to ${intent.value}.`;

    case 'set_transition':
      ctx.flow.setTransition(clamp(intent.value, 0, 20));
      return `Transition set to ${intent.value} seconds.`;

    case 'set_cooldown':
      ctx.flow.setCooldown(clamp(intent.value, 0, 10));
      return `Cooldown set to ${intent.value} minutes.`;

    case 'set_timing_mode':
      ctx.flow.setTimingMode(intent.value === 'seconds' ? TimingMode.Seconds : TimingMode.Breaths);
      return `Timing mode set to ${intent.value}.`;

    case 'toggle':
      ctx.flow.toggle(intent.key);
      return `${intent.key} toggled.`;

    case 'apply_preset':
        // This requires a lookup from the preset name to the actual flow array.
        // This logic should probably live in the main page component.
        // For now, we'll just return a message.
        return `Applying preset ${intent.value}.`;

    case 'name_flow':
      ctx.flow.setName(intent.value);
      return `Flow name set to ${intent.value}.`;

    case 'save_flow':
      ctx.flow.save();
      return "Flow saved.";

    case 'clarify':
      return intent.message;

    default:
      return "I'm not sure how to handle that command.";
  }
}
