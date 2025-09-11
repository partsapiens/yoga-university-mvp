import React from 'react';
import { Play, Pause, Square, SkipForward, SkipBack } from 'lucide-react';
import { POSES } from '@/lib/yoga-data';
import { PoseId } from '@/types/yoga';
import { buildCues } from '@/lib/yoga-helpers';

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
  const poseProgress = currentPoseDuration > 0 ? (timeInPose / currentPoseDuration) * 100 : 0;

  // Get pose cues
  const poseCues = currentPose ? buildCues(currentPose.id, true) : '';
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 border-t border-border shadow-xl backdrop-blur-md">
      {/* Session Progress Bar */}
      <div title={`Session progress: ${Math.round(sessionProgress)}%`} className="h-1 w-full bg-muted/50">
        <div 
          className="h-full bg-primary transition-all duration-500" 
          style={{ width: `${sessionProgress}%` }} 
          role="progressbar" 
          aria-valuenow={sessionProgress} 
          aria-valuemin={0} 
          aria-valuemax={100} 
        />
      </div>

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            
            {/* Left Section: Current Pose Info */}
            <div className="flex items-center gap-4 min-w-0">
              {currentPose && (isPlaying || isPaused) ? (
                <>
                  {/* Pose Animation/Icon */}
                  <div className="relative">
                    <div className="text-6xl lg:text-8xl animate-pulse">
                      {currentPose.icon}
                    </div>
                    {/* Pose Progress Ring */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 lg:w-28 lg:h-28 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="stroke-current text-muted opacity-20"
                          strokeWidth="2"
                          fill="transparent"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="stroke-current text-primary"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="transparent"
                          strokeDasharray={`${poseProgress}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Pose Details */}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-muted-foreground mb-1">
                      {isPlaying ? 'Now Playing' : 'Paused'}
                    </div>
                    <div className="font-bold text-2xl lg:text-3xl leading-tight truncate">
                      {currentPose.name}
                    </div>
                    <div className="text-lg text-muted-foreground truncate mb-2">
                      {currentPose.sanskrit}
                    </div>
                    
                    {/* Pose Timer */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono text-primary font-bold">
                        {formatTime(Math.max(0, currentPoseDuration - timeInPose))}
                      </span>
                      <span className="text-muted-foreground">
                        / {formatTime(currentPoseDuration)}
                      </span>
                    </div>

                    {/* Breathing/Cues */}
                    {poseCues && (
                      <div className="mt-2 text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1 truncate max-w-xs">
                        💨 {poseCues.split('.')[0]}...
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-5xl">🧘‍♀️</div>
                  <div>
                    <div className="text-xl font-bold">Ready to begin?</div>
                    <div className="text-sm text-muted-foreground">Press play to start your flow</div>
                  </div>
                </div>
              )}
            </div>

            {/* Center Section: Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onStop}
                disabled={!isPlaying && !isPaused}
                className="p-3 bg-destructive/10 text-destructive rounded-full hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Square size={20} />
              </button>

              <button
                onClick={() => {/* Previous pose logic */}}
                className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                <SkipBack size={18} />
              </button>

              {!isPlaying ? (
                <button 
                  onClick={onPlay} 
                  className="p-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                >
                  <Play size={24} fill="currentColor" />
                </button>
              ) : isPaused ? (
                <button 
                  onClick={onResume} 
                  className="p-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                >
                  <Play size={24} fill="currentColor" />
                </button>
              ) : (
                <button 
                  onClick={onPause} 
                  className="p-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                >
                  <Pause size={24} />
                </button>
              )}

              <button
                onClick={() => {/* Next pose logic */}}
                className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                <SkipForward size={18} />
              </button>

              {/* Playback Rate */}
              <div className="flex items-center gap-1 ml-2">
                <button 
                  onClick={() => adjustRate(-0.25)} 
                  disabled={playbackRate <= 0.5} 
                  className="w-8 h-8 border rounded-md disabled:opacity-50 hover:bg-muted transition-colors text-xs"
                >
                  −
                </button>
                <span className="text-xs w-12 text-center text-muted-foreground">
                  {playbackRate.toFixed(1)}x
                </span>
                <button 
                  onClick={() => adjustRate(0.25)} 
                  disabled={playbackRate >= 2.0} 
                  className="w-8 h-8 border rounded-md disabled:opacity-50 hover:bg-muted transition-colors text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Right Section: Next Pose & Session Time */}
            <div className="flex items-center justify-end gap-4 min-w-0">
              {/* Session Time Remaining */}
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Session Time</div>
                <div className="text-2xl font-bold font-mono tabular-nums">
                  {formatTime(sessionTimeRemaining)}
                </div>
              </div>

              {/* Next Pose Preview */}
              {nextPose && (isPlaying || isPaused) && (
                <div className="flex items-center gap-3 min-w-0 bg-muted/30 rounded-lg p-3">
                  <div className="text-3xl opacity-60">{nextPose.icon}</div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">Up Next</div>
                    <div className="font-medium text-sm truncate">{nextPose.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{nextPose.sanskrit}</div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
