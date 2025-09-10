"use client";

import { PRESETS } from "@/lib/yoga-data";
import { PoseId } from "@/types/yoga";

interface PresetFlowsRowProps {
  onSelect?: (flow: PoseId[]) => void;
}

export const PresetFlowsRow = ({ onSelect }: PresetFlowsRowProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
      {PRESETS.map((preset) => (
        <button
          key={preset.name}
          onClick={() => onSelect?.(preset.flow)}
          className="btn btn-outline whitespace-nowrap"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};
