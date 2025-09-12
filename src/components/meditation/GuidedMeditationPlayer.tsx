"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MeditationScript, MeditationPhase } from '@/types/ai';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useMeditationVoiceGuide } from '@/hooks/useMeditationVoiceGuide';
import { BreathingOrb } from './BreathingOrb';
import { Avatar } from '@/components/Avatar';

interface GuidedMeditationPlayerProps {
  script: MeditationScript;
  onComplete: () => void;
  onExit: () => void;
}

export const GuidedMeditationPlayer: React.FC<GuidedMeditationPlayerProps> = ({
  script,
  onComplete,
  onExit
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(script.totalDuration);
  const [hasStarted, setHasStarted] = useState(false);
  
  const { speak, voices, voiceName, setVoiceName } = useSpeechSynthesis();
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhase = script.phases[currentPhaseIndex];

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  // Handle phase transitions
  useEffect(() => {
    if (!isPlaying || !hasStarted) return;

    const startPhase = () => {
      const phase = script.phases[currentPhaseIndex];
      if (!phase) {
        handleComplete();
        return;
      }

      // Speak the phase script
      const speechText = phase.script;
      speak(speechText);

      // Set timer for phase duration
      phaseTimerRef.current = setTimeout(() => {
        if (currentPhaseIndex < script.phases.length - 1) {
          setCurrentPhaseIndex(prev => prev + 1);
          setPhaseProgress(0);
        } else {
          handleComplete();
        }
      }, phase.duration * 1000);

      // Progress tracking
      let elapsed = 0;
      const interval = 100; // Update every 100ms
      progressTimerRef.current = setInterval(() => {
        elapsed += interval;
        const progress = Math.min(1, elapsed / (phase.duration * 1000));
        setPhaseProgress(progress);
        setTimeRemaining(prev => Math.max(0, prev - interval / 1000));
      }, interval);
    };

    startPhase();

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentPhaseIndex, isPlaying, hasStarted, script.phases, speak]);

  const handleStart = () => {
    setIsPlaying(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  const handleResume = () => {
    setIsPlaying(true);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    speak("Your meditation is complete. Take a moment to appreciate this time you've given yourself.");
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseDisplayName = (phase: MeditationPhase) => {
    const names = {
      intro: 'Welcome',
      settle: 'Settling In',
      breathwork: 'Breathing Practice',
      main: 'Main Practice',
      close: 'Closing'
    };
    return names[phase.name] || phase.name;
  };

  const formatTimeForSpeech = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins === 0) {
      return `${secs} seconds`;
    } else if (secs === 0) {
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    } else {
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'} and ${secs} seconds`;
    }
  };

  const goToNextPhase = () => {
    if (currentPhaseIndex < script.phases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
      setPhaseProgress(0);
    }
  };

  // Voice guide integration for guided meditation
  const meditationVoiceGuide = useMeditationVoiceGuide({
    onStartMeditation: () => {
      if (!hasStarted) {
        handleStart();
      } else if (!isPlaying) {
        handleResume();
      }
    },
    onPauseMeditation: handlePause,
    onResumeMeditation: handleResume,
    onStopMeditation: onExit,
    onGetTimeRemaining: () => formatTimeForSpeech(timeRemaining),
    onRepeatInstruction: () => {
      if (currentPhase) {
        speak(currentPhase.script);
      }
    },
    onNextSection: goToNextPhase,
    isPlaying: isPlaying && hasStarted,
    timeRemaining
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{script.title}</h1>
          <div className="text-white/80 text-lg">
            {formatTime(timeRemaining)} remaining
          </div>
        </div>

        {/* Phase Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-white/60 text-sm mb-2">
            <span>Phase {currentPhaseIndex + 1} of {script.phases.length}</span>
            <span>{getPhaseDisplayName(currentPhase)}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentPhaseIndex + phaseProgress) / script.phases.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          {/* Current Phase Info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {getPhaseDisplayName(currentPhase)}
            </h2>
            {hasStarted && (
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                {currentPhase.script}
              </p>
            )}
          </div>

          {/* Breathing Orb */}
          {script.breathingPattern && (currentPhase.name === 'breathwork' || currentPhase.breathingCue) && (
            <div className="flex justify-center mb-8">
              <BreathingOrb
                isActive={isPlaying && hasStarted}
                pattern={script.breathingPattern}
              />
            </div>
          )}

          {/* Pre-start Instructions */}
          {!hasStarted && (
            <div className="text-center">
              <div className="bg-white/20 rounded-lg p-6 max-w-2xl mx-auto mb-6">
                <h3 className="text-white font-semibold mb-3">Before we begin:</h3>
                <ul className="text-white/80 space-y-2 text-left">
                  <li>• Find a comfortable seated or lying position</li>
                  <li>• Ensure you won&rsquo;t be disturbed for the next {Math.ceil(script.totalDuration / 60)} minutes</li>
                  <li>• Close your eyes or soften your gaze downward</li>
                  <li>• Allow your breathing to find its natural rhythm</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!hasStarted ? (
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 
                       text-white font-semibold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105"
            >
              Begin Meditation
            </button>
          ) : (
            <>
              <button
                onClick={isPlaying ? handlePause : handleResume}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                         text-white font-semibold py-3 px-6 rounded-full transition-all"
              >
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
            </>
          )}
          
          <button
            onClick={onExit}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-full transition-all"
          >
            Exit
          </button>
        </div>

        {/* Voice Control */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Avatar 
              state={meditationVoiceGuide.state} 
              size="sm"
              className="flex-shrink-0"
            />
            <div className="flex gap-2">
              <button
                onClick={meditationVoiceGuide.toggleVoiceGuide}
                className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                  meditationVoiceGuide.isVoiceEnabled 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {meditationVoiceGuide.isVoiceEnabled ? '🎙️ Voice On' : '🔇 Voice Off'}
              </button>
              {meditationVoiceGuide.isVoiceEnabled && (
                <button
                  onClick={meditationVoiceGuide.startListening}
                  disabled={meditationVoiceGuide.isListening}
                  className="px-3 py-2 text-sm rounded-md font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {meditationVoiceGuide.isListening ? '👂 Listening' : '💬 Talk'}
                </button>
              )}
            </div>
          </div>
          {meditationVoiceGuide.isVoiceEnabled && (
            <div className="text-center text-sm text-white/70 space-y-1">
              <p><strong>Voice Commands:</strong></p>
              <p>&quot;Pause&quot; • &quot;Resume&quot; • &quot;Repeat instruction&quot; • &quot;Next section&quot; • &quot;How much time left&quot;</p>
            </div>
          )}
        </div>

        {/* Voice Settings */}
        {voices.length > 1 && (
          <div className="mt-6 text-center">
            <select
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              className="bg-white/20 text-white rounded-lg px-4 py-2 text-sm backdrop-blur"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name} className="text-black">
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
            <p className="text-white/60 text-xs mt-2">Voice Selection</p>
          </div>
        )}
      </div>
    </div>
  );
};