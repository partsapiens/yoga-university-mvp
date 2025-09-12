"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  Lightbulb, 
  Award, 
  Calendar,
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import type { PracticeSession } from '@/types/dashboard';
import { ProgressInsights } from '@/lib/services/progressAnalytics';

// Circular Progress Component
const CircularProgress: React.FC<{ value: number; size?: number; strokeWidth?: number; color?: string }> = ({ 
  value, 
  size = 80, 
  strokeWidth = 8,
  color = "rgb(147, 51, 234)" // purple-600
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold" style={{ color }}>
          {Math.round(value)}
        </span>
      </div>
    </div>
  );
};

interface AIInsightsDashboardProps {
  sessions: PracticeSession[];
  className?: string;
}

export const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({ 
  sessions, 
  className = '' 
}) => {
  const [insights, setInsights] = useState<ProgressInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateInsights();
  }, [sessions]);

  const generateInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/ai/progress-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessions }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights');
      console.error('Error generating insights:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Progress Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !insights) {
    return (
      <Card className={`bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            AI Progress Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 dark:text-red-300 mb-4">
            {error || 'Unable to generate insights'}
          </p>
          <Button onClick={generateInsights} size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className={`bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-gray-600" />
            AI Progress Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No Practice Data Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Complete a few practice sessions to unlock ✨-powered insights and personalized recommendations.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/flows/create'}>
              Start Your First Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Progress Score Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Progress Insights
            <span className="ml-auto text-sm text-purple-600 bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded-full">
              ML Powered
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Progress Score */}
            <div className="text-center">
              <CircularProgress 
                value={insights.progressScore} 
                color="rgb(147, 51, 234)"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Overall Progress</p>
            </div>

            {/* Consistency Score */}
            <div className="text-center">
              <CircularProgress 
                value={insights.practicePattern.consistencyScore} 
                color="rgb(37, 99, 235)"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Consistency</p>
            </div>

            {/* Level Badge */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {insights.skillDevelopment.currentLevel}
              </p>
            </div>
          </div>

          {/* Improvement Trend */}
          <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
            {insights.practicePattern.improvementTrend === 'improving' && (
              <>
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  Your practice is improving!
                </span>
              </>
            )}
            {insights.practicePattern.improvementTrend === 'stable' && (
              <>
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Steady, consistent progress
                </span>
              </>
            )}
            {insights.practicePattern.improvementTrend === 'declining' && (
              <>
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-orange-700 dark:text-orange-300 font-medium">
                  Room for improvement
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimal Practice Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Optimal Practice Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {formatHour(insights.optimalTiming.recommendedHour)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {Math.round(insights.optimalTiming.confidence * 100)}% confidence
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {insights.optimalTiming.reasoning}
              </p>
            </div>

            {insights.optimalTiming.alternativeSlots.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Alternative times:</p>
                <div className="flex gap-2">
                  {insights.optimalTiming.alternativeSlots.map((slot, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                    >
                      {formatHour(slot.hour)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skill Development */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              Skill Development Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Focus Areas:</p>
                <div className="flex flex-wrap gap-1">
                  {insights.skillDevelopment.recommendedFocus.map((focus, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>

              {insights.skillDevelopment.nextMilestones.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Next Milestone:</p>
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      {insights.skillDevelopment.nextMilestones[0].skill}
                    </span>
                  </div>
                </div>
              )}

              {insights.skillDevelopment.strengthAreas.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Strengths:</p>
                  <div className="flex flex-wrap gap-1">
                    {insights.skillDevelopment.strengthAreas.map((strength, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Recommendations */}
      {insights.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.recommendations.slice(0, 3).map((rec, index) => (
                <div 
                  key={index}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {rec.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.impact === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}>
                        {rec.impact} impact
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {rec.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-3 h-3 text-blue-600" />
                    <span className="text-blue-700 dark:text-blue-300">
                      {rec.actionable}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{rec.timeframe}</span>
                    <span>{Math.round(rec.confidence * 100)}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Progress Forecast */}
      {insights.forecastedProgress.predictedMilestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Progress Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.forecastedProgress.weeklyGrowth !== 0 && (
                <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">
                    Weekly growth trend: {insights.forecastedProgress.weeklyGrowth > 0 ? '+' : ''}
                    {insights.forecastedProgress.weeklyGrowth.toFixed(1)} sessions/week
                  </span>
                </div>
              )}

              {insights.forecastedProgress.predictedMilestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{milestone.milestone}</span>
                    <div className="text-xs text-gray-500">
                      Estimated: {milestone.estimatedDate}
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

function formatHour(hour: number): string {
  if (hour === 0) return '12:00 AM';
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return '12:00 PM';
  return `${hour - 12}:00 PM`;
}