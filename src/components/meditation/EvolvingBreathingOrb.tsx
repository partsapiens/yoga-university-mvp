"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { BreathingPattern } from '@/types/ai';

interface EvolutionStage {
  name: string;
  description: string;
  className: string;
  sessionsRequired: number;
  unlockMessage: string;
}

interface EvolvingBreathingOrbProps {
  isActive: boolean;
  pattern?: BreathingPattern;
  sessionCount?: number;
  onBreathCycle?: (phase: 'inhale' | 'hold1' | 'exhale' | 'hold2') => void;
  onEvolution?: (stage: EvolutionStage) => void;
}

const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    name: 'Novice Breather',
    description: 'Beginning the journey',
    className: 'stage-novice',
    sessionsRequired: 5,
    unlockMessage: "You've discovered inner focus!"
  },
  {
    name: 'Focused Apprentice',
    description: 'Energy rings awakened',
    className: 'stage-apprentice',
    sessionsRequired: 15,
    unlockMessage: 'Your breath creates harmony!'
  },
  {
    name: 'Breathing Master',
    description: 'Crown of wisdom earned',
    className: 'stage-master',
    sessionsRequired: 50,
    unlockMessage: 'You command the life force!'
  },
  {
    name: 'Enlightened Being',
    description: 'Transcendent consciousness',
    className: 'stage-enlightened',
    sessionsRequired: 100,
    unlockMessage: 'You are one with the breath!'
  }
];

