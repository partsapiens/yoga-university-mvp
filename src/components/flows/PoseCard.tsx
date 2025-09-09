"use client";

import React, { useState } from 'react';
import { POSES } from '@/lib/yoga-data';
import { TimingMode, PoseId, Pose } from '@/types/yoga';
import { cn, toArray, stripHtml } from '@/lib/utils';
import { useCycler } from '@/hooks/useCycler';
import { PlaneIcon } from './PlaneIcon';

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
  timeInPose: number; // This will be used to calculate progress
}

export function PoseCard({
  poseId, index, duration, onRemove, onUpdateDuration, timingMode, secPerBreath,
  onMove, dragIndexRef, isFirst, isLast, isActive, timeInPose
}: PoseCardProps) {

  const pose = POSES.find((p) => p.id === poseId);

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

  const progressPct = duration > 0 ? (timeInPose / duration) * 100 : 0;
  const secondsLeft = duration - timeInPose;

  // --- Dynamic Text Cycler ---
  const benefitsList = toArray(pose?.benefits);
  const cuesList = toArray(pose?.cues);
  const [isHovered, setIsHovered] = useState(false);
  const benefitText = useCycler(benefitsList.length ? benefitsList : ['—'], 3500, isActive && !isHovered);
  const cueText = useCycler(cuesList.length ? cuesList : [' '], 3500, isActive && !isHovered);

  if (!pose) return <div className="rounded-2xl border border-destructive bg-destructive/10 p-3"><p className="text-destructive">Pose not found: {poseId}</p></div>;

  return (
    <div
      className={cn("group relative rounded-2xl border bg-card p-3 shadow-sm transition-all duration-300", isActive && "scale-[1.02] shadow-lg ring-2 ring-primary border-primary")}
      draggable onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} onDragEnd={handleDragEnd}
    >
      <div className="flex items-start justify-between">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="cursor-grab select-none hidden md:inline" title="Drag to reorder" aria-hidden>≡</span>
          <span className="inline-flex md:hidden items-center gap-1"><button onClick={() => onMove(index, index - 1)} disabled={isFirst} className="disabled:opacity-30">↑</button><button onClick={() => onMove(index, index + 1)} disabled={isLast} className="disabled:opacity-30">↓</button></span>
          {index + 1}
        </div>
        {/* Compact Seconds Display */}
        {isActive && (
          <div className="w-[3.2ch] font-mono tabular-nums text-sm leading-none inline-block text-foreground">
            {String(Math.max(0, Math.min(999, Math.round(secondsLeft)))).padStart(2, '0')}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">{pose.icon || "🧘"}</div>
        <div>
          <div className="font-medium leading-tight">{pose.name}</div>
          <div className="text-xs text-muted-foreground">{pose.sanskrit}</div>
        </div>
      </div>

      {/* Dynamic Benefits and Cues */}
      <div className="mt-2 text-sm text-foreground min-h-[3em]" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className="line-clamp-2 font-medium">{stripHtml(benefitText)}</div>
        <div className="text-muted-foreground line-clamp-1 italic">{stripHtml(cueText)}</div>
      </div>

      <div className="flex items-center justify-between mt-2">
          <label className="block text-xs text-muted-foreground">
            {isBreathMode ? 'Breaths' : 'Seconds'}
            <input type="number" min={minVal} max={maxVal} step={stepVal} value={displayValue} onChange={(e) => handleValueChange(Number(e.target.value))} className="ml-2 w-20 rounded-md border border-input bg-background px-2 py-1 text-xs" />
          </label>
          <div className="flex items-center justify-end gap-2">
            <PlaneIcon plane={pose.plane} />
            <button type="button" onClick={() => onRemove(index)} className="px-2 py-1 text-xs rounded border hover:bg-destructive/10 hover:border-destructive">Remove</button>
          </div>
      </div>

      {/* Active-Only Progress Bar */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 px-3 pb-3">
            <div className="h-full w-full rounded bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-[width] duration-200 ease-linear" style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }} />
            </div>
        </div>
      )}
    </div>
  );
}
