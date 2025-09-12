import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion, filterContent } from '@/lib/openai';
import { PoseId } from '@/types/yoga';

export interface FlowAdaptationRequest {
  currentFlow: {
    poses: PoseId[];
    durations: number[];
    totalDuration: number;
  };
  userProfile: {
    experience: 'beginner' | 'intermediate' | 'advanced';
    physicalLimitations?: string[];
    preferences?: string[];
    pastPerformance?: {
      completionRate: number;
      averageDifficulty: number;
      struggledWith: string[];
      excelsAt: string[];
    };
  };
  sessionFeedback?: {
    currentPose?: string;
    difficulty?: 'too-easy' | 'just-right' | 'too-hard';
    energy?: 'low' | 'medium' | 'high';
    timeConstraint?: number; // minutes available
    specificRequest?: string;
  };
  adaptationType: 'real-time' | 'pre-session' | 'post-feedback';
}

export interface FlowAdaptationResponse {
  adaptedFlow: {
    poses: PoseId[];
    durations: number[];
    modifications: {
      poseIndex: number;
      originalPose: PoseId;
      modifiedPose?: PoseId;
      durationChange?: number;
      instruction: string;
      reason: string;
    }[];
  };
  personalizationInsights: {
    adaptationSummary: string;
    whyThisWorks: string;
    progressNotes: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: FlowAdaptationRequest = await request.json();
    const { 
      currentFlow,
      userProfile,
      sessionFeedback = {},
      adaptationType = 'pre-session'
    } = body;

    // Generate adaptive flow modifications
    const adaptation = await generateFlowAdaptations({
      currentFlow,
      userProfile,
      sessionFeedback,
      adaptationType
    });
    
    return NextResponse.json(adaptation);

  } catch (error) {
    console.error('Flow Adaptation API error:', error);
    
    // Return fallback adaptation with default values
    const fallbackAdaptation = generateFallbackAdaptations(
      { poses: [], durations: [], totalDuration: 0 }, 
      { experience: 'beginner' }
    );
    return NextResponse.json({ 
      error: 'Failed to generate flow adaptations',
      ...fallbackAdaptation
    }, { status: 500 });
  }
}

