import React, { useEffect, useState } from 'react';
import { Save, Clock } from 'lucide-react';
import { PoseId } from '@/types/yoga';

interface AutoSaveProps {
  flow: PoseId[];
  overrides: Record<number, number>;
  flowName: string;
  onRestoreFlow: (flow: PoseId[], overrides: Record<number, number>, name: string) => void;
  className?: string;
}

interface AutoSaveData {
  flow: PoseId[];
  overrides: Record<number, number>;
  flowName: string;
  timestamp: number;
}

export function AutoSave({ flow, overrides, flowName, onRestoreFlow, className = '' }: AutoSaveProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (flow.length === 0) return;

    const timeoutId = setTimeout(() => {
      const autoSaveData: AutoSaveData = {
        flow,
        overrides,
        flowName,
        timestamp: Date.now()
      };
      
      localStorage.setItem('yoga_flow_autosave', JSON.stringify(autoSaveData));
      setLastSaved(new Date());
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [flow, overrides, flowName]);

  // Check for existing draft on mount
  useEffect(() => {
    const savedData = localStorage.getItem('yoga_flow_autosave');
    if (savedData) {
      try {
        const data: AutoSaveData = JSON.parse(savedData);
        // Only consider it a draft if it's different from current state
        const isDifferent = 
          JSON.stringify(data.flow) !== JSON.stringify(flow) ||
          JSON.stringify(data.overrides) !== JSON.stringify(overrides) ||
          data.flowName !== flowName;
        
        setHasDraft(isDifferent && data.flow.length > 0);
        if (data.timestamp) {
          setLastSaved(new Date(data.timestamp));
        }
      } catch (error) {
        console.error('Error parsing auto-save data:', error);
      }
    }
  }, [flow, overrides, flowName]);

  const handleRestoreDraft = () => {
    const savedData = localStorage.getItem('yoga_flow_autosave');
    if (savedData) {
      try {
        const data: AutoSaveData = JSON.parse(savedData);
        onRestoreFlow(data.flow, data.overrides, data.flowName);
        setHasDraft(false);
      } catch (error) {
        console.error('Error restoring draft:', error);
      }
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('yoga_flow_autosave');
    setHasDraft(false);
    setLastSaved(null);
  };

  return (
    <div className={`${className}`}>
      {/* Auto-save status */}
      {lastSaved && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Save size={12} />
          <span>Auto-saved {formatTimeAgo(lastSaved)}</span>
        </div>
      )}

      {/* Draft restoration */}
      {hasDraft && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-start gap-2 mb-2">
            <Clock size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Draft Available
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                You have an unsaved flow from {lastSaved ? formatTimeAgo(lastSaved) : 'recently'}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRestoreDraft}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Restore Draft
            </button>
            <button
              onClick={clearDraft}
              className="px-3 py-1 text-xs border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}