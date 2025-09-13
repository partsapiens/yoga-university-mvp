import { OpenAI } from 'openai';
import { EnhancedRecommendationInput, Recommendation, MeditationRecommendation, RecommendationContext } from '@/types/ai';
import { analyzeSentiment, SentimentResult } from './sentimentAnalysis';
import { MoodTrackingService } from './moodTracking';
import { PoseId } from '@/types/yoga';

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

/**
 * Enhanced AI recommendation service with mood analysis and adaptive learning
 */
export class AdaptiveRecommendationService {
  private moodTracker = MoodTrackingService.getInstance();

  /**
   * Generate personalized recommendations based on mood analysis and user patterns
   */
  async generateAdaptiveRecommendations(input: EnhancedRecommendationInput): Promise<{
    recommendations: MeditationRecommendation[];
    sentimentAnalysis?: SentimentResult;
    adaptiveInsights: string[];
    confidenceScore: number;
  }> {
    let sentimentAnalysis: SentimentResult | undefined;

    // Analyze sentiment if text input is provided
    if (input.textInput) {
      sentimentAnalysis = await analyzeSentiment(input.textInput, 'meditation recommendation');
      
      // Save mood data for tracking
      this.moodTracker.saveMoodEntry(sentimentAnalysis, input.textInput);
    }

    // Get user's mood history and patterns
    const moodAnalytics = this.moodTracker.getMoodAnalytics();
    const smartRecommendations = this.moodTracker.getSmartRecommendations();

    // Determine primary mood source
    const primaryMood = sentimentAnalysis?.mood || input.mood || moodAnalytics.dominantMood;
    
    // Build context for recommendations
    const context: RecommendationContext = {
      timeOfDay: this.getTimeOfDay(),
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      userProfile: {
        preferredDurations: [input.duration],
        favoriteStyles: [],
        typicalMeditationTimes: [],
        completionRate: moodAnalytics.sessionCompletionRate,
        averageRating: 0,
        recentMoods: [primaryMood],
        meditationGoals: [],
        moodPatterns: {
          dominantMood: moodAnalytics.dominantMood,
          moodTrend: moodAnalytics.weeklyTrend,
          stressIndicators: this.identifyStressIndicators(input.moodHistory || []),
          effectiveStyles: this.getEffectiveStyles(input.moodHistory || [])
        }
      },
      recentSessions: [],
      currentMood: primaryMood,
      availableTime: input.duration,
      sentimentAnalysis,
      moodHistory: input.moodHistory
    };

    // Generate recommendations using multiple strategies
    const recommendations = await this.generateMultiModalRecommendations(context, input);
    
    // Generate adaptive insights
    const adaptiveInsights = this.generateAdaptiveInsights(context, smartRecommendations, moodAnalytics);

    // Calculate overall confidence score
    const confidenceScore = this.calculateConfidenceScore(sentimentAnalysis, moodAnalytics, input);

    return {
      recommendations,
      sentimentAnalysis,
      adaptiveInsights,
      confidenceScore
    };
  }

