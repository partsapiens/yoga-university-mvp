import { SentimentResult, MoodPattern, analyzeMoodPatterns } from './sentimentAnalysis';

// Local storage keys (privacy-first approach)
const MOOD_HISTORY_KEY = 'yoga_mood_history';
const MOOD_PREFERENCES_KEY = 'yoga_mood_preferences';
const MAX_MOOD_HISTORY = 100; // Limit storage size

export interface MoodHistoryEntry {
  id: string;
  timestamp: string;
  mood: string;
  confidence: number;
  suggestedStyle: string;
  sessionCompleted?: boolean;
  userFeedback?: 'helpful' | 'not_helpful';
  textInput?: string; // Encrypted/hashed for privacy
}

export interface MoodPreferences {
  enableTracking: boolean;
  shareAnalytics: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'never';
  dataRetentionDays: number;
}

export interface MoodAnalytics {
  totalEntries: number;
  dominantMood: string;
  moodDistribution: Record<string, number>;
  weeklyTrend: 'improving' | 'declining' | 'stable';
  recommendations: string[];
  confidenceAverage: number;
  sessionCompletionRate: number;
}

/**
 * Privacy-first mood tracking service
 */
export class MoodTrackingService {
  private static instance: MoodTrackingService;
  
  public static getInstance(): MoodTrackingService {
    if (!MoodTrackingService.instance) {
      MoodTrackingService.instance = new MoodTrackingService();
    }
    return MoodTrackingService.instance;
  }

  /**
   * Save mood data to local storage
   */
  saveMoodEntry(sentimentResult: SentimentResult, textInput?: string): MoodHistoryEntry {
    const entry: MoodHistoryEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      mood: sentimentResult.mood,
      confidence: sentimentResult.confidence,
      suggestedStyle: sentimentResult.suggestedStyle,
      textInput: textInput ? this.hashText(textInput) : undefined, // Hash for privacy
    };

    const history = this.getMoodHistory();
    history.push(entry);

    // Limit history size
    if (history.length > MAX_MOOD_HISTORY) {
      history.splice(0, history.length - MAX_MOOD_HISTORY);
    }

