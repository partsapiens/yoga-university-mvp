import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion, filterContent } from '@/lib/openai';
import { MeditationRecommendation, RecommendationContext, UserMeditationProfile } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationContext = await request.json();
    const { 
      timeOfDay, 
      dayOfWeek, 
      userProfile, 
      recentSessions = [], 
      currentMood,
      availableTime 
    } = body;

    // Generate personalized recommendations
    const recommendations = await generatePersonalizedRecommendations(body);
    
    return NextResponse.json({ recommendations });

  } catch (error) {
    console.error('Recommendations API error:', error);
    
    // Create fallback context for error case
    const fallbackContext: RecommendationContext = {
      timeOfDay: 'afternoon',
      dayOfWeek: 'Monday',
      userProfile: {
        preferredDurations: [10],
        favoriteStyles: ['mindfulness'],
        typicalMeditationTimes: ['afternoon'],
        completionRate: 0,
        averageRating: 0,
        recentMoods: ['neutral'],
        meditationGoals: ['stress relief']
      },
      recentSessions: []
    };
    
    return NextResponse.json({ 
      error: 'Failed to generate recommendations',
      recommendations: generateFallbackRecommendations(fallbackContext)
    }, { status: 500 });
  }
}

async function generatePersonalizedRecommendations(
  context: RecommendationContext
): Promise<MeditationRecommendation[]> {
  const { timeOfDay, userProfile, recentSessions, currentMood, availableTime } = context;
  
  // Build context for AI prompt
  const recentSessionsText = recentSessions.length > 0 
    ? recentSessions.slice(-5).map(s => 
        `${s.style} (${s.duration}min, ${s.completed ? 'completed' : 'incomplete'}${s.rating ? `, rated ${s.rating}/5` : ''}, mood: ${s.mood || 'unknown'})`
      ).join(', ')
    : 'No recent sessions';

  const userPreferencesText = `
    Preferred durations: ${userProfile.preferredDurations.join(', ')} minutes
    Favorite styles: ${userProfile.favoriteStyles.join(', ')}
    Typical meditation times: ${userProfile.typicalMeditationTimes.join(', ')}
    Completion rate: ${userProfile.completionRate}%
    Average rating: ${userProfile.averageRating}/5
    Recent moods: ${userProfile.recentMoods.join(', ')}
    Goals: ${userProfile.meditationGoals.join(', ')}
  `;

  const prompt = `Based on user context, generate 3-4 personalized meditation recommendations.

Time context: ${timeOfDay} 
Current mood: ${currentMood || 'unknown'}
Available time: ${availableTime || 'flexible'} minutes

User profile:
${userPreferencesText}

Recent sessions (last 5):
${recentSessionsText}

Available meditation styles: Mindfulness, Breathing, Body Scan, Loving Kindness, Sleep, Focus, Progressive Relaxation

Consider:
- User's historical preferences and completion patterns
- Time appropriateness (energizing vs calming)
- Variety to avoid repetition from recent sessions
- Progression based on experience level
- Mood-appropriate recommendations
- Duration preferences and available time

Return JSON array of recommendations with this format:
[
  {
    "id": "unique_id",
    "title": "Short descriptive title",
    "description": "Brief explanation of what this meditation involves",
    "duration": number_in_minutes,
    "style": "meditation_style",
    "confidence": number_0_to_1,
    "reasoning": "Why this is recommended for the user right now",
    "tags": ["tag1", "tag2"],
    "timeOfDay": "morning|afternoon|evening|night",
    "breathingPattern": {"name": "pattern_name", "inhale": 4, "exhale": 6, "description": "brief_description"},
    "personalizedFor": {
      "mood": "current_mood",
      "energyLevel": "low|medium|high",
      "stressLevel": "low|medium|high",
      "experience": "beginner|intermediate|advanced"
    }
  }
]`;

  try {
    // Generate AI response
    const aiResponse = await generateCompletion(prompt, 'complex', 0.7);
    const filteredResponse = filterContent(aiResponse);

    // Parse JSON response
    const jsonMatch = filteredResponse.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : filteredResponse;
    const parsedRecommendations = JSON.parse(jsonStr);
    
    return parsedRecommendations.map((rec: any) => ({
      id: rec.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: rec.title || 'Personalized Meditation',
      description: rec.description || 'A meditation tailored to your needs',
      duration: Math.min(Math.max(rec.duration || 10, 3), 60),
      style: rec.style || 'mindfulness',
      confidence: Math.min(Math.max(rec.confidence || 0.8, 0), 1),
      reasoning: rec.reasoning || 'Recommended based on your preferences',
      tags: Array.isArray(rec.tags) ? rec.tags : ['personalized'],
      timeOfDay: rec.timeOfDay || timeOfDay,
      breathingPattern: rec.breathingPattern,
      personalizedFor: rec.personalizedFor || {
        mood: currentMood,
        energyLevel: 'medium',
        stressLevel: 'medium',
        experience: 'beginner'
      }
    }));

  } catch (parseError) {
    console.error('Failed to parse AI recommendations:', parseError);
    return generateFallbackRecommendations(context);
  }
}

