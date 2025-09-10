import React from 'react';
import { cn } from '@/lib/utils';

interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
}

export const Metric: React.FC<MetricProps> = ({ label, value, className, ...props }) => (
  <div className={cn(className)} {...props}>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);