    this.saveMoodHistory(history);
    return entry;
  }

  /**
   * Get mood history from local storage
   */
  getMoodHistory(): MoodHistoryEntry[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(MOOD_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load mood history:', error);
      return [];
    }
  }

  /**
   * Get mood analytics and insights
   */
  getMoodAnalytics(): MoodAnalytics {
    const history = this.getMoodHistory();
    
    if (history.length === 0) {
      return {
        totalEntries: 0,
        dominantMood: 'neutral',
        moodDistribution: {},
        weeklyTrend: 'stable',
        recommendations: ['Start tracking your mood to get personalized insights'],
        confidenceAverage: 0,
        sessionCompletionRate: 0
      };
    }

    // Calculate mood distribution
    const moodDistribution: Record<string, number> = {};
    let confidenceSum = 0;
    let completedSessions = 0;

    history.forEach(entry => {
      moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
      confidenceSum += entry.confidence;
      if (entry.sessionCompleted) completedSessions++;
    });

    const dominantMood = Object.entries(moodDistribution)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';

    // Analyze patterns for trends
    const patterns: MoodPattern[] = history.map(entry => ({
      timestamp: entry.timestamp,
      mood: entry.mood,
      confidence: entry.confidence,
      textInput: entry.textInput
    }));

    const patternAnalysis = analyzeMoodPatterns(patterns);

    return {
      totalEntries: history.length,
      dominantMood,
      moodDistribution,
      weeklyTrend: patternAnalysis.trend,
      recommendations: patternAnalysis.recommendations,
      confidenceAverage: confidenceSum / history.length,
      sessionCompletionRate: completedSessions / history.length
    };
  }

  /**
   * Update session completion status
   */
  updateSessionCompletion(entryId: string, completed: boolean): void {
    const history = this.getMoodHistory();
    const entry = history.find(e => e.id === entryId);
    if (entry) {
      entry.sessionCompleted = completed;
      this.saveMoodHistory(history);
    }
  }

  /**
   * Add user feedback on recommendations
   */
  addFeedback(entryId: string, feedback: 'helpful' | 'not_helpful'): void {
    const history = this.getMoodHistory();
    const entry = history.find(e => e.id === entryId);
    if (entry) {
      entry.userFeedback = feedback;
      this.saveMoodHistory(history);
    }
  }

  /**
   * Get mood preferences
   */
  getPreferences(): MoodPreferences {
    if (typeof window === 'undefined') {
      return this.getDefaultPreferences();
    }

    try {
      const stored = localStorage.getItem(MOOD_PREFERENCES_KEY);
      return stored ? { ...this.getDefaultPreferences(), ...JSON.parse(stored) } : this.getDefaultPreferences();
    } catch (error) {
      console.warn('Failed to load mood preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Update mood preferences
   */
  updatePreferences(preferences: Partial<MoodPreferences>): void {
    if (typeof window === 'undefined') return;

    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    
    try {
      localStorage.setItem(MOOD_PREFERENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save mood preferences:', error);
    }
  }

  /**
   * Clear all mood data (for privacy/GDPR compliance)
   */
  clearAllData(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(MOOD_HISTORY_KEY);
      localStorage.removeItem(MOOD_PREFERENCES_KEY);
    } catch (error) {
      console.warn('Failed to clear mood data:', error);
    }
  }

  /**
   * Export mood data for user (GDPR compliance)
   */
  exportData(): { history: MoodHistoryEntry[], preferences: MoodPreferences } {
    return {
      history: this.getMoodHistory(),
      preferences: this.getPreferences()
    };
  }

  /**
   * Get recent mood entries for smart recommendations
   */
  getRecentMoods(days: number = 7): MoodHistoryEntry[] {
    const history = this.getMoodHistory();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return history.filter(entry => new Date(entry.timestamp) >= cutoff);
  }

  /**
   * Get mood-based recommendations
   */
  getSmartRecommendations(): Array<{
    type: 'style' | 'duration' | 'timing' | 'focus';
    recommendation: string;
    reasoning: string;
    confidence: number;
  }> {
    const analytics = this.getMoodAnalytics();
    const recentMoods = this.getRecentMoods(7);
    const recommendations = [];

    // Style recommendations based on dominant mood
    if (analytics.dominantMood === 'stressed') {
      recommendations.push({
        type: 'style' as const,
        recommendation: 'breathing',
        reasoning: 'Your recent mood patterns show stress. Breathing exercises can help calm your nervous system.',
        confidence: 0.8
      });
    } else if (analytics.dominantMood === 'anxious') {
      recommendations.push({
        type: 'style' as const,
        recommendation: 'mindfulness',
        reasoning: 'Mindfulness meditation can help you observe anxious thoughts without judgment.',
        confidence: 0.75
      });
    }

    // Duration recommendations based on completion rate
    if (analytics.sessionCompletionRate < 0.5) {
      recommendations.push({
        type: 'duration' as const,
        recommendation: 'Try shorter 5-10 minute sessions',
        reasoning: 'You tend to complete shorter sessions more often. Building consistency is more important than duration.',
        confidence: 0.7
      });
    }

    // Timing recommendations based on patterns
    const morningMoods = recentMoods.filter(m => {
      const hour = new Date(m.timestamp).getHours();
      return hour < 12;
    });
    
    if (morningMoods.some(m => m.mood === 'stressed')) {
      recommendations.push({
        type: 'timing' as const,
        recommendation: 'morning',
        reasoning: 'Starting your day with meditation might help reduce morning stress.',
        confidence: 0.6
      });
    }

    return recommendations;
  }

  // Private helper methods
  private saveMoodHistory(history: MoodHistoryEntry[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save mood history:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private hashText(text: string): string {
    // Simple hash for privacy (in production, use a proper crypto library)
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  private getDefaultPreferences(): MoodPreferences {
    return {
      enableTracking: true,
      shareAnalytics: false,
      reminderFrequency: 'daily',
      dataRetentionDays: 90
    };
  }
}