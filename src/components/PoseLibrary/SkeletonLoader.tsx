import React from 'react';
import { Card } from '@/components/ui/Card';

const SkeletonLoader = () => {
  return (
    <Card className="flex flex-col items-center p-4 animate-pulse">
      <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4" />
      <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
      <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
    </Card>
  );
};

export default SkeletonLoader;