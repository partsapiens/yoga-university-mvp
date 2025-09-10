import { cn } from '@/lib/utils';
import type { FC } from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ className }) => (
  <div className={cn('animate-pulse rounded-md bg-muted', className)} />
);

export default Skeleton;
