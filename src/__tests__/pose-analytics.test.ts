import { describe, test, expect, beforeEach, vi } from 'vitest';
import { 
  PoseAnalytics, 
  formatDuration, 
  getImprovementIcon, 
  getAccuracyColor, 
  getAccuracyLabel 
} from '@/lib/pose-analytics';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('PoseAnalytics', () => {
  let analytics: PoseAnalytics;

  beforeEach(() => {
    vi.clearAllMocks();
    analytics = new PoseAnalytics();
  });

  describe('saveSession', () => {
    test('saves a new session for a new pose', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const session = {
        id: 'test-session-1',
        poseName: 'Downward Dog',
        timestamp: Date.now(),
        duration: 60,
        accuracy: 85,
        feedback: ['Good alignment!'],
        suggestions: ['Keep breathing deeply']
      };

      analytics.saveSession(session);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'yoga_pose_analytics',
        expect.stringContaining('Downward Dog')
      );
    });

    test('appends session to existing pose data', () => {
      const existingData = [{
        poseName: 'Downward Dog',
        sessions: [{
          id: 'existing-session',
          poseName: 'Downward Dog',
          timestamp: Date.now() - 1000,
          duration: 45,
          accuracy: 75,
          feedback: [],
          suggestions: []
        }],
        averageAccuracy: 75,
        bestAccuracy: 75,
        totalSessions: 1,
        totalDuration: 45,
        improvementTrend: 'insufficient_data' as const,
        lastPracticed: Date.now() - 1000
      }];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingData));

      const newSession = {
        id: 'test-session-2',
        poseName: 'Downward Dog',
        timestamp: Date.now(),
        duration: 60,
        accuracy: 85,
        feedback: ['Better form!'],
        suggestions: []
      };

      analytics.saveSession(newSession);

      expect(localStorageMock.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      const poseData = savedData[0];
      
      expect(poseData.totalSessions).toBe(2);
      expect(poseData.bestAccuracy).toBe(85);
      expect(poseData.averageAccuracy).toBe(80); // (75 + 85) / 2
    });
  });

  describe('getProgressForPose', () => {
    test('returns pose progress if it exists', () => {
      const mockData = [{
        poseName: 'Warrior I',
        sessions: [],
        averageAccuracy: 70,
        bestAccuracy: 85,
        totalSessions: 5,
        totalDuration: 300,
        improvementTrend: 'improving' as const,
        lastPracticed: Date.now()
      }];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

      const progress = analytics.getProgressForPose('Warrior I');
      expect(progress).toEqual(mockData[0]);
    });

    test('returns null if pose not found', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const progress = analytics.getProgressForPose('NonexistentPose');
      expect(progress).toBeNull();
    });
  });

  describe('getOverallProgress', () => {
    test('calculates overall statistics correctly', () => {
      const mockData = [
        {
          poseName: 'Downward Dog',
          sessions: [
            { id: '1', poseName: 'Downward Dog', timestamp: Date.now(), duration: 60, accuracy: 80, feedback: [], suggestions: [] },
            { id: '2', poseName: 'Downward Dog', timestamp: Date.now() - 1000, duration: 45, accuracy: 85, feedback: [], suggestions: [] }
          ],
          averageAccuracy: 82,
          bestAccuracy: 85,
          totalSessions: 2,
          totalDuration: 105,
          improvementTrend: 'improving' as const,
          lastPracticed: Date.now()
        },
        {
          poseName: 'Warrior I',
          sessions: [
            { id: '3', poseName: 'Warrior I', timestamp: Date.now() - 2000, duration: 30, accuracy: 70, feedback: [], suggestions: [] }
          ],
          averageAccuracy: 70,
          bestAccuracy: 70,
          totalSessions: 1,
          totalDuration: 30,
          improvementTrend: 'insufficient_data' as const,
          lastPracticed: Date.now() - 2000
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

      const overall = analytics.getOverallProgress();
      
      expect(overall.totalSessions).toBe(3);
      expect(overall.totalDuration).toBe(135);
      expect(overall.mostPracticedPose).toBe('Downward Dog');
      expect(overall.mostImprovedPose).toBe('Downward Dog');
    });

    test('returns empty progress for no data', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const overall = analytics.getOverallProgress();
      
      expect(overall.totalSessions).toBe(0);
      expect(overall.totalDuration).toBe(0);
      expect(overall.averageAccuracy).toBe(0);
      expect(overall.mostPracticedPose).toBe('');
      expect(overall.mostImprovedPose).toBe('');
    });
  });

  describe('clearAllData', () => {
    test('removes analytics data from localStorage', () => {
      analytics.clearAllData();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('yoga_pose_analytics');
    });
  });
});

describe('Utility Functions', () => {
  describe('formatDuration', () => {
    test('formats seconds correctly', () => {
      expect(formatDuration(30)).toBe('30s');
      expect(formatDuration(45)).toBe('45s');
    });

    test('formats minutes correctly', () => {
      expect(formatDuration(60)).toBe('1m');
      expect(formatDuration(90)).toBe('1m 30s');
      expect(formatDuration(120)).toBe('2m');
    });

    test('formats hours correctly', () => {
      expect(formatDuration(3600)).toBe('1h');
      expect(formatDuration(3660)).toBe('1h 1m');
      expect(formatDuration(7200)).toBe('2h');
    });
  });

  describe('getImprovementIcon', () => {
    test('returns correct icons for trends', () => {
      expect(getImprovementIcon('improving')).toBe('📈');
      expect(getImprovementIcon('declining')).toBe('📉');
      expect(getImprovementIcon('stable')).toBe('➡️');
      expect(getImprovementIcon('insufficient_data')).toBe('❓');
    });
  });

  describe('getAccuracyColor', () => {
    test('returns correct colors for accuracy ranges', () => {
      expect(getAccuracyColor(95)).toBe('text-green-600');
      expect(getAccuracyColor(80)).toBe('text-yellow-600');
      expect(getAccuracyColor(65)).toBe('text-orange-600');
      expect(getAccuracyColor(50)).toBe('text-red-600');
    });
  });

  describe('getAccuracyLabel', () => {
    test('returns correct labels for accuracy ranges', () => {
      expect(getAccuracyLabel(95)).toBe('Excellent');
      expect(getAccuracyLabel(80)).toBe('Good');
      expect(getAccuracyLabel(65)).toBe('Fair');
      expect(getAccuracyLabel(50)).toBe('Needs Practice');
    });
  });
});