import React from 'react';
import { QuickActions } from './QuickActions';
import { FlowValidation } from './FlowValidation';
import { PoseCard } from './PoseCard';
import { PoseId, TimingMode } from '@/types/yoga';

interface FlowManagementProps {
  // PoseGrid props
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
  
  // QuickActions props
  onDuplicateFlow: () => void;
  onReverseFlow: () => void;
  onClearFlow: () => void;
  onShuffleFlow: () => void;
  onOptimizeFlow?: () => void;
  
  className?: string;
}

export function FlowManagement({
  // PoseGrid props
  flow, secondsPerPose, totalSeconds, onRemovePose, onUpdatePoseDuration,
  timingMode, secPerBreath, onMovePose, dragIndexRef, activePoseIndex, timeInPose,
  
  // QuickActions props
  onDuplicateFlow, onReverseFlow, onClearFlow, onShuffleFlow, onOptimizeFlow,
  
  className = ''
}: FlowManagementProps) {
  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-4 ${className}`}>
      {/* Header with Your Flow title and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Flow & Quick Actions</h2>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="rounded-full border border-border px-2 py-0.5">
              Total: <strong className="font-semibold text-foreground tabular-nums">{Math.round(totalSeconds / 60)}m</strong>
            </span>
            <span className="rounded-full border border-border px-2 py-0.5">
              Poses: <strong className="font-semibold text-foreground tabular-nums">{flow.length}</strong>
            </span>
          </div>
        </div>
        
        {/* Quick Actions integrated */}
        <div className="flex-shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {/* Quick Action buttons - inline here for better integration */}
            <button
              onClick={onDuplicateFlow}
              disabled={flow.length === 0}
              className="flex items-center gap-1 p-2 text-xs border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Duplicate current flow"
            >
              📋 Duplicate
            </button>
            <button
              onClick={onReverseFlow}
              disabled={flow.length === 0}
              className="flex items-center gap-1 p-2 text-xs border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Reverse flow order"
            >
              🔄 Reverse
            </button>
            <button
              onClick={onShuffleFlow}
              disabled={flow.length === 0}
              className="flex items-center gap-1 p-2 text-xs border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Shuffle poses randomly"
            >
              🎲 Shuffle
            </button>
            {onOptimizeFlow && (
              <button
                onClick={onOptimizeFlow}
                disabled={flow.length === 0}
                className="flex items-center gap-1 p-2 text-xs border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Optimize flow sequence"
              >
                ⚡ Optimize
              </button>
            )}
            <button
              onClick={onClearFlow}
              disabled={flow.length === 0}
              className="flex items-center gap-1 p-2 text-xs border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Clear all poses"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>

      {/* AI Flow Review (Flow Validation) */}
      <div>
        <h3 className="text-lg font-semibold mb-2">AI Flow Review</h3>
        <FlowValidation flow={flow} totalSeconds={totalSeconds} />
      </div>

      {/* Your Flow Grid */}
      <div>
        {flow.length > 0 ? (
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
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h3 className="text-lg font-semibold mb-2">Start Building Your Flow</h3>
            <p className="text-sm">Add poses from the library below or use the AI generator to create your sequence</p>
          </div>
        )}
      </div>
    </div>
  );
}