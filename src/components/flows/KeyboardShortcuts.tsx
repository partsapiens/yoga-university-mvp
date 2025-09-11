import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsProps {
  className?: string;
}

interface Shortcut {
  key: string;
  description: string;
  category: 'Player' | 'Flow' | 'General';
}

const shortcuts: Shortcut[] = [
  // Player controls
  { key: 'Space', description: 'Play/Pause flow', category: 'Player' },
  { key: '→', description: 'Next pose', category: 'Player' },
  { key: '←', description: 'Previous pose', category: 'Player' },
  { key: '[', description: 'Slow down playback', category: 'Player' },
  { key: ']', description: 'Speed up playback', category: 'Player' },
  
  // Flow editing
  { key: 'Ctrl/Cmd + Z', description: 'Undo last action', category: 'Flow' },
  { key: 'Ctrl/Cmd + S', description: 'Save flow', category: 'Flow' },
  { key: 'Ctrl/Cmd + D', description: 'Duplicate flow', category: 'Flow' },
  { key: 'Delete', description: 'Remove selected pose', category: 'Flow' },
  
  // General
  { key: '?', description: 'Show/hide shortcuts', category: 'General' },
  { key: 'Esc', description: 'Close modals', category: 'General' },
];

export function KeyboardShortcuts({ className = '' }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors ${className}`}
        title="View keyboard shortcuts (Press ? key)"
      >
        <Keyboard size={16} />
        <span className="hidden sm:inline">Shortcuts</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[80vh] overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Keyboard size={20} />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted/50 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {shortcuts
                      .filter(s => s.category === category)
                      .map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className="text-sm">{shortcut.description}</span>
                          <kbd className="px-2 py-1 text-xs bg-muted border border-border rounded font-mono">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                  </div>
                </div>
              ))}

              {/* Pro Tips */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Pro Tips
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <div>• Hold Shift while clicking to select multiple poses</div>
                  <div>• Drag poses to reorder them in your flow</div>
                  <div>• Use the AI generator for inspiration, then customize</div>
                  <div>• Export flows as PDF to print for offline practice</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Hook to handle keyboard shortcuts globally
export function useKeyboardShortcuts(handlers: {
  onToggleShortcuts?: () => void;
  onSave?: () => void;
  onDuplicate?: () => void;
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === '?' && handlers.onToggleShortcuts) {
        e.preventDefault();
        handlers.onToggleShortcuts();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's' && handlers.onSave) {
        e.preventDefault();
        handlers.onSave();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && handlers.onDuplicate) {
        e.preventDefault();
        handlers.onDuplicate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}