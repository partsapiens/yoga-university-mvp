import React, { useEffect, useState, useRef } from 'react';

interface GridNavigationProps {
  items: any[];
  onSelect: (item: any) => void;
  gridColumns?: number;
}

export default function GridNavigation({ items, onSelect, gridColumns = 3 }: GridNavigationProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (!items.length) return;

      const currentIndex = focusedIndex;
      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newIndex = Math.max(0, currentIndex - gridColumns);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = Math.min(items.length - 1, currentIndex + gridColumns);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = Math.max(0, currentIndex - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newIndex = Math.min(items.length - 1, currentIndex + 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (items[currentIndex]) {
            onSelect(items[currentIndex]);
          }
          return;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = items.length - 1;
          break;
        default:
          return;
      }

      setFocusedIndex(newIndex);

      // Focus the actual DOM element
      const cards = containerRef.current?.querySelectorAll('[data-pose-card]');
      if (cards && cards[newIndex]) {
        (cards[newIndex] as HTMLElement).focus();
      }
    }
    
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [items, onSelect, focusedIndex, gridColumns]);

  // Reset focus when items change
  useEffect(() => {
    setFocusedIndex(0);
  }, [items]);

  return (
    <div 
      ref={containerRef}
      className="sr-only"
      aria-label="Use arrow keys to navigate poses, Enter to select"
    />
  );
}