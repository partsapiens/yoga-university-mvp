import { NextRequest, NextResponse } from 'next/server';
import { AdaptiveRecommendationService } from '@/lib/services/adaptiveRecommendations';
import { EnhancedRecommendationInput } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: EnhancedRecommendationInput = body;

    // Validate required fields
    if (!input.mood && !input.textInput) {
      return NextResponse.json(
        { error: 'Either mood or textInput is required' },
        { status: 400 }
      );
    }

    // Initialize the adaptive recommendation service
    const adaptiveService = new AdaptiveRecommendationService();

    // Generate adaptive recommendations
    const result = await adaptiveService.generateAdaptiveRecommendations(input);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating adaptive recommendations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Adaptive Mood Recommendations API',
    endpoints: {
      POST: {
        description: 'Generate personalized recommendations based on mood analysis',
        body: {
          mood: 'string (optional if textInput provided)',
          textInput: 'string (optional if mood provided)',
          duration: 'number (required)',
          intensity: 'number (1-5)',
          focus: 'string',
          injuries: 'string (optional)',
          moodHistory: 'array (optional)',
          biometricData: 'object (optional)',
          previousRecommendationFeedback: 'array (optional)'
        }
      }
    },
    features: [
      'Sentiment analysis of text input',
      'Mood pattern recognition',
      'Adaptive learning from user feedback',
      'Biometric data integration (optional)',
      'Privacy-first local mood tracking'
    ]
  });
}