import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion, filterContent } from '@/lib/openai';
import { AIInsightsInput, AIInsightsOutput } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    const body: AIInsightsInput = await request.json();
    const { sessionData, userJourney } = body;

    // Validate inputs
    if (!sessionData || !userJourney) {
      return NextResponse.json({ 
        error: 'sessionData and userJourney are required' 
      }, { status: 400 });
    }

    // Build context for AI prompt
    const completionRate = sessionData.completed ? 100 : Math.round((sessionData.completionTime / sessionData.duration) * 100);
    
    // Enhanced prompt template for insights
    const insightsPrompt = `Session completed: ${sessionData.style} for ${sessionData.duration} minutes.
User feedback: "${sessionData.userFeedback || 'No feedback provided'}"
Completion rate: ${completionRate}%
${sessionData.userRating ? `User rating: ${sessionData.userRating}/5` : ''}

User Journey Context:
- Total sessions: ${userJourney.totalSessions}
- Recent pattern: ${userJourney.weeklyAverage} sessions/week
- Preferred styles: ${userJourney.preferredStyles.join(', ')}
- Progress metrics: ${JSON.stringify(userJourney.progressMetrics)}

Generate personalized insights and encouragement. Return JSON format:
{
  "immediateRecap": "brief encouraging recap (≤30 words)",
  "insights": ["specific insight 1", "specific insight 2", "specific insight 3"],
  "nextRecommendation": {
    "suggestion": "what to try next",
    "reasoning": "why this recommendation",
    "recommendedTime": "when to practice next"
  },
  "journeyProgress": {
    "milestone": "any milestone achieved or null",
    "encouragement": "motivating message about their progress",
    "skillsDeveloped": ["skill 1", "skill 2"]
  }
}

Guidelines:
- Tone: Supportive coach, growth-focused, never prescriptive
- Acknowledge their effort regardless of completion
- Provide specific, actionable insights
- Celebrate progress and patterns
- No medical claims or therapeutic advice`;

    // Generate AI response
    const aiResponse = await generateCompletion(insightsPrompt, 'complex', 0.8);
    const filteredResponse = filterContent(aiResponse);

    // Parse JSON response
    let insights: AIInsightsOutput;
    try {
      // Extract JSON from response
      const jsonMatch = filteredResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : filteredResponse;
      const parsed = JSON.parse(jsonStr);
      
      insights = {
        immediateRecap: parsed.immediateRecap || generateFallbackRecap(sessionData),
        insights: Array.isArray(parsed.insights) ? parsed.insights : generateFallbackInsights(sessionData, userJourney),
        nextRecommendation: parsed.nextRecommendation || generateFallbackRecommendation(sessionData, userJourney),
        journeyProgress: parsed.journeyProgress || generateFallbackProgress(userJourney)
      };
    } catch (parseError) {
      console.error('Failed to parse AI insights response:', parseError);
      
      // Fallback insights generation
      insights = generateFallbackInsights(sessionData, userJourney);
    }

    return NextResponse.json(insights);

  } catch (error) {
    console.error('AI Insights error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate session insights' 
    }, { status: 500 });
  }
}

// Fallback insights when AI fails
function generateFallbackInsights(
  sessionData: AIInsightsInput['sessionData'], 
  userJourney: AIInsightsInput['userJourney']
): AIInsightsOutput {
  return {
    immediateRecap: generateFallbackRecap(sessionData),
    insights: generateFallbackInsightsList(sessionData, userJourney),
    nextRecommendation: generateFallbackRecommendation(sessionData, userJourney),
    journeyProgress: generateFallbackProgress(userJourney)
  };
}

function generateFallbackRecap(sessionData: AIInsightsInput['sessionData']): string {
  if (sessionData.completed) {
    return `Beautiful work completing your ${sessionData.style} practice! You've given yourself a meaningful gift today.`;
  } else {
    const completionRate = Math.round((sessionData.completionTime / sessionData.duration) * 100);
    return `Great job showing up for ${completionRate}% of your practice. Every moment of mindfulness counts.`;
  }
}

