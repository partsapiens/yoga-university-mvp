"use client";

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui';
import { fetchRecommendations } from '@/lib/api/ai';
import type { Recommendation } from '@/types/ai';
import { useApplyToFlow } from '@/hooks/useApplyToFlow';
import { track } from '@/lib/telemetry';

export const AIRecommendation = () => {
  const [form, setForm] = useState({
    duration: '',
    intensity: '1',
    mood: '',
    focuses: [] as string[],
  });
  const [results, setResults] = useState<Recommendation[]>([]);
  const { applyToFlow } = useApplyToFlow();

  const focusOptions = ['hips', 'hamstrings', 'core', 'back', 'shoulders', 'balance'];

  const toggleFocus = (tag: string) => {
    setForm((prev) => {
      const focuses = prev.focuses.includes(tag)
        ? prev.focuses.filter((t) => t !== tag)
        : [...prev.focuses, tag];
      return { ...prev, focuses };
    });
  };

  const handleGenerate = async () => {
    const recs = await fetchRecommendations({
      duration: Number(form.duration),
      intensity: Number(form.intensity),
      mood: form.mood,
      focuses: form.focuses,
    });
    setResults(recs);
    track('generate_recommendations', {
      duration: form.duration,
      intensity: form.intensity,
      mood: form.mood,
      focuses: form.focuses,
    });
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
          <Select value={form.mood} onValueChange={(v) => setForm({ ...form, mood: v })}>
            <SelectTrigger aria-label="Mood">
              <SelectValue placeholder="Mood" />
            </SelectTrigger>
            <SelectContent>
              {['calm', 'energized', 'neutral'].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="sm:col-span-2 flex flex-wrap gap-2" role="group" aria-label="Focus">
            {focusOptions.map((f) => {
              const selected = form.focuses.includes(f);
              return (
                <Button
                  key={f}
                  type="button"
                  variant={selected ? 'default' : 'outline'}
                  onClick={() => toggleFocus(f)}
                  aria-pressed={selected}
                >
                  {f}
                </Button>
              );
            })}
          </div>
          <Button className="sm:col-span-2" onClick={handleGenerate}>
            Go
          </Button>
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
