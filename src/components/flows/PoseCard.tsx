import React from 'react';
import { POSES } from '@/lib/yoga-data';
import { TimingMode, PoseId } from '@/types/yoga';
import { coachTip } from '@/lib/yoga-helpers';
import { cn } from '@/lib/utils';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

interface PoseCardProps {
  poseId: PoseId;
  index: number;
  duration: number;
  onRemove: (index: number) => void;
  onUpdateDuration: (index: number, duration: number) => void;
  timingMode: TimingMode;
  secPerBreath: number;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  dragIndexRef: React.MutableRefObject<number | null>;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  timeInPose: number;
  prevPoseId?: PoseId;
  nextPoseId?: PoseId;
}

export function PoseCard({
  poseId, index, duration, onRemove, onUpdateDuration, timingMode, secPerBreath,
  onMove, dragIndexRef, isFirst, isLast, isActive, timeInPose, prevPoseId, nextPoseId
}: PoseCardProps) {
  const pose = POSES.find((p) => p.id === poseId);
  const tip = coachTip(prevPoseId, poseId, nextPoseId);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => { dragIndexRef.current = index; e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); if (dragIndexRef.current === null || dragIndexRef.current === index) return; onMove(dragIndexRef.current, index); dragIndexRef.current = index; };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); dragIndexRef.current = null; };
  const handleDragEnd = () => { dragIndexRef.current = null; };

  const isBreathMode = timingMode === TimingMode.Breaths;
  const displayValue = isBreathMode ? Math.round(duration / secPerBreath) : duration;
  const handleValueChange = (newDisplayValue: number) => {
    if (isBreathMode) onUpdateDuration(index, clamp(newDisplayValue, 1, 20) * secPerBreath);
    else onUpdateDuration(index, clamp(newDisplayValue, 5, 600));
  };
  const minVal = isBreathMode ? 1 : 5;
  const maxVal = isBreathMode ? 20 : 600;
  const stepVal = isBreathMode ? 1 : 5;
  const perPoseProgress = duration > 0 ? (timeInPose / duration) * 100 : 0;

  if (!pose) return <div className="rounded-2xl border border-destructive bg-destructive/10 p-3"><p className="text-destructive">Pose not found: {poseId}</p></div>;

  return (
    <div
      className={cn("group relative rounded-2xl border bg-card p-3 shadow-sm transition-all duration-300", isActive ? "scale-[1.02] shadow-lg ring-2 ring-primary border-primary" : "border-border")}
      draggable onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} onDragEnd={handleDragEnd}
    >
      <div className="flex items-start justify-between">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="cursor-grab select-none hidden md:inline" title="Drag to reorder" aria-hidden>≡</span>
          <span className="inline-flex md:hidden items-center gap-1"><button onClick={() => onMove(index, index - 1)} disabled={isFirst} className="disabled:opacity-30">↑</button><button onClick={() => onMove(index, index + 1)} disabled={isLast} className="disabled:opacity-30">↓</button></span>
          {index + 1}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative"><div className="text-[11px] text-muted-foreground cursor-help">Why?</div><div className="invisible absolute right-0 z-20 mt-1 w-56 rounded-xl border border-border bg-popover p-3 text-xs text-popover-foreground opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">{tip}</div></div>
          <button onClick={() => onRemove(index)} className="rounded-full border border-border px-2 py-0.5 text-xs hover:bg-accent">Remove</button>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">{pose.icon || "🧘"}</div>
        <div><div className="font-medium leading-tight">{pose.name}</div><div className="text-xs text-muted-foreground">{pose.sanskrit}</div></div>
      </div>
      <label className="mt-2 block text-xs text-muted-foreground">
        {isBreathMode ? 'Breaths' : 'Seconds'}
        <input type="number" min={minVal} max={maxVal} step={stepVal} value={displayValue} onChange={(e) => handleValueChange(Number(e.target.value))} className="ml-2 w-24 rounded-md border border-input bg-background px-2 py-1 text-xs" />
      </label>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all duration-200" style={{ width: `${isActive ? perPoseProgress : 100}%` }} />
      </div>
    </div>
  );
}
