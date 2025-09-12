"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Clock, Target, Award } from 'lucide-react';
import { PoseAnalytics, PoseProgress, OverallProgress, formatDuration, getImprovementIcon, getAccuracyColor, getAccuracyLabel } from '@/lib/pose-analytics';

interface ProgressTrackingProps {
  className?: string;
}

export function ProgressTracking({ className = '' }: ProgressTrackingProps) {
  const [analytics] = useState(new PoseAnalytics());
  const [overallProgress, setOverallProgress] = useState<OverallProgress | null>(null);
  const [poseProgress, setPoseProgress] = useState<PoseProgress[]>([]);
  const [selectedPose, setSelectedPose] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    setIsLoading(true);
    try {
      const overall = analytics.getOverallProgress();
      const poses = analytics.getAllProgress();
      
      setOverallProgress(overall);
      setPoseProgress(poses);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all progress data? This action cannot be undone.')) {
      analytics.clearAllData();
      loadProgressData();
    }
  };

  const getTrendIcon = (trend: PoseProgress['improvementTrend']) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-yellow-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!overallProgress || overallProgress.totalSessions === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 text-center ${className}`}>
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Progress Data Yet</h3>
          <p className="text-sm">
            Start practicing with pose analysis to track your improvement over time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Practice Progress</h2>
        <button
          onClick={clearAllData}
          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Clear Data
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Sessions</span>
          </div>
          <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
            {overallProgress.totalSessions}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Total Time</span>
          </div>
          <div className="text-xl font-bold text-green-900 dark:text-green-100">
            {formatDuration(overallProgress.totalDuration)}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Avg Accuracy</span>
          </div>
          <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
            {overallProgress.averageAccuracy}%
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Most Practiced</span>
          </div>
          <div className="text-sm font-bold text-orange-900 dark:text-orange-100 truncate">
            {overallProgress.mostPracticedPose || 'None'}
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      {overallProgress.weeklyProgress.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Weekly Progress</h3>
          <div className="space-y-2">
            {overallProgress.weeklyProgress.map((week, index) => (
              <div key={week.week} className="flex items-center gap-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 w-20">
                  Week {index + 1}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(week.sessions * 10, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 w-16">
                  {week.sessions} sessions
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 w-12">
                  {week.averageAccuracy}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Pose Progress */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Pose Progress</h3>
        
        {poseProgress.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>No individual pose data available yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {poseProgress
              .sort((a, b) => b.totalSessions - a.totalSessions)
              .map((pose) => (
                <div
                  key={pose.poseName}
                  className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPose === pose.poseName
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedPose(selectedPose === pose.poseName ? null : pose.poseName)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {pose.poseName}
                        </h4>
                        {getTrendIcon(pose.improvementTrend)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getImprovementIcon(pose.improvementTrend)} {pose.improvementTrend.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                        <span>{pose.totalSessions} sessions</span>
                        <span>{formatDuration(pose.totalDuration)}</span>
                        <span className={getAccuracyColor(pose.averageAccuracy)}>
                          {pose.averageAccuracy}% avg
                        </span>
                        <span className={getAccuracyColor(pose.bestAccuracy)}>
                          {pose.bestAccuracy}% best
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last practiced
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(pose.lastPracticed).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedPose === pose.poseName && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">Recent Sessions</h5>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {pose.sessions
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .slice(0, 5)
                          .map((session) => (
                            <div
                              key={session.id}
                              className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded"
                            >
                              <div>
                                {new Date(session.timestamp).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <span>{formatDuration(session.duration)}</span>
                                <span className={getAccuracyColor(session.accuracy)}>
                                  {session.accuracy}%
                                </span>
                                <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                                  {getAccuracyLabel(session.accuracy)}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      {overallProgress.recentSessions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {overallProgress.recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {session.poseName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(session.timestamp).toLocaleDateString()} at{' '}
                    {new Date(session.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${getAccuracyColor(session.accuracy)}`}>
                    {session.accuracy}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDuration(session.duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}