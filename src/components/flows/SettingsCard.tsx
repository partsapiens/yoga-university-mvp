import React from 'react';
import * as Select from '@radix-ui/react-select';
import * as Switch from '@radix-ui/react-switch';
import { Focus, TimingMode, PoseId } from '@/types/yoga';
import { FOCI, PRESETS } from '@/lib/yoga-data';
import { dotBar } from '@/lib/yoga-helpers';
import { cn } from '@/lib/utils';

// Updated FieldGroup to be more compact
const FieldGroup = ({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) => (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-sm font-medium text-gray-900">{title}</label>
      <div className="min-h-[36px] flex items-center">{children}</div>
    </div>
);

// Minimal UI components for styling
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("rounded-2xl border bg-card text-card-foreground shadow-sm h-full", className)} {...props} />;
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("p-4 sm:p-6", className)} {...props} />;
const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button className={cn("h-9 px-3 inline-flex items-center justify-center rounded-xl text-sm font-medium", className)} {...props} />;
const PresetPill = ({ label, ...props }: { label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => <button className="text-xs rounded-full border px-2.5 py-1 hover:bg-accent hover:border-primary/50" {...props}>{label}</button>;
const UiSelect = ({ children, ...props }: Select.SelectProps & { children: React.ReactNode }) => ( <Select.Root {...props}><Select.Trigger className="h-9 w-full rounded-md border border-input px-3 py-2 text-sm"><Select.Value /></Select.Trigger><Select.Portal><Select.Content position="popper" sideOffset={5} className="w-[var(--radix-select-trigger-width)] rounded-md border bg-popover text-popover-foreground shadow-lg"><Select.Viewport className="p-1">{children}</Select.Viewport></Select.Content></Select.Portal></Select.Root> );
const UiSelectItem = React.forwardRef<HTMLDivElement, Select.SelectItemProps>(({ children, ...props }, forwardedRef) => ( <Select.Item {...props} ref={forwardedRef} className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=checked]:font-semibold"><Select.ItemText>{children}</Select.ItemText><Select.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">✓</Select.ItemIndicator></Select.Item> ) );
UiSelectItem.displayName = "UiSelectItem";
const Toggle = React.forwardRef<HTMLButtonElement, Switch.SwitchProps>(({ className, ...props }, ref) => <Switch.Root className={cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)} {...props} ref={ref}><Switch.Thumb className={cn("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")} /></Switch.Root>);
Toggle.displayName = Switch.Root.displayName;

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

interface SettingsCardProps {
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

export function SettingsCard({
  minutes, setMinutes, intensity, setIntensity, focus, setFocus,
  breathingCues, setBreathingCues, saferSequencing, setSaferSequencing,
  saveToDevice, setSaveToDevice,
  timingMode, setTimingMode, secPerBreath, setSecPerBreath,
  transitionSec, setTransitionSec, cooldownMin, setCooldownMin,
  onAutoGenerate, flowName, setFlowName, onSaveFlow, onLoadPreset
}: SettingsCardProps) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4 sm:mb-6">Settings</h2>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr mb-4">
          <FieldGroup title="Time (minutes)"><div className="flex items-center gap-3 w-full"><input type="range" min={10} max={90} step={5} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-full" /><span className="text-sm font-medium tabular-nums">{minutes}m</span></div></FieldGroup>
          <FieldGroup title="Intensity"><div className="flex items-center gap-3 w-full"><input type="range" min={1} max={5} step={1} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full" /><span className="text-sm font-medium tabular-nums">{dotBar(intensity)}</span></div></FieldGroup>
          <FieldGroup title="Focus"><UiSelect value={focus} onValueChange={(v: Focus) => setFocus(v)}>{FOCI.map(f => <UiSelectItem key={f} value={f}>{f}</UiSelectItem>)}</UiSelect></FieldGroup>
        </div>

        <div className="grid gap-3 sm:gap-4 mb-4 grid-cols-1 lg:grid-cols-6">
          <FieldGroup title="Timing Mode" className="lg:col-span-2"><UiSelect value={timingMode} onValueChange={(v: TimingMode) => setTimingMode(v)}>{/* ... */}</UiSelect></FieldGroup>
          <FieldGroup title="Transition (s)"><input type="number" min={0} max={20} value={transitionSec} onChange={e => setTransitionSec(clamp(Number(e.target.value), 0, 20))} className="h-9 w-full rounded-md border border-input px-3" /></FieldGroup>
          <FieldGroup title="Cooldown (min)"><input type="number" min={0} max={10} value={cooldownMin} onChange={e => setCooldownMin(clamp(Number(e.target.value), 0, 10))} className="h-9 w-full rounded-md border border-input px-3" /></FieldGroup>
          <FieldGroup title="Breathing Cues"><div className="w-full flex justify-center"><Toggle checked={breathingCues} onCheckedChange={setBreathingCues} /></div></FieldGroup>
          <FieldGroup title="Safer Seq."><div className="w-full flex justify-center"><Toggle checked={saferSequencing} onCheckedChange={setSaferSequencing} /></div></FieldGroup>
        </div>

        <div className="border-t mt-6 pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESETS.map(p => (<PresetPill key={p.name} label={p.name} onClick={() => onLoadPreset(p.flow)} />))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input className="h-9 rounded-xl border px-3 text-sm w-44" placeholder="Flow name" value={flowName} onChange={e => setFlowName(e.target.value)} />
            <Button onClick={onSaveFlow} className="border">Save</Button>
            <Button onClick={onAutoGenerate} className="bg-primary text-primary-foreground">Auto-generate</Button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-600">Save to Device</span>
              <Toggle checked={saveToDevice} onCheckedChange={setSaveToDevice} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
