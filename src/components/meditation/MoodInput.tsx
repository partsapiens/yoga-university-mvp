"use client";

import React, { useState, useRef } from 'react';
import { MeditationInput, AISelectInput, AISelectOutput } from '@/types/ai';

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface MoodInputProps {
  onGenerate: (input: MeditationInput) => void;
  isGenerating?: boolean;
}

interface EnhancedMoodInputProps {
  onGenerateEnhanced?: (recommendation: AISelectOutput) => void;
  isGenerating?: boolean;
}

export const MoodInput: React.FC<MoodInputProps> = ({ onGenerate, isGenerating = false }) => {
  const [formData, setFormData] = useState({
    mood: '',
    goal: '',
    duration: 10,
    experience: 'beginner' as const,
    style: 'mindfulness' as const,
    timeOfDay: 'afternoon' as const
  });

  const [customGoal, setCustomGoal] = useState('');
  const [showCustomGoal, setShowCustomGoal] = useState(false);

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Enhanced mode toggle
  const [useEnhancedMode, setUseEnhancedMode] = useState(true);
  const [conversationalInput, setConversationalInput] = useState('');

  const commonMoods = [
    { value: 'stressed', label: 'Stressed', emoji: '😤' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' },
    { value: 'tired', label: 'Tired', emoji: '😴' },
    { value: 'overwhelmed', label: 'Overwhelmed', emoji: '🤯' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'energetic', label: 'Energetic', emoji: '⚡' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' }
  ];

  const commonGoals = [
    "I can't sleep",
    "Need to focus",
    "Feeling stressed",
    "Want to relax", 
    "Need energy",
    "Feeling anxious",
    "Want inner peace",
    "Need clarity"
  ];

  const meditationStyles = [
    { value: 'mindfulness', label: 'Mindfulness', description: 'Present moment awareness' },
    { value: 'breathing', label: 'Breathing', description: 'Focused breathing patterns' },
    { value: 'body-scan', label: 'Body Scan', description: 'Progressive body awareness' },
    { value: 'loving-kindness', label: 'Loving-Kindness', description: 'Compassion practice' },
    { value: 'sleep', label: 'Sleep', description: 'Prepare for rest' },
    { value: 'focus', label: 'Focus', description: 'Concentration training' }
  ];

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  // Initialize voice recognition
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const result = event.results[0][0].transcript;
          setTranscript(result);
          setConversationalInput(result);
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Enhanced ✨-powered submission with sentiment analysis
  const handleEnhancedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!conversationalInput && !formData.mood) return;

    try {
      // Use our new sentiment analysis service
      const { analyzeSentiment } = await import('@/lib/services/sentimentAnalysis');
      const { MoodTrackingService } = await import('@/lib/services/moodTracking');
      
      const userText = conversationalInput || `I'm feeling ${formData.mood} and ${showCustomGoal ? customGoal : formData.goal}`;
      
      // Analyze sentiment and extract mood/style recommendations
      const sentimentResult = await analyzeSentiment(userText, 'meditation request');
      
      // Save mood data for tracking
      const moodTracker = MoodTrackingService.getInstance();
      moodTracker.saveMoodEntry(sentimentResult, userText);
      
      // Create enhanced meditation input
      const meditationInput: MeditationInput = {
        mood: sentimentResult.mood,
        goal: conversationalInput || (showCustomGoal ? customGoal : formData.goal),
        duration: formData.duration,
        experience: formData.experience,
        style: sentimentResult.suggestedStyle as any,
        timeOfDay: getTimeOfDay(),
        pastSessions: 0,
        currentStreak: 0
      };

      // Show brief sentiment feedback to user (optional)
      if (sentimentResult.confidence > 0.7) {
        console.log(`Detected mood: ${sentimentResult.mood} (${Math.round(sentimentResult.confidence * 100)}% confidence)`);
      }

      onGenerate(meditationInput);
    } catch (error) {
      console.error('Enhanced sentiment analysis failed, falling back to simple mode:', error);
      // Fallback to regular processing
      const meditationInput: MeditationInput = {
        mood: formData.mood || 'neutral',
        goal: conversationalInput || (showCustomGoal ? customGoal : formData.goal),
        duration: formData.duration,
        experience: formData.experience,
        style: formData.style,
        timeOfDay: getTimeOfDay(),
        pastSessions: 0,
        currentStreak: 0
      };
      onGenerate(meditationInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalGoal = showCustomGoal ? customGoal : formData.goal;
    if (!formData.mood || !finalGoal) return;

    const input: MeditationInput = {
      ...formData,
      goal: finalGoal,
      timeOfDay: getTimeOfDay(),
      pastSessions: 0, // TODO: Get from user data
      currentStreak: 0  // TODO: Get from user data
    };

    onGenerate(input);
  };

  // Enhanced conversational processing
  const handleConversationalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationalInput.trim()) return;

    try {
      // Use sentiment analysis to extract mood and generate recommendations
      const { analyzeSentiment } = await import('@/lib/services/sentimentAnalysis');
      const sentimentResult = await analyzeSentiment(conversationalInput, 'meditation request');
      
      // Create MeditationInput from sentiment analysis
      const input: MeditationInput = {
        mood: sentimentResult.mood,
        goal: conversationalInput,
        duration: formData.duration,
        experience: formData.experience,
        style: sentimentResult.suggestedStyle as any,
        timeOfDay: getTimeOfDay(),
        pastSessions: 0,
        currentStreak: 0
      };

      onGenerate(input);
    } catch (error) {
      console.error('Failed to process conversational input:', error);
      // Fallback to regular processing
      const input: MeditationInput = {
        mood: 'neutral',
        goal: conversationalInput,
        duration: formData.duration,
        experience: formData.experience,
        style: 'mindfulness',
        timeOfDay: getTimeOfDay(),
        pastSessions: 0,
        currentStreak: 0
      };
      onGenerate(input);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
      {/* Time-aware greeting */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {getTimeOfDay() === 'morning' && '🌅 Good morning! How are you feeling?'}
          {getTimeOfDay() === 'afternoon' && '☀️ Good afternoon! What do you need right now?'}
          {getTimeOfDay() === 'evening' && '🌆 Good evening! How can we help you unwind?'}
          {getTimeOfDay() === 'night' && '🌙 Ready to wind down? Tell me how you&apos;re feeling.'}
        </h3>
        
        {/* Enhanced mode toggle */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-sm text-gray-600">Simple mode</span>
          <button
            type="button"
            onClick={() => setUseEnhancedMode(!useEnhancedMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useEnhancedMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useEnhancedMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-gray-600">✨ AI mode</span>
        </div>
      </div>
      
      <form onSubmit={useEnhancedMode ? handleEnhancedSubmit : handleSubmit} className="space-y-6">
        {/* Enhanced conversational input */}
        {useEnhancedMode && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Tell me how you&apos;re feeling and what you need
            </label>
            <div className="relative">
              <textarea
                value={conversationalInput}
                onChange={(e) => setConversationalInput(e.target.value)}
                placeholder="I'm feeling stressed after a long day and need to relax..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 min-h-[100px]"
                rows={3}
              />
              
              {/* Voice input button */}
              {recognitionRef.current && (
                <button
                  type="button"
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  title={isListening ? 'Stop voice input' : 'Start voice input'}
                >
                  {isListening ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a2 2 0 114 0v4a2 2 0 11-4 0V7z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              )}
            </div>
            {isListening && (
              <p className="text-sm text-blue-600 animate-pulse">🎤 Listening... speak naturally about how you&apos;re feeling</p>
            )}
            {transcript && (
              <p className="text-sm text-green-600">✓ Captured: &quot;{transcript}&quot;</p>
            )}
          </div>
        )}

        {/* Fallback to simple mode when enhanced is off or as backup */}
        {(!useEnhancedMode || !conversationalInput) && (
          <>
            {/* Mood Selection with enhanced emoji interface */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How are you feeling right now?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {commonMoods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood: mood.value })}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      formData.mood === mood.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:scale-102'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Show remaining form fields when not in enhanced mode or as additional options */}
        {!useEnhancedMode && (
          <>
            {/* Goal/Need */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What do you need right now?
              </label>
              {!showCustomGoal ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {commonGoals.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setFormData({ ...formData, goal })}
                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                          formData.goal === goal
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCustomGoal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Or describe in your own words...
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="Describe what you need right now..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomGoal(false)}
                    className="text-sm text-gray-600 hover:text-gray-700 underline"
                  >
                    Choose from common options instead
                  </button>
                </div>
              )}
            </div>

            {/* Meditation Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Meditation Style
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {meditationStyles.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, style: style.value as any })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.style === style.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-800">{style.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Duration and Experience - always show for fine-tuning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={3}>3 minutes</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={20}>20 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={
            useEnhancedMode 
              ? (!conversationalInput && !formData.mood) || isGenerating
              : (!formData.mood || (!formData.goal && !customGoal) || isGenerating)
          }
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {useEnhancedMode ? 'AI is creating your perfect meditation...' : 'Generating your personalized meditation...'}
            </span>
          ) : (
            <>
              {useEnhancedMode ? '✨ Create My Perfect Meditation' : '✨ Generate My Meditation'}
            </>
          )}
        </button>
        
        {/* Enhanced mode benefits */}
        {useEnhancedMode && (
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>✨ AI will analyze your words and create a personalized experience</p>
            <p>🎯 Automatically selects optimal style, duration, and breathing pattern</p>
          </div>
        )}
      </form>
    </div>
  );
};