import { NextRequest, NextResponse } from 'next/server';
import { ProgressAnalyticsService, ProgressInsights } from '@/lib/services/progressAnalytics';
import { PracticeSession } from '@/types/dashboard';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'AI Progress Insights API',
    endpoints: {
      POST: {
        description: 'Generate AI-powered progress insights and recommendations',
        body: {
          sessions: 'array of practice sessions (required)',
          userId: 'string (optional for future user-specific insights)'
        }
      }
    },
    features: [
      'Practice pattern analysis using ML algorithms',
      'Optimal practice time prediction',
      'Skill development path suggestions',
      'Personalized improvement recommendations',
      'Progress forecasting and milestone prediction'
    ]
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessions, userId } = body;

    // Validate required fields
    if (!sessions || !Array.isArray(sessions)) {
      return NextResponse.json(
        { error: 'Sessions array is required' },
        { status: 400 }
      );
    }

    // Initialize the progress analytics service
    const analyticsService = ProgressAnalyticsService.getInstance();

    // Analyze practice patterns
    const practicePattern = analyticsService.analyzePracticePatterns(sessions);
    
    // Generate skill development path
    const skillDevelopment = analyticsService.generateSkillDevelopmentPath(sessions);
    
    // Predict optimal timing
    const optimalTiming = analyticsService.predictOptimalTiming(practicePattern);
    
    // Generate personalized recommendations
    const recommendations = analyticsService.generateRecommendations(
      practicePattern,
      skillDevelopment,
      sessions
    );
    
    // Calculate progress metrics
    const { progressScore, forecastedProgress } = analyticsService.calculateProgressMetrics(sessions);

    const insights: ProgressInsights = {
      practicePattern,
      skillDevelopment,
      optimalTiming,
      recommendations,
      progressScore,
      forecastedProgress
    };

    return NextResponse.json({
      success: true,
      insights,
      metadata: {
        totalSessions: sessions.length,
        analysisDate: new Date().toISOString(),
        confidence: calculateOverallConfidence(insights),
        userId: userId || 'anonymous'
      }
    });

  } catch (error) {
    console.error('Error generating progress insights:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate progress insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate overall confidence score for the insights
 */
function calculateOverallConfidence(insights: ProgressInsights): number {
  const factors = [
    insights.optimalTiming.confidence,
    insights.recommendations.length > 0 ? 
      insights.recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / insights.recommendations.length : 0.5,
    Math.min(1, insights.practicePattern.consistencyScore / 100),
    insights.practicePattern.preferredTimeSlots.length > 0 ? 0.8 : 0.3
  ];

  return Math.round((factors.reduce((sum, factor) => sum + factor, 0) / factors.length) * 100) / 100;
}