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
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              placeholder="Duration (min)"
              aria-label="Duration"
              type="number"
              min="5"
              max="90"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
            <Select value={form.focus} onValueChange={(v) => setForm({ ...form, focus: v })}>
              <SelectTrigger aria-label="Focus Area">
                <SelectValue placeholder="Focus Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="core">Core Strength</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="balance">Balance</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="mobility">Mobility</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Select value={form.intensity} onValueChange={(v) => setForm({ ...form, intensity: v })}>
              <SelectTrigger aria-label="Intensity">
                <SelectValue placeholder="Intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Very Gentle</SelectItem>
                <SelectItem value="2">2 - Gentle</SelectItem>
                <SelectItem value="3">3 - Moderate</SelectItem>
                <SelectItem value="4">4 - Challenging</SelectItem>
                <SelectItem value="5">5 - Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={form.mood} onValueChange={(v) => setForm({ ...form, mood: v })}>
              <SelectTrigger aria-label="Current Mood">
                <SelectValue placeholder="Current Mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="energetic">Energetic</SelectItem>
                <SelectItem value="stressed">Stressed</SelectItem>
                <SelectItem value="tired">Tired</SelectItem>
                <SelectItem value="anxious">Anxious</SelectItem>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="focused">Focused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Any injuries or limitations? (optional)"
            aria-label="Injuries"
            value={form.injuries}
            onChange={(e) => setForm({ ...form, injuries: e.target.value })}
          />
          <Button 
            onClick={handleGenerate} 
            className="w-full"
            disabled={!form.duration || !form.focus}
          >
            Get AI Recommendations
          </Button>
        </div>
        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Personalized Recommendations</h4>
            <div className="grid gap-3">
              {results.map((rec, idx) => (
                <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{rec.name}</div>
                      <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                      {rec.poses.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {rec.poses.slice(0, 3).map((pose, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {pose}
                            </span>
                          ))}
                          {rec.poses.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{rec.poses.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        applyToFlow({
                          id: Date.now().toString(),
                          name: rec.name,
                          flow: rec.poses,
                          overrides: {},
                        });
                        track('recommendation_applied', { name: rec.name, poses_count: rec.poses.length });
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setResults([])}
              className="w-full"
            >
              Clear Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
