/**
 * AI-powered analytics intelligence service
 * Analyzes aggregated, privacy-friendly analytics data to identify patterns
 * and provide insights while maintaining complete privacy compliance
 */

export interface ContentPopularityInsight {
  contentType: string;
  contentId: string;
  engagementScore: number;
  averageTimeSpent: number;
  completionRate: number;
  userCount: number;
  trendDirection: 'rising' | 'stable' | 'declining';
  confidence: number;
}

export interface OptimalSessionInsight {
  sessionType: string;
  recommendedDuration: number;
  completionRate: number;
  satisfactionScore: number;
  sampleSize: number;
  confidence: number;
  reasoning: string;
}

export interface EngagementTrend {
  period: string; // e.g., 'daily', 'weekly'
  metric: string;
  currentValue: number;
  previousValue: number;
  changePercentage: number;
  trend: 'improving' | 'stable' | 'declining';
  significance: 'high' | 'medium' | 'low';
}

export interface PlatformInsights {
  popularContent: ContentPopularityInsight[];
  optimalSessions: OptimalSessionInsight[];
  engagementTrends: EngagementTrend[];
  keyMetrics: {
    totalSessions: number;
    avgSessionDuration: number;
    contentEngagementRate: number;
    retentionRate: number;
  };
  recommendations: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    confidence: number;
  }[];
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
  url?: string;
  sessionId?: string;
}

export class AnalyticsIntelligenceService {
  private static instance: AnalyticsIntelligenceService;

  public static getInstance(): AnalyticsIntelligenceService {
    if (!AnalyticsIntelligenceService.instance) {
      AnalyticsIntelligenceService.instance = new AnalyticsIntelligenceService();
    }
    return AnalyticsIntelligenceService.instance;
  }

  /**
   * Analyze content popularity from aggregated analytics data
   */
  analyzeContentPopularity(events: AnalyticsEvent[]): ContentPopularityInsight[] {
    // Group events by content
    const contentMap = new Map<string, {
      engagements: number[];
      timeSpent: number[];
      completions: number[];
      userSessions: Set<string>;
    }>();

    events.forEach(event => {
      if (event.category === 'content' && event.label) {
        const [contentType, contentId] = event.label.split(':');
        const key = `${contentType}:${contentId}`;
        
        if (!contentMap.has(key)) {
          contentMap.set(key, {
            engagements: [],
            timeSpent: [],
            completions: [],
            userSessions: new Set()
          });
        }

        const data = contentMap.get(key)!;
        if (event.sessionId) {
          data.userSessions.add(event.sessionId);
        }

        if (event.action === 'content_engagement' && event.value) {
          data.timeSpent.push(event.value);
        } else if (event.action === 'content_completion' && event.value) {
          data.completions.push(event.value);
        }
      }
    });

    // Analyze each content item
    const insights: ContentPopularityInsight[] = [];

    contentMap.forEach((data, key) => {
      const [contentType, contentId] = key.split(':');
      
      if (data.userSessions.size < 3) return; // Need minimum sample size

      const avgTimeSpent = data.timeSpent.length > 0 
        ? data.timeSpent.reduce((sum, t) => sum + t, 0) / data.timeSpent.length 
        : 0;
      
      const avgCompletionRate = data.completions.length > 0
        ? data.completions.reduce((sum, c) => sum + c, 0) / data.completions.length / 100
        : 0;

      // Calculate engagement score (weighted combination of metrics)
      const engagementScore = this.calculateEngagementScore(
        avgTimeSpent,
        avgCompletionRate,
        data.userSessions.size
      );

      // Determine trend (simplified - in real implementation would compare with historical data)
      const trendDirection = this.determineTrend(data.timeSpent);

      insights.push({
        contentType,
        contentId,
        engagementScore,
        averageTimeSpent: avgTimeSpent,
        completionRate: avgCompletionRate,
        userCount: data.userSessions.size,
        trendDirection,
        confidence: Math.min(0.95, data.userSessions.size / 100) // Higher confidence with more users
      });
    });

    return insights.sort((a, b) => b.engagementScore - a.engagementScore);
  }

