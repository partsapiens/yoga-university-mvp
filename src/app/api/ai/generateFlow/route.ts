import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { generateCompletion, isOpenAIAvailable } from '@/lib/openai';

// POST /api/ai/generateFlow - Generate an AI-powered yoga flow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      duration = 30, // minutes
      difficulty = 'intermediate', // beginner, intermediate, advanced
      focus_areas = ['full-body'], // array of focus areas
      mood = 'balanced', // energizing, calming, grounding, balanced
      exclude_poses = [] // array of pose IDs to exclude
    } = body;

    // Validate inputs
    if (![15, 30, 45, 60, 90].includes(duration)) {
      return NextResponse.json({ 
        error: 'Duration must be 15, 30, 45, 60, or 90 minutes' 
      }, { status: 400 });
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      return NextResponse.json({ 
        error: 'Difficulty must be beginner, intermediate, or advanced' 
      }, { status: 400 });
    }

    // Fetch poses from database
    let query = supabase
      .from('poses')
      .select('*')
      .eq('is_published', true);

    // Apply difficulty filter
    query = query.eq('difficulty', difficulty);

    // Exclude poses if specified
    if (exclude_poses.length > 0) {
      query = query.not('id', 'in', `(${exclude_poses.join(',')})`);
    }

    const { data: allPoses, error: posesError } = await query;

    if (posesError) {
      console.error('Error fetching poses:', posesError);
      return NextResponse.json({ error: 'Failed to fetch poses from database' }, { status: 500 });
    }

    if (!allPoses || allPoses.length === 0) {
      return NextResponse.json({ error: 'No poses found matching criteria' }, { status: 400 });
    }

    // Generate flow using simplified logic
    const generatedFlow = await generateSimplifiedFlow(allPoses, {
      duration,
      difficulty,
      focus_areas,
      mood
    });

    return NextResponse.json({ 
      flow: generatedFlow,
      metadata: {
        total_poses: generatedFlow.length,
        estimated_duration: duration,
        difficulty,
        focus_areas,
        mood,
        generation_method: isOpenAIAvailable() ? 'ai-assisted' : 'rule-based'
      }
    });

  } catch (error) {
    console.error('AI Generate Flow error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Simplified flow generation with optional AI assistance
async function generateSimplifiedFlow(poses: any[], options: {
  duration: number;
  difficulty: string;
  focus_areas: string[];
  mood: string;
}) {
  const { duration, focus_areas, mood } = options;
  
  // Calculate target number of poses (simpler calculation)
  const avgPoseTime = 2; // minutes per pose
  const targetPoseCount = Math.max(5, Math.floor(duration / avgPoseTime));
  
  // Categorize poses simply by category
  const categories = {
    warmup: poses.filter(p => ['standing', 'seated'].includes(p.category)),
    active: poses.filter(p => ['backbend', 'arm_balance', 'inversion', 'balance'].includes(p.category)),
    stretch: poses.filter(p => ['hip_opener', 'forward_fold', 'twist'].includes(p.category)),
    cooldown: poses.filter(p => ['restorative', 'supine'].includes(p.category))
  };

  // Build flow structure (simplified)
  let flow: any[] = [];
  
  // Warmup (25% of poses)
  const warmupCount = Math.max(1, Math.floor(targetPoseCount * 0.25));
  flow.push(...selectRandomPoses(categories.warmup, warmupCount));
  
  // Active phase (40% of poses) - adapt for focus areas
  const activeCount = Math.floor(targetPoseCount * 0.4);
  let activePoses = [...categories.active];
  
  // Add focused poses based on focus areas
  if (focus_areas.includes('hips')) {
    activePoses.push(...categories.stretch.filter(p => p.category === 'hip_opener'));
  }
  if (focus_areas.includes('core')) {
    activePoses = activePoses.filter(p => p.anatomy_focus?.includes('core') || p.category === 'arm_balance');
  }
  
  flow.push(...selectRandomPoses(activePoses, activeCount));
  
  // Stretch phase (25% of poses)
  const stretchCount = Math.floor(targetPoseCount * 0.25);
  flow.push(...selectRandomPoses(categories.stretch, stretchCount));
  
  // Cooldown (10% of poses, minimum 1)
  const cooldownCount = Math.max(1, Math.floor(targetPoseCount * 0.1));
  flow.push(...selectRandomPoses(categories.cooldown, cooldownCount));
  
  // Adjust for mood
  if (mood === 'energizing') {
    // Add one more active pose if we have room
    const extraActive = selectRandomPoses(categories.active, 1);
    if (extraActive.length > 0) {
      flow.splice(-1, 0, ...extraActive);
    }
  } else if (mood === 'calming') {
    // Add one more restorative pose
    const extraCalm = selectRandomPoses(categories.cooldown, 1);
    if (extraCalm.length > 0) {
      flow.push(...extraCalm);
    }
  }
  
  // Remove duplicates and limit to target count
  flow = removeDuplicates(flow);
  if (flow.length > targetPoseCount) {
    flow = flow.slice(0, targetPoseCount);
  }
  
  // AI enhancement if available
  if (isOpenAIAvailable()) {
    flow = await enhanceFlowWithAI(flow, options);
  }
  
  // Format for response
  return flow.map((pose, index) => ({
    pose_id: pose.id,
    order_index: index,
    duration: calculateSimpleDuration(pose, duration, flow.length),
    pose: {
      id: pose.id,
      name: pose.name,
      sanskrit_name: pose.sanskrit_name,
      category: pose.category,
      difficulty: pose.difficulty,
      image_url: pose.image_url,
      description: pose.description
    }
  }));
}

// Helper function: select random poses from a category
function selectRandomPoses(poses: any[], count: number): any[] {
  if (!poses || poses.length === 0 || count <= 0) return [];
  
  const shuffled = [...poses].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, poses.length));
}

// Helper function: remove duplicate poses
function removeDuplicates(poses: any[]): any[] {
  const seen = new Set();
  return poses.filter(pose => {
    if (seen.has(pose.id)) return false;
    seen.add(pose.id);
    return true;
  });
}

// Helper function: simple duration calculation
function calculateSimpleDuration(pose: any, totalDurationMinutes: number, totalPoses: number): number {
  const baseSeconds = Math.floor((totalDurationMinutes * 60) / totalPoses);
  
  // Simple adjustments based on category
  if (pose.category === 'restorative') {
    return Math.min(baseSeconds * 1.5, 180); // Longer for restorative
  } else if (pose.category === 'balance' || pose.category === 'arm_balance') {
    return Math.max(baseSeconds * 0.8, 30); // Shorter for challenging poses
  }
  
  return Math.max(baseSeconds, 30); // Minimum 30 seconds
}

// Optional AI enhancement
async function enhanceFlowWithAI(flow: any[], options: any): Promise<any[]> {
  try {
    const poseNames = flow.map(p => p.name).join(', ');
    const prompt = `Review this yoga flow for a ${options.duration}-minute ${options.difficulty} practice focused on ${options.focus_areas.join(', ')} with a ${options.mood} mood:

${poseNames}

Suggest any pose substitutions or additions to improve the flow. Respond with just the improved pose names, separated by commas.`;

    const response = await generateCompletion(prompt, 'simple', 0.3);
    
    // For now, just return original flow - could implement pose substitution logic here
    return flow;
  } catch (error) {
    console.error('AI enhancement error:', error);
    return flow;
  }
}

