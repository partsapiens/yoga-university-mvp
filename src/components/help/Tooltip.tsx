"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus' | 'longPress';
  delay?: number;
  className?: string;
  disabled?: boolean;
  maxWidth?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  delay = 300,
  className = '',
  disabled = false,
  maxWidth = '16rem'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate best position based on viewport
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPosition = position;

    // Check if tooltip would overflow and adjust position
    switch (position) {
      case 'top':
        if (triggerRect.top - tooltipRect.height < 0) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewport.height) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (triggerRect.left - tooltipRect.width < 0) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewport.width) {
          newPosition = 'left';
        }
        break;
    }

    setActualPosition(newPosition);
  };

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleLongPressStart = () => {
    if (trigger !== 'longPress') return;
    
    longPressTimeoutRef.current = setTimeout(() => {
      showTooltip();
    }, 500); // 500ms long press
  };

  const handleLongPressEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
    };
  }, []);

  const getPositionClasses = () => {
    const baseClasses = 'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none transition-opacity duration-200';
    
    switch (actualPosition) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`;
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`;
      default:
        return baseClasses;
    }
  };

  const getArrowClasses = () => {
    const baseArrow = 'absolute w-0 h-0 border-4 border-transparent';
    
    switch (actualPosition) {
      case 'top':
        return `${baseArrow} border-t-gray-900 top-full left-1/2 transform -translate-x-1/2`;
      case 'bottom':
        return `${baseArrow} border-b-gray-900 bottom-full left-1/2 transform -translate-x-1/2`;
      case 'left':
        return `${baseArrow} border-l-gray-900 left-full top-1/2 transform -translate-y-1/2`;
      case 'right':
        return `${baseArrow} border-r-gray-900 right-full top-1/2 transform -translate-y-1/2`;
      default:
        return '';
    }
  };

  const eventHandlers = {
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
    }),
    ...(trigger === 'focus' && {
      onFocus: showTooltip,
      onBlur: hideTooltip,
    }),
    ...(trigger === 'click' && {
      onClick: () => isVisible ? hideTooltip() : showTooltip(),
    }),
    ...(trigger === 'longPress' && {
      onTouchStart: handleLongPressStart,
      onTouchEnd: handleLongPressEnd,
      onMouseDown: handleLongPressStart,
      onMouseUp: handleLongPressEnd,
      onMouseLeave: handleLongPressEnd,
    }),
  };

  return (
    <div ref={triggerRef} className={`relative inline-block ${className}`} {...eventHandlers}>
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={getPositionClasses()}
          style={{ maxWidth }}
          role="tooltip"
          aria-live="polite"
        >
          {content}
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  );
};

// Specialized tooltip for help information
interface HelpTooltipProps {
  title?: string;
  description: string;
  children: ReactNode;
  learnMoreUrl?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  title,
  description,
  children,
  learnMoreUrl,
  position = 'top'
}) => {
  const tooltipContent = (
    <div className="text-left">
      {title && <div className="font-semibold mb-1">{title}</div>}
      <div className="text-sm text-gray-200 mb-2">{description}</div>
      {learnMoreUrl && (
        <a 
          href={learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-200 text-xs underline"
          onClick={(e) => e.stopPropagation()}
        >
          Learn more →
        </a>
      )}
    </div>
  );

  return (
    <Tooltip
      content={tooltipContent}
      position={position}
      trigger="hover"
      maxWidth="20rem"
      className="cursor-help"
    >
      {children}
    </Tooltip>
  );
};

// Help icon component that's commonly used
export const HelpIcon: React.FC<{
  title?: string;
  description: string;
  learnMoreUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ title, description, learnMoreUrl, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <HelpTooltip title={title} description={description} learnMoreUrl={learnMoreUrl}>
      <div className={`inline-flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors ${sizeClasses[size]} cursor-help`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </HelpTooltip>
  );
};