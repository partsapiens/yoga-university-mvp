import React from 'react';
import * as Select from '@radix-ui/react-select';
import * as Switch from '@radix-ui/react-switch';
import { Focus, TimingMode, PoseId } from '@/types/yoga';
import { FOCI, PRESETS } from '@/lib/yoga-data';
import { dotBar } from '@/lib/yoga-helpers';
import { cn } from '@/lib/utils';

function HelpIcon({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center align-middle group">
      <span tabIndex={0} className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/50 text-[10px] leading-none text-muted-foreground outline-none focus:ring-2 focus:ring-ring cursor-help">?</span>
      <div role="tooltip" className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100">{text}</div>
    </span>
  );
}

const UiSelect = ({ children, ...props }: Select.SelectProps & { children: React.ReactNode }) => ( <Select.Root {...props}><Select.Trigger className="h-9 min-w-[120px] rounded-md border border-input px-2 py-1 text-sm text-left flex items-center justify-between"><Select.Value /><Select.Icon>⌄</Select.Icon></Select.Trigger><Select.Portal><Select.Content position="popper" sideOffset={5} className="w-[var(--radix-select-trigger-width)] rounded-md border border-border bg-popover text-popover-foreground shadow-lg"><Select.Viewport className="p-1">{children}</Select.Viewport></Select.Content></Select.Portal></Select.Root> );
const UiSelectItem = React.forwardRef<HTMLDivElement, Select.SelectItemProps>( ({ children, ...props }, forwardedRef) => ( <Select.Item {...props} ref={forwardedRef} className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=checked]:font-semibold"><Select.ItemText>{children}</Select.ItemText><Select.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">✓</Select.ItemIndicator></Select.Item> ) );
UiSelectItem.displayName = "UiSelectItem";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

interface ControlPanelProps {
  minutes: number; setMinutes: (value: number) => void;
  intensity: number; setIntensity: (value: number) => void;
  focus: Focus; setFocus: (value: Focus) => void;
  breathingCues: boolean; setBreathingCues: (value: boolean) => void;
  saferSequencing: boolean; setSaferSequencing: (value: boolean) => void;
  saveToDevice: boolean; setSaveToDevice: (value: boolean) => void;
  timingMode: TimingMode; setTimingMode: (value: TimingMode) => void;
  secPerBreath: number; setSecPerBreath: (value: number) => void;
  transitionSec: number; setTransitionSec: (value: number) => void;
  cooldownMin: number; setCooldownMin: (value: number) => void;
  onAutoGenerate: () => void;
  flowName: string; setFlowName: (value: string) => void;
  onSaveFlow: () => void;
  onLoadPreset: (flow: PoseId[]) => void;
}

