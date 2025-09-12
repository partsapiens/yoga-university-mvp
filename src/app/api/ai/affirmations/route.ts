import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion, filterContent } from '@/lib/openai';

export interface AffirmationRequest {
  context: 'meditation' | 'flow' | 'general';
  userProfile?: {
    name?: string;
    goals?: string[];
    challenges?: string[];
    experience?: 'beginner' | 'intermediate' | 'advanced';
    preferredTone?: 'gentle' | 'empowering' | 'calming' | 'energizing';
  };
  sessionData?: {
    mood?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    focusArea?: string;
    duration?: number;
    style?: string;
  };
  count?: number;
}

export interface AffirmationResponse {
  affirmations: {
    id: string;
    text: string;
    category: 'self-acceptance' | 'strength' | 'peace' | 'growth' | 'gratitude' | 'focus' | 'healing';
    tone: string;
    timing: 'beginning' | 'middle' | 'end' | 'transition';
    personalizedFor: string;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: AffirmationRequest = await request.json();
    const { 
      context = 'general',
      userProfile = {},
      sessionData = {},
      count = 3
    } = body;

    // Generate personalized affirmations
    const affirmations = await generatePersonalizedAffirmations({
      context,
      userProfile,
      sessionData,
      count
    });
    
    return NextResponse.json({ affirmations });

  } catch (error) {
    console.error('Affirmations API error:', error);
    
    // Return fallback affirmations
    const fallbackAffirmations = generateFallbackAffirmations('general', 3);
    return NextResponse.json({ 
      error: 'Failed to generate personalized affirmations',
      affirmations: fallbackAffirmations
    }, { status: 500 });
  }
}

async function generatePersonalizedAffirmations(params: {
  context: string;
  userProfile: any;
  sessionData: any;
  count: number;
}): Promise<AffirmationResponse['affirmations']> {
  const { context, userProfile, sessionData, count } = params;
  
  // Build context for AI prompt
  const userContext = `
    Experience level: ${userProfile.experience || 'beginner'}
    Goals: ${userProfile.goals?.join(', ') || 'general wellness'}
    Challenges: ${userProfile.challenges?.join(', ') || 'none specified'}
    Preferred tone: ${userProfile.preferredTone || 'gentle'}
  `;

  const sessionContext = `
    Session context: ${context}
    Current mood: ${sessionData.mood || 'neutral'}
    Time of day: ${sessionData.timeOfDay || 'afternoon'}
    Focus area: ${sessionData.focusArea || 'full-body'}
    Duration: ${sessionData.duration || 10} minutes
    Style: ${sessionData.style || 'mindful'}
  `;

  const prompt = `Generate ${count} personalized affirmations for a yoga/meditation session.

User profile:
${userContext}

Session details:
${sessionContext}

Requirements:
- Affirmations should be personal, positive, and present-tense
- Match the ${userProfile.preferredTone || 'gentle'} tone preference
- Be appropriate for ${context} practice
- Consider the user's goals and challenges
- Vary timing: some for beginning, middle, end, or transitions
- Include different categories: self-acceptance, strength, peace, growth, gratitude, focus, healing

Return JSON array with this format:
[
  {
    "id": "unique_id",
    "text": "I am present in this moment and trust my body's wisdom",
    "category": "self-acceptance",
    "tone": "gentle",
    "timing": "beginning",
    "personalizedFor": "Brief explanation of why this affirmation fits the user"
  }
]

Make each affirmation unique and specifically relevant to the user's context.`;

  try {
    // Generate AI response
    const aiResponse = await generateCompletion(prompt, 'complex', 0.8);
    const filteredResponse = filterContent(aiResponse);

    // Parse JSON response
    const jsonMatch = filteredResponse.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : filteredResponse;
    const parsedAffirmations = JSON.parse(jsonStr);
    
    return parsedAffirmations.map((aff: any, index: number) => ({
      id: aff.id || `aff_${Date.now()}_${index}`,
      text: aff.text || 'I am present in this moment',
      category: aff.category || 'self-acceptance',
      tone: aff.tone || userProfile.preferredTone || 'gentle',
      timing: aff.timing || 'beginning',
      personalizedFor: aff.personalizedFor || 'Personalized for your practice'
    }));

  } catch (parseError) {
    console.error('Failed to parse AI affirmations:', parseError);
    return generateFallbackAffirmations(context, count);
  }
}

function generateFallbackAffirmations(context: string, count: number = 3): AffirmationResponse['affirmations'] {
  const fallbacksByContext: Record<string, any[]> = {
    meditation: [
      {
        id: 'med_1',
        text: 'I am present in this moment and open to peace within',
        category: 'peace',
        tone: 'gentle',
        timing: 'beginning',
        personalizedFor: 'Perfect for meditation practice'
      },
      {
        id: 'med_2', 
        text: 'With each breath, I release what no longer serves me',
        category: 'healing',
        tone: 'calming',
        timing: 'middle',
        personalizedFor: 'Supports letting go during meditation'
      },
      {
        id: 'med_3',
        text: 'I carry this peace with me throughout my day',
        category: 'gratitude',
        tone: 'empowering',
        timing: 'end',
        personalizedFor: 'Helps integrate meditation benefits'
      }
    ],
    flow: [
      {
        id: 'flow_1',
        text: 'My body is strong, capable, and worthy of respect',
        category: 'strength',
        tone: 'empowering',
        timing: 'beginning',
        personalizedFor: 'Builds confidence for physical practice'
      },
      {
        id: 'flow_2',
        text: 'I listen to my body and honor its needs in this moment',
        category: 'self-acceptance',
        tone: 'gentle',
        timing: 'transition',
        personalizedFor: 'Encourages mindful movement'
      },
      {
        id: 'flow_3',
        text: 'I am growing stronger and more flexible with each practice',
        category: 'growth',
        tone: 'encouraging',
        timing: 'end',
        personalizedFor: 'Celebrates progress in yoga practice'
      }
    ],
    general: [
      {
        id: 'gen_1',
        text: 'I am exactly where I need to be on my journey',
        category: 'self-acceptance',
        tone: 'gentle',
        timing: 'beginning',
        personalizedFor: 'Universal encouragement for any practice'
      },
      {
        id: 'gen_2',
        text: 'I choose to approach myself with kindness and patience',
        category: 'self-acceptance',
        tone: 'nurturing',
        timing: 'middle',
        personalizedFor: 'Promotes self-compassion'
      },
      {
        id: 'gen_3',
        text: 'I am grateful for this time I have given myself',
        category: 'gratitude',
        tone: 'warm',
        timing: 'end',
        personalizedFor: 'Acknowledges the value of self-care'
      }
    ]
  };

  const contextAffirmations = fallbacksByContext[context] || fallbacksByContext.general;
  return contextAffirmations.slice(0, count);
}