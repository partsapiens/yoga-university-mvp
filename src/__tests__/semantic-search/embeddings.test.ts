import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  generateEmbedding, 
  cosineSimilarity, 
  semanticSearch, 
  createPoseSearchText,
  createManualSearchText,
  hybridSearch 
} from '@/lib/embeddings';

// Mock OpenAI
vi.mock('@/lib/openai', () => ({
  openai: {
    embeddings: {
      create: vi.fn()
    }
  },
  isOpenAIAvailable: vi.fn(() => true)
}));

describe('Semantic Search Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('cosineSimilarity', () => {
    it('should calculate cosine similarity correctly', () => {
      const a = [1, 0, 0];
      const b = [1, 0, 0];
      expect(cosineSimilarity(a, b)).toBe(1);
    });

    it('should handle orthogonal vectors', () => {
      const a = [1, 0];
      const b = [0, 1];
      expect(cosineSimilarity(a, b)).toBe(0);
    });

    it('should throw error for different length vectors', () => {
      const a = [1, 0];
      const b = [1, 0, 0];
      expect(() => cosineSimilarity(a, b)).toThrow('Embeddings must have the same length');
    });
  });

  describe('createPoseSearchText', () => {
    it('should create searchable text from pose data', () => {
      const pose = {
        name: 'Mountain Pose',
        name_en: 'Mountain Pose',
        sanskrit: 'Tadasana',
        family_id: 'standing',
        benefits: ['improves posture', 'strengthens legs'],
        anatomical_focus: ['legs', 'core'],
        cues: ['stand tall', 'ground feet'],
        instructions: 'Stand with feet hip-width apart',
        description: 'A foundational standing pose',
        aka: ['Equal Standing Pose']
      };

      const searchText = createPoseSearchText(pose);
      expect(searchText).toContain('mountain pose');
      expect(searchText).toContain('tadasana');
      expect(searchText).toContain('standing');
      expect(searchText).toContain('improves posture');
      expect(searchText).toContain('legs');
      expect(searchText).toContain('stand tall');
    });

    it('should handle missing fields gracefully', () => {
      const pose = {
        name: 'Simple Pose'
      };

      const searchText = createPoseSearchText(pose);
      expect(searchText).toBe('simple pose');
    });
  });

  describe('createManualSearchText', () => {
    it('should create searchable text from manual data', () => {
      const item = {
        title: 'Breathing Basics',
        summary: 'Learn fundamental breathing techniques',
        content: 'Proper breathing is essential for yoga practice',
        group: 'Pranayama'
      };

      const searchText = createManualSearchText(item);
      expect(searchText).toContain('breathing basics');
      expect(searchText).toContain('fundamental breathing');
      expect(searchText).toContain('essential for yoga');
      expect(searchText).toContain('pranayama');
    });
  });

  describe('generateEmbedding', () => {
    it('should return cached embedding if available', async () => {
      const { openai } = await import('@/lib/openai');
      
      // Mock OpenAI response
      openai.embeddings.create = vi.fn().mockResolvedValue({
        data: [{ embedding: [0.1, 0.2, 0.3] }]
      });

      // First call should hit API
      const embedding1 = await generateEmbedding('unique test text 1');
      expect(embedding1).toEqual([0.1, 0.2, 0.3]);
      expect(openai.embeddings.create).toHaveBeenCalledTimes(1);

      // Second call with same text should use cache
      const embedding2 = await generateEmbedding('unique test text 1');
      expect(embedding2).toEqual([0.1, 0.2, 0.3]);
      expect(openai.embeddings.create).toHaveBeenCalledTimes(1); // Still 1, not 2
    });

    it('should handle API errors gracefully', async () => {
      const { openai } = await import('@/lib/openai');
      
      openai.embeddings.create = vi.fn().mockRejectedValue(new Error('API Error'));

      const embedding = await generateEmbedding('unique error test text');
      expect(embedding).toBeNull();
    });
  });

  describe('hybridSearch', () => {
    const mockItems = [
      { id: '1', name: 'Mountain Pose', category: 'standing' },
      { id: '2', name: 'Child Pose', category: 'restorative' },
      { id: '3', name: 'Downward Dog', category: 'inversion' }
    ];

    const mockFuzzySearch = (query: string, items: typeof mockItems) => {
      return items.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    };

    it('should fall back to fuzzy search when semantic search fails', async () => {
      const { isOpenAIAvailable } = await import('@/lib/openai');
      isOpenAIAvailable.mockReturnValue(false);

      const results = await hybridSearch('mountain', mockItems, {
        textExtractor: (item) => item.name,
        idExtractor: (item) => item.id,
        fuzzySearchFn: mockFuzzySearch,
        limit: 5
      });

      expect(results).toHaveLength(1);
      expect(results[0].item.name).toBe('Mountain Pose');
      expect(results[0].source).toBe('fuzzy');
    });

    it('should handle empty results gracefully', async () => {
      const results = await hybridSearch('nonexistent', mockItems, {
        textExtractor: (item) => item.name,
        idExtractor: (item) => item.id,
        fuzzySearchFn: mockFuzzySearch,
        limit: 5
      });

      expect(results).toHaveLength(0);
    });
  });
});