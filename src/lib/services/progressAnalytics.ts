import { PracticeSession } from '@/types/dashboard';

// Types for progress analytics
export interface PracticePattern {
  preferredTimeSlots: { hour: number; frequency: number; successRate: number }[];
  durationPatterns: { duration: number; frequency: number; completionRate: number }[];
  weeklyTrends: { dayOfWeek: number; averageSessions: number; averageDuration: number }[];
  consistencyScore: number;
  improvementTrend: 'improving' | 'stable' | 'declining';
}

export interface SkillDevelopmentPath {
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  recommendedFocus: string[];
  nextMilestones: { skill: string; estimatedTimeToAchieve: number; confidence: number }[];
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface OptimalPracticeTime {
  recommendedHour: number;
  confidence: number;
  reasoning: string;
  alternativeSlots: { hour: number; confidence: number }[];
}

export interface PersonalizedRecommendation {
  type: 'duration' | 'frequency' | 'focus' | 'timing' | 'technique';
  title: string;
  description: string;
  actionable: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  confidence: number;
}

export interface ProgressInsights {
  practicePattern: PracticePattern;
  skillDevelopment: SkillDevelopmentPath;
  optimalTiming: OptimalPracticeTime;
  recommendations: PersonalizedRecommendation[];
  progressScore: number;
  forecastedProgress: {
    weeklyGrowth: number;
    predictedMilestones: { milestone: string; estimatedDate: string }[];
  };
}

/**
 * AI-powered progress analytics service that analyzes practice patterns
 * and provides machine learning-based insights
 */
export class ProgressAnalyticsService {
  private static instance: ProgressAnalyticsService;

  public static getInstance(): ProgressAnalyticsService {
    if (!ProgressAnalyticsService.instance) {
      ProgressAnalyticsService.instance = new ProgressAnalyticsService();
    }
    return ProgressAnalyticsService.instance;
  }

  /**
   * Analyze practice patterns using ML-like algorithms
   */
  analyzePracticePatterns(sessions: PracticeSession[]): PracticePattern {
    if (sessions.length === 0) {
      return this.getDefaultPattern();
    }

    // Time slot analysis - group by hour of day
    const timeSlotMap = new Map<number, { total: number; completed: number }>();
    
    // Duration pattern analysis
    const durationMap = new Map<number, { total: number; completed: number }>();
    
    // Weekly trend analysis
    const weeklyMap = new Map<number, { sessions: number; totalDuration: number }>();

    sessions.forEach(session => {
      const date = new Date(session.completedAt);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();
      const duration = session.duration;
      const completed = session.completed !== false;

      // Time slot tracking
      const timeSlot = timeSlotMap.get(hour) || { total: 0, completed: 0 };
      timeSlot.total++;
      if (completed) timeSlot.completed++;
      timeSlotMap.set(hour, timeSlot);

      // Duration tracking
      const durationSlot = durationMap.get(duration) || { total: 0, completed: 0 };
      durationSlot.total++;
      if (completed) durationSlot.completed++;
      durationMap.set(duration, durationSlot);

      // Weekly tracking
      const weeklySlot = weeklyMap.get(dayOfWeek) || { sessions: 0, totalDuration: 0 };
      weeklySlot.sessions++;
      weeklySlot.totalDuration += duration;
      weeklyMap.set(dayOfWeek, weeklySlot);
    });

    // Convert to sorted arrays
    const preferredTimeSlots = Array.from(timeSlotMap.entries())
      .map(([hour, data]) => ({
        hour,
        frequency: data.total,
        successRate: data.completed / data.total
      }))
      .sort((a, b) => b.frequency - a.frequency);

    const durationPatterns = Array.from(durationMap.entries())
      .map(([duration, data]) => ({
        duration,
        frequency: data.total,
        completionRate: data.completed / data.total
      }))
      .sort((a, b) => b.frequency - a.frequency);

    const weeklyTrends = Array.from(weeklyMap.entries())
      .map(([dayOfWeek, data]) => ({
        dayOfWeek,
        averageSessions: data.sessions,
        averageDuration: data.totalDuration / data.sessions
      }))
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek);

    // Calculate consistency score (0-100)
    const consistencyScore = this.calculateConsistencyScore(sessions);
    
