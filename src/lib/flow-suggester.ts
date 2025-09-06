import { Pose, PoseRelation } from '@/types';
import { getPoses, getPoseRelations } from './database';

// A cache to hold all poses so we don't have to fetch them repeatedly.
let allPoses: Pose[] = [];
let posesMap: Map<string, Pose> = new Map();
let posesBySlug: Map<string, Pose> = new Map();

// Initialize the pose cache.
const ensurePoseCache = async () => {
  if (allPoses.length === 0) {
    allPoses = await getPoses();
    posesMap = new Map(allPoses.map(p => [p.id, p]));
    posesBySlug = new Map(allPoses.map(p => [p.slug, p]));
  }
};

/**
 * Suggests a few good starting poses for a new flow.
 */
export const getStartingPoseSuggestions = async (): Promise<Pose[]> => {
  await ensurePoseCache();
  // Suggest poses with low intensity, like warm-ups.
  return allPoses.filter(p => (p.intensity ?? 3) <= 2).slice(0, 5);
};

interface ScoredSuggestion {
  pose: Pose;
  score: number;
}

/**
 * Suggests the next 5 poses based on the current state of the flow.
 */
export const getNextPoseSuggestions = async (currentFlow: Pose[]): Promise<Pose[]> => {
  if (currentFlow.length === 0) {
    return getStartingPoseSuggestions();
  }

  await ensurePoseCache();
  const lastPose = currentFlow[currentFlow.length - 1];
  const suggestions: ScoredSuggestion[] = [];

  // Rule 1: Bilateral Balance (highest priority)
  if (lastPose.other_side_slug) {
    const otherSidePose = posesBySlug.get(lastPose.other_side_slug);
    const secondLastPose = currentFlow[currentFlow.length - 2];
    // Check if we just did the other side.
    if (otherSidePose && (!secondLastPose || secondLastPose.id !== otherSidePose.id)) {
      suggestions.push({ pose: otherSidePose, score: 1000 });
    }
  }

  // Rule 2: Use the pre-calculated relations from the database
  const relations = await getPoseRelations(lastPose.id);
  for (const relation of relations) {
    const targetPose = posesMap.get(relation.target_pose_id);
    if (targetPose) {
      let score = relation.weight;
      // You can add more dynamic scoring here if needed.
      // For example, boost counterposes after intense sequences.
      const recentIntensity = currentFlow.slice(-2).reduce((sum, p) => sum + (p.intensity ?? 0), 0);
      if (recentIntensity > 8 && relation.relation_type === 'counterpose') {
        score += 50;
      }
      suggestions.push({ pose: targetPose, score });
    }
  }

  // Rule 3: Add some general variety if no strong suggestions are found
  if (suggestions.length < 5) {
      allPoses.forEach(p => {
          if (p.level === lastPose.level) {
              suggestions.push({ pose: p, score: 1 });
          }
      });
  }

  // Consolidate scores for any duplicates
  const consolidated = new Map<string, ScoredSuggestion>();
  for (const sug of suggestions) {
    const existing = consolidated.get(sug.pose.id);
    if (existing) {
      existing.score = Math.max(existing.score, sug.score); // Take the highest score if suggested for multiple reasons
    } else {
      consolidated.set(sug.pose.id, sug);
    }
  }

  // Exclude poses already in the current flow
  currentFlow.forEach(p => consolidated.delete(p.id));

  // Sort by score and return the top 5 poses
  const sortedSuggestions = Array.from(consolidated.values()).sort((a, b) => b.score - a.score);

  return sortedSuggestions.slice(0, 5).map(s => s.pose);
};
