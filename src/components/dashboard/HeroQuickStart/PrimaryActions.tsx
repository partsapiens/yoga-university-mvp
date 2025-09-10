"use client";

import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
} from '@/components/ui';
import { useSavedFlows } from '@/hooks/useSavedFlows';
import type { SavedFlow } from '@/types/yoga';
import { track } from '@/lib/telemetry';
import { slugify } from '@/lib/utils';
import { autogenFlow } from '@/lib/api/ai';

interface PrimaryActionsProps {
  flowName: string;
  setFlowName: (value: string) => void;
}

export const PrimaryActions: React.FC<PrimaryActionsProps> = ({ flowName, setFlowName }) => {
  const { saved, setSaved } = useSavedFlows(true);
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiForm, setAiForm] = useState({ duration: '', intensity: '1', focus: '', mood: '', injuries: '' });

  const isValidFlow = (f: SavedFlow) => f.name && Array.isArray(f.flow) && typeof f.overrides === 'object';

  const handleSave = () => {
    if (!flowName.trim()) return;
    const flow: SavedFlow = {
      id: new Date().toISOString(),
      name: flowName.trim(),
      flow: [],
      overrides: {},
    };
    if (!isValidFlow(flow)) return;
    setSaved([...saved, flow]);
    const slug = slugify(flow.name);
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
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

  const handleCreateWithAI = async () => {
    setGenerating(true);
    track('flow_autogen_requested', { ...aiForm, name: flowName });
    const flow = await autogenFlow({
      name: flowName || 'AI Flow',
      duration: Number(aiForm.duration),
      intensity: Number(aiForm.intensity),
      focus: aiForm.focus,
      mood: aiForm.mood,
      injuries: aiForm.injuries,
    });
    setGenerating(false);
    setOpen(false);
    if (isValidFlow(flow)) {
      setSaved([...saved, flow]);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Input
        placeholder="Flow name"
        aria-label="Flow name"
        value={flowName}
        onChange={(e) => setFlowName(e.target.value)}
        className="sm:flex-1"
      />
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto" disabled={generating}>
            {generating ? 'Creating...' : 'Create with AI'}
          </Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create with AI</ModalTitle>
          </ModalHeader>
          <div className="grid gap-2 py-4">
            <Input
              placeholder="Duration (min)"
              aria-label="Duration"
              value={aiForm.duration}
              onChange={(e) => setAiForm({ ...aiForm, duration: e.target.value })}
            />
            <Select value={aiForm.intensity} onValueChange={(v) => setAiForm({ ...aiForm, intensity: v })}>
              <SelectTrigger aria-label="Intensity">
                <SelectValue placeholder="Intensity" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Focus"
              aria-label="Focus"
              value={aiForm.focus}
              onChange={(e) => setAiForm({ ...aiForm, focus: e.target.value })}
            />
            <Input
              placeholder="Mood"
              aria-label="Mood"
              value={aiForm.mood}
              onChange={(e) => setAiForm({ ...aiForm, mood: e.target.value })}
            />
            <Textarea
              placeholder="Injuries (optional)"
              aria-label="Injuries"
              value={aiForm.injuries}
              onChange={(e) => setAiForm({ ...aiForm, injuries: e.target.value })}
            />
          </div>
          <ModalFooter>
            <Button onClick={handleCreateWithAI} disabled={generating}>
              {generating ? 'Generating...' : 'Generate'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button className="w-full sm:w-auto" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

