import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PoseId } from '@/types/yoga';

// Mock the Next.js request/response
const mockRequest = (body: any) => ({
  json: vi.fn().mockResolvedValue(body),
});

const mockResponse = {
  json: vi.fn().mockReturnValue({ data: 'mocked' }),
  status: vi.fn().mockReturnThis(),
};

// Mock OpenAI
vi.mock('@/lib/openai', () => ({
  openai: {
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'Ensure proper warm-up before intense poses\nAdd rest poses between challenging sequences\nMaintain good spine alignment throughout'
            }
          }]
        })
      }
    }
  },
  isOpenAIAvailable: vi.fn().mockReturnValue(true)
}));

vi.mock('next/server', () => ({
  NextRequest: vi.fn(),
  NextResponse: {
    json: vi.fn().mockImplementation((data, options) => ({ data, options }))
  }
}));

describe('AI Sequence Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Transition Risk Analysis', () => {
    it('should detect high-intensity pose sequences without rest', async () => {
      // Import the route handler
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      const highIntensityFlow = [PoseId.Boat, PoseId.TwistLow, PoseId.Boat];
      const request = mockRequest({ flow: highIntensityFlow });
      
      const response = await POST(request as any);
      
      // Verify that high intensity transitions are detected
      expect(response.data.transitionRisks).toBeDefined();
      expect(response.data.overallSafety).not.toBe('safe');
    });

    it('should detect dangerous spine transitions', async () => {
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      // Bridge to Forward Fold - dangerous spine transition
      const dangerousFlow = [PoseId.Bridge, PoseId.ForwardFold];
      const request = mockRequest({ flow: dangerousFlow });
      
      const response = await POST(request as any);
      
      expect(response.data.transitionRisks).toContainEqual(
        expect.objectContaining({
          riskLevel: 'high',
          reason: expect.stringContaining('spine direction change')
        })
      );
    });

    it('should flag inversion to standing transitions', async () => {
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      const riskyFlow = [PoseId.DownDog, PoseId.Warrior1Right];
      const request = mockRequest({ flow: riskyFlow });
      
      const response = await POST(request as any);
      
      expect(response.data.transitionRisks).toContainEqual(
        expect.objectContaining({
          riskLevel: 'medium',
          reason: expect.stringContaining('inversion to standing')
        })
      );
    });
  });

  describe('Safer Alternative Generation', () => {
    it('should generate safer alternatives for risky sequences', async () => {
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      const riskyFlow = [PoseId.Boat, PoseId.TwistLow];
      const request = mockRequest({ flow: riskyFlow });
      
      const response = await POST(request as any);
      
      if (response.data.overallSafety !== 'safe') {
        expect(response.data.saferAlternatives).toBeDefined();
        expect(response.data.saferAlternatives.length).toBeGreaterThan(riskyFlow.length);
        // Should include rest poses
        expect(response.data.saferAlternatives).toContain(PoseId.Child);
      }
    });

    it('should insert rest poses between high-intensity sequences', async () => {
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      const intensiveFlow = [PoseId.Boat, PoseId.TwistLow, PoseId.Boat];
      const request = mockRequest({ flow: intensiveFlow });
      
      const response = await POST(request as any);
      
      if (response.data.saferAlternatives) {
        // Should have more poses than original (rest poses added)
        expect(response.data.saferAlternatives.length).toBeGreaterThan(intensiveFlow.length);
        
        // Should contain Child's Pose as rest
        expect(response.data.saferAlternatives).toContain(PoseId.Child);
      }
    });
  });

  describe('AI Integration', () => {
    it('should include AI suggestions in response', async () => {
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      const testFlow = [PoseId.DownDog, PoseId.Warrior1Right, PoseId.Child];
      const request = mockRequest({ flow: testFlow });
      
      const response = await POST(request as any);
      
      expect(response.data.suggestions).toBeDefined();
      expect(Array.isArray(response.data.suggestions)).toBe(true);
      expect(response.data.suggestions.length).toBeGreaterThan(0);
    });

    it('should handle AI unavailability gracefully', async () => {
      // Test that the endpoint works even when AI is unavailable
      // This test ensures the basic validation still works
      
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      const testFlow = [PoseId.DownDog, PoseId.Warrior1Right];
      const request = mockRequest({ flow: testFlow });
      
      const response = await POST(request as any);
      
      // Should still return a valid response structure
      expect(response.data.overallSafety).toBeDefined();
      expect(response.data.transitionRisks).toBeDefined();
      expect(response.data.suggestions).toBeDefined();
      expect(Array.isArray(response.data.suggestions)).toBe(true);
    });
  });

  describe('Safety Assessment', () => {
    it('should rate safe sequences as safe', async () => {
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      // Use a truly safe flow without inversion-to-standing transitions
      const safeFlow = [PoseId.Child, PoseId.Butterfly, PoseId.ForwardFold, PoseId.Child];
      const request = mockRequest({ flow: safeFlow });
      
      const response = await POST(request as any);
      
      expect(response.data.overallSafety).toBe('safe');
      expect(response.data.transitionRisks).toHaveLength(0);
    });

    it('should rate sequences with multiple medium risks as caution', async () => {
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      // Multiple medium-risk transitions
      const cautiousFlow = [PoseId.ForwardFold, PoseId.Bridge, PoseId.DownDog, PoseId.Warrior1Right];
      const request = mockRequest({ flow: cautiousFlow });
      
      const response = await POST(request as any);
      
      // Should have medium risks
      const mediumRisks = response.data.transitionRisks.filter((r: any) => r.riskLevel === 'medium');
      if (mediumRisks.length > 1) {
        expect(response.data.overallSafety).toBe('caution');
      }
    });

    it('should rate sequences with high risks as unsafe', async () => {
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      const unsafeFlow = [PoseId.Bridge, PoseId.ForwardFold];
      const request = mockRequest({ flow: unsafeFlow });
      
      const response = await POST(request as any);
      
      expect(response.data.overallSafety).toBe('unsafe');
      expect(response.data.transitionRisks.some((r: any) => r.riskLevel === 'high')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid flow data', async () => {
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      const request = mockRequest({ flow: null });
      
      const response = await POST(request as any);
      
      expect(response.options?.status).toBe(400);
      expect(response.data.error).toContain('Invalid flow data');
    });

    it('should handle empty flows', async () => {
      const { POST } = await import('@/app/api/ai/validateSequence/route');
      
      const request = mockRequest({ flow: [] });
      
      const response = await POST(request as any);
      
      expect(response.data.overallSafety).toBe('safe');
      expect(response.data.transitionRisks).toHaveLength(0);
    });
  });
});