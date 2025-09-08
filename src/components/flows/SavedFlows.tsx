import React from 'react';
import { SavedFlow } from '@/types/yoga';

interface SavedFlowsProps {
  flows: SavedFlow[];
  onLoad: (flowId: string) => void;
  onDelete: (flowId: string) => void;
}

export function SavedFlows({ flows, onLoad, onDelete }: SavedFlowsProps) {
  return (
    <div className="mx-auto max-w-5xl mt-6">
      <h3 className="text-base font-medium mb-2 text-muted-foreground">Saved Flows</h3>
      <div className="flex flex-wrap gap-2">
        {flows.map(flow => (
          <div key={flow.id} className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-3">
            <button onClick={() => onLoad(flow.id)} className="font-semibold text-sm hover:underline px-2">
              {flow.name}
            </button>
            <button onClick={() => onDelete(flow.id)} className="text-xs text-muted-foreground hover:text-destructive">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
