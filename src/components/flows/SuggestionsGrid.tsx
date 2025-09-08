import React from 'react';
import { Pose, PoseId } from '@/types/yoga';
import { POSES } from '@/lib/yoga-data';

interface SuggestionsGridProps {
  onAddPose: (poseId: PoseId) => void;
}

export function SuggestionsGrid({ onAddPose }: SuggestionsGridProps) {
  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-medium">Suggestions</h2>
        <div className="text-xs text-muted-foreground">Click to add</div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {POSES.map((p) => (
          <button
            key={p.id}
            onClick={() => onAddPose(p.id)}
            className="group rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="mb-2 flex h-20 w-full items-center justify-center rounded-xl bg-muted text-3xl">
              {p.icon}
            </div>
            <div className="font-medium group-hover:underline text-sm leading-tight">{p.name}</div>
            <div className="text-xs text-muted-foreground truncate">{p.sanskrit}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
