import React, { useEffect, useCallback } from 'react';
import { POSES } from '@/lib/yoga-data';
import { PoseId } from '@/types/yoga';
import { Avatar } from '@/components/Avatar';
import { useYogaVoiceGuide } from '@/hooks/useYogaVoiceGuide';
import { PoseCard } from './PoseCard';

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
  // New props for flow display
  flow: PoseId[];
  secondsPerPose: number[];
  onRemovePose: (index: number) => void;
  onUpdatePoseDuration: (index: number, duration: number) => void;
  timingMode: any;
  secPerBreath: number;
  onMovePose: (dragIndex: number, hoverIndex: number) => void;
  dragIndexRef: React.MutableRefObject<number | null>;
  activePoseIndex: number;
}

export function Player({
  isPlaying, isPaused, currentPoseId, nextPoseId, timeInPose, currentPoseDuration,
  sessionTotalSeconds, sessionTimeRemaining, playbackRate,
  onPlay, onPause, onResume, onStop, onNext, onPrev, adjustRate,
  flow, secondsPerPose, onRemovePose, onUpdatePoseDuration, timingMode, secPerBreath,
  onMovePose, dragIndexRef, activePoseIndex,
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
      {/* Flow Sequence Display - Only show when flow exists */}
      {flow.length > 0 && (
        <div className="border-b border-border p-4 max-h-48 overflow-y-auto">
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-foreground">Active Flow Sequence</h3>
            <p className="text-xs text-muted-foreground">
              {flow.length} poses • {Math.round(sessionTotalSeconds / 60)} minutes total
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {flow.map((id, i) => (
              <div key={`${id}-${i}`} className="scale-75 origin-top-left">
                <PoseCard
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
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Session Progress Bar */}
      <div title={`Session progress: ${Math.round(sessionProgress)}%`} className="h-0.5 w-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${sessionProgress}%` }} role="progressbar" aria-valuenow={sessionProgress} aria-valuemin={0} aria-valuemax={100} />
      </div>
      
      <div className="p-2">
        <div className="flex items-center gap-3">
          {/* Avatar and Voice Controls - Smaller */}
          <div className="flex items-center gap-2">
            <Avatar 
              state={voiceGuide.state} 
              size="sm"
              className="flex-shrink-0"
            />
            <div className="flex gap-1">
              <button
                onClick={voiceGuide.toggleVoiceGuide}
                className={`px-1.5 py-0.5 text-xs rounded-md font-medium transition-colors ${
                  voiceGuide.isVoiceEnabled 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {voiceGuide.isVoiceEnabled ? '🎙️' : '🔇'}
              </button>
              {voiceGuide.isVoiceEnabled && (
                <button
                  onClick={voiceGuide.startListening}
                  disabled={voiceGuide.isListening}
                  className="px-1.5 py-0.5 text-xs rounded-md font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {voiceGuide.isListening ? '👂' : '💬'}
                </button>
              )}
            </div>
          </div>

          {/* Current Pose Info - More Compact */}
          <div className="flex-1 min-w-0">
            {currentPose && isPlaying ? (
              <div className="flex items-center gap-2">
                {/* Smaller Pose Icon */}
                <div className="relative">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl animate-pulse"></div>
                    <span className="relative z-10">{currentPose.icon}</span>
                    
                    {/* Progress ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 22}`}
                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - poseProgress / 100)}`}
                        className="text-primary transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Compact Pose Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">Currently Practicing</div>
                  <div className="font-bold text-lg leading-tight truncate">{currentPose.name}</div>
                  <div className="text-xs text-muted-foreground truncate italic">{currentPose.sanskrit}</div>
                  
                  {/* Compact Timer */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-sm font-mono font-bold tabular-nums">
                      {formatTime(Math.max(0, currentPoseDuration - timeInPose))}
                    </div>
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden max-w-24">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 ease-linear" 
                        style={{ width: `${poseProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Next Pose Preview - Inline and Compact */}
                {nextPose && (
                  <div className="flex items-center gap-1 p-2 bg-muted/30 rounded-lg border flex-shrink-0">
                    <div className="text-lg">{nextPose.icon}</div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">NEXT</div>
                      <div className="font-semibold text-xs truncate max-w-16">{nextPose.name}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="text-lg font-bold mb-1">Ready to begin?</div>
                <div className="text-xs text-muted-foreground">Press Play to start your yoga flow</div>
              </div>
            )}
          </div>

          {/* Enhanced Controls - More Prominent */}
          <div className="flex flex-col items-end gap-2">
            {/* Main Controls - Larger and More Visible */}
            <div className="flex items-center gap-2">
              <button 
                onClick={onPrev} 
                disabled={!isPlaying} 
                className="h-12 w-12 rounded-full bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-bold shadow-lg"
              >
                ⏮
              </button>
              
              {!isPlaying ? (
                <button onClick={onPlay} className="h-16 w-16 bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-all">
                  ▶
                </button>
              ) : isPaused ? (
                <button onClick={onResume} className="h-16 w-16 bg-primary text-primary-foreground rounded-full font-semibold flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-all">
                  ▶
                </button>
              ) : (
                <button onClick={onPause} className="h-16 w-16 bg-secondary text-secondary-foreground rounded-full font-semibold flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-all">
                  ⏸
                </button>
              )}
              
              <button 
                onClick={onNext} 
                disabled={!isPlaying} 
                className="h-12 w-12 rounded-full bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-bold shadow-lg"
              >
                ⏭
              </button>
              
              <button 
                onClick={onStop} 
                disabled={!isPlaying && !isPaused} 
                className="h-12 w-12 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-bold shadow-lg"
              >
                ⏹
              </button>
            </div>

            {/* Tempo Controls and Session Time - Side by Side */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => adjustRate(-0.25)} 
                  disabled={playbackRate <= 0.5} 
                  className="h-7 w-7 border rounded-md disabled:opacity-50 hover:bg-muted flex items-center justify-center text-xs font-mono shadow"
                >
                  −
                </button>
                <span className="text-xs w-12 text-center text-muted-foreground font-mono">
                  {playbackRate.toFixed(1)}x
                </span>
                <button 
                  onClick={() => adjustRate(0.25)} 
                  disabled={playbackRate >= 2.0} 
                  className="h-7 w-7 border rounded-md disabled:opacity-50 hover:bg-muted flex items-center justify-center text-xs font-mono shadow"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <div className="text-xs text-muted-foreground">Session</div>
                <div className="text-lg font-bold tabular-nums font-mono">{formatTime(sessionTimeRemaining)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
