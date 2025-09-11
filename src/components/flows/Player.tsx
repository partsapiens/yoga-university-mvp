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
  const poseProgress = currentPoseDuration > 0 ? ((currentPoseDuration - (currentPoseDuration - timeInPose)) / currentPoseDuration) * 100 : 0;

  // Generate breathing cue based on current pose
  const getBreathingCue = () => {
    if (!currentPose) return "";
    
    const cues = {
      [PoseId.DownDog]: "💨 Press palms, lift hips back and up",
      [PoseId.Warrior1Right]: "💨 Ground through feet, reach arms skyward", 
      [PoseId.ForwardFold]: "💨 Soften knees, let gravity do the work",
      [PoseId.Child]: "💨 Breathe into your back body",
      [PoseId.Butterfly]: "💨 Gentle forward fold with each exhale",
      [PoseId.Bridge]: "💨 Press feet down, lift heart up",
      [PoseId.Pigeon]: "💨 Breathe into the hip opening",
      [PoseId.Boat]: "💨 Lift through the chest, engage core",
      [PoseId.HighLungeRight]: "💨 Strong through legs, light through arms",
      [PoseId.TwistLow]: "💨 Inhale lengthen, exhale deepen the twist"
    };
    
    return cues[currentPoseId as PoseId] || "💨 Breathe deeply and mindfully";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 border-t border-border shadow-lg backdrop-blur-sm">
      {/* Session Progress Bar */}
      <div title={`Session progress: ${Math.round(sessionProgress)}%`} className="h-1 w-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${sessionProgress}%` }} role="progressbar" aria-valuenow={sessionProgress} aria-valuemin={0} aria-valuemax={100} />
      </div>
      
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar and Voice Controls */}
          <div className="flex items-center gap-3">
            <Avatar 
              state={voiceGuide.state} 
              size="md"
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-1">
              <button
                onClick={voiceGuide.toggleVoiceGuide}
                className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${
                  voiceGuide.isVoiceEnabled 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {voiceGuide.isVoiceEnabled ? '🎙️ Voice' : '🔇 Muted'}
              </button>
              {voiceGuide.isVoiceEnabled && (
                <button
                  onClick={voiceGuide.startListening}
                  disabled={voiceGuide.isListening}
                  className="px-2 py-1 text-xs rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {voiceGuide.isListening ? '👂' : '💬'}
                </button>
              )}
            </div>
          </div>

          {/* Current Pose Info */}
          <div className="flex-1 min-w-0">
            {currentPose && isPlaying ? (
              <div className="flex items-center gap-4">
                {/* Animated Pose Icon with Progress Ring */}
                <div className="relative">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-4xl relative overflow-hidden">
                    {/* Pulse animation */}
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-pulse"></div>
                    <span className="relative z-10">{currentPose.icon}</span>
                    
                    {/* Progress ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 30}`}
                        strokeDashoffset={`${2 * Math.PI * 30 * (1 - poseProgress / 100)}`}
                        className="text-primary transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Pose Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-muted-foreground mb-1">Currently Practicing</div>
                  <div className="font-bold text-2xl leading-tight truncate">{currentPose.name}</div>
                  <div className="text-sm text-muted-foreground truncate italic">{currentPose.sanskrit}</div>
                  
                  {/* Breathing Cue */}
                  <div className="mt-2 text-sm text-primary font-medium">
                    {getBreathingCue()}
                  </div>
                  
                  {/* Pose Timer */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-lg font-mono font-bold tabular-nums">
                      {formatTime(Math.max(0, currentPoseDuration - timeInPose))}
                    </div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 ease-linear" 
                        style={{ width: `${poseProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-xl font-bold mb-2">Ready to begin your practice?</div>
                <div className="text-sm text-muted-foreground">Press Play to start your yoga flow</div>
              </div>
            )}

            {/* Next Pose Preview */}
            {isPlaying && nextPose && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{nextPose.icon}</div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">UP NEXT</div>
                    <div className="font-semibold text-sm">{nextPose.name}</div>
                    <div className="text-xs text-muted-foreground italic">{nextPose.sanskrit}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-end gap-3">
            {/* Main Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={onPrev} 
                disabled={!isPlaying} 
                className="h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold"
              >
                ⏮
              </button>
              
              {!isPlaying ? (
                <button onClick={onPlay} className="h-12 w-12 bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center text-lg">
                  ▶
                </button>
              ) : isPaused ? (
                <button onClick={onResume} className="h-12 w-12 bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center text-lg">
                  ▶
                </button>
              ) : (
                <button onClick={onPause} className="h-12 w-12 bg-secondary text-secondary-foreground rounded-full font-semibold flex items-center justify-center text-lg">
                  ⏸
                </button>
              )}
              
              <button 
                onClick={onNext} 
                disabled={!isPlaying} 
                className="h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold"
              >
                ⏭
              </button>
              
              <button 
                onClick={onStop} 
                disabled={!isPlaying && !isPaused} 
                className="h-10 w-10 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold"
              >
                ⏹
              </button>
            </div>

            {/* Tempo Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => adjustRate(-0.25)} 
                disabled={playbackRate <= 0.5} 
                className="h-8 w-8 border rounded-md disabled:opacity-50 hover:bg-muted flex items-center justify-center text-sm font-mono"
              >
                −
              </button>
              <span className="text-xs w-16 text-center text-muted-foreground font-mono">
                {playbackRate.toFixed(2)}x
              </span>
              <button 
                onClick={() => adjustRate(0.25)} 
                disabled={playbackRate >= 2.0} 
                className="h-8 w-8 border rounded-md disabled:opacity-50 hover:bg-muted flex items-center justify-center text-sm font-mono"
              >
                +
              </button>
            </div>

            {/* Session Time */}
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Session Time</div>
              <div className="text-2xl font-bold tabular-nums font-mono">{formatTime(sessionTimeRemaining)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
