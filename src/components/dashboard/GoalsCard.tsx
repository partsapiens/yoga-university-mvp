"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import type { UserGoal } from '@/types/dashboard';
import { useEffect } from 'react';
import { track } from '@/lib/telemetry';
import { Plus, Target, Sparkles, Clock, Trophy } from 'lucide-react';

interface GoalsCardProps {
  goals: UserGoal[];
}

const aiRecommendedGoals = [
  {
    title: "Practice 3x per week",
    target: "3 sessions weekly",
    category: "consistency",
    icon: Clock,
    description: "Build a sustainable practice routine"
  },
  {
    title: "Master 10 new poses",
    target: "10 poses",
    category: "skill",
    icon: Trophy,
    description: "Expand your pose repertoire"
  },
  {
    title: "Hold plank for 2 minutes",
    target: "2 minutes",
    category: "strength",
    icon: Target,
    description: "Build core strength progressively"
  },
  {
    title: "Complete 30-day challenge",
    target: "30 days",
    category: "milestone",
    icon: Sparkles,
    description: "Transform your practice with consistency"
  }
];

export const GoalsCard: React.FC<GoalsCardProps> = ({ goals }) => {
  const [showGoalSetter, setShowGoalSetter] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  
  useEffect(() => {
    if (goals.length > 0) track('goal_viewed');
  }, [goals.length]);

  const handleAddCustomGoal = () => {
    // TODO: Open custom goal creation modal
    console.log('Add custom goal');
    setShowGoalSetter(false);
  };

  const handleSelectRecommendation = (goalTitle: string) => {
    // TODO: Add recommended goal to user's goals
    console.log('Add recommended goal:', goalTitle);
    setSelectedRecommendation(goalTitle);
    setTimeout(() => {
      setSelectedRecommendation(null);
      setShowGoalSetter(false);
    }, 1000);
  };

  if (showGoalSetter) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Set New Goals
            </CardTitle>
            <Button
              onClick={() => setShowGoalSetter(false)}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">✨ AI Recommended</span>
            </div>
            <div className="space-y-2">
              {aiRecommendedGoals.map((goal) => {
                const IconComponent = goal.icon;
                const isSelected = selectedRecommendation === goal.title;
                
                return (
                  <div
                    key={goal.title}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                      isSelected ? 'bg-primary/10 border-primary' : ''
                    }`}
                    onClick={() => handleSelectRecommendation(goal.title)}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-4 w-4 mt-0.5 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{goal.title}</div>
                        <div className="text-xs text-muted-foreground">{goal.description}</div>
                        <div className="text-xs text-primary mt-1">Target: {goal.target}</div>
                      </div>
                      {isSelected && (
                        <div className="text-xs text-primary font-medium">Added! ✓</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Custom Goal Option */}
          <div className="border-t pt-4">
            <Button
              onClick={handleAddCustomGoal}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals
          </CardTitle>
          <Button
            onClick={() => setShowGoalSetter(true)}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <EmptyState 
            title="No goals set" 
            description="Set a goal to stay motivated."
            action={
              <Button
                onClick={() => setShowGoalSetter(true)}
                size="sm"
                className="mt-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Set Your First Goal
              </Button>
            }
          />
        ) : (
          <ul className="space-y-4">
            {goals.map((goal) => (
              <li key={goal.id}>
                <div className="mb-1 text-sm font-medium">{goal.title}</div>
                <div className="text-xs text-muted-foreground">Target: {goal.target}</div>
                {goal.dueDate && (
                  <div className="text-xs text-muted-foreground">
                    Due: {new Date(goal.dueDate).toLocaleDateString()}
                  </div>
                )}
                <ProgressBar value={goal.progress} />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    {goal.progress}% complete
                  </span>
                  {goal.progress >= 100 && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      Completed!
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
