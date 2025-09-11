"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Play, 
  Clock, 
  Flame, 
  Heart, 
  Moon, 
  Sun, 
  Wind,
  Target,
  PlusCircle,
  Zap
} from 'lucide-react';

const quickActions = [
  {
    id: 'morning-flow',
    title: 'Morning Flow',
    description: '15-20 min energizing practice',
    icon: Sun,
    color: 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    duration: '15-20 min',
    action: () => console.log('Start morning flow')
  },
  {
    id: 'quick-stretch',
    title: 'Quick Stretch',
    description: '5-10 min desk break',
    icon: Clock,
    color: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    duration: '5-10 min',
    action: () => console.log('Start quick stretch')
  },
  {
    id: 'power-yoga',
    title: 'Power Yoga',
    description: '30-45 min intense flow',
    icon: Flame,
    color: 'bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
    duration: '30-45 min',
    action: () => console.log('Start power yoga')
  },
  {
    id: 'restorative',
    title: 'Restorative',
    description: '20-30 min gentle practice',
    icon: Heart,
    color: 'bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/20 dark:hover:bg-pink-900/30',
    iconColor: 'text-pink-600 dark:text-pink-400',
    duration: '20-30 min',
    action: () => console.log('Start restorative')
  },
  {
    id: 'evening-wind-down',
    title: 'Evening Wind Down',
    description: '15-25 min calming flow',
    icon: Moon,
    color: 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    duration: '15-25 min',
    action: () => console.log('Start evening flow')
  },
  {
    id: 'breathing',
    title: 'Breathing Exercise',
    description: '5-15 min pranayama',
    icon: Wind,
    color: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    duration: '5-15 min',
    action: () => console.log('Start breathing exercise')
  }
];

export const QuickActions: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Start
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Custom
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            
            return (
              <Button
                key={action.id}
                onClick={action.action}
                variant="ghost"
                className={`h-auto p-4 flex flex-col items-center gap-2 ${action.color} border-0`}
              >
                <IconComponent className={`h-6 w-6 ${action.iconColor}`} />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.duration}</div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {/* Today's Recommendation */}
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Today's AI Recommendation</span>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            Based on your recent activity and the time of day
          </div>
          <Button size="sm" className="w-full">
            <Play className="h-3 w-3 mr-2" />
            Start Gentle Morning Flow (20 min)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};