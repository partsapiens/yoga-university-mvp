import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Metric } from '@/components/ui/Metric';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface StatCardProps {
  title: string;
  value: string | number;
  progress?: number; // 0-100 percentage for progress bar
  trend?: 'up' | 'down' | 'neutral'; // Optional trend indicator
  subtitle?: string; // Optional subtitle for additional context
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  progress, 
  trend, 
  subtitle 
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendSymbol = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Metric label={title} value={value} />
          {subtitle && (
            <div className={`text-xs ${getTrendColor()}`}>
              {getTrendSymbol()} {subtitle}
            </div>
          )}
          {progress !== undefined && (
            <div className="space-y-1">
              <ProgressBar value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {progress}% of goal
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