    // Determine improvement trend
    const improvementTrend = this.calculateImprovementTrend(sessions);

    return {
      preferredTimeSlots,
      durationPatterns,
      weeklyTrends,
      consistencyScore,
      improvementTrend
    };
  }

  /**
   * Generate skill development path based on practice history
   */
  generateSkillDevelopmentPath(sessions: PracticeSession[]): SkillDevelopmentPath {
    const totalSessions = sessions.length;
    const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    const completionRate = sessions.filter(s => s.completed !== false).length / totalSessions;

    // Determine current level
    let currentLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (totalSessions >= 50 && totalHours >= 25 && completionRate >= 0.8) {
      currentLevel = 'advanced';
    } else if (totalSessions >= 20 && totalHours >= 10 && completionRate >= 0.7) {
      currentLevel = 'intermediate';
    }

    // Generate recommendations based on current level
    const recommendedFocus = this.getRecommendedFocus(currentLevel, sessions);
    const nextMilestones = this.getNextMilestones(currentLevel, totalSessions, totalHours);
    const { strengthAreas, improvementAreas } = this.analyzeStrengthsAndWeaknesses(sessions);

    return {
      currentLevel,
      recommendedFocus,
      nextMilestones,
      strengthAreas,
      improvementAreas
    };
  }

  /**
   * Predict optimal practice times using pattern analysis
   */
  predictOptimalTiming(pattern: PracticePattern): OptimalPracticeTime {
    if (pattern.preferredTimeSlots.length === 0) {
      return {
        recommendedHour: 9, // Default morning time
        confidence: 0.3,
        reasoning: "Insufficient data for personalized timing. Morning sessions are generally effective.",
        alternativeSlots: [
          { hour: 18, confidence: 0.25 },
          { hour: 21, confidence: 0.2 }
        ]
      };
    }

    // Find the time slot with highest success rate and reasonable frequency
    const bestSlot = pattern.preferredTimeSlots
      .filter(slot => slot.frequency >= 2) // Must have tried at least twice
      .sort((a, b) => (b.successRate * b.frequency) - (a.successRate * a.frequency))[0];

    if (!bestSlot) {
      const fallbackSlot = pattern.preferredTimeSlots[0];
      return {
        recommendedHour: fallbackSlot.hour,
        confidence: 0.4,
        reasoning: "Based on your practice history, though limited data available.",
        alternativeSlots: pattern.preferredTimeSlots.slice(1, 3).map(slot => ({
          hour: slot.hour,
          confidence: slot.successRate * 0.6
        }))
      };
    }

    const confidence = Math.min(0.95, bestSlot.successRate * (Math.log(bestSlot.frequency + 1) / 3));
    
    return {
      recommendedHour: bestSlot.hour,
      confidence,
      reasoning: `Your success rate is ${Math.round(bestSlot.successRate * 100)}% at this time with ${bestSlot.frequency} sessions.`,
      alternativeSlots: pattern.preferredTimeSlots
        .filter(slot => slot.hour !== bestSlot.hour && slot.frequency >= 1)
        .slice(0, 2)
        .map(slot => ({
          hour: slot.hour,
          confidence: slot.successRate * 0.8
        }))
    };
  }

