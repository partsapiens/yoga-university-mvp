"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Trophy, 
  Flame, 
  Target, 
  Clock, 
  Star,
  Award,
  TrendingUp
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'milestone' | 'streak' | 'skill' | 'consistency';
  earnedAt: string;
  isRecent: boolean;
}

const sampleAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Warrior Mastery',
    description: 'Completed all Warrior pose variations',
    icon: Trophy,
    type: 'skill',
    earnedAt: '2024-01-15',
    isRecent: true
  },
  {
    id: '2',
    title: '7-Day Streak',
    description: 'Practiced yoga for 7 consecutive days',
    icon: Flame,
    type: 'streak',
    earnedAt: '2024-01-14',
    isRecent: true
  },
  {
    id: '3',
    title: 'Morning Person',
    description: 'Completed 10 morning sessions',
    icon: Star,
    type: 'consistency',
    earnedAt: '2024-01-12',
    isRecent: false
  },
  {
    id: '4',
    title: 'Flow Creator',
    description: 'Created your first custom flow',
    icon: Target,
    type: 'milestone',
    earnedAt: '2024-01-10',
    isRecent: false
  }
];

const typeColors = {
  milestone: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  streak: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
  skill: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  consistency: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
};

export const RecentAchievements: React.FC = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            {sampleAchievements.filter(a => a.isRecent).length} new
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sampleAchievements.map((achievement) => {
            const IconComponent = achievement.icon;
            
            return (
              <div
                key={achievement.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  achievement.isRecent 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/30'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  achievement.isRecent 
                    ? 'bg-primary/10' 
                    : 'bg-muted'
                }`}>
                  <IconComponent className={`h-4 w-4 ${
                    achievement.isRecent 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {achievement.isRecent && (
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                      )}
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${typeColors[achievement.type]}`}
                      >
                        {achievement.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(achievement.earnedAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Achievement Progress */}
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-accent/50 to-accent/20 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Next Achievement</span>
            <span className="text-xs text-muted-foreground">80% complete</span>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            Practice for 3 more days to unlock &quot;10-Day Streak&quot;
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '80%' }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};