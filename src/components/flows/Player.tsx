import React from 'react';
import { POSES } from '@/lib/yoga-data';
import { PoseId } from '@/types/yoga';

interface PlayerProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentPoseId?: PoseId;
  nextPoseId?: PoseId;
  timeInPose: number;
  currentPoseDuration: number;
  sessionTotalSeconds: number;
  sessionTimeRemaining: number;
  playbackRate: number;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  adjustRate: (amount: number) => void;
}

export function Player({
  isPlaying, isPaused, currentPoseId, nextPoseId, timeInPose, currentPoseDuration,
  sessionTotalSeconds, sessionTimeRemaining, playbackRate,
  onPlay, onPause, onResume, onStop, adjustRate,
}: PlayerProps) {
  const currentPose = currentPoseId ? POSES.find(p => p.id === currentPoseId) : null;
  const nextPose = nextPoseId ? POSES.find(p => p.id === nextPoseId) : null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const sessionProgress = sessionTotalSeconds > 0 ? ((sessionTotalSeconds - sessionTimeRemaining) / sessionTotalSeconds) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/90 border-t border-border p-4 shadow-lg backdrop-blur-sm">
      <div title={`Session progress: ${Math.round(sessionProgress)}%`} className="h-1 w-full bg-muted rounded-full overflow-hidden mb-3">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${sessionProgress}%` }} role="progressbar" aria-valuenow={sessionProgress} aria-valuemin={0} aria-valuemax={100} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 min-w-0">
          {currentPose && isPlaying ? (
            <>
              <div className="text-4xl hidden sm:block">{currentPose.icon}</div>
              <div className="truncate">
                <div className="text-sm text-muted-foreground">Now Playing</div>
                <div className="font-bold text-lg truncate">{currentPose.name}</div>
                <div className="text-sm text-muted-foreground truncate">{currentPose.sanskrit}</div>
              </div>
            </>
          ) : (
            <div className="text-lg font-bold">Ready to begin?</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isPlaying ? ( <button onClick={onPlay} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold">Play</button> ) : isPaused ? ( <button onClick={onResume} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold">Resume</button> ) : ( <button onClick={onPause} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold">Pause</button> )}
          <button onClick={onStop} disabled={!isPlaying} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold disabled:opacity-50">Stop</button>
        </div>

        <div className="flex-1 text-right min-w-0">
          <div className="flex items-center justify-end gap-2">
             <button onClick={() => adjustRate(-0.25)} disabled={playbackRate <= 0.5} className="h-8 w-8 border rounded-md disabled:opacity-50">[</button>
             <span className="text-xs w-12 text-center text-muted-foreground">Tempo<br/>{playbackRate.toFixed(2)}x</span>
             <button onClick={() => adjustRate(0.25)} disabled={playbackRate >= 2.0} className="h-8 w-8 border rounded-md disabled:opacity-50">]</button>
          </div>
          {isPlaying && nextPose && <div className="text-sm text-muted-foreground truncate mt-1">Next up: {nextPose.name}</div>}
          <div className="text-2xl font-bold tabular-nums">{formatTime(sessionTimeRemaining)}</div>
        </div>
      </div>
    </div>
  );
}