export const EvolvingBreathingOrb: React.FC<EvolvingBreathingOrbProps> = ({
  isActive,
  pattern = { name: 'Natural', inhale: 4, exhale: 4, description: 'Natural breathing' },
  sessionCount = 0,
  onBreathCycle,
  onEvolution
}) => {
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [scale, setScale] = useState(1);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [heartRate, setHeartRate] = useState(72);
  const [currentStage, setCurrentStage] = useState(0);
  const [showEvolutionMessage, setShowEvolutionMessage] = useState(false);
  const [evolutionMessage, setEvolutionMessage] = useState('');

  // Calculate phase durations in milliseconds
  const phaseDurations = {
    inhale: pattern.inhale * 1000,
    hold1: (pattern.hold1 || 0) * 1000,
    exhale: pattern.exhale * 1000,
    hold2: (pattern.hold2 || 0) * 1000
  };

  // Total cycle duration
  const totalCycleDuration = Object.values(phaseDurations).reduce((sum, duration) => sum + duration, 0);

  // Determine current evolution stage based on session count
  useEffect(() => {
    const newStage = EVOLUTION_STAGES.findIndex(stage => sessionCount < stage.sessionsRequired);
    const stageIndex = newStage === -1 ? EVOLUTION_STAGES.length - 1 : Math.max(0, newStage - 1);
    
    if (stageIndex !== currentStage && sessionCount > 0) {
      setCurrentStage(stageIndex);
      triggerEvolution(stageIndex);
    }
  }, [sessionCount, currentStage]);

  const triggerEvolution = (stageIndex: number) => {
    const stage = EVOLUTION_STAGES[stageIndex];
    if (stage) {
      setEvolutionMessage(stage.unlockMessage);
      setShowEvolutionMessage(true);
      onEvolution?.(stage);
      
      setTimeout(() => {
        setShowEvolutionMessage(false);
      }, 4000);
    }
  };

  // Simulate heart rate changes
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const baseRate = currentPhase === 'inhale' ? 75 : 68;
      const variation = Math.random() * 4 - 2;
      setHeartRate(Math.round(baseRate + variation));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhase]);

  // Main breathing animation
  useEffect(() => {
    if (!isActive || pattern.inhale === 0) return;

    let animationFrame: number;
    let startTime = Date.now();
    let currentCyclePhase: 'inhale' | 'hold1' | 'exhale' | 'hold2' = 'inhale';
    let lastPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2' = 'inhale';

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cyclePosition = elapsed % totalCycleDuration;
      
      let phaseStart = 0;
      let phaseEnd = phaseDurations.inhale;
      let newPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2' = 'inhale';

      // Determine current phase
      if (cyclePosition < phaseDurations.inhale) {
        newPhase = 'inhale';
        phaseStart = 0;
        phaseEnd = phaseDurations.inhale;
      } else if (cyclePosition < phaseDurations.inhale + phaseDurations.hold1) {
        newPhase = 'hold1';
        phaseStart = phaseDurations.inhale;
        phaseEnd = phaseDurations.inhale + phaseDurations.hold1;
      } else if (cyclePosition < phaseDurations.inhale + phaseDurations.hold1 + phaseDurations.exhale) {
        newPhase = 'exhale';
        phaseStart = phaseDurations.inhale + phaseDurations.hold1;
        phaseEnd = phaseDurations.inhale + phaseDurations.hold1 + phaseDurations.exhale;
      } else {
        newPhase = 'hold2';
        phaseStart = phaseDurations.inhale + phaseDurations.hold1 + phaseDurations.exhale;
        phaseEnd = totalCycleDuration;
      }

      // Update phase if changed
      if (newPhase !== currentCyclePhase) {
        lastPhase = currentCyclePhase;
        currentCyclePhase = newPhase;
        setCurrentPhase(newPhase);
        onBreathCycle?.(newPhase);

        // Increment breath count on complete exhale
        if (lastPhase === 'exhale' && newPhase === 'hold2') {
          setBreathCount(prev => prev + 1);
        }
      }

      // Calculate progress within current phase
      const phaseElapsed = cyclePosition - phaseStart;
      const phaseDuration = phaseEnd - phaseStart;
      const progress = phaseDuration > 0 ? phaseElapsed / phaseDuration : 0;
      setPhaseProgress(Math.min(1, Math.max(0, progress)));

      // Calculate scale based on phase with smooth transitions
      let targetScale = 1;
      if (newPhase === 'inhale') {
        targetScale = 1 + (progress * 0.3); // Scale from 1 to 1.3
      } else if (newPhase === 'hold1') {
        targetScale = 1.3; // Hold at expanded
      } else if (newPhase === 'exhale') {
        targetScale = 1.3 - (progress * 0.4); // Scale from 1.3 to 0.9
      } else {
        targetScale = 0.9; // Hold at contracted
      }

      setScale(targetScale);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, pattern, totalCycleDuration, onBreathCycle]);

  // Get orb colors based on evolution stage and phase
  const getOrbColors = () => {
    const stage = EVOLUTION_STAGES[currentStage];
    
    switch (stage?.className) {
      case 'stage-novice':
        return currentPhase === 'inhale' || currentPhase === 'hold1'
          ? 'from-blue-400 via-blue-500 to-blue-600'
          : 'from-blue-300 via-blue-400 to-blue-500';
          
      case 'stage-apprentice':
        return currentPhase === 'inhale' || currentPhase === 'hold1'
          ? 'from-purple-400 via-purple-500 to-blue-600'
          : 'from-purple-300 via-purple-400 to-blue-500';
          
      case 'stage-master':
        return currentPhase === 'inhale' || currentPhase === 'hold1'
          ? 'from-orange-400 via-red-500 to-pink-600'
          : 'from-orange-300 via-red-400 to-pink-500';
          
      case 'stage-enlightened':
        return currentPhase === 'inhale' || currentPhase === 'hold1'
          ? 'from-yellow-300 via-yellow-400 to-white'
          : 'from-yellow-200 via-yellow-300 to-yellow-100';
          
      default:
        return currentPhase === 'inhale' || currentPhase === 'hold1'
          ? 'from-blue-400 via-blue-500 to-blue-600'
          : 'from-blue-300 via-blue-400 to-blue-500';
    }
  };

  // Get phase instruction text
  const getPhaseText = () => {
    if (!isActive) return 'Start';
    
    switch (currentPhase) {
      case 'inhale':
        return 'Inhale';
      case 'hold1':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      case 'hold2':
        return 'Hold';
      default:
        return 'Breathe';
    }
  };

  const currentStageData = EVOLUTION_STAGES[currentStage];
  const progress = Math.min((sessionCount / currentStageData.sessionsRequired) * 100, 100);

  return (
    <div className="relative">
      {/* Evolution Message Overlay */}
      {showEvolutionMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 backdrop-blur-md border-2 border-yellow-400/80 text-yellow-100 px-8 py-4 rounded-2xl text-xl font-bold animate-pulse shadow-2xl">
            {evolutionMessage}
          </div>
        </div>
      )}

      {/* Stats Display */}
      <div className="flex justify-center gap-8 mb-6 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{heartRate}</div>
          <div className="text-gray-600">BPM</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">6.2</div>
          <div className="text-gray-600">HRV</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{breathCount}</div>
          <div className="text-gray-600">Breaths</div>
        </div>
      </div>

      {/* Evolution Level Display */}
      <div className="text-center mb-6">
        <div className="text-lg font-semibold text-yellow-600 mb-1">{currentStageData.name}</div>
        <div className="text-sm text-gray-600 mb-3">{currentStageData.description}</div>
        <div className="w-48 mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {sessionCount}/{currentStageData.sessionsRequired} sessions
        </div>
      </div>

      {/* Main Breathing Orb Container */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          {/* Outer glow rings for higher stages */}
          {currentStage >= 1 && (
            <>
              <div 
                className="absolute inset-0 rounded-full opacity-20 blur-sm animate-pulse"
                style={{
                  background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                  transform: `scale(${scale * 1.4})`,
                }}
              />
              <div 
                className="absolute inset-0 rounded-full opacity-15 blur-md animate-pulse"
                style={{
                  background: 'linear-gradient(45deg, #a78bfa, #60a5fa)',
                  transform: `scale(${scale * 1.6})`,
                  animationDelay: '2s'
                }}
              />
            </>
          )}

          {/* Crown for Master+ stages */}
          {currentStage >= 2 && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-80">
              <div className="flex items-end justify-center space-x-1">
                {[15, 20, 25, 20, 15].map((height, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-yellow-400 to-transparent"
                    style={{
                      width: '2px',
                      height: `${height}px`,
                      transform: `rotate(${(index - 2) * 15}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Wings for Enlightened stage */}
          {currentStage >= 3 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute -left-16 top-8 w-16 h-24 bg-gradient-to-br from-white/10 to-blue-200/20 rounded-full border border-white/10 animate-pulse" 
                   style={{ transform: 'rotate(-20deg)' }} />
              <div className="absolute -right-16 top-8 w-16 h-24 bg-gradient-to-br from-white/10 to-blue-200/20 rounded-full border border-white/10 animate-pulse" 
                   style={{ transform: 'rotate(20deg) scaleX(-1)' }} />
            </div>
          )}

          {/* Orbital particles for higher stages */}
          {currentStage >= 1 && isActive && (
            <div className="absolute inset-0 pointer-events-none">
              {[0, 60, 120, 180, 240, 300].map((angle, index) => (
                <div
                  key={index}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-spin"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${angle}deg) translateX(80px) rotate(-${angle}deg)`,
                    animationDuration: `${8 + index * 2}s`,
                    animationDelay: `${index * 1.3}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Progress Ring */}
          <svg 
            className="absolute inset-0 w-48 h-48 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="3"
              className={
                currentPhase === 'inhale' || currentPhase === 'hold1' 
                  ? 'stroke-blue-400' 
                  : 'stroke-red-400'
              }
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - phaseProgress)}`}
              style={{
                transition: currentPhase.includes('hold') ? 'none' : 'stroke-dashoffset 0.1s ease-out'
              }}
            />
          </svg>

          {/* Main Orb */}
          <div 
            className={`w-48 h-48 rounded-full bg-gradient-to-br ${getOrbColors()} 
                       shadow-2xl flex items-center justify-center transition-all duration-200 ease-out
                       border-4 border-white/20 relative overflow-hidden`}
            style={{
              transform: `scale(${scale}) rotateY(${isActive ? '10deg' : '0deg'})`,
              boxShadow: `0 0 ${scale * 60}px ${getOrbColors().includes('yellow') ? 'rgba(255, 215, 0, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`
            }}
          >
            {/* Inner sphere effect */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
            
            {/* Breathing text */}
            <div className="text-white text-center z-10">
              <div className="text-lg font-semibold mb-1">
                {getPhaseText()}
              </div>
              {isActive && pattern.inhale > 0 && (
                <div className="text-sm opacity-80">
                  {Math.ceil((1 - phaseProgress) * (
                    currentPhase === 'inhale' ? pattern.inhale :
                    currentPhase === 'hold1' ? (pattern.hold1 || 0) :
                    currentPhase === 'exhale' ? pattern.exhale :
                    (pattern.hold2 || 0)
                  ))}s
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pattern Info */}
        {pattern.inhale > 0 && (
          <div className="text-center">
            <h4 className="font-medium text-gray-800 mb-2">{pattern.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span className="text-blue-600">In: {pattern.inhale}s</span>
              {pattern.hold1 && <span className="text-blue-700">Hold: {pattern.hold1}s</span>}
              <span className="text-red-600">Out: {pattern.exhale}s</span>
              {pattern.hold2 && <span className="text-red-700">Hold: {pattern.hold2}s</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};