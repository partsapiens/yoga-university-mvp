import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion, filterContent } from '@/lib/openai';
import { AISelectInput, AISelectOutput } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    const body: AISelectInput = await request.json();
    const { 
      userText, 
      timeOfDay, 
      preferredDuration, 
      recentSessions = [], 
      userMood 
    } = body;

    // Validate inputs
    if (!userText || !timeOfDay) {
      return NextResponse.json({ 
        error: 'userText and timeOfDay are required' 
      }, { status: 400 });
    }

    // Build context for AI prompt
    const recentSessionsText = recentSessions.length > 0 
      ? recentSessions.map(s => `${s.style} (${s.completed ? 'completed' : 'incomplete'}${s.rating ? `, rated ${s.rating}/5` : ''})`).join(', ')
      : 'No recent sessions';

    // Enhanced prompt template
    const prompt = `User context: "${userText}" at ${timeOfDay}.
Recent sessions: ${recentSessionsText}
${userMood ? `Current mood: ${userMood}` : ''}
${preferredDuration ? `Preferred duration: ${preferredDuration} minutes` : ''}

Available options:
- Styles: Mindfulness, Box Breathing, Body Scan, Loving Kindness, 4-7-8 Breathing, Progressive Relaxation
- Durations: 3, 5, 10, 15, 20 minutes
- Breathing patterns: Standard (4-4-4-4), Calming (4-7-8), Energizing (4-4-6-2)

Consider:
- User's emotional state and energy level
- Time appropriateness (avoid energizing before bed)
- Session history to avoid repetition
- Beginner vs experienced cues from past behavior

Return JSON with personalized recommendation and brief rationale. Format:
{
  "style": "recommended style",
  "duration": number_in_minutes,
  "breathingPattern": {"inhale": 4, "hold": 4, "exhale": 4},
  "rationale": "brief explanation for this choice",
  "visualTheme": "calm-blue|energizing-gold|grounding-green",
  "confidence": number_0_to_1
}`;

    // Generate AI response
    const aiResponse = await generateCompletion(prompt, 'simple', 0.8);
    const filteredResponse = filterContent(aiResponse);

    // Parse JSON response
    let recommendation: AISelectOutput;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = filteredResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : filteredResponse;
      const parsed = JSON.parse(jsonStr);
      
      recommendation = {
        style: parsed.style || 'mindfulness',
        duration: Math.min(Math.max(parsed.duration || 10, 3), 20),
        breathingPattern: parsed.breathingPattern || { inhale: 4, hold: 0, exhale: 4 },
        rationale: parsed.rationale || 'A gentle practice suited to your current needs.',
        visualTheme: parsed.visualTheme || 'calm-blue',
        confidence: Math.min(Math.max(parsed.confidence || 0.8, 0), 1)
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      
      // Fallback recommendation based on simple rules
      recommendation = generateFallbackRecommendation(body);
    }

    return NextResponse.json(recommendation);

  } catch (error) {
    console.error('AI Select error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate meditation recommendation' 
    }, { status: 500 });
  }
}

// Fallback logic when AI fails
function generateFallbackRecommendation(input: AISelectInput): AISelectOutput {
  const { userText, timeOfDay, userMood, preferredDuration } = input;
  
  // Simple rule-based fallback
  let style = 'mindfulness';
  let duration = preferredDuration || 10;
  let breathingPattern = { inhale: 4, hold: 0, exhale: 4 };
  let visualTheme: 'calm-blue' | 'energizing-gold' | 'grounding-green' = 'calm-blue';
  
  // Time-based adjustments
  if (timeOfDay === 'morning') {
    style = 'mindfulness';
    visualTheme = 'energizing-gold';
  } else if (timeOfDay === 'evening' || timeOfDay === 'night') {
    style = 'sleep';
    breathingPattern = { inhale: 4, hold: 7, exhale: 8 };
  }
  
  // Mood-based adjustments
  if (userMood === 'stressed' || userMood === 'anxious') {
    style = 'breathing';
    breathingPattern = { inhale: 4, hold: 4, exhale: 6 };
    visualTheme = 'grounding-green';
  } else if (userMood === 'tired') {
    style = 'body-scan';
    duration = Math.min(duration, 15);
  } else if (userMood === 'energetic') {
    style = 'focus';
    visualTheme = 'energizing-gold';
  }
  
  // Text-based keywords
  const text = userText.toLowerCase();
  if (text.includes('sleep') || text.includes('tired')) {
    style = 'sleep';
    breathingPattern = { inhale: 4, hold: 7, exhale: 8 };
  } else if (text.includes('stress') || text.includes('anxious')) {
    style = 'breathing';
    breathingPattern = { inhale: 4, hold: 4, exhale: 6 };
  } else if (text.includes('focus') || text.includes('concentrate')) {
    style = 'focus';
  }
  
  return {
    style,
    duration,
    breathingPattern,
    rationale: `Based on your ${timeOfDay} timing and current state, this ${style} practice will help you find the peace you're seeking.`,
    visualTheme,
    confidence: 0.7
  };
}