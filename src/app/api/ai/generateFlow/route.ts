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

// Flow generation algorithm with AI transition detection
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

  // Build flow structure with transition-aware sequencing
  let flow: any[] = [];
  
  // Warm-up (20% of flow) - start with neutral poses
  const warmupCount = Math.max(2, Math.floor(targetPoseCount * 0.2));
  const warmupSequence = selectTransitionAwarePoses(null, warmupPoses, warmupCount, poses);
  flow.push(...warmupSequence);
  
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
  
  const activeSequence = selectTransitionAwarePoses(
    flow[flow.length - 1] || null, 
    activePosePool, 
    activeCount, 
    poses
  );
  flow.push(...activeSequence);
  
  // Balancing/twists (20% of flow)
  const balanceCount = Math.floor(targetPoseCount * 0.2);
  const balanceTwistPoses = [...balancePoses, ...twistPoses];
  const balanceSequence = selectTransitionAwarePoses(
    flow[flow.length - 1] || null,
    balanceTwistPoses,
    balanceCount,
    poses
  );
  flow.push(...balanceSequence);
  
  // Cool-down (10% of flow)
  const cooldownCount = Math.max(1, Math.floor(targetPoseCount * 0.1));
  const cooldownPoses = [...forwardFoldPoses, ...restorativePoses];
  const cooldownSequence = selectTransitionAwarePoses(
    flow[flow.length - 1] || null,
    cooldownPoses,
    cooldownCount,
    poses
  );
  flow.push(...cooldownSequence);
  
  // Adjust for mood with transition awareness
  if (mood === 'energizing') {
    // Add more active poses, but consider transitions
    const lastPose = flow[flow.length - 2] || null;
    const extraActivePoses = selectTransitionAwarePoses(lastPose, activePoses, 2, poses);
    flow.splice(-2, 0, ...extraActivePoses);
  } else if (mood === 'calming') {
    // Add more restorative poses with smooth transitions
    const lastPose = flow[flow.length - 1] || null;
    const extraRestorativePoses = selectTransitionAwarePoses(lastPose, restorativePoses, 2, poses);
    flow.push(...extraRestorativePoses);
  }
  
  // Apply final transition optimization
  flow = optimizeFlowTransitions(flow, poses);
  
  // Ensure flow doesn't exceed target pose count
  if (flow.length > targetPoseCount) {
    flow = flow.slice(0, targetPoseCount);
  }
  
  // Add sequence order and default durations
  return flow.map((pose, index) => ({
    pose_id: pose.id,
    order_index: index,
    duration: calculatePoseDuration(pose, duration, flow.length),
    transition_score: index > 0 ? calculateTransitionScore(flow[index - 1], pose) : null,
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

// Helper function to select poses with transition awareness
function selectTransitionAwarePoses(previousPose: any, candidatePoses: any[], count: number, allPoses: any[]): any[] {
  if (!candidatePoses || candidatePoses.length === 0) return [];
  if (count <= 0) return [];
  
  const selected: any[] = [];
  let currentPose = previousPose;
  
  for (let i = 0; i < count; i++) {
    if (candidatePoses.length === 0) break;
    
    // Use transition-aware selection
    const nextPoses = selectBestTransitionPoses(currentPose, candidatePoses, 1);
    if (nextPoses.length === 0) break;
    
    const nextPose = nextPoses[0];
    selected.push(nextPose);
    currentPose = nextPose;
    
    // Remove selected pose from candidates
    const index = candidatePoses.findIndex(p => p.id === nextPose.id);
    if (index !== -1) {
      candidatePoses.splice(index, 1);
    }
  }
  
  return selected;
}

// Optimize flow transitions by inserting bridging poses when needed
function optimizeFlowTransitions(flow: any[], allPoses: any[]): any[] {
  const optimizedFlow: any[] = [];
  
  for (let i = 0; i < flow.length; i++) {
    const currentPose = flow[i];
    const nextPose = flow[i + 1];
    
    optimizedFlow.push(currentPose);
    
    // Check if we need a transition pose
    if (nextPose) {
      const transitionScore = calculateTransitionScore(currentPose, nextPose);
      
      if (transitionScore < 3) { // Poor transition
        const bridgePose = suggestTransitionPose(currentPose, nextPose, allPoses);
        if (bridgePose && !optimizedFlow.some(p => p.id === bridgePose.id)) {
          optimizedFlow.push(bridgePose);
        }
      }
    }
  }
  
  return optimizedFlow;
}

// Import transition helper functions (these would be from yoga-helpers.ts)
function calculateTransitionScore(fromPose: any, toPose: any): number {
  if (!fromPose || !toPose) return 0;

  let score = 0;

  // Check if poses have direct transition relationship
  if (fromPose.transitions_out?.includes(toPose.slug) || fromPose.transitions_out?.includes(toPose.id)) {
    score += 10; // Strong direct transition
  }
  
  if (toPose.transitions_in?.includes(fromPose.slug) || toPose.transitions_in?.includes(fromPose.id)) {
    score += 10; // Strong incoming transition
  }

  // Check related next poses
  if (fromPose.related_next_slugs?.includes(toPose.slug) || fromPose.related_next_slugs?.includes(toPose.id)) {
    score += 5; // Good sequence relationship
  }

  // Same category bonus (easier transitions within same pose family)
  if (fromPose.category === toPose.category) {
    score += 3;
  }

  // Same plane of movement bonus
  if (fromPose.plane === toPose.plane) {
    score += 2;
  }

  // Similar intensity levels (avoid big jumps in difficulty)
  const intensityDiff = Math.abs((fromPose.intensity || 3) - (toPose.intensity || 3));
  if (intensityDiff <= 1) {
    score += 2;
  } else if (intensityDiff >= 3) {
    score -= 2; // Penalize big intensity jumps
  }

  // Check if transition requires safety intervention
  if (isTransitionUnsafe(fromPose, toPose)) {
    score -= 5; // Penalize unsafe transitions
  }

  return Math.max(0, score); // Ensure non-negative score
}

function isTransitionUnsafe(fromPose: any, toPose: any): boolean {
  if (!fromPose || !toPose) return false;

  const fromFamily = (fromPose.family || fromPose.category || '').toLowerCase();
  const toFamily = (toPose.family || toPose.category || '').toLowerCase();

  // Unsafe patterns: twist to backbend or backbend to twist
  return (/twist/i.test(fromFamily) && /backbend/i.test(toFamily)) || 
         (/backbend/i.test(fromFamily) && /twist/i.test(toFamily));
}

function selectBestTransitionPoses(currentPose: any, candidatePoses: any[], count: number): any[] {
  if (!candidatePoses || candidatePoses.length === 0) return [];
  if (!currentPose) return selectRandomPoses(candidatePoses, count);

  // Score each candidate pose
  const scoredPoses = candidatePoses.map(pose => ({
    pose,
    score: calculateTransitionScore(currentPose, pose)
  }));

  // Sort by score (descending) and add some randomness for variety
  scoredPoses.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (scoreDiff === 0) {
      return Math.random() - 0.5; // Random for equal scores
    }
    return scoreDiff;
  });

  // Select top candidates but introduce some randomness to avoid predictability
  const topCandidates = Math.min(count * 2, scoredPoses.length);
  const selected: any[] = [];
  
  for (let i = 0; i < count && i < candidatePoses.length; i++) {
    // Bias toward higher scored poses but allow some variety
    const maxIndex = Math.min(topCandidates, scoredPoses.length);
    const weightedIndex = Math.floor(Math.random() * Math.random() * maxIndex);
    
    if (scoredPoses[weightedIndex] && !selected.includes(scoredPoses[weightedIndex].pose)) {
      selected.push(scoredPoses[weightedIndex].pose);
      scoredPoses.splice(weightedIndex, 1); // Remove to avoid duplicates
    }
  }

  // Fill remaining slots with random selection if needed
  while (selected.length < count && scoredPoses.length > 0) {
    const randomIndex = Math.floor(Math.random() * scoredPoses.length);
    selected.push(scoredPoses[randomIndex].pose);
    scoredPoses.splice(randomIndex, 1);
  }

  return selected;
}

function suggestTransitionPose(fromPose: any, toPose: any, availablePoses: any[]): any | null {
  if (!fromPose || !toPose || calculateTransitionScore(fromPose, toPose) >= 5) {
    return null; // No transition needed for good transitions
  }

  // Look for poses that can bridge the gap
  const bridgePoses = availablePoses.filter(pose => {
    const fromBridge = calculateTransitionScore(fromPose, pose);
    const bridgeTo = calculateTransitionScore(pose, toPose);
    return fromBridge >= 3 && bridgeTo >= 3;
  });

  if (bridgePoses.length === 0) {
    // Fallback to neutral poses
    const neutralPoses = availablePoses.filter(pose => 
      ['restorative', 'neutral', 'standing'].includes(pose.category) ||
      pose.slug === 'childs-pose' || pose.slug === 'mountain-pose'
    );
    return neutralPoses.length > 0 ? neutralPoses[0] : null;
  }

  // Return the best bridging pose
  return selectBestTransitionPoses(fromPose, bridgePoses, 1)[0] || null;
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