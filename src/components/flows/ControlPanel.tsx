import React from 'react';
import * as Select from '@radix-ui/react-select';
import * as Switch from '@radix-ui/react-switch';
import { Focus, TimingMode, PoseId } from '@/types/yoga';
import { FOCI } from '@/lib/yoga-data';
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
}

export function ControlPanel({
  minutes, setMinutes, intensity, setIntensity, focus, setFocus,
  breathingCues, setBreathingCues, saferSequencing, setSaferSequencing,
  saveToDevice, setSaveToDevice, timingMode, setTimingMode, secPerBreath, setSecPerBreath,
  transitionSec, setTransitionSec, cooldownMin, setCooldownMin, onAutoGenerate,
  flowName, setFlowName, onSaveFlow
}: ControlPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card/90 p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Settings Header */}
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        
        {/* First Line: Time and Intensity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span>Time</span>
              <HelpIcon text="Target length of the practice in minutes." />
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="range" 
                min={10} 
                max={90} 
                step={5} 
                value={minutes} 
                onChange={(e) => setMinutes(Number(e.target.value))} 
                className="flex-1 h-2"
              />
              <span className="w-12 text-right text-sm font-medium tabular-nums">{minutes}m</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span>Intensity</span>
              <HelpIcon text="How physically demanding the flow will be (1-5)." />
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="range" 
                min={1} 
                max={5} 
                value={intensity} 
                step={1} 
                onChange={(e) => setIntensity(Number(e.target.value))} 
                className="flex-1 h-2"
              />
              <span className="w-12 text-right text-sm font-medium tabular-nums">{dotBar(intensity)}</span>
            </div>
          </div>
        </div>

        {/* Second Line: Muscle Focus and Intention (breathing cues as intention) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span>Muscle Focus</span>
              <HelpIcon text="The primary body area to target." />
            </label>
            <UiSelect value={focus} onValueChange={(v: Focus) => setFocus(v)}>
              {FOCI.map(f => <UiSelectItem key={f} value={f}>{f}</UiSelectItem>)}
            </UiSelect>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span>Intention</span>
              <HelpIcon text="Practice options and sequencing preferences." />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center justify-between p-2 border border-border rounded-md hover:bg-muted/50 transition-colors">
                <span className="text-xs">Breathing Cues</span>
                <Switch.Root checked={breathingCues} onCheckedChange={setBreathingCues} className="w-[32px] h-[18px] bg-muted rounded-full relative data-[state=checked]:bg-primary outline-none cursor-default">
                  <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full shadow-lg transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[16px]" />
                </Switch.Root>
              </label>
              
              <label className="flex items-center justify-between p-2 border border-border rounded-md hover:bg-muted/50 transition-colors">
                <span className="text-xs">Safer Sequencing</span>
                <Switch.Root checked={saferSequencing} onCheckedChange={setSaferSequencing} className="w-[32px] h-[18px] bg-muted rounded-full relative data-[state=checked]:bg-primary outline-none cursor-default">
                  <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full shadow-lg transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[16px]" />
                </Switch.Root>
              </label>
            </div>
          </div>
        </div>

        {/* Third Line: Timing Settings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span>Timing Mode</span>
              <HelpIcon text="Hold poses for a number of seconds or a number of breaths." />
            </label>
            <UiSelect value={timingMode} onValueChange={(v: TimingMode) => setTimingMode(v)}>
              <UiSelectItem value={TimingMode.Seconds}>Seconds</UiSelectItem>
              <UiSelectItem value={TimingMode.Breaths}>Breaths</UiSelectItem>
            </UiSelect>
          </div>

          {timingMode === TimingMode.Breaths && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <span>Secs/Breath</span>
                <HelpIcon text="The average number of seconds per full breath cycle (in and out)." />
              </label>
              <input 
                type="number" 
                min={3} 
                max={10} 
                value={secPerBreath} 
                onChange={e => setSecPerBreath(clamp(Number(e.target.value), 3, 10))} 
                className="w-full px-3 py-2 rounded-md border border-input text-sm" 
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span>Transition</span>
              <HelpIcon text="Seconds to pause between poses." />
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min={0} 
                max={20} 
                value={transitionSec} 
                onChange={e => setTransitionSec(clamp(Number(e.target.value), 0, 20))} 
                className="w-full px-3 py-2 rounded-md border border-input text-sm" 
              />
              <span className="text-sm text-muted-foreground">s</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span>Cooldown</span>
              <HelpIcon text="Minutes of Savasana (Corpse Pose) to add at the end." />
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min={0} 
                max={10} 
                value={cooldownMin} 
                onChange={e => setCooldownMin(clamp(Number(e.target.value), 0, 10))} 
                className="w-full px-3 py-2 rounded-md border border-input text-sm" 
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
        </div>
        
        {/* Fourth Line: Generate button */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-border">
          <input 
            value={flowName} 
            onChange={e => setFlowName(e.target.value)} 
            className="px-3 py-2 rounded-md border border-input text-sm flex-1 max-w-xs" 
            placeholder="Flow name" 
          />
          <button 
            onClick={onSaveFlow} 
            className="px-4 py-2 rounded-md border border-border text-sm hover:bg-accent transition-colors"
          >
            Save
          </button>
          <button 
            onClick={onAutoGenerate} 
            className="px-6 py-2 rounded-md text-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-colors font-medium"
          >
            Generate Flow
          </button>
        </div>
      </div>
    </div>
  );
}
