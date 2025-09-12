"use client";

import React, { useState, useEffect } from 'react';
import { MeditationRecommendation, RecommendationContext, UserMeditationProfile } from '@/types/ai';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface RecommendationsProps {
  onSelectRecommendation: (recommendation: MeditationRecommendation) => void;
  sessionStats?: {
    streak: number;
    totalSessions: number;
    totalMinutes: number;
    lastSession: string | null;
  };
}

export const MeditationRecommendations: React.FC<RecommendationsProps> = ({ 
  onSelectRecommendation,
  sessionStats 
}) => {
  const [recommendations, setRecommendations] = useState<MeditationRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  const getStaticRecommendations = (): MeditationRecommendation[] => {
    const timeOfDay = getTimeOfDay();
    
    if (timeOfDay === 'morning') {
      return [{
        id: 'morning_default',
        title: 'Morning Mindfulness',
        description: 'Start your day with intention and clarity',
        duration: 10,
        style: 'mindfulness',
        confidence: 0.8,
        reasoning: 'A gentle way to begin your day',
        tags: ['morning', 'mindfulness'],
        timeOfDay: 'morning',
        personalizedFor: {
          mood: 'neutral',
          energyLevel: 'medium',
          stressLevel: 'low',
          experience: 'beginner'
        }
      }];
    } else if (timeOfDay === 'evening') {
      return [{
        id: 'evening_default',
        title: 'Evening Wind Down',
        description: 'Release the day and prepare for rest',
        duration: 15,
        style: 'breathing',
        confidence: 0.8,
        reasoning: 'Perfect for evening relaxation',
        tags: ['evening', 'relaxation'],
        timeOfDay: 'evening',
        personalizedFor: {
          mood: 'tired',
          energyLevel: 'low',
          stressLevel: 'medium',
          experience: 'beginner'
        }
      }];
    }
    
    return [{
      id: 'general_default',
      title: 'Stress Relief Breathing',
      description: 'Calm your mind with focused breathing',
      duration: 12,
      style: 'breathing',
      confidence: 0.7,
      reasoning: 'A reliable practice for any time of day',
      tags: ['stress-relief', 'breathing'],
      personalizedFor: {
        mood: 'neutral',
        energyLevel: 'medium',
        stressLevel: 'medium',
        experience: 'beginner'
      }
    }];
  };

  useEffect(() => {
    // For now, just use static recommendations to ensure component renders
    setRecommendations(getStaticRecommendations());
    setLoading(false);
  }, []);

  const getGreeting = () => {
    const timeOfDay = getTimeOfDay();
    const greetings = {
      morning: '🌅 Good morning! Here are your personalized recommendations:',
      afternoon: '☀️ Good afternoon! Perfect time for a mindful break:',
      evening: '🌆 Good evening! Wind down with these recommendations:',
      night: '🌙 Good night! Prepare for rest with these calming practices:'
    };
    return greetings[timeOfDay];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recommended for You</h2>
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm"
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">{getGreeting()}</p>
      
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectRecommendation(rec)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{rec.title}</h3>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {rec.duration} min
                </span>
                <span className={`text-xs ${getConfidenceColor(rec.confidence)}`}>
                  {Math.round(rec.confidence * 100)}% match
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1">
                {rec.tags.slice(0, 3).map(tag => (
                  <span 
                    key={tag} 
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                Start Session
              </button>
            </div>
            
            {rec.reasoning && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  💡 <strong>Why this?</strong> {rec.reasoning}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm">
          ✨ Get more recommendations
        </button>
      </div>
    </div>
  );
};