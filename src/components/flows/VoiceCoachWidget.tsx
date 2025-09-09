"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useSpeechRecognition } from '@/lib/voice/useSpeechRecognition';
import { useInterruptibleTTS } from '@/hooks/useInterruptibleTTS';
import { parseCoachTranscript } from '@/lib/voice/coach-nlu';
import { POSES } from '@/lib/yoga-data';
import { PoseId } from '@/types/yoga';
import { cn } from '@/lib/utils';

interface FlowItem {
  id: PoseId;
  duration: number;
}

interface VoiceCoachWidgetProps {
  initialFlow: FlowItem[];
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function VoiceCoachWidget({ initialFlow }: VoiceCoachWidgetProps) {
  const [flow, setFlow] = useState(initialFlow);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(flow[0]?.duration ?? 0);
  const [isPaused, setIsPaused] = useState(true);
  const [pace, setPace] = useState(1.0); // 1.0 is normal speed

  const speech = useSpeechRecognition();
  const tts = useInterruptibleTTS();

  const currentPoseId = useMemo(() => flow[currentIndex]?.id, [flow, currentIndex]);
  const currentPoseInfo = useMemo(() => POSES.find(p => p.id === currentPoseId), [currentPoseId]);

  const advanceToNextPose = useCallback(() => {
    if (currentIndex < flow.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeRemaining(flow[nextIndex].duration);
      tts.speak(POSES.find(p => p.id === flow[nextIndex].id)?.name || "Next pose");
    } else {
      tts.speak("Practice complete. Nice work.");
      setIsPaused(true);
    }
  }, [currentIndex, flow, tts]);

  useTimer(() => {
    if (isPaused) return;
    if (timeRemaining > 1) {
      setTimeRemaining(t => t - 1);
    } else {
      advanceToNextPose();
    }
  }, isPaused ? null : 1000 / pace);

  // Effect to process voice commands
  useEffect(() => {
    if (speech.transcript) {
      const intent = parseCoachTranscript(speech.transcript);
      if (intent) {
        switch (intent.name) {
          case 'pause': setIsPaused(true); tts.speak("Paused."); break;
          case 'resume': setIsPaused(false); tts.speak("Resuming."); break;
          case 'next_pose': advanceToNextPose(); break;
          case 'repeat_pose': setTimeRemaining(flow[currentIndex].duration); tts.speak(`Repeating ${currentPoseInfo?.name}`); break;
          case 'slower': setPace(p => Math.max(0.5, p - 0.25)); tts.speak("Slowing down."); break;
          case 'faster': setPace(p => Math.min(2.0, p + 0.25)); tts.speak("Speeding up."); break;
          case 'how_long': tts.speak(`There are ${formatTime(timeRemaining)} remaining for ${currentPoseInfo?.name}.`); break;
          case 'explain_pose': tts.speak(currentPoseInfo?.description || `I do not have a description for ${currentPoseInfo?.name}.`); break;
        }
      } else {
        tts.speak("Sorry, I didn't understand that.");
      }
    }
  }, [speech.transcript]);

  const handleMicPress = () => {
    tts.cancel();
    setIsPaused(true);
    speech.start();
  };
  const handleMicRelease = () => speech.stop();

  return (
    <div className="fixed bottom-8 right-8 z-50 p-4 bg-card border border-border rounded-lg shadow-xl w-80">
      <div className="text-center">
        <h3 className="font-bold text-lg">{currentPoseInfo?.name ?? "Ready"}</h3>
        <p className="text-5xl font-mono my-2">{formatTime(timeRemaining)}</p>
        <div className="flex items-center justify-center gap-4">
          <button
            className={cn("h-16 w-16 rounded-full text-white text-3xl flex items-center justify-center shadow-lg active:scale-95 transition-all", speech.listening ? "bg-red-500 animate-pulse" : "bg-primary")}
            onMouseDown={handleMicPress}
            onMouseUp={handleMicRelease}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicRelease}
          >
            🎤
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{speech.listening ? "Listening..." : "Hold to Speak"}</p>
        <p className="text-sm h-6 mt-2">{speech.interimTranscript}</p>
      </div>
    </div>
  );
}