  /**
   * Generate personalized improvement recommendations
   */
  generateRecommendations(
    pattern: PracticePattern,
    skillPath: SkillDevelopmentPath,
    sessions: PracticeSession[]
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    // Frequency recommendations
    if (pattern.consistencyScore < 70) {
      recommendations.push({
        type: 'frequency',
        title: 'Build Consistency',
        description: 'Your practice consistency could improve to accelerate progress.',
        actionable: 'Try to practice at the same time each day, even if just for 5 minutes.',
        impact: 'high',
        timeframe: '2-3 weeks',
        confidence: 0.85
      });
    }

    // Duration recommendations
    const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
    if (avgDuration < 15 && skillPath.currentLevel !== 'beginner') {
      recommendations.push({
        type: 'duration',
        title: 'Extend Practice Duration',
        description: 'Longer sessions could help deepen your practice and benefits.',
        actionable: 'Gradually increase session length by 2-3 minutes each week.',
        impact: 'medium',
        timeframe: '1 month',
        confidence: 0.75
      });
    }

    // Timing recommendations
    if (pattern.preferredTimeSlots.length > 0) {
      const bestTime = pattern.preferredTimeSlots[0];
      if (bestTime.successRate < 0.8) {
        recommendations.push({
          type: 'timing',
          title: 'Optimize Practice Timing',
          description: 'Your completion rate varies by time of day.',
          actionable: `Consider practicing at ${this.formatHour(bestTime.hour)} when you have higher success rates.`,
          impact: 'medium',
          timeframe: '1-2 weeks',
          confidence: 0.7
        });
      }
    }

    // Focus area recommendations
    if (skillPath.improvementAreas.length > 0) {
      recommendations.push({
        type: 'focus',
        title: 'Develop Key Skills',
        description: `Focus on ${skillPath.improvementAreas[0]} to accelerate your progress.`,
        actionable: `Dedicate 20% of your practice time to ${skillPath.improvementAreas[0]} exercises.`,
        impact: 'high',
        timeframe: '4-6 weeks',
        confidence: 0.8
      });
    }

    // Technique recommendations based on level
    if (skillPath.currentLevel === 'intermediate') {
      recommendations.push({
        type: 'technique',
        title: 'Advanced Breathing Techniques',
        description: 'You\'re ready to explore more sophisticated breathing patterns.',
        actionable: 'Try 4-7-8 breathing or alternate nostril breathing in your sessions.',
        impact: 'medium',
        timeframe: '2-3 weeks',
        confidence: 0.7
      });
    }

    return recommendations.sort((a, b) => {
      const impactScore = { high: 3, medium: 2, low: 1 };
      return (impactScore[b.impact] * b.confidence) - (impactScore[a.impact] * a.confidence);
    });
  }

  /**
   * Calculate overall progress score and forecast
   */
  calculateProgressMetrics(sessions: PracticeSession[]): {
    progressScore: number;
    forecastedProgress: ProgressInsights['forecastedProgress'];
  } {
    if (sessions.length === 0) {
      return {
        progressScore: 0,
        forecastedProgress: {
          weeklyGrowth: 0,
          predictedMilestones: []
        }
      };
    }

    const completionRate = sessions.filter(s => s.completed !== false).length / sessions.length;
    const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    const consistency = this.calculateConsistencyScore(sessions);
    
    // Weighted progress score (0-100)
    const progressScore = Math.round(
      (completionRate * 40) + 
      (Math.min(totalHours / 20, 1) * 30) + 
      (consistency / 100 * 30)
    );

    // Calculate weekly growth trend
    const recentSessions = sessions.slice(-14); // Last 2 weeks
    const weeklyGrowth = this.calculateGrowthTrend(recentSessions);

    // Predict future milestones
    const predictedMilestones = this.predictMilestones(sessions, weeklyGrowth);

    return {
      progressScore,
      forecastedProgress: {
        weeklyGrowth,
        predictedMilestones
      }
    };
  }

  // Private helper methods

  private getDefaultPattern(): PracticePattern {
    return {
      preferredTimeSlots: [],
      durationPatterns: [],
      weeklyTrends: [],
      consistencyScore: 0,
      improvementTrend: 'stable'
    };
  }

  private calculateConsistencyScore(sessions: PracticeSession[]): number {
    if (sessions.length < 7) return sessions.length * 10; // Encourage early practice

    // Calculate consistency over last 4 weeks
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    
    const recentSessions = sessions.filter(s => new Date(s.completedAt) >= fourWeeksAgo);
    
    // Group by week
    const weeklyGroups = new Map<string, number>();
    recentSessions.forEach(session => {
      const date = new Date(session.completedAt);
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      weeklyGroups.set(weekKey, (weeklyGroups.get(weekKey) || 0) + 1);
    });

    const weeklyValues = Array.from(weeklyGroups.values());
    if (weeklyValues.length === 0) return 0;

    const mean = weeklyValues.reduce((sum, val) => sum + val, 0) / weeklyValues.length;
    const variance = weeklyValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / weeklyValues.length;
    const stdDev = Math.sqrt(variance);
    
    // Higher consistency = lower std deviation
    const consistencyScore = Math.max(0, 100 - (stdDev * 20));
    return Math.round(consistencyScore);
  }

