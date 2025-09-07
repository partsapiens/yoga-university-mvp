import React from 'react';
import { Pose } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface PoseCardProps {
  pose: Pose;
  onClick?: () => void;
  className?: string;
  isSelected?: boolean;
}

export const PoseCard = ({ pose, onClick, className, isSelected }: PoseCardProps) => {
  return (
    <Card
      className={cn(
        'w-48 cursor-pointer hover:shadow-lg transition-shadow',
        isSelected && 'ring-2 ring-primary',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <img
          src={pose.image_url || '/placeholder.jpg'}
          alt={pose.name}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-3">
        <h3 className="font-bold text-md truncate">{pose.name}</h3>
        <p className="text-sm text-gray-500 truncate">{pose.sanskrit}</p>
      </CardContent>
    </Card>
  );
};
