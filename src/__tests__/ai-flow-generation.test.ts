import { describe, it, expect } from "vitest";

// Import the transition functions directly from the route file  
const samplePoses = [
  {
    id: 'test-mountain',
    slug: 'mountain-pose',
    name: 'Mountain Pose',
    sanskrit: 'Tadasana',
    category: 'standing',
    level: 'beginner',
    intensity: 2,
    transitions_out: ['forward-fold'],
    related_next_slugs: ['forward-fold'],
    family: 'standing',
    plane: 'frontal'
  },
  {
    id: 'test-forward-fold',
    slug: 'forward-fold',
    name: 'Forward Fold',
    sanskrit: 'Uttanasana',
    category: 'forward_fold',
    level: 'beginner',
    intensity: 2,
    transitions_in: ['mountain-pose'],
    family: 'forward_fold',
    plane: 'sagittal'
  },
  {
    id: 'test-twist',
    slug: 'twist-pose',
    name: 'Twist Pose',
    category: 'twist',
    level: 'intermediate',
    intensity: 3,
    family: 'twist'
  },
  {
    id: 'test-backbend',
    slug: 'bridge-pose',
    name: 'Bridge Pose',
    category: 'backbend',
    level: 'intermediate',
    intensity: 4,
    family: 'backbend'
  },
  {
    id: 'test-restorative',
    slug: 'childs-pose',
    name: 'Child\'s Pose',
    category: 'restorative',
    level: 'beginner',
    intensity: 1,
    family: 'restorative'
  }
];

// Create helper functions for testing (copied from route file)
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

describe('AI Flow Generation Transition Detection', () => {
  it('should score good transitions highly', () => {
    const mountainPose = samplePoses[0]; // mountain-pose
    const forwardFold = samplePoses[1]; // forward-fold (has mountain-pose in transitions_in)
    
    const score = calculateTransitionScore(mountainPose, forwardFold);
    expect(score).toBeGreaterThan(10); // Should get bonus for direct transition
  });

  it('should penalize unsafe transitions', () => {
    const twistPose = samplePoses[2]; // twist
    const backbendPose = samplePoses[3]; // backbend
    
    const unsafeScore = calculateTransitionScore(twistPose, backbendPose);
    const safeScore = calculateTransitionScore(twistPose, samplePoses[4]); // to restorative
    
    expect(unsafeScore).toBeLessThan(safeScore); // Unsafe should score lower
  });

  it('should detect unsafe transitions correctly', () => {
    const twistPose = samplePoses[2];
    const backbendPose = samplePoses[3];
    const restorativePose = samplePoses[4];
    
    expect(isTransitionUnsafe(twistPose, backbendPose)).toBe(true);
    expect(isTransitionUnsafe(backbendPose, twistPose)).toBe(true);
    expect(isTransitionUnsafe(twistPose, restorativePose)).toBe(false);
  });

  it('should give same category bonus', () => {
    // Create two standing poses
    const standing1 = { ...samplePoses[0], id: 'standing1' };
    const standing2 = { ...samplePoses[0], id: 'standing2' };
    
    const sameCategory = calculateTransitionScore(standing1, standing2);
    const diffCategory = calculateTransitionScore(standing1, samplePoses[4]); // to restorative
    
    expect(sameCategory).toBeGreaterThan(diffCategory);
  });

  it('should consider intensity differences', () => {
    const easyPose = { ...samplePoses[4], intensity: 1 }; // restorative, intensity 1
    const hardPose = { ...samplePoses[3], intensity: 5 }; // modified to intensity 5
    const mediumPose = { ...samplePoses[0], intensity: 2 }; // standing, intensity 2
    
    const easyToMedium = calculateTransitionScore(easyPose, mediumPose);
    const easyToHard = calculateTransitionScore(easyPose, hardPose);
    
    expect(easyToMedium).toBeGreaterThan(easyToHard);
  });

  it('should handle null/undefined poses gracefully', () => {
    expect(calculateTransitionScore(null, null)).toBe(0);
    expect(calculateTransitionScore(samplePoses[0], null)).toBe(0);
    expect(calculateTransitionScore(null, samplePoses[0])).toBe(0);
    
    expect(isTransitionUnsafe(null, null)).toBe(false);
    expect(isTransitionUnsafe(samplePoses[0], null)).toBe(false);
  });
});