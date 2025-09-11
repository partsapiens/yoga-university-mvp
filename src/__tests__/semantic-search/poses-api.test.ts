import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from '@/app/api/search/poses/route';

// Mock dependencies
vi.mock('@/lib/database', () => ({
  getPosesFromDatabase: vi.fn()
}));

vi.mock('@/lib/embeddings', () => ({
  hybridSearch: vi.fn(),
  createPoseSearchText: vi.fn()
}));

vi.mock('fuse.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      search: vi.fn().mockReturnValue([])
    }))
  };
});

describe('/api/search/poses', () => {
  const mockPoses = [
    {
      id: '1',
      name: 'Mountain Pose',
      sanskrit: 'Tadasana',
      family: 'standing',
      level: 'beginner',
      benefits: ['improves posture'],
      anatomical_focus: ['legs', 'core'],
      thumbnail_url: '/images/mountain.jpg'
    },
    {
      id: '2',
      name: 'Child Pose',
      sanskrit: 'Balasana',
      family: 'restorative',
      level: 'beginner',
      benefits: ['calms mind'],
      anatomical_focus: ['back', 'hips'],
      thumbnail_url: '/images/child.jpg'
    }
  ];

  describe('GET /api/search/poses', () => {
    it('should return error when query parameter is missing', async () => {
      const request = new Request('http://localhost:3000/api/search/poses');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Query parameter is required');
    });

    it('should return empty results when no poses available', async () => {
      const { getPosesFromDatabase } = await import('@/lib/database');
      getPosesFromDatabase.mockResolvedValue([]);

      const request = new Request('http://localhost:3000/api/search/poses?q=mountain');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.results).toEqual([]);
      expect(data.message).toBe('No poses available');
    });

    it('should perform search and return results', async () => {
      const { getPosesFromDatabase } = await import('@/lib/database');
      const { hybridSearch } = await import('@/lib/embeddings');
      
      getPosesFromDatabase.mockResolvedValue(mockPoses);
      hybridSearch.mockResolvedValue([
        {
          item: mockPoses[0],
          score: 0.9,
          source: 'semantic'
        }
      ]);

      const request = new Request('http://localhost:3000/api/search/poses?q=mountain&limit=5');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.results).toHaveLength(1);
      expect(data.results[0].displayName).toBe('Mountain Pose');
      expect(data.results[0].searchSource).toBe('semantic');
      expect(data.query).toBe('mountain');
      expect(data.totalResults).toBe(1);
    });

    it('should handle search errors gracefully', async () => {
      const { getPosesFromDatabase } = await import('@/lib/database');
      getPosesFromDatabase.mockRejectedValue(new Error('Database error'));

      const request = new Request('http://localhost:3000/api/search/poses?q=mountain');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
      expect(data.message).toBe('Failed to search poses');
    });
  });

  describe('POST /api/search/poses', () => {
    it('should return error when query is missing', async () => {
      const request = new Request('http://localhost:3000/api/search/poses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Query is required');
    });

    it('should apply filters and perform search', async () => {
      const { getPosesFromDatabase } = await import('@/lib/database');
      const { hybridSearch } = await import('@/lib/embeddings');
      
      getPosesFromDatabase.mockResolvedValue(mockPoses);
      hybridSearch.mockResolvedValue([
        {
          item: mockPoses[1],
          score: 0.8,
          source: 'hybrid'
        }
      ]);

      const request = new Request('http://localhost:3000/api/search/poses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'relaxing',
          filters: {
            category: ['restorative'],
            difficulty: ['beginner']
          },
          limit: 10
        })
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.results).toHaveLength(1);
      expect(data.results[0].displayName).toBe('Child Pose');
      expect(data.results[0].searchSource).toBe('hybrid');
      expect(data.filters).toEqual({
        category: ['restorative'],
        difficulty: ['beginner']
      });
      expect(data.totalPoses).toBe(2);
    });

    it('should handle malformed JSON gracefully', async () => {
      const request = new Request('http://localhost:3000/api/search/poses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
    });
  });
});