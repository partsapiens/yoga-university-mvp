// Define local interfaces to avoid circular imports
interface PoseAnalysisResult {
  score: number;
  feedback: string[];
  keypoints?: any[];
  timestamp: number;
  accuracy?: number;
  pose?: any;
  suggestions?: string[];
}

interface DetectedPose {
  keypoints: any[];
  score: number;
}

export interface PoseSession {
  id: string;
  poseName: string;
  timestamp: number;
  duration: number; // in seconds
  accuracy: number;
  feedback: string[];
  suggestions: string[];
}

export interface PoseProgress {
  poseName: string;
  sessions: PoseSession[];
  averageAccuracy: number;
  bestAccuracy: number;
  totalSessions: number;
  totalDuration: number; // in seconds
  improvementTrend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  lastPracticed: number;
}

export interface OverallProgress {
  totalSessions: number;
  totalDuration: number; // in seconds
  averageAccuracy: number;
  mostPracticedPose: string;
  mostImprovedPose: string;
  recentSessions: PoseSession[];
  weeklyProgress: {
    week: string;
    sessions: number;
    averageAccuracy: number;
  }[];
}

export class PoseAnalytics {
  private storageKey = 'yoga_pose_analytics';

  saveSession(session: PoseSession): void {
    try {
      const data = this.loadData();
      
      // Add session to the appropriate pose progress
      let poseProgress = data.find(p => p.poseName === session.poseName);
      
      if (!poseProgress) {
        poseProgress = {
          poseName: session.poseName,
          sessions: [],
          averageAccuracy: 0,
          bestAccuracy: 0,
          totalSessions: 0,
          totalDuration: 0,
          improvementTrend: 'insufficient_data',
          lastPracticed: 0
        };
        data.push(poseProgress);
      }

      // Add the session
      poseProgress.sessions.push(session);
      poseProgress.totalSessions++;
      poseProgress.totalDuration += session.duration;
      poseProgress.lastPracticed = session.timestamp;
      
      // Update best accuracy
      if (session.accuracy > poseProgress.bestAccuracy) {
        poseProgress.bestAccuracy = session.accuracy;
      }

      // Recalculate average accuracy
      poseProgress.averageAccuracy = Math.round(
        poseProgress.sessions.reduce((sum, s) => sum + s.accuracy, 0) / poseProgress.sessions.length
      );

      // Update improvement trend
      poseProgress.improvementTrend = this.calculateImprovementTrend(poseProgress.sessions);

      // Keep only recent sessions (last 50 per pose to avoid storage bloat)
      if (poseProgress.sessions.length > 50) {
        poseProgress.sessions = poseProgress.sessions
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 50);
      }

      this.saveData(data);
    } catch (error) {
      console.error('Error saving pose session:', error);
    }
  }

  getProgressForPose(poseName: string): PoseProgress | null {
    try {
      const data = this.loadData();
      return data.find(p => p.poseName === poseName) || null;
    } catch (error) {
      console.error('Error loading pose progress:', error);
      return null;
    }
  }

  getAllProgress(): PoseProgress[] {
    try {
      return this.loadData();
    } catch (error) {
      console.error('Error loading all progress:', error);
      return [];
    }
  }

  getOverallProgress(): OverallProgress {
    try {
      const data = this.loadData();
      
      if (data.length === 0) {
        return {
          totalSessions: 0,
          totalDuration: 0,
          averageAccuracy: 0,
          mostPracticedPose: '',
          mostImprovedPose: '',
          recentSessions: [],
          weeklyProgress: []
        };
      }

      const totalSessions = data.reduce((sum, p) => sum + p.totalSessions, 0);
      const totalDuration = data.reduce((sum, p) => sum + p.totalDuration, 0);
      const averageAccuracy = Math.round(
        data.reduce((sum, p) => sum + (p.averageAccuracy * p.totalSessions), 0) / totalSessions
      );

      // Find most practiced pose
      const mostPracticedPose = data.reduce((max, p) => 
        p.totalSessions > max.totalSessions ? p : max
      ).poseName;

      // Find most improved pose
      const mostImprovedPose = data
        .filter(p => p.improvementTrend === 'improving')
        .reduce((max, p) => {
          if (!max) return p;
          const maxImprovement = this.calculateImprovementScore(max.sessions);
          const currentImprovement = this.calculateImprovementScore(p.sessions);
          return currentImprovement > maxImprovement ? p : max;
        }, null as PoseProgress | null)?.poseName || '';

      // Get recent sessions (last 10)
      const allSessions = data.flatMap(p => p.sessions);
      const recentSessions = allSessions
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

      // Calculate weekly progress
      const weeklyProgress = this.calculateWeeklyProgress(allSessions);

      return {
        totalSessions,
        totalDuration,
        averageAccuracy,
        mostPracticedPose,
        mostImprovedPose,
        recentSessions,
        weeklyProgress
      };
    } catch (error) {
      console.error('Error calculating overall progress:', error);
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageAccuracy: 0,
        mostPracticedPose: '',
        mostImprovedPose: '',
        recentSessions: [],
        weeklyProgress: []
      };
    }
  }

  clearAllData(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing analytics data:', error);
    }
  }

  private loadData(): PoseProgress[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading analytics data:', error);
      return [];
    }
  }

  private saveData(data: PoseProgress[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving analytics data:', error);
    }
  }

  private calculateImprovementTrend(sessions: PoseSession[]): 'improving' | 'stable' | 'declining' | 'insufficient_data' {
    if (sessions.length < 3) {
      return 'insufficient_data';
    }

    // Take last 5 sessions to calculate trend
    const recentSessions = sessions
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-5);

    if (recentSessions.length < 3) {
      return 'insufficient_data';
    }

    const improvementScore = this.calculateImprovementScore(recentSessions);
    
    if (improvementScore > 2) {
      return 'improving';
    } else if (improvementScore < -2) {
      return 'declining';
    } else {
      return 'stable';
    }
  }

  private calculateImprovementScore(sessions: PoseSession[]): number {
    if (sessions.length < 3) return 0;

    // Sort sessions by timestamp
    const sortedSessions = sessions.sort((a, b) => a.timestamp - b.timestamp);
    
    // Calculate trend using linear regression approach
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    const n = sortedSessions.length;

    sortedSessions.forEach((session, index) => {
      const x = index;
      const y = session.accuracy;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    // Calculate slope (improvement rate)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    return slope;
  }

  private calculateWeeklyProgress(sessions: PoseSession[]): { week: string; sessions: number; averageAccuracy: number; }[] {
    const weeklyData = new Map<string, { sessions: number; totalAccuracy: number; }>();
    
    sessions.forEach(session => {
      const date = new Date(session.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, { sessions: 0, totalAccuracy: 0 });
      }
      
      const weekData = weeklyData.get(weekKey)!;
      weekData.sessions++;
      weekData.totalAccuracy += session.accuracy;
    });

    return Array.from(weeklyData.entries())
      .map(([week, data]) => ({
        week,
        sessions: data.sessions,
        averageAccuracy: Math.round(data.totalAccuracy / data.sessions)
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-8); // Last 8 weeks
  }
}

// Utility functions for pose analytics
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
}

export function getImprovementIcon(trend: PoseProgress['improvementTrend']): string {
  switch (trend) {
    case 'improving': return '📈';
    case 'declining': return '📉';
    case 'stable': return '➡️';
    case 'insufficient_data': return '❓';
    default: return '❓';
  }
}

export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 90) return 'text-green-600';
  if (accuracy >= 75) return 'text-yellow-600';
  if (accuracy >= 60) return 'text-orange-600';
  return 'text-red-600';
}

export function getAccuracyLabel(accuracy: number): string {
  if (accuracy >= 90) return 'Excellent';
  if (accuracy >= 75) return 'Good';
  if (accuracy >= 60) return 'Fair';
  return 'Needs Practice';
}