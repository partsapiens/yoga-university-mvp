"use client";

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
} from '@/components/ui';
import { PoseId } from '@/types/yoga';
import { checkForm } from '@/lib/api/ai';
import type { FormFeedback } from '@/types/ai';
import { track } from '@/lib/telemetry';
import { toast } from 'react-hot-toast';

export const AIFormChecker = () => {
  const [pose, setPose] = useState<PoseId | undefined>();
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<FormFeedback[]>([]);

  const handleCheck = async () => {
    if (!pose) return;
    const res = await checkForm({ pose, notes });
    setFeedback(res);
    track('ai_form_check_run', { pose });
  };

  const handleCopy = () => {
    const text = feedback.map((f) => f.message).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Feedback copied');
    track('copy_form_feedback');
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>AI Form Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={pose} onValueChange={(v) => setPose(v as PoseId)}>
          <SelectTrigger aria-label="Pose">
            <SelectValue placeholder="Select pose" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PoseId).map((id) => (
              <SelectItem key={id} value={id}>
                {id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Notes"
          aria-label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button onClick={handleCheck}>Check</Button>
        {feedback.length > 0 && (
          <div>
            <ul className="mb-2 list-disc pl-4">
              {feedback.map((f, idx) => (
                <li key={idx}>{f.message}</li>
              ))}
            </ul>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              Copy feedback
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
