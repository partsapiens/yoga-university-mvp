import React from 'react';
import { cn } from '@/lib/utils';

interface MeditationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'floating';
  children: React.ReactNode;
}

export const MeditationCard = React.forwardRef<HTMLDivElement, MeditationCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles - Wear OS inspired white card
          "bg-white rounded-3xl border border-gray-100/50",
          
          // Variant-specific shadows and effects
          {
            "shadow-lg shadow-gray-200/60": variant === 'default',
            "shadow-xl shadow-gray-200/80 hover:shadow-2xl hover:shadow-gray-200/90 transition-all duration-300": variant === 'elevated',
            "shadow-2xl shadow-gray-300/60 backdrop-blur-sm": variant === 'floating',
          },
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MeditationCard.displayName = "MeditationCard";

// Modern Button Component for Meditation UI
interface MeditationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const MeditationButton = React.forwardRef<HTMLButtonElement, MeditationButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          
          // Size variants
          {
            "px-4 py-2 text-sm": size === 'sm',
            "px-6 py-3 text-base": size === 'md',
            "px-8 py-4 text-lg": size === 'lg',
          },
          
          // Variant styles - Wear OS inspired
          {
            "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-200/70": variant === 'primary',
            "bg-white text-gray-700 border border-gray-200 shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/60": variant === 'secondary',
            "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-200/70": variant === 'accent',
          },
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MeditationButton.displayName = "MeditationButton";

// Stat Box Component for Bio Feedback
interface StatBoxProps {
  value: string | number;
  label: string;
  color: 'red' | 'blue' | 'green' | 'orange';
  className?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ value, label, color, className }) => {
  const colorClasses = {
    red: "bg-red-50 border-red-100 text-red-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600", 
    green: "bg-green-50 border-green-100 text-green-600",
    orange: "bg-orange-50 border-orange-100 text-orange-600",
  };

  return (
    <div className={cn(
      "rounded-2xl p-4 text-center border shadow-sm",
      colorClasses[color],
      className
    )}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
};