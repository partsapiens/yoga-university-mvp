"use client";

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateMeditationScript } from '@/lib/api/ai';
import { MeditationInput, MeditationScript, MeditationRecommendation } from '@/types/ai';
import { MoodInput } from '@/components/meditation/MoodInput';
import { GuidedMeditationPlayer } from '@/components/meditation/GuidedMeditationPlayer';
import { BreathingOrb } from '@/components/meditation/BreathingOrb';
import { EvolvingBreathingOrb } from '@/components/meditation/EvolvingBreathingOrb';
import { MeditationRecommendations } from '@/components/meditation/MeditationRecommendations';
import { PersonalizedAffirmations } from '@/components/ai/PersonalizedAffirmations';

// Types for meditation features
interface MeditationSession {
  id: string;
  name: string;
  duration: number; // in minutes
  type: 'guided' | 'timer' | 'breathing';
  description: string;
}

interface SessionStats {
  streak: number;
  lastSession: string | null;
  totalSessions: number;
  totalMinutes: number;
  favoriteStyle?: string;
  averageRating?: number;
}

// Sample meditation techniques
const MEDITATION_TECHNIQUES: MeditationSession[] = [
  {
    id: 'mindfulness-5',
    name: 'Mindfulness Meditation',
    duration: 5,
    type: 'guided',
    description: 'A gentle introduction to mindfulness practice with breath awareness.'
  },
  {
    id: 'breathing-box',
    name: 'Box Breathing',
    duration: 10,
    type: 'breathing',
    description: 'Systematic 4-4-4-4 breathing pattern for stress relief and focus.'
  },
  {
    id: 'body-scan',
    name: 'Body Scan Meditation',
    duration: 15,
    type: 'guided',
    description: 'Progressive relaxation through mindful body awareness.'
  },
  {
    id: 'loving-kindness',
    name: 'Loving Kindness',
    duration: 12,
    type: 'guided',
    description: 'Cultivate compassion and positive emotions toward self and others.'
  }
];