function generateFallbackInsightsList(
  sessionData: AIInsightsInput['sessionData'], 
  userJourney: AIInsightsInput['userJourney']
): string[] {
  const insights: string[] = [];
  
  // Completion-based insights
  if (sessionData.completed) {
    insights.push("You demonstrated commitment by completing your full practice session.");
  } else {
    insights.push("Showing up is often the hardest part - you took an important step today.");
  }
  
  // Journey-based insights
  if (userJourney.totalSessions > 1) {
    insights.push(`You're building consistency with ${userJourney.totalSessions} total sessions in your practice.`);
  }
  
  if (userJourney.weeklyAverage >= 3) {
    insights.push("Your regular practice pattern shows dedication to your well-being.");
  }
  
  // Style preference insights
  if (userJourney.preferredStyles.length > 0) {
    insights.push(`Your preference for ${userJourney.preferredStyles[0]} meditation shows you're developing a personal practice style.`);
  }
  
  // Default insight if none generated
  if (insights.length === 0) {
    insights.push("Each meditation session contributes to your growing sense of inner peace and awareness.");
  }
  
  return insights.slice(0, 3); // Return max 3 insights
}

function generateFallbackRecommendation(
  sessionData: AIInsightsInput['sessionData'], 
  userJourney: AIInsightsInput['userJourney']
): AIInsightsOutput['nextRecommendation'] {
  let suggestion = "Continue with your current practice";
  let reasoning = "Consistency helps deepen your meditation experience";
  let recommendedTime = "tomorrow at the same time";
  
  // Adjust based on completion
  if (!sessionData.completed) {
    suggestion = "Try a shorter session next time";
    reasoning = "Building confidence with achievable goals supports long-term practice";
    recommendedTime = "later today or tomorrow";
  }
  
  // Adjust based on journey
  if (userJourney.weeklyAverage < 2) {
    suggestion = "Aim for more frequent, shorter sessions";
    reasoning = "Regular practice is more beneficial than occasional longer sessions";
    recommendedTime = "within the next 24 hours";
  }
  
  // Style-based recommendations
  if (sessionData.style === 'breathing' && sessionData.completed) {
    suggestion = "Explore body scan meditation next";
    reasoning = "Expanding your practice variety enhances overall mindfulness skills";
  }
  
  return { suggestion, reasoning, recommendedTime };
}

function generateFallbackProgress(
  userJourney: AIInsightsInput['userJourney']
): AIInsightsOutput['journeyProgress'] {
  let milestone: string | undefined;
  let encouragement = "Every practice session is a step forward in your mindfulness journey.";
  let skillsDeveloped: string[] = ["Present moment awareness"];
  
  // Milestone detection
  if (userJourney.totalSessions === 1) {
    milestone = "First meditation session completed!";
    encouragement = "Congratulations on starting your meditation journey!";
  } else if (userJourney.totalSessions === 7) {
    milestone = "One week of practice!";
    encouragement = "You're building a beautiful foundation for your practice.";
  } else if (userJourney.totalSessions === 30) {
    milestone = "30 sessions completed!";
    encouragement = "Your dedication is truly inspiring. Notice how your practice has evolved.";
  } else if (userJourney.totalSessions % 10 === 0) {
    milestone = `${userJourney.totalSessions} sessions milestone!`;
    encouragement = "Your consistent practice is developing real wisdom and peace.";
  }
  
  // Skills based on session count and styles
  if (userJourney.totalSessions >= 5) {
    skillsDeveloped.push("Breath awareness");
  }
  if (userJourney.totalSessions >= 10) {
    skillsDeveloped.push("Emotional regulation");
  }
  if (userJourney.totalSessions >= 20) {
    skillsDeveloped.push("Sustained attention");
  }
  if (userJourney.preferredStyles.includes('loving-kindness')) {
    skillsDeveloped.push("Compassion cultivation");
  }
  if (userJourney.preferredStyles.includes('body-scan')) {
    skillsDeveloped.push("Body awareness");
  }
  
  return {
    milestone,
    encouragement,
    skillsDeveloped: skillsDeveloped.slice(0, 3) // Max 3 skills
  };
}