  /**
   * Generate recommendations using multiple strategies
   */
  private async generateMultiModalRecommendations(
    context: RecommendationContext,
    input: EnhancedRecommendationInput
  ): Promise<MeditationRecommendation[]> {
    const recommendations: MeditationRecommendation[] = [];

    // 1. Mood-based recommendations
    const moodBasedRecs = this.generateMoodBasedRecommendations(context, input);
    recommendations.push(...moodBasedRecs);

    // 2. Pattern-based recommendations
    const patternBasedRecs = this.generatePatternBasedRecommendations(context);
    recommendations.push(...patternBasedRecs);

    // 3. Biometric-based recommendations (if available)
    if (input.biometricData) {
      const biometricRecs = this.generateBiometricRecommendations(input.biometricData, context);
      recommendations.push(...biometricRecs);
    }

    // 4. AI-enhanced recommendations (if OpenAI available)
    if (openai && context.sentimentAnalysis) {
      const aiRecs = await this.generateAIEnhancedRecommendations(context, input);
      recommendations.push(...aiRecs);
    }

    // Sort by confidence and relevance
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Generate mood-based recommendations
   */
  private generateMoodBasedRecommendations(
    context: RecommendationContext,
    input: EnhancedRecommendationInput
  ): MeditationRecommendation[] {
    const mood = context.currentMood || 'neutral';
    const timeOfDay = context.timeOfDay;

    const moodStrategies: Record<string, MeditationRecommendation> = {
      stressed: {
        id: 'stress-relief',
        title: 'Stress Relief Breathing',
        description: 'Calming breathing exercises to reduce stress and tension',
        duration: Math.min(input.duration, 15),
        style: 'breathing',
        confidence: 0.9,
        reasoning: 'Breathing exercises are scientifically proven to activate the parasympathetic nervous system, reducing stress',
        tags: ['stress-relief', 'breathing', 'calming'],
        timeOfDay: timeOfDay as any,
        personalizedFor: {
          mood: 'stressed',
          stressLevel: 'high'
        }
      },
      anxious: {
        id: 'anxiety-mindfulness',
        title: 'Grounding Mindfulness',
        description: 'Present-moment awareness to calm anxious thoughts',
        duration: input.duration,
        style: 'mindfulness',
        confidence: 0.85,
        reasoning: 'Mindfulness helps you observe anxious thoughts without getting caught up in them',
        tags: ['anxiety-relief', 'mindfulness', 'grounding'],
        timeOfDay: timeOfDay as any,
        personalizedFor: {
          mood: 'anxious',
          stressLevel: 'medium'
        }
      },
      tired: {
        id: 'energy-restoration',
        title: 'Gentle Energy Restoration',
        description: 'Restorative practice to naturally boost energy',
        duration: Math.max(input.duration, 10),
        style: 'body-scan',
        confidence: 0.8,
        reasoning: 'Body-scan meditation helps release physical tension and restore natural energy',
        tags: ['energy', 'restoration', 'body-scan'],
        timeOfDay: timeOfDay as any,
        personalizedFor: {
          mood: 'tired',
          energyLevel: 'low'
        }
      },
      sad: {
        id: 'loving-kindness',
        title: 'Self-Compassion Practice',
        description: 'Loving-kindness meditation to nurture emotional wellbeing',
        duration: input.duration,
        style: 'loving-kindness',
        confidence: 0.8,
        reasoning: 'Loving-kindness meditation helps cultivate positive emotions and self-compassion',
        tags: ['self-compassion', 'emotional-healing', 'loving-kindness'],
        timeOfDay: timeOfDay as any,
        personalizedFor: {
          mood: 'sad'
        }
      },
      happy: {
        id: 'gratitude-mindfulness',
        title: 'Gratitude & Joy Meditation',
        description: 'Cultivate and expand feelings of joy and gratitude',
        duration: input.duration,
        style: 'mindfulness',
        confidence: 0.75,
        reasoning: 'When feeling good, meditation can help you appreciate and extend positive emotions',
        tags: ['gratitude', 'joy', 'positive-emotions'],
        timeOfDay: timeOfDay as any,
        personalizedFor: {
          mood: 'happy'
        }
      },
      energetic: {
        id: 'focused-concentration',
        title: 'Focused Concentration',
        description: 'Channel your energy into focused attention training',
        duration: Math.min(input.duration, 20),
        style: 'focus',
        confidence: 0.8,
        reasoning: 'High energy is perfect for concentration practices that require sustained attention',
        tags: ['focus', 'concentration', 'energy'],
        timeOfDay: timeOfDay as any,
        personalizedFor: {
          mood: 'energetic',
          energyLevel: 'high'
        }
      }
    };

    const recommendation = moodStrategies[mood];
    return recommendation ? [recommendation] : [];
  }

  /**
   * Generate pattern-based recommendations from user history
   */
  private generatePatternBasedRecommendations(context: RecommendationContext): MeditationRecommendation[] {
    const recommendations: MeditationRecommendation[] = [];
    const moodPatterns = context.userProfile.moodPatterns;

    if (!moodPatterns) return recommendations;

    // Trend-based recommendations
    if (moodPatterns.moodTrend === 'declining') {
      recommendations.push({
        id: 'trend-support',
        title: 'Emotional Support Practice',
        description: 'Extra support during challenging times',
        duration: 15,
        style: 'loving-kindness',
        confidence: 0.7,
        reasoning: 'Your mood patterns suggest you could benefit from extra emotional support',
        tags: ['emotional-support', 'challenging-times'],
        timeOfDay: context.timeOfDay as any
      });
    } else if (moodPatterns.moodTrend === 'improving') {
      recommendations.push({
        id: 'momentum-building',
        title: 'Momentum Building Practice',
        description: 'Maintain your positive momentum',
        duration: 12,
        style: 'mindfulness',
        confidence: 0.6,
        reasoning: 'Keep building on your recent positive progress',
        tags: ['momentum', 'positive-progress'],
        timeOfDay: context.timeOfDay as any
      });
    }

    return recommendations;
  }

  /**
   * Generate biometric-based recommendations
   */
  private generateBiometricRecommendations(
    biometrics: NonNullable<EnhancedRecommendationInput['biometricData']>,
    context: RecommendationContext
  ): MeditationRecommendation[] {
    const recommendations: MeditationRecommendation[] = [];

    // Heart rate variability recommendations
    if (biometrics.heartRateVariability !== undefined) {
      if (biometrics.heartRateVariability < 20) {
        recommendations.push({
          id: 'hrv-breathing',
          title: 'HRV Coherence Breathing',
          description: 'Breathing pattern optimized for heart rate variability',
          duration: 10,
          style: 'breathing',
          confidence: 0.9,
          reasoning: 'Your HRV data suggests focused breathing exercises would be beneficial',
          tags: ['hrv', 'heart-coherence', 'breathing'],
          breathingPattern: {
            name: 'HRV Coherence Breathing',
            inhale: 4,
            hold1: 4,
            exhale: 6,
            hold2: 2,
            description: 'Heart rate variability coherence pattern'
          }
        });
      }
    }

    // Stress level recommendations
    if (biometrics.stressLevel === 'high') {
      recommendations.push({
        id: 'stress-biometric',
        title: 'Physiological Stress Relief',
        description: 'Targeted practice based on your stress indicators',
        duration: 15,
        style: 'body-scan',
        confidence: 0.85,
        reasoning: 'Your biometric data indicates elevated stress levels',
        tags: ['biometric-guided', 'stress-relief'],
      });
    }

    return recommendations;
  }

  /**
   * Generate AI-enhanced recommendations using OpenAI
   */
  private async generateAIEnhancedRecommendations(
    context: RecommendationContext,
    input: EnhancedRecommendationInput
  ): Promise<MeditationRecommendation[]> {
    if (!openai) return [];

    try {
      const prompt = `
Based on this user context, generate a personalized meditation recommendation:

Mood: ${context.currentMood}
Sentiment Analysis: ${JSON.stringify(context.sentimentAnalysis)}
Time of Day: ${context.timeOfDay}
Available Time: ${context.availableTime} minutes
Mood Trend: ${context.userProfile.moodPatterns?.moodTrend}
Completion Rate: ${context.userProfile.completionRate}

User Input: "${input.textInput || 'No specific input'}"

Generate a JSON response with a single highly personalized recommendation:
{
  "id": "unique-id",
  "title": "engaging title",
  "description": "personalized description addressing their specific needs",
  "duration": number (minutes),
  "style": "meditation style",
  "confidence": 0.0-1.0,
  "reasoning": "detailed explanation of why this recommendation fits their current state",
  "tags": ["relevant", "tags"],
  "personalizedElements": "specific elements tailored to their input"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert meditation teacher creating personalized recommendations based on detailed user context. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.4,
      });

      const result = response.choices[0]?.message?.content;
      if (result) {
        const recommendation = JSON.parse(result);
        return [recommendation];
      }
    } catch (error) {
      console.warn('AI recommendation generation failed:', error);
    }

    return [];
  }

  // Helper methods
  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  private identifyStressIndicators(moodHistory: Array<{ mood: string }>): string[] {
    const stressfulMoods = ['stressed', 'anxious', 'overwhelmed', 'tired'];
    const recent = moodHistory.slice(-7);
    const stressCount = recent.filter(m => stressfulMoods.includes(m.mood)).length;
    
    if (stressCount > 4) return ['high-stress-frequency'];
    if (stressCount > 2) return ['moderate-stress'];
    return [];
  }

  private getEffectiveStyles(moodHistory: Array<{ mood: string }>): string[] {
    // This would ideally be based on completion rates and feedback
    // For now, return common effective styles
    return ['mindfulness', 'breathing'];
  }

  private generateAdaptiveInsights(
    context: RecommendationContext,
    smartRecommendations: any[],
    moodAnalytics: any
  ): string[] {
    const insights: string[] = [];

    if (moodAnalytics.totalEntries > 10) {
      insights.push(`Based on ${moodAnalytics.totalEntries} mood entries, your most common state is ${moodAnalytics.dominantMood}`);
    }

    if (context.userProfile.moodPatterns?.moodTrend === 'improving') {
      insights.push('Your mood trend is improving over the past week - great progress!');
    }

    if (context.sentimentAnalysis?.needsAttention) {
      insights.push('Your current message suggests you might benefit from professional support alongside meditation');
    }

    smartRecommendations.forEach(rec => {
      insights.push(rec.reasoning);
    });

    return insights;
  }

  private calculateConfidenceScore(
    sentimentAnalysis?: SentimentResult,
    moodAnalytics?: any,
    input?: EnhancedRecommendationInput
  ): number {
    let score = 0.5; // Base confidence

    if (sentimentAnalysis) {
      score += sentimentAnalysis.confidence * 0.3;
    }

    if (moodAnalytics?.totalEntries > 5) {
      score += 0.2; // More data = higher confidence
    }

    if (input?.textInput && input.textInput.length > 20) {
      score += 0.1; // Detailed input = better analysis
    }

    return Math.min(score, 1.0);
  }
}