import { describe, it, expect } from "vitest";
import { applySafetyAdjustments, tempoAdjust, calculateTransitionScore, selectBestTransitionPoses, suggestTransitionPose } from "../yoga-helpers";
import { PoseId } from "../../types/yoga";

describe("applySafetyAdjustments", () => {
  it("inserts counter pose between twist and backbend", () => {
    const seq = applySafetyAdjustments([PoseId.TwistLow, PoseId.Bridge]);
    expect(seq).not.toEqual([PoseId.TwistLow, PoseId.Bridge]);
    expect(seq).toContain(PoseId.ForwardFold);
  });
});

describe("tempoAdjust", () => {
  it("halves duration at 2x tempo", () => {
    expect(tempoAdjust(60, 2)).toBe(30);
  });
});

describe("calculateTransitionScore", () => {
  it("returns 0 for null poses", () => {
    expect(calculateTransitionScore(null, null)).toBe(0);
    expect(calculateTransitionScore({}, null)).toBe(0);
    expect(calculateTransitionScore(null, {})).toBe(0);
  });

  it("gives high score for direct transition relationships", () => {
    const fromPose = {
      id: 'pose1',
      slug: 'mountain-pose',
      transitions_out: ['forward-fold'],
      category: 'standing'
    };
    const toPose = {
      id: 'pose2', 
      slug: 'forward-fold',
      transitions_in: ['mountain-pose'],
      category: 'forward_fold'
    };
    
    const score = calculateTransitionScore(fromPose, toPose);
    expect(score).toBeGreaterThan(10);
  });

  it("gives bonus for same category poses", () => {
    const pose1 = { id: 'p1', category: 'standing', intensity: 2 };
    const pose2 = { id: 'p2', category: 'standing', intensity: 2 };
    
    const score = calculateTransitionScore(pose1, pose2);
    expect(score).toBeGreaterThan(0);
  });

  it("penalizes unsafe transitions", () => {
    const twistPose = { id: 'p1', family: 'twist', category: 'twist' };
    const backbendPose = { id: 'p2', family: 'backbend', category: 'backbend' };
    
    const score = calculateTransitionScore(twistPose, backbendPose);
    expect(score).toBeLessThan(calculateTransitionScore(twistPose, { id: 'p3', family: 'standing', category: 'standing' }));
  });

  it("considers intensity differences", () => {
    const easyPose = { id: 'p1', intensity: 1 };
    const hardPose = { id: 'p2', intensity: 5 };
    const mediumPose = { id: 'p3', intensity: 2 };
    
    const easyToMedium = calculateTransitionScore(easyPose, mediumPose);
    const easyToHard = calculateTransitionScore(easyPose, hardPose);
    
    expect(easyToMedium).toBeGreaterThan(easyToHard);
  });
});

describe("selectBestTransitionPoses", () => {
  const samplePoses = [
    { id: 'p1', slug: 'mountain-pose', category: 'standing', intensity: 2 },
    { id: 'p2', slug: 'forward-fold', category: 'forward_fold', intensity: 2, transitions_in: ['mountain-pose'] },
    { id: 'p3', slug: 'backbend', category: 'backbend', intensity: 4 },
    { id: 'p4', slug: 'twist', category: 'twist', intensity: 3 }
  ];

  it("returns empty array for empty candidate list", () => {
    expect(selectBestTransitionPoses({}, [], 3)).toEqual([]);
  });

  it("returns random selection when no current pose", () => {
    const result = selectBestTransitionPoses(null, samplePoses, 2);
    expect(result).toHaveLength(2);
    expect(samplePoses).toEqual(expect.arrayContaining(result));
  });

  it("prefers poses with better transition scores", () => {
    const mountainPose = samplePoses[0]; // mountain-pose
    const result = selectBestTransitionPoses(mountainPose, samplePoses.slice(1), 1);
    
    expect(result).toHaveLength(1);
    // Should prefer forward-fold which has mountain-pose in transitions_in
    expect(result[0].slug).toBe('forward-fold');
  });

  it("respects count parameter", () => {
    const result = selectBestTransitionPoses(samplePoses[0], samplePoses, 3);
    expect(result.length).toBeLessThanOrEqual(3);
  });
});

describe("suggestTransitionPose", () => {
  const availablePoses = [
    { id: 'p1', slug: 'childs-pose', category: 'restorative', intensity: 1 },
    { id: 'p2', slug: 'mountain-pose', category: 'standing', intensity: 2 },
    { id: 'p3', slug: 'forward-fold', category: 'forward_fold', intensity: 2 },
    { id: 'p4', slug: 'plank', category: 'arm_balance', intensity: 3, transitions_out: ['downward-dog'] },
    { id: 'p5', slug: 'downward-dog', category: 'inversion', intensity: 3, transitions_in: ['plank'] }
  ];

  it("returns null for good transitions", () => {
    const goodFromPose = availablePoses[3]; // plank  
    const goodToPose = availablePoses[4]; // downward-dog
    
    expect(suggestTransitionPose(goodFromPose, goodToPose, availablePoses)).toBeNull();
  });

  it("suggests bridge pose for difficult transitions", () => {
    const twistPose = { id: 'twist', category: 'twist', family: 'twist' };
    const backbendPose = { id: 'backbend', category: 'backbend', family: 'backbend' };
    
    const suggestion = suggestTransitionPose(twistPose, backbendPose, availablePoses);
    expect(suggestion).toBeTruthy();
    expect(['restorative', 'standing', 'forward_fold']).toContain(suggestion.category);
  });

  it("returns neutral pose as fallback", () => {
    const difficultPose1 = { id: 'p1', category: 'difficult1' };
    const difficultPose2 = { id: 'p2', category: 'difficult2' };
    
    const suggestion = suggestTransitionPose(difficultPose1, difficultPose2, availablePoses);
    expect(suggestion).toBeTruthy();
    // Should return one of the available neutral-ish poses
    expect(availablePoses).toContain(suggestion);
  });
});
