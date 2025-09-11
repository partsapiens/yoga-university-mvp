import React from 'react';
import { PoseCard } from './PoseCard';
import { TimingMode, PoseId } from '@/types/yoga';

interface PoseGridProps {
  flow: PoseId[];
  secondsPerPose: number[];
  totalSeconds: number;
  onRemovePose: (index: number) => void;
  onUpdatePoseDuration: (index: number, duration: number) => void;
  timingMode: TimingMode;
  secPerBreath: number;
  onMovePose: (dragIndex: number, hoverIndex: number) => void;
  dragIndexRef: React.MutableRefObject<number | null>;
  activePoseIndex: number;
  timeInPose: number;
}

export function PoseGrid({
  flow, secondsPerPose, totalSeconds, onRemovePose, onUpdatePoseDuration,
  timingMode, secPerBreath, onMovePose, dragIndexRef, activePoseIndex, timeInPose,
}: PoseGridProps) {
  return (
    <section>
      <h2 className="mb-1 text-lg font-medium">Your Flow</h2>
      <div className="mb-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
        <span className="rounded-full border border-border px-2 py-0.5">Total: <strong className="font-semibold text-foreground tabular-nums">{Math.round(totalSeconds / 60)}m</strong></span>
        <span className="rounded-full border border-border px-2 py-0.5">Poses: <strong className="font-semibold text-foreground tabular-nums">{flow.length}</strong></span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {flow.map((id, i) => (
          <PoseCard
            key={`${id}-${i}`}
            poseId={id}
            index={i}
            duration={secondsPerPose[i] || 0}
            onRemove={onRemovePose}
            onUpdateDuration={onUpdatePoseDuration}
            timingMode={timingMode}
            secPerBreath={secPerBreath}
            onMove={onMovePose}
            dragIndexRef={dragIndexRef}
            isFirst={i === 0}
            isLast={i === flow.length - 1}
            isActive={i === activePoseIndex}
            timeInPose={i === activePoseIndex ? timeInPose : 0}
            prevPoseId={flow[i-1]}
            nextPoseId={flow[i+1]}
          />
        ))}
      </div>
    </section>
  );
}
