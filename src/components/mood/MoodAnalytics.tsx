"use client";

import React, { useState, useEffect } from 'react';
import { MoodTrackingService, MoodAnalytics } from '@/lib/services/moodTracking';

interface MoodAnalyticsProps {
  className?: string;
}

export const MoodAnalyticsComponent: React.FC<MoodAnalyticsProps> = ({ className = '' }) => {
  const [analytics, setAnalytics] = useState<MoodAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const moodTracker = MoodTrackingService.getInstance();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = moodTracker.getMoodAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load mood analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalEntries === 0) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Mood Insights</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🌱</div>
          <p className="text-gray-600 mb-4">Start tracking your mood to see personalized insights</p>
          <p className="text-sm text-gray-500">
            Regular mood tracking helps us provide better recommendations for your practice
          </p>
        </div>
      </div>
    );
  }

  const getMoodEmoji = (mood: string): string => {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      stressed: '😤',
      anxious: '😰',
      tired: '😴',
      energetic: '⚡',
      calm: '😌',
      focused: '🎯',
      overwhelmed: '🤯',
      neutral: '😐'
    };
    return emojiMap[mood] || '😐';
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  const getTopMoods = () => {
    return Object.entries(analytics.moodDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / analytics.totalEntries) * 100)
      }));
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">📊 Mood Insights</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{analytics.totalEntries}</div>
          <div className="text-sm text-gray-600">Total Entries</div>
        </div>
        <div className="text-center">
          <div className="text-2xl">
            {getMoodEmoji(analytics.dominantMood)}
          </div>
          <div className="text-sm text-gray-600 capitalize">{analytics.dominantMood}</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl ${getTrendColor(analytics.weeklyTrend)}`}>
            {getTrendIcon(analytics.weeklyTrend)}
          </div>
          <div className="text-sm text-gray-600 capitalize">{analytics.weeklyTrend}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(analytics.sessionCompletionRate * 100)}%
          </div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>

      {/* Top Moods */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Most Common Moods</h4>
        <div className="space-y-2">
          {getTopMoods().map(({ mood, count, percentage }) => (
            <div key={mood} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getMoodEmoji(mood)}</span>
                <span className="text-sm font-medium text-gray-700 capitalize">{mood}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Personalized Insights</h4>
        <div className="space-y-2">
          {analytics.recommendations.slice(0, 3).map((rec, index) => (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r">
              <p className="text-sm text-blue-800">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-700 mb-3">Detailed Analytics</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confidence Average
              </label>
              <div className="flex items-center space-x-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${analytics.confidenceAverage * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">
                  {Math.round(analytics.confidenceAverage * 100)}%
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Weekly Trend
              </label>
              <div className={`text-sm font-medium ${getTrendColor(analytics.weeklyTrend)}`}>
                {getTrendIcon(analytics.weeklyTrend)} {analytics.weeklyTrend}
              </div>
            </div>
          </div>

          {/* All Moods Distribution */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Complete Mood Distribution
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(analytics.moodDistribution).map(([mood, count]) => (
                <div key={mood} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{getMoodEmoji(mood)}</span>
                    <span className="text-xs text-gray-600 capitalize">{mood}</span>
                  </div>
                  <span className="text-xs text-gray-500">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          🔒 Your mood data is stored locally on your device for privacy. 
          <br />
          You can clear this data anytime in your privacy settings.
        </p>
      </div>
    </div>
  );
};