import React from 'react';

/**
 * A simple, full-page loading spinner.
 */
export const FullPageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

/**
 * An inline loading spinner.
 */
export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizeClasses[size]}`}></div>
  );
};