import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analyzeSentiment, analyzeMoodPatterns, createAnonymizedMoodData } from '@/lib/services/sentimentAnalysis';

// Mock OpenAI since we don't have API key in tests
vi.mock('openai', () => ({
  OpenAI: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                mood: 'stressed',
                confidence: 0.8,
                emotions: [{ emotion: 'stressed', intensity: 0.8 }],
                needsAttention: false,
                suggestedStyle: 'breathing',
                reasoning: 'Detected stress indicators in text'
              })
            }
          }]
        })
      }
    }
  }))
}));

describe('Sentiment Analysis Service', () => {
  beforeEach(() => {
    // Clear environment variable to force rule-based analysis
    delete process.env.OPENAI_API_KEY;
  });

  describe('analyzeSentiment', () => {
    it('should detect stressed mood from text', async () => {
      const text = "I'm so stressed about work deadlines";
      const result = await analyzeSentiment(text);

      expect(result.mood).toBe('stressed');
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.suggestedStyle).toBe('breathing');
    });

    it('should detect anxious mood from text', async () => {
      const text = "I'm feeling anxious and worried about tomorrow";
      const result = await analyzeSentiment(text);

      expect(result.mood).toBe('anxious');
      expect(result.suggestedStyle).toBe('mindfulness');
    });

    it('should detect happy mood from text', async () => {
      const text = "I'm feeling so happy and joyful today";
      const result = await analyzeSentiment(text);

      expect(result.mood).toBe('happy');
      expect(result.suggestedStyle).toBe('mindfulness');
    });

    it('should detect crisis keywords and flag for attention', async () => {
      const text = "I feel like I want to hurt myself";
      const result = await analyzeSentiment(text);

      expect(result.needsAttention).toBe(true);
    });

    it('should default to neutral for unclear text', async () => {
      const text = "The weather is nice today";
      const result = await analyzeSentiment(text);

      expect(result.mood).toBe('neutral');
      expect(result.confidence).toBeLessThanOrEqual(0.5);
    });

    it('should handle empty text gracefully', async () => {
      const text = "";
      const result = await analyzeSentiment(text);

      expect(result.mood).toBe('neutral');
      expect(result.needsAttention).toBe(false);
    });
  });

  describe('analyzeMoodPatterns', () => {
    it('should return default values for empty patterns', () => {
      const result = analyzeMoodPatterns([]);

      expect(result.dominantMood).toBe('neutral');
      expect(result.trend).toBe('stable');
      expect(result.recommendations).toContain('Start with daily mood tracking to understand your patterns');
    });

    it('should identify dominant mood from patterns', () => {
      const patterns = [
        { timestamp: '2024-01-01', mood: 'stressed', confidence: 0.8 },
        { timestamp: '2024-01-02', mood: 'stressed', confidence: 0.7 },
        { timestamp: '2024-01-03', mood: 'happy', confidence: 0.6 }
      ];

      const result = analyzeMoodPatterns(patterns);

      expect(result.dominantMood).toBe('stressed');
    });

    it('should detect improving trend', () => {
      const patterns = [
        // Previous week (negative)
        { timestamp: '2024-01-01', mood: 'stressed', confidence: 0.8 },
        { timestamp: '2024-01-02', mood: 'sad', confidence: 0.7 },
        // Recent week (positive)
        { timestamp: '2024-01-08', mood: 'happy', confidence: 0.8 },
        { timestamp: '2024-01-09', mood: 'calm', confidence: 0.7 },
        { timestamp: '2024-01-10', mood: 'energetic', confidence: 0.6 },
        { timestamp: '2024-01-11', mood: 'focused', confidence: 0.8 },
        { timestamp: '2024-01-12', mood: 'happy', confidence: 0.7 },
        { timestamp: '2024-01-13', mood: 'calm', confidence: 0.6 },
        { timestamp: '2024-01-14', mood: 'energetic', confidence: 0.8 }
      ];

      const result = analyzeMoodPatterns(patterns);

      expect(result.trend).toBe('improving');
    });

    it('should detect declining trend', () => {
      const patterns = [
        // Previous week (positive)
        { timestamp: '2024-01-01', mood: 'happy', confidence: 0.8 },
        { timestamp: '2024-01-02', mood: 'calm', confidence: 0.7 },
        { timestamp: '2024-01-03', mood: 'energetic', confidence: 0.6 },
        // Recent week (negative)
        { timestamp: '2024-01-08', mood: 'stressed', confidence: 0.8 },
        { timestamp: '2024-01-09', mood: 'anxious', confidence: 0.7 },
        { timestamp: '2024-01-10', mood: 'sad', confidence: 0.6 },
        { timestamp: '2024-01-11', mood: 'overwhelmed', confidence: 0.8 },
        { timestamp: '2024-01-12', mood: 'tired', confidence: 0.7 },
        { timestamp: '2024-01-13', mood: 'stressed', confidence: 0.6 },
        { timestamp: '2024-01-14', mood: 'anxious', confidence: 0.8 }
      ];

      const result = analyzeMoodPatterns(patterns);

      expect(result.trend).toBe('declining');
    });

    it('should provide stress-specific recommendations', () => {
      const patterns = [
        { timestamp: '2024-01-01', mood: 'stressed', confidence: 0.8 },
        { timestamp: '2024-01-02', mood: 'stressed', confidence: 0.7 },
        { timestamp: '2024-01-03', mood: 'stressed', confidence: 0.6 }
      ];

      const result = analyzeMoodPatterns(patterns);

      expect(result.recommendations).toContain('Focus on breathing exercises and gentle yoga');
    });

    it('should identify risk factors for high negative emotions', () => {
      const patterns = Array.from({ length: 7 }, (_, i) => ({
        timestamp: `2024-01-${i + 1}`,
        mood: 'stressed',
        confidence: 0.8
      }));

      const result = analyzeMoodPatterns(patterns);

      expect(result.riskFactors).toContain('High frequency of negative emotions detected');
      expect(result.recommendations).toContain('Consider speaking with a mental health professional');
    });
  });

  describe('createAnonymizedMoodData', () => {
    it('should anonymize mood data properly', () => {
      const sentimentResult = {
        mood: 'happy',
        confidence: 0.8,
        emotions: [{ emotion: 'happy', intensity: 0.8 }],
        needsAttention: false,
        suggestedStyle: 'mindfulness',
        reasoning: 'Positive sentiment detected'
      };

      const result = createAnonymizedMoodData(sentimentResult);

      expect(result.moodCategory).toBe('happy');
      expect(result.confidenceRange).toBe('high');
      expect(result.sessionType).toBe('mindfulness');
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Date only, no time
    });

    it('should categorize confidence levels correctly', () => {
      const highConfidence = createAnonymizedMoodData({
        mood: 'happy',
        confidence: 0.8,
        emotions: [],
        needsAttention: false,
        suggestedStyle: 'mindfulness',
        reasoning: 'Test'
      });

      const mediumConfidence = createAnonymizedMoodData({
        mood: 'happy',
        confidence: 0.5,
        emotions: [],
        needsAttention: false,
        suggestedStyle: 'mindfulness',
        reasoning: 'Test'
      });

      const lowConfidence = createAnonymizedMoodData({
        mood: 'happy',
        confidence: 0.3,
        emotions: [],
        needsAttention: false,
        suggestedStyle: 'mindfulness',
        reasoning: 'Test'
      });

      expect(highConfidence.confidenceRange).toBe('high');
      expect(mediumConfidence.confidenceRange).toBe('medium');
      expect(lowConfidence.confidenceRange).toBe('low');
    });
  });
});