async function generateFlowAdaptations(params: {
  currentFlow: any;
  userProfile: any;
  sessionFeedback: any;
  adaptationType: string;
}): Promise<FlowAdaptationResponse> {
  const { currentFlow, userProfile, sessionFeedback, adaptationType } = params;
  
  // Map pose IDs to pose names for AI context
  const poseNames = currentFlow.poses.map((poseId: PoseId) => {
    const poseNameMap: Record<PoseId, string> = {
      [PoseId.DownDog]: 'Downward Dog',
      [PoseId.Warrior1Right]: 'Warrior I (Right)',
      [PoseId.ForwardFold]: 'Forward Fold',
      [PoseId.Child]: 'Child\'s Pose',
      [PoseId.Butterfly]: 'Butterfly Pose',
      [PoseId.HighLungeRight]: 'High Lunge (Right)',
      [PoseId.TwistLow]: 'Low Twist',
      [PoseId.Bridge]: 'Bridge Pose',
      [PoseId.Pigeon]: 'Pigeon Pose',
      [PoseId.Boat]: 'Boat Pose'
    };
    return poseNameMap[poseId] || 'Unknown Pose';
  });

  const currentFlowDescription = poseNames.map((name: string, i: number) => 
    `${i + 1}. ${name} (${currentFlow.durations[i] || 30}s)`
  ).join('\n');

  const userContext = `
    Experience level: ${userProfile.experience}
    Physical limitations: ${userProfile.physicalLimitations?.join(', ') || 'none'}
    Preferences: ${userProfile.preferences?.join(', ') || 'none specified'}
    Past performance:
      - Completion rate: ${userProfile.pastPerformance?.completionRate || 'unknown'}%
      - Average difficulty handled: ${userProfile.pastPerformance?.averageDifficulty || 'unknown'}
      - Struggles with: ${userProfile.pastPerformance?.struggledWith?.join(', ') || 'unknown'}
      - Excels at: ${userProfile.pastPerformance?.excelsAt?.join(', ') || 'unknown'}
  `;

  const sessionContext = `
    Adaptation type: ${adaptationType}
    Current session feedback:
      - Difficulty level: ${sessionFeedback.difficulty || 'not provided'}
      - Energy level: ${sessionFeedback.energy || 'not provided'}
      - Time constraint: ${sessionFeedback.timeConstraint || 'none'} minutes
      - Specific request: ${sessionFeedback.specificRequest || 'none'}
  `;

  const prompt = `Adapt the following yoga flow for personalized practice.

Current flow:
${currentFlowDescription}

Total duration: ${currentFlow.totalDuration} seconds

User profile:
${userContext}

Session context:
${sessionContext}

Adaptation requirements:
1. Consider user's experience level and limitations
2. Address any session feedback (difficulty, energy, time constraints)
3. Maintain flow coherence and safe transitions
4. Provide specific modifications for individual poses if needed
5. Suggest duration adjustments
6. Explain reasoning for each change

Available pose modifications:
- Beginner alternatives (easier variations)
- Advanced progressions (more challenging)
- Props/support variations
- Duration adjustments
- Rest pose insertions

Return JSON with this format:
{
  "adaptedFlow": {
    "poses": ["PoseId1", "PoseId2", ...],
    "durations": [30, 45, ...],
    "modifications": [
      {
        "poseIndex": 0,
        "originalPose": "DownDog",
        "modifiedPose": "DownDog",
        "durationChange": 10,
        "instruction": "Hold for extra 10 seconds with blocks under hands",
        "reason": "Added support for wrist comfort and longer hold for strength building"
      }
    ]
  },
  "personalizationInsights": {
    "adaptationSummary": "Flow adapted for beginner level with wrist support",
    "whyThisWorks": "These modifications match your experience level and address your wrist concerns",
    "progressNotes": "As you build strength, we can gradually reduce prop usage"
  }
}

Keep pose names as they are, only suggest duration and instruction modifications.`;

  try {
    // Generate AI response
    const aiResponse = await generateCompletion(prompt, 'complex', 0.7);
    const filteredResponse = filterContent(aiResponse);

    // Parse JSON response
    const jsonMatch = filteredResponse.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : filteredResponse;
    const parsed = JSON.parse(jsonStr);
    
    return {
      adaptedFlow: {
        poses: parsed.adaptedFlow?.poses || currentFlow.poses,
        durations: parsed.adaptedFlow?.durations || currentFlow.durations,
        modifications: parsed.adaptedFlow?.modifications || []
      },
      personalizationInsights: {
        adaptationSummary: parsed.personalizationInsights?.adaptationSummary || 'Flow adapted for your needs',
        whyThisWorks: parsed.personalizationInsights?.whyThisWorks || 'Modifications match your profile',
        progressNotes: parsed.personalizationInsights?.progressNotes || 'Continue practicing mindfully'
      }
    };

  } catch (parseError) {
    console.error('Failed to parse AI flow adaptation:', parseError);
    return generateFallbackAdaptations(currentFlow, userProfile);
  }
}

function generateFallbackAdaptations(currentFlow: any, userProfile: any): FlowAdaptationResponse {
  const modifications: any[] = [];
  
  // Generate basic adaptations based on experience level
  if (userProfile.experience === 'beginner') {
    modifications.push({
      poseIndex: 0,
      originalPose: currentFlow.poses[0],
      durationChange: -10,
      instruction: 'Shorter hold with focus on proper alignment',
      reason: 'Reduced duration for beginner comfort'
    });
  } else if (userProfile.experience === 'advanced') {
    modifications.push({
      poseIndex: 0,
      originalPose: currentFlow.poses[0],
      durationChange: 15,
      instruction: 'Extended hold with deeper engagement',
      reason: 'Longer duration for advanced practitioner'
    });
  }

  // Add modifications for physical limitations
  if (userProfile.physicalLimitations?.includes('wrists')) {
    modifications.push({
      poseIndex: 0,
      originalPose: currentFlow.poses[0],
      instruction: 'Use blocks under hands or come to forearms',
      reason: 'Wrist-friendly modification'
    });
  }

  return {
    adaptedFlow: {
      poses: currentFlow.poses,
      durations: currentFlow.durations.map((duration: number, index: number) => {
        const mod = modifications.find(m => m.poseIndex === index);
        return mod?.durationChange ? duration + mod.durationChange : duration;
      }),
      modifications
    },
    personalizationInsights: {
      adaptationSummary: `Flow adapted for ${userProfile.experience} level`,
      whyThisWorks: 'Modifications match your experience and any limitations',
      progressNotes: 'Continue to listen to your body and progress mindfully'
    }
  };
}