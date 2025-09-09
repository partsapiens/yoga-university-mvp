import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface CommandLog {
  id: string;
  transcript: string;
  feedback: string;
}

interface CommandConsoleProps {
  logs: CommandLog[];
  onCommand: (command: string) => void;
  show: boolean;
  isPopupVersion?: boolean;
}

export function CommandConsole({ logs, onCommand, show, isPopupVersion = false }: CommandConsoleProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onCommand(inputValue.trim());
      setInputValue('');
    }
  };

  if (!show) {
    return null;
  }

  const wrapperClasses = isPopupVersion
    ? "w-full"
    : "fixed bottom-0 left-0 right-0 bg-card/90 border-t border-border p-4 shadow-lg backdrop-blur-sm z-10";

  return (
    <div className={wrapperClasses}>
      <div className={cn(!isPopupVersion && "max-w-5xl mx-auto")}>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          {isPopupVersion ? "Voice not supported. Use text instead." : "Command Console"}
        </h3>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., 'play', 'set intensity 3'"
            className="flex-grow h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <button type="submit" className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold">
            Send
          </button>
        </form>
        <div className="text-xs text-muted-foreground space-y-1 max-h-24 overflow-y-auto">
          {logs.length === 0 && <p>Command history will appear here.</p>}
          {logs.map(log => (
            <p key={log.id}>
              <span className="font-semibold text-foreground">&gt; {log.transcript}</span>
              <span className="italic ml-2">→ {log.feedback}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
