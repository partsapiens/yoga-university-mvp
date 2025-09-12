import { describe, test, expect, vi, beforeEach } from 'vitest';
import { 
  PoseDetector, 
  calculateAngle, 
  getKeypointByName, 
  calculateDistance,
  isKeypointVisible,
  analyzeDownwardDog,
  analyzeWarriorI,
  analyzeGenericPose
} from '@/lib/pose-detection';

// Mock TensorFlow.js
vi.mock('@tensorflow/tfjs', () => ({
  ready: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@tensorflow-models/pose-detection', () => ({
  createDetector: vi.fn().mockResolvedValue({
    estimatePoses: vi.fn().mockResolvedValue([]),
    dispose: vi.fn(),
  }),
  SupportedModels: {
    MoveNet: 'MoveNet',
  },
  movenet: {
    modelType: {
      SINGLEPOSE_THUNDER: 'singlepose-thunder',
    },
  },
}));

describe('Pose Detection Utilities', () => {
  describe('calculateAngle', () => {
    test('calculates angle between three points correctly', () => {
      const p1 = { x: 0, y: 0, score: 1, name: 'point1' };
      const p2 = { x: 1, y: 0, score: 1, name: 'point2' };
      const p3 = { x: 1, y: 1, score: 1, name: 'point3' };
      
      const angle = calculateAngle(p1, p2, p3);
      expect(angle).toBe(90);
    });
  });

  describe('calculateDistance', () => {
    test('calculates distance between two points correctly', () => {
      const p1 = { x: 0, y: 0, score: 1, name: 'point1' };
      const p2 = { x: 3, y: 4, score: 1, name: 'point2' };
      
      const distance = calculateDistance(p1, p2);
      expect(distance).toBe(5);
    });
  });

  describe('isKeypointVisible', () => {
    test('returns true for high confidence keypoints', () => {
      const keypoint = { x: 100, y: 100, score: 0.8, name: 'test' };
      expect(isKeypointVisible(keypoint)).toBe(true);
    });

    test('returns false for low confidence keypoints', () => {
      const keypoint = { x: 100, y: 100, score: 0.1, name: 'test' };
      expect(isKeypointVisible(keypoint)).toBe(false);
    });

    test('uses custom threshold', () => {
      const keypoint = { x: 100, y: 100, score: 0.5, name: 'test' };
      expect(isKeypointVisible(keypoint, 0.6)).toBe(false);
      expect(isKeypointVisible(keypoint, 0.4)).toBe(true);
    });
  });

  describe('getKeypointByName', () => {
    test('finds keypoint by name', () => {
      const pose = {
        keypoints: [
          { x: 100, y: 100, score: 0.8, name: 'left_shoulder' },
          { x: 200, y: 200, score: 0.9, name: 'right_shoulder' },
        ],
        score: 0.85,
      };

      const keypoint = getKeypointByName(pose, 'left_shoulder');
      expect(keypoint).toEqual({ x: 100, y: 100, score: 0.8, name: 'left_shoulder' });
    });

    test('returns null for non-existent keypoint', () => {
      const pose = {
        keypoints: [
          { x: 100, y: 100, score: 0.8, name: 'left_shoulder' },
        ],
        score: 0.85,
      };

      const keypoint = getKeypointByName(pose, 'nonexistent');
      expect(keypoint).toBeNull();
    });
  });
});

describe('Pose Analysis Functions', () => {
  const createMockPose = (keypoints: any[]) => ({
    keypoints,
    score: 0.8,
  });

  describe('analyzeDownwardDog', () => {
    test('returns error for missing keypoints', () => {
      const incompletePose = createMockPose([
        { x: 100, y: 100, score: 0.8, name: 'left_wrist' },
      ]);

      const result = analyzeDownwardDog(incompletePose);
      expect(result.accuracy).toBe(0);
      expect(result.feedback[0]).toContain('Unable to detect all key body points');
    });

    test('analyzes complete pose correctly', () => {
      const completePose = createMockPose([
        { x: 100, y: 200, score: 0.8, name: 'left_wrist' },
        { x: 200, y: 200, score: 0.8, name: 'right_wrist' },
        { x: 100, y: 300, score: 0.8, name: 'left_ankle' },
        { x: 200, y: 300, score: 0.8, name: 'right_ankle' },
        { x: 110, y: 150, score: 0.8, name: 'left_shoulder' },
        { x: 190, y: 150, score: 0.8, name: 'right_shoulder' },
        { x: 120, y: 100, score: 0.8, name: 'left_hip' },
        { x: 180, y: 100, score: 0.8, name: 'right_hip' },
      ]);

      const result = analyzeDownwardDog(completePose);
      expect(result.accuracy).toBeGreaterThan(0);
      expect(result.pose).toBe(completePose);
      expect(Array.isArray(result.feedback)).toBe(true);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });

  describe('analyzeWarriorI', () => {
    test('analyzes warrior pose with proper feedback', () => {
      const warriorPose = createMockPose([
        { x: 150, y: 250, score: 0.8, name: 'left_knee' },
        { x: 250, y: 280, score: 0.8, name: 'right_knee' },
        { x: 150, y: 300, score: 0.8, name: 'left_ankle' },
        { x: 250, y: 350, score: 0.8, name: 'right_ankle' },
        { x: 150, y: 150, score: 0.8, name: 'left_hip' },
        { x: 250, y: 180, score: 0.8, name: 'right_hip' },
        { x: 150, y: 100, score: 0.8, name: 'left_shoulder' },
        { x: 250, y: 100, score: 0.8, name: 'right_shoulder' },
      ]);

      const result = analyzeWarriorI(warriorPose);
      expect(result.accuracy).toBeGreaterThan(0);
      expect(result.pose).toBe(warriorPose);
    });
  });

  describe('analyzeGenericPose', () => {
    test('provides basic analysis for any pose', () => {
      const genericPose = createMockPose([
        { x: 100, y: 100, score: 0.8, name: 'left_shoulder' },
        { x: 200, y: 100, score: 0.8, name: 'right_shoulder' },
        { x: 100, y: 200, score: 0.8, name: 'left_hip' },
        { x: 200, y: 200, score: 0.8, name: 'right_hip' },
      ]);

      const result = analyzeGenericPose(genericPose, 'Test Pose');
      expect(result.accuracy).toBeGreaterThan(0);
      expect(result.pose).toBe(genericPose);
      expect(result.suggestions).toContain('Focus on proper alignment for Test Pose');
    });

    test('handles low visibility poses', () => {
      const lowVisibilityPose = createMockPose([
        { x: 100, y: 100, score: 0.1, name: 'left_shoulder' },
        { x: 200, y: 100, score: 0.1, name: 'right_shoulder' },
      ]);

      const result = analyzeGenericPose(lowVisibilityPose, 'Test Pose');
      expect(result.accuracy).toBeLessThan(60);
      expect(result.feedback[0]).toContain('Some body parts are not clearly visible');
    });
  });
});

describe('PoseDetector', () => {
  let detector: PoseDetector;

  beforeEach(() => {
    detector = new PoseDetector();
  });

  test('initializes without errors', async () => {
    await expect(detector.initialize()).resolves.not.toThrow();
  });

  test('disposes properly', async () => {
    await detector.initialize();
    await expect(detector.dispose()).resolves.not.toThrow();
  });
});