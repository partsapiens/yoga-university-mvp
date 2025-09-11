"use client";

import React, { useState } from 'react';
import { MeditationInput } from '@/types/ai';

interface MoodInputProps {
  onGenerate: (input: MeditationInput) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Tell me how you're feeling
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
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
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="text-lg mb-1">{mood.emoji}</div>
                {mood.label}
              </button>
            ))}
          </div>
        </div>

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

        {/* Duration and Experience */}
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
          disabled={!formData.mood || (!formData.goal && !customGoal) || isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating your personalized meditation...
            </span>
          ) : (
            '✨ Generate My Meditation'
          )}
        </button>
      </form>
    </div>
  );
};