export function ControlPanel({
  minutes, setMinutes, intensity, setIntensity, focus, setFocus,
  breathingCues, setBreathingCues, saferSequencing, setSaferSequencing,
  saveToDevice, setSaveToDevice, timingMode, setTimingMode, secPerBreath, setSecPerBreath,
  transitionSec, setTransitionSec, cooldownMin, setCooldownMin, onAutoGenerate,
  flowName, setFlowName, onSaveFlow, onLoadPreset
}: ControlPanelProps) {
  return (
    <div className="mx-auto mt-4 rounded-2xl border border-border bg-card/90 p-4 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3"><span className="w-16 text-sm text-muted-foreground">Time</span><HelpIcon text="Target length of the practice in minutes." /><input type="range" min={10} max={90} step={5} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} /><span className="w-14 text-right text-sm font-medium tabular-nums">{minutes}m</span></label>
            <label className="flex items-center gap-3"><span className="w-16 text-sm text-muted-foreground">Intensity</span><HelpIcon text="How physically demanding the flow will be (1-5)." /><input type="range" min={1} max={5} value={intensity} step={1} onChange={(e) => setIntensity(Number(e.target.value))} /><span className="w-14 text-right text-sm font-medium tabular-nums">{dotBar(intensity)}</span></label>
            <label className="flex items-center gap-3"><span className="w-16 text-sm text-muted-foreground">Focus</span><HelpIcon text="The primary body area to target." /><UiSelect value={focus} onValueChange={(v: Focus) => setFocus(v)}>{FOCI.map(f => <UiSelectItem key={f} value={f}>{f}</UiSelectItem>)}</UiSelect></label>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3"><span className="w-24 text-sm text-muted-foreground">Timing Mode</span><HelpIcon text="Hold poses for a number of seconds or a number of breaths." /><UiSelect value={timingMode} onValueChange={(v: TimingMode) => setTimingMode(v)}><UiSelectItem value={TimingMode.Seconds}>Seconds</UiSelectItem><UiSelectItem value={TimingMode.Breaths}>Breaths</UiSelectItem></UiSelect></label>
            {timingMode === TimingMode.Breaths && (<label className="flex items-center gap-3"><span className="w-24 text-sm text-muted-foreground">Secs/Breath</span><HelpIcon text="The average number of seconds per full breath cycle (in and out)." /><input type="number" min={3} max={10} value={secPerBreath} onChange={e => setSecPerBreath(clamp(Number(e.target.value), 3, 10))} className="h-9 w-20 rounded-md border border-input px-2 py-1 text-sm" /></label>)}
            <label className="flex items-center gap-3"><span className="w-24 text-sm text-muted-foreground">Transition</span><HelpIcon text="Seconds to pause between poses." /><input type="number" min={0} max={20} value={transitionSec} onChange={e => setTransitionSec(clamp(Number(e.target.value), 0, 20))} className="h-9 w-20 rounded-md border border-input px-2 py-1 text-sm" /><span className="text-sm text-muted-foreground">s</span></label>
            <label className="flex items-center gap-3"><span className="w-24 text-sm text-muted-foreground">Cooldown</span><HelpIcon text="Minutes of Savasana (Corpse Pose) to add at the end." /><input type="number" min={0} max={10} value={cooldownMin} onChange={e => setCooldownMin(clamp(Number(e.target.value), 0, 10))} className="h-9 w-20 rounded-md border border-input px-2 py-1 text-sm" /><span className="text-sm text-muted-foreground">min</span></label>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3"><span className="w-32 text-sm text-muted-foreground">Breathing Cues</span><Switch.Root checked={breathingCues} onCheckedChange={setBreathingCues} className="w-[42px] h-[25px] bg-muted rounded-full relative data-[state=checked]:bg-primary outline-none cursor-default"><Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-lg transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" /></Switch.Root></label>
            <label className="flex items-center gap-3"><span className="w-32 text-sm text-muted-foreground">Safer Sequencing</span><HelpIcon text="Avoids sharp transitions (e.g., twist to backbend) by inserting neutral poses." /><Switch.Root checked={saferSequencing} onCheckedChange={setSaferSequencing} className="w-[42px] h-[25px] bg-muted rounded-full relative data-[state=checked]:bg-primary outline-none cursor-default"><Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-lg transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" /></Switch.Root></label>
            <label className="flex items-center gap-3"><span className="w-32 text-sm text-muted-foreground">Save to Device</span><HelpIcon text="If on, saved flows will persist after you close the browser." /><Switch.Root checked={saveToDevice} onCheckedChange={setSaveToDevice} className="w-[42px] h-[25px] bg-muted rounded-full relative data-[state=checked]:bg-primary outline-none cursor-default"><Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-lg transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" /></Switch.Root></label>
          </div>
          <div className="flex flex-col gap-3 border-l border-border pl-6 ml-auto"><div className="flex items-center gap-2"><input value={flowName} onChange={e => setFlowName(e.target.value)} className="h-9 w-36 max-w-full rounded-md border border-input px-2 py-1 text-sm" placeholder="Flow name" /><button onClick={onSaveFlow} className="h-9 rounded-full border px-3 py-1 text-xs hover:bg-accent">Save</button></div><button onClick={onAutoGenerate} className="h-9 rounded-full px-3 py-2 text-sm text-primary-foreground bg-primary hover:bg-primary/90">Auto-generate</button></div>
        </div>
        <div className="border-t border-border mt-4 pt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground mr-2">Presets:</span>
            {PRESETS.map(p => (
                <button key={p.name} onClick={() => onLoadPreset(p.flow)} className="text-xs rounded-full border px-2.5 py-1 hover:bg-accent hover:border-primary/50">{p.name}</button>
            ))}
        </div>
      </div>
    </div>
  );
}
