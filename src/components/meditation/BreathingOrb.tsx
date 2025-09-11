"use client";

import React, { useEffect, useState } from 'react';
import { BreathingPattern } from '@/types/ai';

interface BreathingOrbProps {
  isActive: boolean;
  pattern?: BreathingPattern;
  onBreathCycle?: (phase: 'inhale' | 'hold1' | 'exhale' | 'hold2') => void;
}

export const BreathingOrb: React.FC<BreathingOrbProps> = ({ 
  isActive, 
  pattern = { name: 'Natural', inhale: 4, exhale: 4, description: 'Natural breathing' },
  onBreathCycle 
}) => {
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [scale, setScale] = useState(1);
  const [phaseProgress, setPhaseProgress] = useState(0);

  // Calculate phase durations in milliseconds
  const phaseDurations = {
    inhale: pattern.inhale * 1000,
    hold1: (pattern.hold1 || 0) * 1000,
    exhale: pattern.exhale * 1000,
    hold2: (pattern.hold2 || 0) * 1000
  };

  // Total cycle duration
  const totalCycleDuration = Object.values(phaseDurations).reduce((sum, duration) => sum + duration, 0);

  useEffect(() => {
    if (!isActive || pattern.inhale === 0) return;

    let animationFrame: number;
    let startTime = Date.now();
    let currentCyclePhase: 'inhale' | 'hold1' | 'exhale' | 'hold2' = 'inhale';

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
        currentCyclePhase = newPhase;
        setCurrentPhase(newPhase);
        onBreathCycle?.(newPhase);
      }

      // Calculate progress within current phase
      const phaseElapsed = cyclePosition - phaseStart;
      const phaseDuration = phaseEnd - phaseStart;
      const progress = phaseDuration > 0 ? phaseElapsed / phaseDuration : 0;
      setPhaseProgress(Math.min(1, Math.max(0, progress)));

      // Calculate scale based on phase
      let targetScale = 1;
      if (newPhase === 'inhale') {
        targetScale = 1 + (progress * 0.6); // Scale from 1 to 1.6
      } else if (newPhase === 'hold1') {
        targetScale = 1.6; // Hold at expanded
      } else if (newPhase === 'exhale') {
        targetScale = 1.6 - (progress * 0.6); // Scale from 1.6 to 1
      } else {
        targetScale = 1; // Hold at contracted
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

  // Get orb color based on current phase
  const getOrbColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'from-blue-400 to-blue-600';
      case 'hold1':
        return 'from-blue-500 to-blue-700';
      case 'exhale':
        return 'from-red-400 to-red-600';
      case 'hold2':
        return 'from-red-300 to-red-500';
      default:
        return 'from-gray-300 to-gray-500';
    }
  };

  // Get phase instruction text
  const getPhaseText = () => {
    if (!isActive) return 'Press Play to Begin';
    
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold1':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold2':
        return 'Hold';
      default:
        return 'Breathe';
    }
  };

  // Get progress ring color
  const getProgressColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'stroke-blue-300';
      case 'hold1':
        return 'stroke-blue-400';
      case 'exhale':
        return 'stroke-red-300';
      case 'hold2':
        return 'stroke-red-400';
      default:
        return 'stroke-gray-300';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Breathing Orb */}
      <div className="relative">
        {/* Outer glow ring */}
        <div 
          className={`absolute inset-0 rounded-full opacity-30 blur-md transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}
          style={{
            background: currentPhase === 'inhale' || currentPhase === 'hold1' 
              ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)' 
              : 'linear-gradient(45deg, #ef4444, #dc2626)',
            transform: `scale(${scale * 1.2})`,
          }}
        />
        
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
            className={getProgressColor()}
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
          className={`w-48 h-48 rounded-full bg-gradient-to-br ${getOrbColor()} 
                     shadow-2xl flex items-center justify-center transition-all duration-200 ease-out
                     border-4 border-white/20`}
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {/* Inner breathing indicator */}
          <div className="text-white text-center">
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

      {/* Accessibility - Screen reader friendly phase announcements */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {isActive && `Current breathing phase: ${getPhaseText()}`}
      </div>
    </div>
  );
};