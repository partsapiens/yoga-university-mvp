import { NextRequest, NextResponse } from 'next/server';
import { openai, isOpenAIAvailable } from '@/lib/openai';
import { PoseId } from '@/types/yoga';

export const runtime = 'nodejs';
import { POSES } from '@/lib/yoga-data';

interface ValidationRequest {
  flow: PoseId[];
  totalSeconds?: number;
}

interface TransitionRisk {
  fromPose: string;
  toPose: string;
  riskLevel: 'low' | 'medium' | 'high';
  reason: string;
  suggestion: string;
}

interface SequenceValidation {
  overallSafety: 'safe' | 'caution' | 'unsafe';
  transitionRisks: TransitionRisk[];
  suggestions: string[];
  saferAlternatives?: PoseId[];
}

// Define pose transition safety rules
const HIGH_INTENSITY_POSES = [PoseId.Boat, PoseId.TwistLow];
const REST_POSES = [PoseId.Child, PoseId.Butterfly];
const BACKBEND_POSES = [PoseId.Bridge];
const FORWARD_FOLD_POSES = [PoseId.ForwardFold];
const TWIST_POSES = [PoseId.TwistLow];
const INVERSION_POSES = [PoseId.DownDog];

function analyzeTransitions(flow: PoseId[]): TransitionRisk[] {
  const risks: TransitionRisk[] = [];
  
  for (let i = 0; i < flow.length - 1; i++) {
    const currentPose = flow[i];
    const nextPose = flow[i + 1];
    
    const currentPoseData = POSES.find(p => p.id === currentPose);
    const nextPoseData = POSES.find(p => p.id === nextPose);
    
    if (!currentPoseData || !nextPoseData) continue;
    
    // High to high intensity without rest
    if (currentPoseData.intensity >= 4 && nextPoseData.intensity >= 4) {
      risks.push({
        fromPose: currentPoseData.name,
        toPose: nextPoseData.name,
        riskLevel: 'medium',
        reason: 'Back-to-back high intensity poses without rest',
        suggestion: 'Consider adding a rest pose or reducing intensity'
      });
    }
    
    // Backbend directly to forward fold
    if (BACKBEND_POSES.includes(currentPose) && FORWARD_FOLD_POSES.includes(nextPose)) {
      risks.push({
        fromPose: currentPoseData.name,
        toPose: nextPoseData.name,
        riskLevel: 'high',
        reason: 'Sudden spine direction change from backbend to forward fold',
        suggestion: 'Add a neutral spine pose like Child\'s Pose between them'
      });
    }
    
    // Forward fold directly to backbend
    if (FORWARD_FOLD_POSES.includes(currentPose) && BACKBEND_POSES.includes(nextPose)) {
      risks.push({
        fromPose: currentPoseData.name,
        toPose: nextPoseData.name,
        riskLevel: 'medium',
        reason: 'Quick spine direction change from forward fold to backbend',
        suggestion: 'Add a neutral preparation pose'
      });
    }
    
    // From inversion to standing without transition
    if (INVERSION_POSES.includes(currentPose) && nextPoseData.family === 'Standing') {
      risks.push({
        fromPose: currentPoseData.name,
        toPose: nextPoseData.name,
        riskLevel: 'medium',
        reason: 'Quick transition from inversion to standing pose',
        suggestion: 'Add a brief neutral pose to allow blood flow adjustment'
      });
    }
  }
  
  return risks;
}

function generateSaferAlternatives(flow: PoseId[], risks: TransitionRisk[]): PoseId[] {
  if (risks.length === 0) return flow;
  
  const newFlow: PoseId[] = [...flow];
  
  // Add rest poses between high-intensity sequences
  for (let i = newFlow.length - 2; i >= 0; i--) {
    const currentPose = newFlow[i];
    const nextPose = newFlow[i + 1];
    
    const currentPoseData = POSES.find(p => p.id === currentPose);
    const nextPoseData = POSES.find(p => p.id === nextPose);
    
    if (currentPoseData && nextPoseData && currentPoseData.intensity >= 4 && nextPoseData.intensity >= 4) {
      // Insert Child's Pose as a rest
      newFlow.splice(i + 1, 0, PoseId.Child);
    }
    
    // Handle backbend to forward fold transitions
    if (BACKBEND_POSES.includes(currentPose) && FORWARD_FOLD_POSES.includes(nextPose)) {
      newFlow.splice(i + 1, 0, PoseId.Child);
    }
  }
  
  return newFlow;
}

async function getAIValidation(flow: PoseId[]): Promise<string[]> {
  if (!isOpenAIAvailable()) {
    return [
      "AI validation is currently unavailable. Please check the basic safety guidelines below.",
      "Ensure proper warm-up and cool-down poses are included in your sequence."
    ];
  }
  
  try {
    const poseNames = flow.map(id => {
      const pose = POSES.find(p => p.id === id);
      return pose ? `${pose.name} (${pose.family}, Intensity: ${pose.intensity})` : id;
    });
    
    const prompt = `Analyze this yoga sequence for safety and appropriateness:

Poses in sequence:
${poseNames.join(' → ')}

Please provide 2-3 specific safety recommendations for this sequence, considering:
1. Pose transitions and spine movement patterns
2. Intensity progression and recovery
3. Muscle group balance and preparation
4. Overall flow safety

Keep recommendations concise and actionable.`;

    const completion = await openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: "system",
          content: "You are a certified yoga instructor focused on safe practice. Provide specific, practical safety advice for yoga sequences. Avoid medical claims and focus on movement safety."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || '';
    return content.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
  } catch (error) {
    console.error('AI validation error:', error);
    return [
      "AI validation encountered an error. Please review your sequence manually.",
      "Ensure you have proper warm-up poses at the beginning and cool-down poses at the end."
    ];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidationRequest = await request.json();
    const { flow, totalSeconds } = body;
    
    if (!flow || !Array.isArray(flow)) {
      return NextResponse.json(
        { error: 'Invalid flow data' },
        { status: 400 }
      );
    }
    
    // Analyze transitions for immediate safety risks
    const transitionRisks = analyzeTransitions(flow);
    
    // Get AI-powered suggestions
    const aiSuggestions = await getAIValidation(flow);
    
    // Determine overall safety level
    const highRisks = transitionRisks.filter(r => r.riskLevel === 'high').length;
    const mediumRisks = transitionRisks.filter(r => r.riskLevel === 'medium').length;
    
    let overallSafety: 'safe' | 'caution' | 'unsafe' = 'safe';
    if (highRisks > 0) {
      overallSafety = 'unsafe';
    } else if (mediumRisks > 1) {
      overallSafety = 'caution';
    }
    
    // Generate safer alternatives if needed
    let saferAlternatives: PoseId[] | undefined;
    if (overallSafety !== 'safe') {
      saferAlternatives = generateSaferAlternatives(flow, transitionRisks);
    }
    
    const validation: SequenceValidation = {
      overallSafety,
      transitionRisks,
      suggestions: aiSuggestions,
      saferAlternatives
    };
    
    return NextResponse.json(validation);
    
  } catch (error) {
    console.error('Sequence validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate sequence' },
      { status: 500 }
    );
  }
}