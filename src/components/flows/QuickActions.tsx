import React from 'react';
import { Copy, RotateCcw, Trash2, Shuffle, Zap } from 'lucide-react';
import { PoseId } from '@/types/yoga';

interface QuickActionsProps {
  flow: PoseId[];
  onDuplicateFlow: () => void;
  onReverseFlow: () => void;
  onClearFlow: () => void;
  onShuffleFlow: () => void;
  onOptimizeFlow?: () => void;
  className?: string;
}

export function QuickActions({
  flow,
  onDuplicateFlow,
  onReverseFlow,
  onClearFlow,
  onShuffleFlow,
  onOptimizeFlow,
  className = ''
}: QuickActionsProps) {
  const hasFlow = flow.length > 0;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {/* Duplicate Flow */}
        <button
          onClick={onDuplicateFlow}
          disabled={!hasFlow}
          className="flex items-center gap-2 p-2 text-sm border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Duplicate current flow"
        >
          <Copy size={16} />
          <span className="hidden sm:inline">Duplicate</span>
        </button>

        {/* Reverse Flow */}
        <button
          onClick={onReverseFlow}
          disabled={!hasFlow}
          className="flex items-center gap-2 p-2 text-sm border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Reverse pose order"
        >
          <RotateCcw size={16} />
          <span className="hidden sm:inline">Reverse</span>
        </button>

        {/* Shuffle Flow */}
        <button
          onClick={onShuffleFlow}
          disabled={!hasFlow}
          className="flex items-center gap-2 p-2 text-sm border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Shuffle pose order randomly"
        >
          <Shuffle size={16} />
          <span className="hidden sm:inline">Shuffle</span>
        </button>

        {/* Optimize Flow */}
        {onOptimizeFlow && (
          <button
            onClick={onOptimizeFlow}
            disabled={!hasFlow}
            className="flex items-center gap-2 p-2 text-sm border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-blue-600 dark:text-blue-400"
            title="Optimize flow for better transitions"
          >
            <Zap size={16} />
            <span className="hidden sm:inline">Optimize</span>
          </button>
        )}

        {/* Clear Flow */}
        <button
          onClick={onClearFlow}
          disabled={!hasFlow}
          className="flex items-center gap-2 p-2 text-sm border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Clear all poses"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Flow Stats */}
      {hasFlow && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>
              <strong className="text-foreground">{flow.length}</strong> poses
            </span>
            <span>
              <strong className="text-foreground">{flow.filter((pose, i) => flow.indexOf(pose) === i).length}</strong> unique
            </span>
            {flow.length !== flow.filter((pose, i) => flow.indexOf(pose) === i).length && (
              <span className="text-orange-600 dark:text-orange-400">
                {flow.length - flow.filter((pose, i) => flow.indexOf(pose) === i).length} repeats
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}