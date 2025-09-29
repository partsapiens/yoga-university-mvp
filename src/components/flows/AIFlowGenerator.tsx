"use client";

import React, { useState } from 'react';
import { AIGenerationParams, Difficulty, PracticeStyle, FocusArea } from '@/types/ai';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { useToast } from '@/components/ui/use-toast';

// Define the props for the component, which will include the function to handle the generated flow
interface AIFlowGeneratorProps {
  onFlowGenerated: (flow: any) => void;
}

export const AIFlowGenerator = ({ onFlowGenerated }: AIFlowGeneratorProps) => {
  const { toast } = useToast();
  const [params, setParams] = useState<AIGenerationParams>({
    duration: 30,
    difficulty: 'intermediate',
    practiceStyle: 'vinyasa',
    focusArea: 'flexibility',
    includeWarmup: true,
    includeCooldown: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleParamChange = (key: keyof AIGenerationParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generateFlow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate flow.');
      }

      const generatedFlow = await response.json();
      onFlowGenerated(generatedFlow);
      toast({
        title: "Flow Generated!",
        description: "Your personalized yoga flow is ready.",
      });

    } catch (error) {
      console.error("Error generating flow:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
      // Pass an empty/error state flow up to the parent
      onFlowGenerated({ name: "Error", poses: [] });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🤖 AI Flow Generator</CardTitle>
        <CardDescription>Customize your practice and let our AI create the perfect flow for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Focus Area */}
          <div className="space-y-2">
            <Label htmlFor="focusArea">Focus Area</Label>
            <Select
              value={params.focusArea}
              onValueChange={(value: FocusArea) => handleParamChange('focusArea', value)}
            >
              <SelectTrigger id="focusArea">
                <SelectValue placeholder="Select a focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="balance">Balance</SelectItem>
                <SelectItem value="mindfulness">Mindfulness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={params.difficulty}
              onValueChange={(value: Difficulty) => handleParamChange('difficulty', value)}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select a difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Practice Style */}
          <div className="space-y-2">
            <Label htmlFor="practiceStyle">Practice Style</Label>
             <Select
              value={params.practiceStyle}
              onValueChange={(value: PracticeStyle) => handleParamChange('practiceStyle', value)}
            >
              <SelectTrigger id="practiceStyle">
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vinyasa">Vinyasa</SelectItem>
                <SelectItem value="hatha">Hatha</SelectItem>
                <SelectItem value="restorative">Restorative</SelectItem>
                <SelectItem value="power">Power</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration: {params.duration} minutes</Label>
            <Slider
              id="duration"
              min={10}
              max={90}
              step={5}
              value={[params.duration]}
              onValueChange={(value) => handleParamChange('duration', value[0])}
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between col-span-2">
            <div className="flex items-center space-x-2">
                <Switch
                    id="includeWarmup"
                    checked={params.includeWarmup}
                    onCheckedChange={(checked) => handleParamChange('includeWarmup', checked)}
                />
                <Label htmlFor="includeWarmup">Include Warm-up</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    id="includeCooldown"
                    checked={params.includeCooldown}
                    onCheckedChange={(checked) => handleParamChange('includeCooldown', checked)}
                />
                <Label htmlFor="includeCooldown">Include Cool-down</Label>
            </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          className="w-full"
          disabled={isGenerating}
          size="lg"
        >
          {isGenerating ? 'Generating Your Flow...' : '✨ Generate Flow'}
        </Button>
      </CardContent>
    </Card>
  );
};