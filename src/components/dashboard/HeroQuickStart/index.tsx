"use client";

import { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { track } from '@/lib/telemetry';
import { PrimaryActions } from './PrimaryActions';

interface Preset {
  name: string;
  duration: number;
  focusTags: string[];
}

const presets: Preset[] = [
  { name: 'Quick Core 15', duration: 15, focusTags: ['core'] },
  { name: 'Hip Opener 30', duration: 30, focusTags: ['hips'] },
  { name: 'Morning Wake-Up', duration: 20, focusTags: ['morning'] },
  { name: 'Evening Unwind', duration: 20, focusTags: ['evening'] },
  { name: 'Restorative 20', duration: 20, focusTags: ['restorative'] },
  { name: 'Power 45', duration: 45, focusTags: ['power'] },
];

export default function HeroQuickStart() {
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [flowName, setFlowName] = useState('');

  return (
    <section className="mb-8">
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-2" aria-label="Preset flows">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant={selectedPreset?.name === preset.name ? 'default' : 'secondary'}
              onClick={() => {
                setSelectedPreset(preset);
                setFlowName(preset.name);
                track('preset_opened', { preset: preset.name });
              }}
              className="whitespace-nowrap"
            >
              <div className="flex items-center gap-1">
                <span>{preset.name}</span>
                <Badge variant="outline">{preset.duration}m</Badge>
                {preset.focusTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Button>
          ))}
        </div>
      </div>
      <PrimaryActions flowName={flowName} setFlowName={setFlowName} />
    </section>
  );
}

