import { describe, it, expect } from 'vitest';
import { AnalyticsIntelligenceService } from '@/lib/services/analyticsIntelligence';

describe('AnalyticsIntelligenceService', () => {
  const service = AnalyticsIntelligenceService.getInstance();

  const createSampleEvents = () => [
    {
      action: 'content_engagement',
      category: 'content',
      label: 'meditation:morning-flow',
      value: 600, // 10 minutes
      timestamp: Date.now() - 86400000, // 1 day ago
      sessionId: 'session_1'
    },
    {
      action: 'content_completion',
      category: 'content',
      label: 'meditation:morning-flow',
      value: 85, // 85% completion
      timestamp: Date.now() - 86400000,
      sessionId: 'session_1'
    },
    {
      action: 'content_engagement',
      category: 'content',
      label: 'meditation:morning-flow',
      value: 580, // Another session for the same content
      timestamp: Date.now() - 172800000, // 2 days ago
      sessionId: 'session_3'
    },
    {
      action: 'content_completion',
      category: 'content',
      label: 'meditation:morning-flow',
      value: 80, // 80% completion
      timestamp: Date.now() - 172800000,
      sessionId: 'session_3'
    },
    {
      action: 'content_engagement',
      category: 'content',
      label: 'meditation:morning-flow',
      value: 620, // Third session for minimum sample size
      timestamp: Date.now() - 259200000, // 3 days ago
      sessionId: 'session_4'
    },
    {
      action: 'content_completion',
      category: 'content',
      label: 'meditation:morning-flow',
      value: 90, // 90% completion
      timestamp: Date.now() - 259200000,
      sessionId: 'session_4'
    },
    {
      action: 'content_engagement',
      category: 'content',
      label: 'yoga-flow:sun-salutation',
      value: 1200, // 20 minutes
      timestamp: Date.now() - 172800000, // 2 days ago
      sessionId: 'session_2'
    },
    {
      action: 'content_completion',
      category: 'content',
      label: 'yoga-flow:sun-salutation',
      value: 95, // 95% completion
      timestamp: Date.now() - 172800000,
      sessionId: 'session_2'
    },
    {
      action: 'content_engagement',
      category: 'content',
      label: 'yoga-flow:sun-salutation',
      value: 1100, // Another session
      timestamp: Date.now() - 345600000, // 4 days ago
      sessionId: 'session_5'
    },
    {
      action: 'content_completion',
      category: 'content',
      label: 'yoga-flow:sun-salutation',
      value: 92, // 92% completion
      timestamp: Date.now() - 345600000,
      sessionId: 'session_5'
    },
    {
      action: 'content_engagement',
      category: 'content',
      label: 'yoga-flow:sun-salutation',
      value: 1250, // Third session
      timestamp: Date.now() - 432000000, // 5 days ago
      sessionId: 'session_6'
    },
    {
      action: 'content_completion',
      category: 'content',
      label: 'yoga-flow:sun-salutation',
      value: 98, // 98% completion
      timestamp: Date.now() - 432000000,
      sessionId: 'session_6'
    },
    {
      action: 'session_quality',
      category: 'practice',
      label: 'meditation',
      value: 8, // quality score 8/10
      timestamp: Date.now() - 86400000,
      sessionId: 'session_1'
    },
    {
      action: 'meditation_complete',
      category: 'practice',
      label: 'meditation',
      value: 15, // 15 minutes
      timestamp: Date.now() - 86400000,
      sessionId: 'session_1'
    },
    {
      action: 'session_duration_analysis',
      category: 'optimization',
      label: 'meditation',
      value: 75, // 75% completion rate
      timestamp: Date.now() - 86400000,
      sessionId: 'session_1'
    },
    // Add more duration analysis events for minimum sample size
    {
      action: 'session_duration_analysis',
      category: 'optimization',
      label: 'meditation',
      value: 80, // 80% completion rate
      timestamp: Date.now() - 172800000,
      sessionId: 'session_3'
    },
    {
      action: 'session_duration_analysis',
      category: 'optimization',
      label: 'meditation',
      value: 70, // 70% completion rate
      timestamp: Date.now() - 259200000,
      sessionId: 'session_4'
    },
    {
      action: 'session_duration_analysis',
      category: 'optimization',
      label: 'meditation',
      value: 78, // 78% completion rate
      timestamp: Date.now() - 345600000,
      sessionId: 'session_7'
    },
    {
      action: 'session_duration_analysis',
      category: 'optimization',
      label: 'meditation',
      value: 82, // 82% completion rate
      timestamp: Date.now() - 432000000,
      sessionId: 'session_8'
    }
  ];

  describe('Content Popularity Analysis', () => {
    it('should identify popular content from engagement data', () => {
      const events = createSampleEvents();
      const insights = service.analyzeContentPopularity(events);

      expect(insights).toBeDefined();
      expect(insights.length).toBeGreaterThan(0);

      // Should have meditation and yoga-flow content
      const contentTypes = insights.map(i => i.contentType);
      expect(contentTypes).toContain('meditation');
      expect(contentTypes).toContain('yoga-flow');

      // Results should be sorted by engagement score
      for (let i = 1; i < insights.length; i++) {
        expect(insights[i-1].engagementScore).toBeGreaterThanOrEqual(insights[i].engagementScore);
      }
    });

    it('should calculate engagement scores correctly', () => {
      const events = createSampleEvents();
      const insights = service.analyzeContentPopularity(events);
      
      const meditationContent = insights.find(i => i.contentType === 'meditation');
      expect(meditationContent).toBeDefined();
      expect(meditationContent!.engagementScore).toBeGreaterThan(0);
      expect(meditationContent!.averageTimeSpent).toBe(600); // Average of 600, 580, 620
      expect(meditationContent!.completionRate).toBeCloseTo(0.85, 1); // Average of 85%, 80%, 90%
      expect(meditationContent!.userCount).toBe(3);
    });

    it('should require minimum sample size', () => {
      const singleEvent = [createSampleEvents()[0]];
      const insights = service.analyzeContentPopularity(singleEvent);
      
      // Should be empty due to insufficient sample size
      expect(insights).toHaveLength(0);
    });

    it('should include confidence scores', () => {
      const events = createSampleEvents();
      const insights = service.analyzeContentPopularity(events);
      
      insights.forEach(insight => {
        expect(insight.confidence).toBeGreaterThan(0);
        expect(insight.confidence).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Session Optimization Analysis', () => {
    it('should analyze optimal session lengths', () => {
      const events = createSampleEvents();
      const insights = service.analyzeOptimalSessionLengths(events);

      expect(insights).toBeDefined();
      expect(insights.length).toBeGreaterThan(0);

      const meditationSession = insights.find(i => i.sessionType === 'meditation');
      expect(meditationSession).toBeDefined();
      expect(meditationSession!.recommendedDuration).toBeGreaterThan(0);
      expect(meditationSession!.completionRate).toBeCloseTo(0.77, 1); // Average of 75%, 80%, 70%, 78%, 82%
      expect(meditationSession!.reasoning).toContain('completion patterns');
    });

    it('should suggest shorter durations for low completion rates', () => {
      const lowCompletionEvents = [
        {
          action: 'session_duration_analysis',
          category: 'optimization',
          label: 'vinyasa',
          value: 40, // 40% completion rate
          timestamp: Date.now(),
          sessionId: 'session_1'
        },
        ...Array(4).fill(null).map((_, i) => ({
          action: 'session_duration_analysis',
          category: 'optimization',
          label: 'vinyasa',
          value: 45,
          timestamp: Date.now() - i * 1000,
          sessionId: `session_${i + 2}`
        }))
      ];

      const insights = service.analyzeOptimalSessionLengths(lowCompletionEvents);
      const vinyasaSession = insights.find(i => i.sessionType === 'vinyasa');
      
      expect(vinyasaSession).toBeDefined();
      expect(vinyasaSession!.reasoning).toContain('shorter sessions');
    });
  });

  describe('Engagement Trends Analysis', () => {
    it('should analyze engagement trends over time', () => {
      const events = createSampleEvents();
      const trends = service.analyzeEngagementTrends(events);

      expect(trends).toBeDefined();
      expect(trends.length).toBeGreaterThan(0);

      trends.forEach(trend => {
        expect(trend.metric).toBeDefined();
        expect(trend.currentValue).toBeGreaterThanOrEqual(0);
        expect(trend.previousValue).toBeGreaterThanOrEqual(0);
        expect(['improving', 'stable', 'declining']).toContain(trend.trend);
        expect(['high', 'medium', 'low']).toContain(trend.significance);
      });
    });

    it('should calculate change percentages correctly', () => {
      const events = createSampleEvents();
      const trends = service.analyzeEngagementTrends(events);

      trends.forEach(trend => {
        if (trend.previousValue > 0) {
          const expectedChange = ((trend.currentValue - trend.previousValue) / trend.previousValue) * 100;
          expect(Math.abs(trend.changePercentage - expectedChange)).toBeLessThan(0.01);
        }
      });
    });
  });

  describe('Platform Insights Generation', () => {
    it('should generate comprehensive platform insights', async () => {
      const events = createSampleEvents();
      const insights = await service.generatePlatformInsights(events);

      expect(insights).toBeDefined();
      expect(insights.popularContent).toBeDefined();
      expect(insights.optimalSessions).toBeDefined();
      expect(insights.engagementTrends).toBeDefined();
      expect(insights.keyMetrics).toBeDefined();
      expect(insights.recommendations).toBeDefined();

      // Key metrics should be calculated
      expect(insights.keyMetrics.totalSessions).toBeGreaterThanOrEqual(0);
      expect(insights.keyMetrics.avgSessionDuration).toBeGreaterThanOrEqual(0);
      expect(insights.keyMetrics.contentEngagementRate).toBeGreaterThanOrEqual(0);
      expect(insights.keyMetrics.retentionRate).toBeGreaterThanOrEqual(0);
    });

    it('should limit results to manageable sizes', async () => {
      const events = createSampleEvents();
      const insights = await service.generatePlatformInsights(events);

      expect(insights.popularContent.length).toBeLessThanOrEqual(10);
    });

    it('should include AI recommendations', async () => {
      const events = createSampleEvents();
      const insights = await service.generatePlatformInsights(events);

      expect(insights.recommendations).toBeDefined();
      insights.recommendations.forEach(rec => {
        expect(rec.title).toBeDefined();
        expect(rec.description).toBeDefined();
        expect(['high', 'medium', 'low']).toContain(rec.impact);
        expect(rec.confidence).toBeGreaterThan(0);
        expect(rec.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should sort recommendations by impact and confidence', async () => {
      const events = createSampleEvents();
      const insights = await service.generatePlatformInsights(events);

      const recommendations = insights.recommendations;
      if (recommendations.length > 1) {
        for (let i = 1; i < recommendations.length; i++) {
          const prev = recommendations[i-1];
          const curr = recommendations[i];
          
          const impactScore = { high: 3, medium: 2, low: 1 };
          const prevScore = impactScore[prev.impact] * prev.confidence;
          const currScore = impactScore[curr.impact] * curr.confidence;
          
          expect(prevScore).toBeGreaterThanOrEqual(currScore);
        }
      }
    });
  });

  describe('Privacy Compliance', () => {
    it('should work with anonymized data only', () => {
      const events = createSampleEvents();
      
      // Ensure no personal identifiable information is required
      events.forEach(event => {
        expect(event).not.toHaveProperty('userId');
        expect(event).not.toHaveProperty('email');
        expect(event).not.toHaveProperty('personalInfo');
      });

      const insights = service.analyzeContentPopularity(events);
      expect(insights).toBeDefined();
    });

    it('should handle events without session IDs gracefully', () => {
      const eventsWithoutSessions = createSampleEvents().map(event => {
        const { sessionId, ...eventWithoutSession } = event;
        return eventWithoutSession;
      });

      expect(() => {
        service.analyzeContentPopularity(eventsWithoutSessions);
      }).not.toThrow();
    });
  });
});