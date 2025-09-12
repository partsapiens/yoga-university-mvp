import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MoodTrackingService } from '@/lib/services/moodTracking';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('MoodTrackingService', () => {
  let service: MoodTrackingService;

  beforeEach(() => {
    service = MoodTrackingService.getInstance();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('saveMoodEntry', () => {
    it('should save mood entry with sentiment result', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const sentimentResult = {
        mood: 'happy',
        confidence: 0.8,
        emotions: [{ emotion: 'happy', intensity: 0.8 }],
        needsAttention: false,
        suggestedStyle: 'mindfulness',
        reasoning: 'Positive sentiment detected'
      };

      const entry = service.saveMoodEntry(sentimentResult, 'I feel great today');

      expect(entry.mood).toBe('happy');
      expect(entry.confidence).toBe(0.8);
      expect(entry.suggestedStyle).toBe('mindfulness');
      expect(entry.textInput).toBeDefined(); // Should be hashed
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should limit history size to MAX_MOOD_HISTORY', () => {
      // Create an array with 101 entries
      const existingHistory = Array.from({ length: 101 }, (_, i) => ({
        id: `entry-${i}`,
        timestamp: new Date().toISOString(),
        mood: 'neutral',
        confidence: 0.5,
        suggestedStyle: 'mindfulness'
      }));

      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingHistory));

      const sentimentResult = {
        mood: 'happy',
        confidence: 0.8,
        emotions: [],
        needsAttention: false,
        suggestedStyle: 'mindfulness',
        reasoning: 'Test'
      };

      service.saveMoodEntry(sentimentResult);

      // Check that setItem was called with trimmed array
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData.length).toBe(100); // Should be trimmed to MAX_MOOD_HISTORY
    });
  });

  describe('getMoodAnalytics', () => {
    it('should return default analytics for empty history', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const analytics = service.getMoodAnalytics();

      expect(analytics.totalEntries).toBe(0);
      expect(analytics.dominantMood).toBe('neutral');
      expect(analytics.weeklyTrend).toBe('stable');
      expect(analytics.recommendations).toContain('Start tracking your mood to get personalized insights');
    });

    it('should calculate analytics correctly from history', () => {
      const mockHistory = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          mood: 'happy',
          confidence: 0.8,
          suggestedStyle: 'mindfulness',
          sessionCompleted: true
        },
        {
          id: '2',
          timestamp: new Date().toISOString(),
          mood: 'happy',
          confidence: 0.7,
          suggestedStyle: 'mindfulness',
          sessionCompleted: false
        },
        {
          id: '3',
          timestamp: new Date().toISOString(),
          mood: 'stressed',
          confidence: 0.6,
          suggestedStyle: 'breathing'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

      const analytics = service.getMoodAnalytics();

      expect(analytics.totalEntries).toBe(3);
      expect(analytics.dominantMood).toBe('happy');
      expect(analytics.moodDistribution).toEqual({ happy: 2, stressed: 1 });
      expect(analytics.confidenceAverage).toBeCloseTo(0.7);
      expect(analytics.sessionCompletionRate).toBeCloseTo(0.33); // 1 out of 3 completed
    });
  });

  describe('updateSessionCompletion', () => {
    it('should update session completion status', () => {
      const mockHistory = [
        {
          id: 'test-id',
          timestamp: new Date().toISOString(),
          mood: 'happy',
          confidence: 0.8,
          suggestedStyle: 'mindfulness',
          sessionCompleted: false
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

      service.updateSessionCompletion('test-id', true);

      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData[0].sessionCompleted).toBe(true);
    });
  });

  describe('addFeedback', () => {
    it('should add user feedback to entry', () => {
      const mockHistory = [
        {
          id: 'test-id',
          timestamp: new Date().toISOString(),
          mood: 'happy',
          confidence: 0.8,
          suggestedStyle: 'mindfulness'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

      service.addFeedback('test-id', 'helpful');

      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData[0].userFeedback).toBe('helpful');
    });
  });

  describe('getPreferences', () => {
    it('should return default preferences when none exist', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const preferences = service.getPreferences();

      expect(preferences.enableTracking).toBe(true);
      expect(preferences.shareAnalytics).toBe(false);
      expect(preferences.reminderFrequency).toBe('daily');
      expect(preferences.dataRetentionDays).toBe(90);
    });

    it('should merge stored preferences with defaults', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        enableTracking: false,
        customSetting: 'test'
      }));

      const preferences = service.getPreferences();

      expect(preferences.enableTracking).toBe(false);
      expect(preferences.shareAnalytics).toBe(false); // default
      expect(preferences.dataRetentionDays).toBe(90); // default
    });
  });

  describe('clearAllData', () => {
    it('should clear all mood data', () => {
      service.clearAllData();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('yoga_mood_history');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('yoga_mood_preferences');
    });
  });

  describe('exportData', () => {
    it('should export history and preferences', () => {
      const mockHistory = [{ id: '1', mood: 'happy' }];
      const mockPreferences = { enableTracking: true };

      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockHistory))
        .mockReturnValueOnce(JSON.stringify(mockPreferences));

      const exported = service.exportData();

      expect(exported.history).toEqual(mockHistory);
      expect(exported.preferences).toEqual(expect.objectContaining(mockPreferences));
    });
  });

  describe('getSmartRecommendations', () => {
    it('should provide style recommendations based on dominant mood', () => {
      const mockHistory = Array.from({ length: 5 }, () => ({
        id: '1',
        timestamp: new Date().toISOString(),
        mood: 'stressed',
        confidence: 0.8,
        suggestedStyle: 'breathing'
      }));

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

      const recommendations = service.getSmartRecommendations();

      const breathingRec = recommendations.find(r => r.recommendation === 'breathing');
      expect(breathingRec).toBeDefined();
      expect(breathingRec?.reasoning).toContain('stress');
    });

    it('should recommend shorter sessions for low completion rate', () => {
      const mockHistory = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        timestamp: new Date().toISOString(),
        mood: 'neutral',
        confidence: 0.5,
        suggestedStyle: 'mindfulness',
        sessionCompleted: i < 3 // Only 30% completion rate
      }));

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

      const recommendations = service.getSmartRecommendations();

      const durationRec = recommendations.find(r => r.type === 'duration');
      expect(durationRec?.recommendation).toContain('shorter');
    });
  });

  describe('getRecentMoods', () => {
    it('should return moods from recent days', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);

      const mockHistory = [
        {
          id: '1',
          timestamp: now.toISOString(),
          mood: 'happy',
          confidence: 0.8,
          suggestedStyle: 'mindfulness'
        },
        {
          id: '2',
          timestamp: yesterday.toISOString(),
          mood: 'stressed',
          confidence: 0.7,
          suggestedStyle: 'breathing'
        },
        {
          id: '3',
          timestamp: lastWeek.toISOString(),
          mood: 'calm',
          confidence: 0.6,
          suggestedStyle: 'mindfulness'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

      const recentMoods = service.getRecentMoods(7);

      expect(recentMoods).toHaveLength(2); // Only recent 2, not the one from last week
      expect(recentMoods.map(m => m.mood)).toEqual(['happy', 'stressed']);
    });
  });
});