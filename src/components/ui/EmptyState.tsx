import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg",
        className
      )}
    >
      {icon && <div className="text-5xl text-muted-foreground mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6">{description}</p>}
      {action}
    </div>
  );
};
