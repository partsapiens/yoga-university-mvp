import React, { useEffect, useCallback } from 'react';
import { POSES } from '@/lib/yoga-data';
import { PoseId } from '@/types/yoga';
import { Avatar } from '@/components/Avatar';
import { useYogaVoiceGuide } from '@/hooks/useYogaVoiceGuide';

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
  onNext?: () => void;
  onPrev?: () => void;
  adjustRate: (amount: number) => void;
}

export function Player({
  isPlaying, isPaused, currentPoseId, nextPoseId, timeInPose, currentPoseDuration,
  sessionTotalSeconds, sessionTimeRemaining, playbackRate,
  onPlay, onPause, onResume, onStop, onNext, onPrev, adjustRate,
}: PlayerProps) {
  const currentPose = currentPoseId ? POSES.find(p => p.id === currentPoseId) : null;
  const nextPose = nextPoseId ? POSES.find(p => p.id === nextPoseId) : null;

  // Voice guide integration
  const voiceGuide = useYogaVoiceGuide({
    onNext,
    onPrev,
    onPause,
    onResume,
    onRepeatInstructions: () => {
      if (currentPoseId && currentPoseDuration) {
        voiceGuide.guideThroughPose(currentPoseId, currentPoseDuration);
      }
    }
  });

  // Guide through pose when starting a new pose
  useEffect(() => {
    if (isPlaying && currentPoseId && timeInPose === 0 && voiceGuide.isVoiceEnabled) {
      voiceGuide.guideThroughPose(currentPoseId, currentPoseDuration);
    }
  }, [isPlaying, currentPoseId, timeInPose, currentPoseDuration, voiceGuide]);

  // Provide encouragement during longer holds
  useEffect(() => {
    if (isPlaying && voiceGuide.isVoiceEnabled && currentPoseDuration > 30) {
      const encouragementInterval = setInterval(() => {
        if (timeInPose > 0 && timeInPose % 20 === 0) { // Every 20 seconds
          voiceGuide.provideEncouragement();
        }
      }, 1000);

      return () => clearInterval(encouragementInterval);
    }
  }, [isPlaying, timeInPose, currentPoseDuration, voiceGuide]);

  // Offer conversation periodically when voice is enabled
  useEffect(() => {
    if (isPlaying && voiceGuide.isVoiceEnabled) {
      const conversationInterval = setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every check
          voiceGuide.offerConversation();
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(conversationInterval);
    }
  }, [isPlaying, voiceGuide]);

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
        {/* Avatar Section */}
        <div className="flex items-center gap-3">
          <Avatar 
            state={voiceGuide.state} 
            size="md"
            className="flex-shrink-0"
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={voiceGuide.toggleVoiceGuide}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                voiceGuide.isVoiceEnabled 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              {voiceGuide.isVoiceEnabled ? '🎙️ Voice On' : '🔇 Voice Off'}
            </button>
            {voiceGuide.isVoiceEnabled && (
              <button
                onClick={voiceGuide.startListening}
                disabled={voiceGuide.isListening}
                className="px-3 py-1 text-xs rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {voiceGuide.isListening ? '👂 Listening...' : '💬 Talk'}
              </button>
            )}
          </div>
        </div>

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
