"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';
import { fetchRecommendations } from '@/lib/api/ai';
import type { Recommendation } from '@/types/ai';
import { useApplyToFlow } from '@/hooks/useApplyToFlow';
import { track } from '@/lib/telemetry';

export const AIRecommendation = () => {
  const [form, setForm] = useState({ duration: '', intensity: '1', focus: '', mood: '', injuries: '' });
  const [results, setResults] = useState<Recommendation[]>([]);
  const { applyToFlow } = useApplyToFlow();

  const handleGenerate = async () => {
    const recs = await fetchRecommendations({
      focus: form.focus,
      duration: Number(form.duration),
      intensity: Number(form.intensity),
      mood: form.mood,
      injuries: form.injuries,
    });
    setResults(recs);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>AI Recommendation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            placeholder="Duration (min)"
            aria-label="Duration"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <Input
            placeholder="Focus"
            aria-label="Focus"
            value={form.focus}
            onChange={(e) => setForm({ ...form, focus: e.target.value })}
          />
          <Select value={form.intensity} onValueChange={(v) => setForm({ ...form, intensity: v })}>
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
            placeholder="Mood"
            aria-label="Mood"
            value={form.mood}
            onChange={(e) => setForm({ ...form, mood: e.target.value })}
          />
          <Input
            placeholder="Injuries (optional)"
            aria-label="Injuries"
            value={form.injuries}
            onChange={(e) => setForm({ ...form, injuries: e.target.value })}
          />
          <Button onClick={handleGenerate}>Go</Button>
        </div>
        <div className="grid gap-2">
          {results.map((rec, idx) => (
            <Card key={idx} className="p-4">
              <div className="font-medium">{rec.name}</div>
              <p className="text-sm text-muted-foreground">{rec.reason}</p>
              <Button
                size="sm"
                className="mt-2"
                onClick={() => {
                  applyToFlow({
                    id: Date.now().toString(),
                    name: rec.name,
                    flow: rec.poses,
                    overrides: {},
                  });
                  track('recommendation_clicked', { name: rec.name });
                }}
              >
                {rec.actionUrl ? 'Open' : 'Apply to Flow'}
              </Button>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
