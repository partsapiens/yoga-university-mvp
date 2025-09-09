import { useEffect, useRef, useState } from 'react';

export function useCycler(items: string[], delayMs = 3000, active = true) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!active || items.length <= 1) {
      if (timer.current) window.clearInterval(timer.current);
      return;
    }

    timer.current && window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setIdx(i => (i + 1) % items.length);
    }, delayMs);

    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [items.join('|'), delayMs, active]);

  // Reset to first when items set changes
  useEffect(() => {
    setIdx(0);
  }, [items.join('|')]);

  return items[idx] || '';
}
