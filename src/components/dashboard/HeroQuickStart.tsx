"use client";

import { useState } from 'react';
import { Button, Input, Badge } from '@/components/ui';
import { useSavedFlows } from '@/hooks/useSavedFlows';
import type { SavedFlow } from '@/types/yoga';
import { track } from '@/lib/telemetry';
import { slugify } from '@/lib/utils';

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

export const HeroQuickStart = () => {
  const { saved, setSaved } = useSavedFlows(true);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [flowName, setFlowName] = useState('');

  const handleSave = () => {
    if (!flowName.trim()) return;
    const flow: SavedFlow = {
      id: new Date().toISOString(),
      name: flowName.trim(),
      flow: [],
      overrides: {},
    };
    setSaved([...saved, flow]);
    const slug = slugify(flow.name);
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 13).replace('T', '_');
    const filename = `flow_${slug}_${timestamp}.json`;
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    track('flow_saved_local', { name: flow.name });
    setFlowName('');
  };

  const handleCreateWithAI = () => {
    track('flow_autogen_requested', { preset: selectedPreset?.name, name: flowName });
    console.log('Create with AI', { preset: selectedPreset?.name, name: flowName });
  };

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
              </div>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Flow name"
          aria-label="Flow name"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          className="sm:flex-1"
        />
        <Button variant="outline" className="w-full sm:w-auto" onClick={handleCreateWithAI}>
          Create with AI
        </Button>
        <Button className="w-full sm:w-auto" onClick={handleSave}>
          Save
        </Button>
      </div>
    </section>
  );
};