  private calculateImprovementTrend(sessions: PracticeSession[]): 'improving' | 'stable' | 'declining' {
    if (sessions.length < 10) return 'stable';

    const midpoint = Math.floor(sessions.length / 2);
    const earlierSessions = sessions.slice(0, midpoint);
    const laterSessions = sessions.slice(midpoint);

    const earlierCompletionRate = earlierSessions.filter(s => s.completed !== false).length / earlierSessions.length;
    const laterCompletionRate = laterSessions.filter(s => s.completed !== false).length / laterSessions.length;

    const earlierAvgDuration = earlierSessions.reduce((sum, s) => sum + s.duration, 0) / earlierSessions.length;
    const laterAvgDuration = laterSessions.reduce((sum, s) => sum + s.duration, 0) / laterSessions.length;

    const completionImprovement = laterCompletionRate - earlierCompletionRate;
    const durationImprovement = (laterAvgDuration - earlierAvgDuration) / earlierAvgDuration;

    const overallImprovement = (completionImprovement * 0.7) + (durationImprovement * 0.3);

    if (overallImprovement > 0.1) return 'improving';
    if (overallImprovement < -0.1) return 'declining';
    return 'stable';
  }

  private getRecommendedFocus(level: 'beginner' | 'intermediate' | 'advanced', sessions: PracticeSession[]): string[] {
    const baseRecommendations = {
      beginner: ['Breath awareness', 'Basic posture', 'Mindful movement'],
      intermediate: ['Advanced breathing', 'Flow transitions', 'Balance poses'],
      advanced: ['Arm balances', 'Deep backbends', 'Meditation practices']
    };

    // TODO: Analyze session data to personalize recommendations
    return baseRecommendations[level];
  }

  private getNextMilestones(level: 'beginner' | 'intermediate' | 'advanced', totalSessions: number, totalHours: number) {
    const milestones = [];

    if (level === 'beginner') {
      if (totalSessions < 10) {
        milestones.push({
          skill: 'Complete 10 sessions',
          estimatedTimeToAchieve: Math.max(1, 10 - totalSessions),
          confidence: 0.9
        });
      }
      if (totalHours < 5) {
        milestones.push({
          skill: 'Practice 5 hours total',
          estimatedTimeToAchieve: Math.max(1, (5 - totalHours) * 2),
          confidence: 0.85
        });
      }
    }

    return milestones;
  }

  private analyzeStrengthsAndWeaknesses(sessions: PracticeSession[]): {
    strengthAreas: string[];
    improvementAreas: string[];
  } {
    // TODO: Implement analysis based on session types, completion rates, etc.
    // For now, return sample data
    return {
      strengthAreas: ['Consistency', 'Breath work'],
      improvementAreas: ['Flexibility', 'Balance']
    };
  }

  private calculateGrowthTrend(recentSessions: PracticeSession[]): number {
    if (recentSessions.length < 4) return 0;

    // Simple linear regression on session frequency
    const weeklySessionCounts = [];
    for (let i = 0; i < recentSessions.length; i += 7) {
      const weekSessions = recentSessions.slice(i, i + 7);
      weeklySessionCounts.push(weekSessions.length);
    }

    if (weeklySessionCounts.length < 2) return 0;

    const mean = weeklySessionCounts.reduce((sum, val) => sum + val, 0) / weeklySessionCounts.length;
    const trend = weeklySessionCounts[weeklySessionCounts.length - 1] - weeklySessionCounts[0];
    
    return Math.round((trend / weeklySessionCounts.length) * 100) / 100;
  }

  private predictMilestones(sessions: PracticeSession[], weeklyGrowth: number) {
    const milestones = [];
    const currentSessions = sessions.length;
    
    if (currentSessions < 25) {
      const sessionsNeeded = 25 - currentSessions;
      const weeksToAchieve = weeklyGrowth > 0 ? Math.ceil(sessionsNeeded / (2 + weeklyGrowth)) : 12;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + (weeksToAchieve * 7));
      
      milestones.push({
        milestone: '25 Session Milestone',
        estimatedDate: targetDate.toLocaleDateString()
      });
    }

    return milestones;
  }

  private formatHour(hour: number): string {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  }
}