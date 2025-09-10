import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Metric } from '@/components/ui/Metric';

interface StatCardProps {
  title: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <Metric label={title} value={value} />
      </CardContent>
    </Card>
  );
};