function generateFallbackRecommendations(context: RecommendationContext): MeditationRecommendation[] {
  const { timeOfDay, userProfile, currentMood, availableTime } = context;
  
  const recommendations: MeditationRecommendation[] = [];
  
  // Time-based recommendation
  if (timeOfDay === 'morning') {
    recommendations.push({
      id: 'morning_energizer',
      title: 'Morning Energizer',
      description: 'Start your day with focused breathing and intention setting',
      duration: availableTime || userProfile.preferredDurations[0] || 10,
      style: 'mindfulness',
      confidence: 0.8,
      reasoning: 'Perfect way to begin your day with clarity and energy',
      tags: ['morning', 'energy', 'focus'],
      timeOfDay: 'morning',
      breathingPattern: {
        name: 'Energizing Breath',
        inhale: 4,
        exhale: 4,
        description: 'Balanced breathing for morning energy'
      },
      personalizedFor: {
        mood: currentMood || 'neutral',
        energyLevel: 'medium',
        stressLevel: 'low',
        experience: 'beginner'
      }
    });
  } else if (timeOfDay === 'evening' || timeOfDay === 'night') {
    recommendations.push({
      id: 'evening_unwind',
      title: 'Evening Unwind',
      description: 'Release the day\'s stress with calming breath work',
      duration: availableTime || userProfile.preferredDurations[0] || 15,
      style: 'breathing',
      confidence: 0.9,
      reasoning: 'Helps transition from day to evening relaxation',
      tags: ['evening', 'relaxation', 'stress-relief'],
      timeOfDay: 'evening',
      breathingPattern: {
        name: '4-7-8 Calming',
        inhale: 4,
        hold1: 7,
        exhale: 8,
        description: 'Deeply calming breath pattern for relaxation'
      },
      personalizedFor: {
        mood: currentMood || 'tired',
        energyLevel: 'low',
        stressLevel: 'medium',
        experience: 'beginner'
      }
    });
  }

  // Mood-based recommendation
  if (currentMood === 'stressed' || currentMood === 'anxious') {
    recommendations.push({
      id: 'stress_relief',
      title: 'Stress Relief Practice',
      description: 'Targeted breathing exercises to calm your nervous system',
      duration: 12,
      style: 'breathing',
      confidence: 0.9,
      reasoning: 'Specifically designed to address stress and anxiety',
      tags: ['stress-relief', 'anxiety', 'calming'],
      breathingPattern: {
        name: 'Calming Box Breath',
        inhale: 4,
        hold1: 4,
        exhale: 6,
        hold2: 2,
        description: 'Extended exhale for nervous system calming'
      },
      personalizedFor: {
        mood: currentMood,
        energyLevel: 'low',
        stressLevel: 'high',
        experience: 'beginner'
      }
    });
  }

  // User preference-based recommendation
  if (userProfile.favoriteStyles.length > 0) {
    const favoriteStyle = userProfile.favoriteStyles[0];
    recommendations.push({
      id: 'favorite_style',
      title: `Your Favorite: ${favoriteStyle.charAt(0).toUpperCase() + favoriteStyle.slice(1)}`,
      description: `A ${favoriteStyle} practice based on your preferences`,
      duration: userProfile.preferredDurations[0] || 10,
      style: favoriteStyle,
      confidence: 0.85,
      reasoning: `You've practiced ${favoriteStyle} most often with great results`,
      tags: ['favorite', 'personalized', favoriteStyle],
      personalizedFor: {
        mood: currentMood || 'neutral',
        energyLevel: 'medium',
        stressLevel: 'medium',
        experience: userProfile.completionRate > 80 ? 'intermediate' : 'beginner'
      }
    });
  }

  // Quick session if time is limited
  if (availableTime && availableTime <= 7) {
    recommendations.push({
      id: 'quick_reset',
      title: 'Quick Reset',
      description: 'Short but effective practice for busy schedules',
      duration: Math.min(availableTime, 5),
      style: 'breathing',
      confidence: 0.7,
      reasoning: 'Perfect for your available time slot',
      tags: ['quick', 'efficient', 'breathing'],
      breathingPattern: {
        name: 'Simple Breath',
        inhale: 3,
        exhale: 5,
        description: 'Simple yet effective breathing pattern'
      },
      personalizedFor: {
        mood: currentMood || 'busy',
        energyLevel: 'medium',
        stressLevel: 'medium',
        experience: 'beginner'
      }
    });
  }

  return recommendations.slice(0, 4); // Return max 4 recommendations
}