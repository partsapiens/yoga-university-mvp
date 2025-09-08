import React from 'react';
import { cn } from '@/lib/utils';

interface VoiceMicButtonProps {
  listening: boolean;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
}

export function VoiceMicButton({ listening, error, onStart, onStop }: VoiceMicButtonProps) {
  const handleClick = () => {
    if (listening) {
      onStop();
    } else {
      onStart();
    }
  };

  const Icon = () => {
    if (error) return <span title={error}>⚠️</span>;
    if (listening) return <span className="animate-pulse">🔴</span>;
    return '🎤';
  };

  return (
    <button
      onClick={handleClick}
      title={listening ? "Stop listening" : "Activate voice commands"}
      className={cn(
        "flex items-center justify-center h-12 w-12 rounded-full border text-2xl transition-all",
        listening ? "bg-primary/20 border-primary" : "bg-card hover:bg-accent",
        error ? "bg-destructive/20 border-destructive" : ""
      )}
    >
      <Icon />
    </button>
  );
}
