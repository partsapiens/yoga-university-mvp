import { useEffect } from 'react';

interface GridNavigationProps {
  items: any[];
  onSelect: (item: any) => void;
}

export default function GridNavigation({ items, onSelect }: GridNavigationProps) {
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      // Arrow key navigation, Enter to select
      // You'd need to track focus state for real navigation
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // Prevent default scrolling
        e.preventDefault();
        // TODO: Implement focus management for grid navigation
      }
      if (e.key === 'Enter') {
        // TODO: Select currently focused item
      }
    }
    
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [items, onSelect]);
  
  return null;
}