export default function MeditationPage() {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [customDuration, setCustomDuration] = useState(10);
  
  // AI-guided meditation state
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<MeditationScript | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  
  // State for affirmations
  const [selectedAffirmation, setSelectedAffirmation] = useState<any>(null);
  const [userProfile, setUserProfile] = useState({
    experience: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    preferredTone: 'gentle' as 'gentle' | 'empowering' | 'calming' | 'energizing',
    goals: ['stress relief', 'better sleep'],
    challenges: []
  });

  // Local storage for session tracking
  const [sessionStats, setSessionStats] = useLocalStorage<SessionStats>('meditation_stats', {
    streak: 0,
    lastSession: null,
    totalSessions: 0,
    totalMinutes: 0,
    favoriteStyle: undefined,
    averageRating: undefined
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsPlaying(false);
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isPlaying && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeRemaining]);

  const handleSessionComplete = () => {
    const today = new Date().toDateString();
    const lastSessionDate = sessionStats.lastSession;
    
    // Calculate streak
    let newStreak = sessionStats.streak;
    if (lastSessionDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastSessionDate === yesterday.toDateString()) {
        newStreak += 1; // Continue streak
      } else if (lastSessionDate !== today) {
        newStreak = 1; // Start new streak
      }
    } else {
      newStreak = 1; // First session
    }
    
    const sessionDuration = selectedSession?.duration || Math.floor((generatedScript?.totalDuration || 0) / 60);
    
    setSessionStats({
      streak: newStreak,
      lastSession: today,
      totalSessions: sessionStats.totalSessions + 1,
      totalMinutes: sessionStats.totalMinutes + sessionDuration,
      favoriteStyle: sessionStats.favoriteStyle,
      averageRating: sessionStats.averageRating
    });
  };

  const startSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration * 60);
    setIsPlaying(true);
  };

  const handleAIGenerate = async (input: MeditationInput) => {
    setIsGenerating(true);
    try {
      const script = await generateMeditationScript(input);
      setGeneratedScript(script);
      setShowMoodInput(false);
      setShowPlayer(true);
    } catch (error) {
      console.error('Failed to generate meditation script:', error);
      // TODO: Show error message to user
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayerComplete = () => {
    setShowPlayer(false);
    setGeneratedScript(null);
    handleSessionComplete();
  };

  const handlePlayerExit = () => {
    setShowPlayer(false);
    setGeneratedScript(null);
    setSelectedSession(null);
  };

  const handleRecommendationSelect = (recommendation: MeditationRecommendation) => {
    // Convert recommendation to a meditation input for AI generation
    const meditationInput: MeditationInput = {
      mood: recommendation.personalizedFor?.mood || 'neutral',
      goal: recommendation.description,
      duration: recommendation.duration,
      experience: recommendation.personalizedFor?.experience || 'beginner',
      style: recommendation.style as any,
      timeOfDay: recommendation.timeOfDay || getTimeOfDay()
    };
    
    handleAIGenerate(meditationInput);
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  const startCustomTimer = () => {
    const customSession: MeditationSession = {
      id: 'custom-timer',
      name: 'Custom Timer',
      duration: customDuration,
      type: 'timer',
      description: 'Personal meditation timer'
    };
    startSession(customSession);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetTimer = () => {
    setIsPlaying(false);
    setTimeRemaining(selectedSession?.duration ? selectedSession.duration * 60 : 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeForSpeech = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs} seconds`;
    } else if (secs === 0) {
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    } else {
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'} and ${secs} seconds`;
    }
  };

  // Show AI meditation player if generated
  if (showPlayer && generatedScript) {
    return (
      <GuidedMeditationPlayer
        script={generatedScript}
        onComplete={handlePlayerComplete}
        onExit={handlePlayerExit}
      />
    );
  }

  // Show mood input for AI-guided meditation
  if (showMoodInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <button
              onClick={() => setShowMoodInput(false)}
              className="text-gray-600 hover:text-gray-800 mb-4"
            >
              ← Back to Meditation Center
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Guided Meditation</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tell me how you're feeling, and I'll create a personalized meditation just for you.
            </p>
          </div>
          
          <MoodInput onGenerate={handleAIGenerate} isGenerating={isGenerating} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meditation Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find inner peace and enhance your yoga practice with guided meditations and breathing exercises.
          </p>
        </div>

        {/* Session Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{sessionStats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sessionStats.totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sessionStats.totalMinutes}</div>
              <div className="text-sm text-gray-600">Minutes Practiced</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm font-medium text-gray-800">
              {sessionStats.lastSession ? `Last session: ${sessionStats.lastSession}` : 'Ready for your first session!'}
            </div>
          </div>
        </div>

        {/* AI-Powered Recommendations Section */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
            <p className="text-sm text-gray-600 mb-6">☀️ Good afternoon! Perfect time for a mindful break:</p>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">Stress Relief Breathing</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">12 min</span>
                    <span className="text-xs text-yellow-600">70% match</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">Calm your mind with focused breathing</p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">stress-relief</span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">breathing</span>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                    Start Session
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    💡 <strong>Why this?</strong> A reliable practice for any time of day
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm">✨ Get more recommendations</button>
            </div>
          </div>
        </div>

        {/* Personalized Affirmations Section */}
        <PersonalizedAffirmations
          context="meditation"
          userProfile={userProfile}
          sessionData={{
            mood: 'calm',
            timeOfDay: getTimeOfDay(),
            focusArea: 'mindfulness',
            duration: customDuration
          }}
          onAffirmationSelect={setSelectedAffirmation}
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meditation Techniques List */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Guided Sessions</h2>
            <div className="space-y-4">
              {MEDITATION_TECHNIQUES.map((session) => (
                <div
                  key={session.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => startSession(session)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{session.name}</h3>
                    <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">
                      {session.duration} min
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 capitalize">{session.type}</span>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                      Start Session
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Timer */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Custom Timer</h3>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(parseInt(e.target.value) || 10)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-20 text-center"
                />
                <span className="text-gray-600">minutes</span>
                <button
                  onClick={startCustomTimer}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Start Timer
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Breathing Meditation Visualizer */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg min-h-[600px]">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {selectedSession ? selectedSession.name : 'Breathing Meditation'}
            </h2>
            
            {selectedSession ? (
              <div className="text-center">
                {/* Timer Display */}
                <div className="mb-6">
                  <div className="text-4xl font-mono font-bold text-purple-600 mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {selectedSession.duration} minute session
                  </div>
                </div>

                {/* Enhanced Breathing Visualizer */}
                <div className="mb-6">
                  <EvolvingBreathingOrb
                    isActive={isPlaying}
                    sessionCount={sessionStats.totalSessions}
                    pattern={
                      selectedSession.type === 'breathing' ? {
                        name: 'Box Breathing',
                        inhale: 4,
                        hold1: 4,
                        exhale: 4,
                        hold2: 4,
                        description: '4-4-4-4 pattern for stress relief and focus'
                      } : {
                        name: 'Natural Breathing',
                        inhale: 4,
                        exhale: 4,
                        description: 'Natural breathing rhythm'
                      }
                    }
                    onBreathCycle={(phase) => {
                      // Optional: Add breath cycle callbacks for additional features
                    }}
                    onEvolution={(stage) => {
                      // Optional: Handle evolution events
                      console.log('Evolved to:', stage.name);
                    }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={togglePlayPause}
                    className={`px-6 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
                      isPlaying 
                        ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' 
                        : 'bg-green-500 hover:bg-green-600 shadow-green-200'
                    } shadow-lg`}
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    ⏹ Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {/* Default Breathing Meditation when no session selected */}
                <div className="mb-6">
                  <EvolvingBreathingOrb
                    isActive={false}
                    sessionCount={sessionStats.totalSessions}
                    pattern={{
                      name: 'Natural Breathing',
                      inhale: 4,
                      exhale: 4,
                      description: 'Start with natural breathing rhythm'
                    }}
                  />
                </div>
                <div className="text-gray-500 space-y-2">
                  <p className="text-lg font-medium">Ready to Begin Your Journey</p>
                  <p className="text-sm">
                    Select a session from the left to start your breathing meditation practice
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <strong>🌟 Evolution System:</strong> Complete sessions to unlock new breathing orb stages and features!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Audio-guided meditation tracks
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Progress visualization and insights
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">○</span>
                Meditation challenges and programs
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">○</span>
                Community meditation sessions
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">○</span>
                Integration with practice journal
              </li>
            </ul>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Meditation Benefits</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">🧠</span>
                <div>
                  <strong>Mental Clarity:</strong> Improve focus and decision-making
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">❤️</span>
                <div>
                  <strong>Stress Relief:</strong> Reduce anxiety and promote relaxation
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">😴</span>
                <div>
                  <strong>Better Sleep:</strong> Improve sleep quality and rest
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⚡</span>
                <div>
                  <strong>Emotional Balance:</strong> Develop resilience and calm
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}