import { vi } from 'vitest';

export const getPosesFromDatabase = vi.fn().mockResolvedValue([
  {
    id: '1',
    name: 'Test Pose',
    slug: 'test-pose',
    category: 'test-category',
    sanskrit: 'Test Sanskrit',
    level: 'beginner',
    intensity: 'low',
    anatomical_focus: ['back', 'legs'],
    benefits: ['flexibility', 'strength'],
  },
]);

export const testSupabaseConnection = vi.fn().mockResolvedValue(true);

export const debugDatabaseConnection = vi.fn().mockResolvedValue(undefined);
