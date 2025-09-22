"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Users, 
  Clock, 
  Star,
  BarChart3,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import type { PlatformInsights } from '@/lib/services/analyticsIntelligence';

interface PlatformAnalyticsProps {
  className?: string;
}

export const PlatformAnalytics: React.FC<PlatformAnalyticsProps> = ({ className = '' }) => {
  const [insights, setInsights] = useState<PlatformInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchInsights();
  }, [timeframe]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics?type=insights&timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch platform insights');
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights');
      console.error('Error fetching platform insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return 'text-green-700 dark:text-green-300';
      case 'declining':
        return 'text-red-700 dark:text-red-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Card className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Loading Analytics
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
            Analytics Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 dark:text-red-300 mb-4">
            {error || 'Unable to load platform insights'}
          </p>
          <Button onClick={fetchInsights} size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with timeframe selector */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Analytics Overview
              <span className="ml-2 text-sm text-blue-600 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-full">
                AI Powered
              </span>
            </CardTitle>
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map(period => (
                <Button
                  key={period}
                  variant={timeframe === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeframe(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {insights.keyMetrics.totalSessions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Sessions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(insights.keyMetrics.avgSessionDuration)}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg Duration
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(insights.keyMetrics.contentEngagementRate * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Engagement Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(insights.keyMetrics.retentionRate * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Retention Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Content */}
        {insights.popularContent.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-600" />
                Popular Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.popularContent.slice(0, 5).map((content, index) => (
                  <div key={`${content.contentType}-${content.contentId}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {content.contentType}: {content.contentId}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          content.trendDirection === 'rising' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          content.trendDirection === 'declining' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                        }`}>
                          {content.trendDirection}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {content.userCount} users • {Math.round(content.averageTimeSpent / 60)}m avg • {Math.round(content.completionRate * 100)}% completion
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-600">
                        {content.engagementScore}
                      </div>
                      <div className="text-xs text-gray-500">
                        score
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Optimal Sessions */}
        {insights.optimalSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Session Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.optimalSessions.slice(0, 4).map((session, index) => (
                  <div key={session.sessionType} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm capitalize">
                        {session.sessionType}
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {session.recommendedDuration}m
                        </div>
                        <div className="text-xs text-gray-500">
                          optimal
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {session.reasoning}
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Completion: {Math.round(session.completionRate * 100)}%</span>
                      <span>Quality: {session.satisfactionScore.toFixed(1)}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Engagement Trends */}
      {insights.engagementTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-600" />
              Engagement Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.engagementTrends.map((trend, index) => (
                <div key={trend.metric} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">
                      {trend.metric.replace('_', ' ')}
                    </span>
                    {getTrendIcon(trend.trend)}
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {trend.currentValue}
                  </div>
                  <div className={`text-xs ${getTrendColor(trend.trend)}`}>
                    {trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage.toFixed(1)}% vs previous {trend.period}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Significance: {trend.significance}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
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
              {insights.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {rec.title}
                    </h4>
                    <div className="flex items-center gap-2">
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
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-green-700 dark:text-green-300">
                        Ready to implement
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {Math.round(rec.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};