  /**
   * Analyze optimal session lengths from completion data
   */
  analyzeOptimalSessionLengths(events: AnalyticsEvent[]): OptimalSessionInsight[] {
    const sessionMap = new Map<string, {
      completionRates: number[];
      durations: number[];
      qualityScores: number[];
    }>();

    events.forEach(event => {
      if (event.category === 'optimization' || event.category === 'practice') {
        let sessionType = '';
        
        if (event.action === 'session_duration_analysis' && event.label) {
          sessionType = event.label;
        } else if (event.action === 'session_quality' && event.label) {
          sessionType = event.label;
        } else if (event.action === 'meditation_complete' && event.label) {
          sessionType = event.label;
        }

        if (!sessionType) return;

        if (!sessionMap.has(sessionType)) {
          sessionMap.set(sessionType, {
            completionRates: [],
            durations: [],
            qualityScores: []
          });
        }

        const data = sessionMap.get(sessionType)!;

        if (event.action === 'session_duration_analysis' && event.value) {
          data.completionRates.push(event.value);
        } else if (event.action === 'meditation_complete' && event.value) {
          data.durations.push(event.value);
        } else if (event.action === 'session_quality' && event.value) {
          data.qualityScores.push(event.value);
        }
      }
    });

    const insights: OptimalSessionInsight[] = [];

    sessionMap.forEach((data, sessionType) => {
      if (data.completionRates.length < 5) return; // Need minimum sample

      const avgCompletionRate = data.completionRates.reduce((sum, r) => sum + r, 0) / data.completionRates.length / 100;
      const avgDuration = data.durations.length > 0 
        ? data.durations.reduce((sum, d) => sum + d, 0) / data.durations.length 
        : this.getDefaultDuration(sessionType);
      
      const avgQuality = data.qualityScores.length > 0
        ? data.qualityScores.reduce((sum, q) => sum + q, 0) / data.qualityScores.length
        : 7; // Default quality score

      // Analyze optimal duration based on completion patterns
      const optimalDuration = this.findOptimalDuration(data.completionRates, avgDuration);

      insights.push({
        sessionType,
        recommendedDuration: optimalDuration,
        completionRate: avgCompletionRate,
        satisfactionScore: avgQuality,
        sampleSize: data.completionRates.length,
        confidence: Math.min(0.95, data.completionRates.length / 50),
        reasoning: this.generateOptimalDurationReasoning(avgCompletionRate, avgQuality, optimalDuration)
      });
    });

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Analyze engagement trends over time
   */
  analyzeEngagementTrends(events: AnalyticsEvent[]): EngagementTrend[] {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;

    // Analyze daily trends (last 7 days vs previous 7 days)
    const recentEvents = events.filter(e => e.timestamp > now - weekMs);
    const previousEvents = events.filter(e => e.timestamp > now - 2 * weekMs && e.timestamp <= now - weekMs);

    const trends: EngagementTrend[] = [];

    // Session frequency trend
    const recentSessions = recentEvents.filter(e => e.action === 'page_view' && e.url?.includes('/meditation')).length;
    const previousSessions = previousEvents.filter(e => e.action === 'page_view' && e.url?.includes('/meditation')).length;
    
    trends.push({
      period: 'weekly',
      metric: 'meditation_sessions',
      currentValue: recentSessions,
      previousValue: previousSessions,
      changePercentage: previousSessions > 0 ? ((recentSessions - previousSessions) / previousSessions) * 100 : 0,
      trend: this.classifyTrend(recentSessions, previousSessions),
      significance: this.calculateSignificance(recentSessions, previousSessions)
    });

    // Content engagement trend
    const recentEngagements = recentEvents.filter(e => e.action === 'content_engagement').length;
    const previousEngagements = previousEvents.filter(e => e.action === 'content_engagement').length;

    trends.push({
      period: 'weekly',
      metric: 'content_engagement',
      currentValue: recentEngagements,
      previousValue: previousEngagements,
      changePercentage: previousEngagements > 0 ? ((recentEngagements - previousEngagements) / previousEngagements) * 100 : 0,
      trend: this.classifyTrend(recentEngagements, previousEngagements),
      significance: this.calculateSignificance(recentEngagements, previousEngagements)
    });

    // Flow creation trend
    const recentFlows = recentEvents.filter(e => e.action === 'flow_created').length;
    const previousFlows = previousEvents.filter(e => e.action === 'flow_created').length;

    trends.push({
      period: 'weekly',
      metric: 'flow_creation',
      currentValue: recentFlows,
      previousValue: previousFlows,
      changePercentage: previousFlows > 0 ? ((recentFlows - previousFlows) / previousFlows) * 100 : 0,
      trend: this.classifyTrend(recentFlows, previousFlows),
      significance: this.calculateSignificance(recentFlows, previousFlows)
    });

    return trends;
  }

  /**
   * Generate comprehensive platform insights
   */
  async generatePlatformInsights(events: AnalyticsEvent[]): Promise<PlatformInsights> {
    const popularContent = this.analyzeContentPopularity(events);
    const optimalSessions = this.analyzeOptimalSessionLengths(events);
    const engagementTrends = this.analyzeEngagementTrends(events);

    // Calculate key metrics
    const keyMetrics = this.calculateKeyMetrics(events);

    // Generate AI recommendations
    const recommendations = this.generateRecommendations(popularContent, optimalSessions, engagementTrends);

    return {
      popularContent: popularContent.slice(0, 10), // Top 10
      optimalSessions,
      engagementTrends,
      keyMetrics,
      recommendations
    };
  }

  // Private helper methods

  private calculateEngagementScore(timeSpent: number, completionRate: number, userCount: number): number {
    // Normalize and weight different factors
    const timeScore = Math.min(timeSpent / 300, 1) * 40; // Max 5 minutes = full score
    const completionScore = completionRate * 40;
    const popularityScore = Math.min(userCount / 50, 1) * 20; // Max 50 users = full score

    return Math.round(timeScore + completionScore + popularityScore);
  }

  private determineTrend(timeData: number[]): 'rising' | 'stable' | 'declining' {
    if (timeData.length < 4) return 'stable';

    const midpoint = Math.floor(timeData.length / 2);
    const earlier = timeData.slice(0, midpoint);
    const later = timeData.slice(midpoint);

    const earlierAvg = earlier.reduce((sum, t) => sum + t, 0) / earlier.length;
    const laterAvg = later.reduce((sum, t) => sum + t, 0) / later.length;

    const change = (laterAvg - earlierAvg) / earlierAvg;

    if (change > 0.1) return 'rising';
    if (change < -0.1) return 'declining';
    return 'stable';
  }

  private getDefaultDuration(sessionType: string): number {
    const defaults: Record<string, number> = {
      'meditation': 15,
      'vinyasa': 45,
      'hatha': 60,
      'restorative': 30,
      'breathwork': 10
    };
    return defaults[sessionType] || 30;
  }

  private findOptimalDuration(completionRates: number[], avgDuration: number): number {
    // Simple heuristic: if completion rate is low, suggest shorter duration
    const avgCompletion = completionRates.reduce((sum, r) => sum + r, 0) / completionRates.length;
    
    if (avgCompletion < 70) {
      return Math.max(5, Math.round(avgDuration * 0.8));
    } else if (avgCompletion > 90) {
      return Math.round(avgDuration * 1.1);
    }
    return Math.round(avgDuration);
  }

  private generateOptimalDurationReasoning(completionRate: number, quality: number, duration: number): string {
    if (completionRate < 0.7) {
      return `Based on ${Math.round(completionRate * 100)}% completion rate, shorter sessions may improve engagement.`;
    } else if (completionRate > 0.9 && quality > 8) {
      return `High completion rate (${Math.round(completionRate * 100)}%) and quality suggest users are ready for longer sessions.`;
    }
    return `Current duration appears optimal based on completion patterns and user satisfaction.`;
  }

  private classifyTrend(current: number, previous: number): 'improving' | 'stable' | 'declining' {
    if (previous === 0) return current > 0 ? 'improving' : 'stable';
    
    const change = (current - previous) / previous;
    if (change > 0.1) return 'improving';
    if (change < -0.1) return 'declining';
    return 'stable';
  }

  private calculateSignificance(current: number, previous: number): 'high' | 'medium' | 'low' {
    const total = current + previous;
    if (total < 10) return 'low';
    if (total < 50) return 'medium';
    return 'high';
  }

  private calculateKeyMetrics(events: AnalyticsEvent[]) {
    const sessionEvents = events.filter(e => e.action === 'meditation_complete' || e.action === 'flow_created');
    const engagementEvents = events.filter(e => e.action === 'content_engagement');
    
    const totalSessions = sessionEvents.length;
    const avgSessionDuration = sessionEvents.length > 0
      ? sessionEvents.reduce((sum, e) => sum + (e.value || 0), 0) / sessionEvents.length
      : 0;
    
    const uniqueSessions = new Set(events.map(e => e.sessionId).filter(Boolean)).size;
    const engagedSessions = new Set(engagementEvents.map(e => e.sessionId).filter(Boolean)).size;
    const contentEngagementRate = uniqueSessions > 0 ? engagedSessions / uniqueSessions : 0;

    // Simple retention approximation
    const retentionRate = 0.75; // Placeholder - would need more sophisticated calculation

    return {
      totalSessions,
      avgSessionDuration,
      contentEngagementRate,
      retentionRate
    };
  }

  private generateRecommendations(
    popularContent: ContentPopularityInsight[],
    optimalSessions: OptimalSessionInsight[],
    trends: EngagementTrend[]
  ) {
    const recommendations: { title: string; description: string; impact: 'high' | 'medium' | 'low'; confidence: number }[] = [];

    // Content recommendations
    if (popularContent.length > 0) {
      const topContent = popularContent[0];
      recommendations.push({
        title: `Promote ${topContent.contentType} Content`,
        description: `${topContent.contentType} content shows high engagement (${topContent.engagementScore}/100). Consider featuring similar content.`,
        impact: 'high',
        confidence: topContent.confidence
      });
    }

    // Session optimization recommendations
    const lowCompletionSessions = optimalSessions.filter(s => s.completionRate < 0.7);
    if (lowCompletionSessions.length > 0) {
      recommendations.push({
        title: 'Optimize Session Lengths',
        description: `${lowCompletionSessions.length} session types have low completion rates. Consider shorter durations.`,
        impact: 'medium',
        confidence: 0.8
      });
    }

    // Trend-based recommendations
    const decliningTrends = trends.filter(t => t.trend === 'declining' && t.significance !== 'low');
    if (decliningTrends.length > 0) {
      recommendations.push({
        title: 'Address Declining Engagement',
        description: `${decliningTrends[0].metric} is declining. Consider investigating user feedback and content quality.`,
        impact: 'high',
        confidence: 0.75
      });
    }

    return recommendations.sort((a, b) => {
      const impactScore = { high: 3, medium: 2, low: 1 };
      return (impactScore[b.impact] * b.confidence) - (impactScore[a.impact] * a.confidence);
    });
  }
}