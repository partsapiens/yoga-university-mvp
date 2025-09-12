"use client";

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import BreathingOrb from '@/components/meditation/BreathingOrb';
// import { useTTS } from '@/hooks/useTTS';
import { supabase } from '@/utils/supabaseClient';
import { Session } from '@supabase/supabase-js';

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
}

export default function MeditationPage() {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [customDuration, setCustomDuration] = useState(10);
  
  const [sessionStats, setSessionStats] = useLocalStorage<SessionStats>('meditation_stats', {
    streak: 0,
    lastSession: null,
    totalSessions: 0
  });

  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [phases, setPhases] = useState(null);

  // const { speak, cancel, pause, resume } = useTTS(generatedScript || '', {
  //   onEnd: () => {
  //     setIsPlaying(false);
  //     handleSessionComplete();
  //   },
  // });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsPlaying(false);
            // cancel(); // Stop TTS
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeRemaining]);

  const handleSessionComplete = async () => {
    const today = new Date().toDateString();
    setSessionStats(prevStats => ({
      streak: prevStats.lastSession === new Date(Date.now() - 86400000).toDateString() ? prevStats.streak + 1 : 1,
      lastSession: today,
      totalSessions: prevStats.totalSessions + 1,
    }));

    const { data: { user } } = await supabase.auth.getUser();

    if (user && selectedSession) {
      const { error } = await supabase.from('meditation_sessions').insert({
        user_id: user.id,
        duration_minutes: selectedSession.duration,
        mood_input: mood,
        generated_script: phases, // Store the structured JSON
      });

      if (error) {
        console.error('Error logging meditation session:', error);
      }
    }
  };

  const startSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration * 60);
    setIsPlaying(true);
    // The speak() call is now in a useEffect triggered by isPlaying and generatedScript
  };

  // useEffect(() => {
  //   if (isPlaying && generatedScript) {
  //     speak();
  //   }
  // }, [isPlaying, generatedScript, speak]);

  const handleGenerateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood || customDuration <= 0) return alert('Please describe your mood and set a valid duration.');

    setIsLoading(true);
    setGeneratedScript(null);
    setPhases(null);
    setSelectedSession(null);
    // cancel();

    try {
      const response = await fetch('/api/meditation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, duration: customDuration }),
      });

      if (!response.ok) throw new Error('Failed to generate script');

      const data = await response.json();
      setGeneratedScript(data.script);
      setPhases(data.phases);

      const aiSession: MeditationSession = {
        id: 'ai-generated',
        name: `Meditation for ${mood.substring(0, 20)}...`,
        duration: customDuration,
        type: 'guided',
        description: data.script,
      };
      startSession(aiSession);

    } catch (error) {
      console.error('Error generating session:', error);
      alert('There was an error generating your meditation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!selectedSession) return;
    if (isPlaying) {
      // pause();
      setIsPlaying(false);
    } else {
      // resume();
      setIsPlaying(true);
    }
  };

  const resetTimer = () => {
    if (!selectedSession) return;
    // cancel();
    setIsPlaying(false);
    setTimeRemaining(selectedSession.duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Meditation Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe your state of mind and let our AI create a personalized meditation session just for you.
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
              <div className="text-sm font-medium text-gray-800">
                {sessionStats.lastSession ? `Last: ${sessionStats.lastSession}` : 'No sessions yet'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Create Your Meditation</h2>
            <p className="text-gray-600 mb-6">
              Describe how you're feeling or what you want to focus on. The AI will generate a personalized meditation for you.
            </p>
            <form onSubmit={handleGenerateSession}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-1">
                    How are you feeling right now?
                  </label>
                  <textarea
                    id="mood"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder="e.g., 'I feel stressed about work' or 'I want to find some morning focus'"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    min="1"
                    max="60"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(parseInt(e.target.value) || 10)}
                    className="border border-gray-300 rounded-md px-3 py-2 w-24 text-center"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-3 rounded-md transition-colors disabled:bg-purple-300"
              >
                {isLoading ? 'Generating...' : 'Create My Meditation'}
              </button>
            </form>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6" data-testid="session-title">
              {selectedSession ? selectedSession.name : 'Your Session'}
            </h2>
            
            {isLoading && (
              <div className="text-center text-gray-500 py-16">
                <p className="text-lg mb-4">Generating your personalized meditation...</p>
              </div>
            )}

            {!isLoading && !selectedSession && (
              <div className="text-center text-gray-500 py-16">
                <p className="text-lg mb-4">Create your personalized meditation to begin</p>
                <p className="text-sm">Describe your mood and choose a duration to get started.</p>
              </div>
            )}

            {selectedSession && (
              <div className="text-center">
                <div className="mb-8">
                  <div className="text-6xl font-mono font-bold text-purple-600 mb-4">
                    {formatTime(timeRemaining)}
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                  <button
                    onClick={togglePlayPause}
                    disabled={!selectedSession}
                    className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                      isPlaying 
                        ? 'bg-orange-500 hover:bg-orange-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    } disabled:bg-gray-400`}
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={resetTimer}
                    disabled={!selectedSession}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
                  >
                    Reset
                  </button>
                </div>

                <div className="mb-8">
                  <BreathingOrb isPlaying={isPlaying} />
                </div>

                {generatedScript && (
                  <div className="text-left bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                     <p className="text-gray-700 whitespace-pre-wrap">{generatedScript}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Coming Soon</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Audio-guided meditation tracks</li>
            <li>• Progress visualization and insights</li>
            <li>• Meditation challenges and programs</li>
            <li>• Community meditation sessions</li>
            <li>• Integration with practice journal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}