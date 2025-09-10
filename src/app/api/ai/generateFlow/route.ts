import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

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

    // Fetch poses from database based on criteria
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

    // AI Flow Generation Logic
    const generatedFlow = generateFlowSequence(allPoses, {
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
        mood
      }
    });

  } catch (error) {
    console.error('AI Generate Flow error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Flow generation algorithm
function generateFlowSequence(poses: any[], options: {
  duration: number;
  difficulty: string;
  focus_areas: string[];
  mood: string;
}) {
  const { duration, focus_areas, mood } = options;
  
  // Calculate approximate number of poses based on duration
  // Assume average 1-2 minutes per pose depending on difficulty
  const avgPoseTime = duration <= 30 ? 1.5 : 2; // minutes per pose
  const targetPoseCount = Math.floor(duration / avgPoseTime);
  
  // Categorize poses by type for intelligent sequencing
  const warmupPoses = poses.filter(p => ['standing', 'seated'].includes(p.category));
  const activePoses = poses.filter(p => ['backbend', 'arm_balance', 'inversion'].includes(p.category));
  const balancePoses = poses.filter(p => p.category === 'balance');
  const twistPoses = poses.filter(p => p.category === 'twist');
  const hipOpenerPoses = poses.filter(p => p.category === 'hip_opener');
  const forwardFoldPoses = poses.filter(p => p.category === 'forward_fold');
  const restorativePoses = poses.filter(p => ['restorative', 'supine'].includes(p.category));

  // Build flow structure based on mood and focus areas
  let flow: any[] = [];
  
  // Warm-up (20% of flow)
  const warmupCount = Math.max(2, Math.floor(targetPoseCount * 0.2));
  flow.push(...selectRandomPoses(warmupPoses, warmupCount));
  
  // Active sequence (50% of flow) - adapted based on focus areas
  const activeCount = Math.floor(targetPoseCount * 0.5);
  let activePosePool = [...activePoses];
  
  if (focus_areas.includes('core')) {
    activePosePool = activePosePool.filter(p => p.anatomy_focus?.includes('core') || p.category === 'arm_balance');
  }
  if (focus_areas.includes('hips')) {
    activePosePool.push(...hipOpenerPoses);
  }
  if (focus_areas.includes('balance')) {
    activePosePool.push(...balancePoses);
  }
  if (focus_areas.includes('backbends')) {
    activePosePool = activePosePool.filter(p => p.category === 'backbend');
  }
  
  flow.push(...selectRandomPoses(activePosePool, activeCount));
  
  // Balancing/twists (20% of flow)
  const balanceCount = Math.floor(targetPoseCount * 0.2);
  const balanceTwistPoses = [...balancePoses, ...twistPoses];
  flow.push(...selectRandomPoses(balanceTwistPoses, balanceCount));
  
  // Cool-down (10% of flow)
  const cooldownCount = Math.max(1, Math.floor(targetPoseCount * 0.1));
  const cooldownPoses = [...forwardFoldPoses, ...restorativePoses];
  flow.push(...selectRandomPoses(cooldownPoses, cooldownCount));
  
  // Adjust for mood
  if (mood === 'energizing') {
    // Add more active poses, reduce restorative
    const extraActivePoses = selectRandomPoses(activePoses, 2);
    flow.splice(-2, 0, ...extraActivePoses);
  } else if (mood === 'calming') {
    // Add more restorative poses
    const extraRestorativePoses = selectRandomPoses(restorativePoses, 2);
    flow.push(...extraRestorativePoses);
  }
  
  // Ensure flow doesn't exceed target pose count
  if (flow.length > targetPoseCount) {
    flow = flow.slice(0, targetPoseCount);
  }
  
  // Add sequence order and default durations
  return flow.map((pose, index) => ({
    pose_id: pose.id,
    order_index: index,
    duration: calculatePoseDuration(pose, duration, flow.length),
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

// Helper function to select random poses from a pool
function selectRandomPoses(poses: any[], count: number): any[] {
  if (!poses || poses.length === 0) return [];
  
  const shuffled = [...poses].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, poses.length));
}

// Calculate appropriate duration for each pose based on total flow duration
function calculatePoseDuration(pose: any, totalDurationMinutes: number, totalPoses: number): number {
  const baseSeconds = Math.floor((totalDurationMinutes * 60) / totalPoses);
  
  // Adjust based on pose category
  switch (pose.category) {
    case 'restorative':
    case 'meditation':
      return Math.min(baseSeconds * 2, 180); // Up to 3 minutes for restorative
    case 'balance':
    case 'arm_balance':
      return Math.max(baseSeconds * 0.7, 15); // Shorter for challenging poses
    case 'standing':
    case 'seated':
      return baseSeconds; // Standard duration
    default:
      return Math.max(baseSeconds, 30); // Minimum 30 seconds
  }
}