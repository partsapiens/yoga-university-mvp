import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/ai/recommendations/route';
import { NextRequest } from 'next/server';

// Mock the OpenAI lib
vi.mock('@/lib/openai', () => ({
  generateCompletion: vi.fn(),
  filterContent: vi.fn()
}));

describe('/api/ai/recommendations', () => {
  it('should return fallback recommendations when OpenAI is not available', async () => {
    const mockRequest = new NextRequest('http://localhost/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        timeOfDay: 'morning',
        dayOfWeek: 'Monday',
        userProfile: {
          preferredDurations: [10],
          favoriteStyles: ['mindfulness'],
          typicalMeditationTimes: ['morning'],
          completionRate: 80,
          averageRating: 4.5,
          recentMoods: ['energetic'],
          meditationGoals: ['stress relief']
        },
        recentSessions: []
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.recommendations).toBeDefined();
    expect(Array.isArray(data.recommendations)).toBe(true);
    expect(data.recommendations.length).toBeGreaterThan(0);
    
    // Check the structure of recommendations
    const recommendation = data.recommendations[0];
    expect(recommendation).toHaveProperty('id');
    expect(recommendation).toHaveProperty('title');
    expect(recommendation).toHaveProperty('description');
    expect(recommendation).toHaveProperty('duration');
    expect(recommendation).toHaveProperty('style');
    expect(recommendation).toHaveProperty('confidence');
    expect(recommendation).toHaveProperty('reasoning');
    expect(recommendation).toHaveProperty('tags');
  });

  it('should provide time-appropriate recommendations', async () => {
    const morningRequest = new NextRequest('http://localhost/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        timeOfDay: 'morning',
        dayOfWeek: 'Monday',
        userProfile: {
          preferredDurations: [10],
          favoriteStyles: [],
          typicalMeditationTimes: [],
          completionRate: 0,
          averageRating: 0,
          recentMoods: [],
          meditationGoals: []
        },
        recentSessions: []
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(morningRequest);
    const data = await response.json();

    expect(data.recommendations[0].title).toContain('Morning');
    expect(data.recommendations[0].tags).toContain('morning');
  });

  it('should provide mood-appropriate recommendations', async () => {
    const stressedRequest = new NextRequest('http://localhost/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        timeOfDay: 'afternoon',
        dayOfWeek: 'Wednesday',
        userProfile: {
          preferredDurations: [15],
          favoriteStyles: [],
          typicalMeditationTimes: [],
          completionRate: 0,
          averageRating: 0,
          recentMoods: ['stressed'],
          meditationGoals: []
        },
        recentSessions: [],
        currentMood: 'stressed'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(stressedRequest);
    const data = await response.json();

    const stressRecommendation = data.recommendations.find((rec: any) => 
      rec.tags.includes('stress-relief') || rec.title.toLowerCase().includes('stress')
    );
    
    expect(stressRecommendation).toBeDefined();
    expect(stressRecommendation.personalizedFor.mood).toBe('stressed');
  });

  it('should include user favorite styles in recommendations', async () => {
    const favoriteStyleRequest = new NextRequest('http://localhost/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        timeOfDay: 'afternoon',
        dayOfWeek: 'Friday',
        userProfile: {
          preferredDurations: [20],
          favoriteStyles: ['breathing'],
          typicalMeditationTimes: ['afternoon'],
          completionRate: 85,
          averageRating: 4.2,
          recentMoods: ['neutral'],
          meditationGoals: ['relaxation']
        },
        recentSessions: [
          {
            style: 'breathing',
            duration: 15,
            completed: true,
            rating: 5,
            timestamp: '2025-01-27T14:00:00Z'
          }
        ]
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(favoriteStyleRequest);
    const data = await response.json();

    const favoriteRecommendation = data.recommendations.find((rec: any) => 
      rec.style === 'breathing'
    );
    
    expect(favoriteRecommendation).toBeDefined();
    expect(favoriteRecommendation.title).toContain('Breathing');
  });

  it('should handle short available time appropriately', async () => {
    const quickSessionRequest = new NextRequest('http://localhost/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        timeOfDay: 'afternoon',
        dayOfWeek: 'Tuesday',
        userProfile: {
          preferredDurations: [10],
          favoriteStyles: [],
          typicalMeditationTimes: [],
          completionRate: 0,
          averageRating: 0,
          recentMoods: [],
          meditationGoals: []
        },
        recentSessions: [],
        availableTime: 5
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(quickSessionRequest);
    const data = await response.json();

    const quickRecommendation = data.recommendations.find((rec: any) => 
      rec.duration <= 5
    );
    
    expect(quickRecommendation).toBeDefined();
    expect(quickRecommendation.tags).toContain('quick');
  });

  it('should handle malformed requests gracefully', async () => {
    const badRequest = new NextRequest('http://localhost/api/ai/recommendations', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await POST(badRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate recommendations');
    expect(data.recommendations).toBeDefined();
    expect(Array.isArray(data.recommendations)).toBe(true);
  });
});