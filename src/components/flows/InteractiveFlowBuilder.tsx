"use client";

import React, { useState, useEffect } from 'react';
import { Pose } from '@/types';
import { getStartingPoseSuggestions, getNextPoseSuggestions } from '@/lib/flow-suggester';
import { PoseCard } from './PoseCard';
import { Button } from '@/components/ui/Button';

export const InteractiveFlowBuilder = () => {
  const [currentFlow, setCurrentFlow] = useState<Pose[]>([]);
  const [suggestions, setSuggestions] = useState<Pose[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  useEffect(() => {
    const fetchInitialSuggestions = async () => {
      setIsLoadingSuggestions(true);
      const initialSuggestions = await getStartingPoseSuggestions();
      setSuggestions(initialSuggestions);
      setIsLoadingSuggestions(false);
    };
    fetchInitialSuggestions();
  }, []);

  const handleSelectSuggestion = async (pose: Pose) => {
    setIsLoadingSuggestions(true);
    const newFlow = [...currentFlow, pose];
    setCurrentFlow(newFlow);

    const nextSuggestions = await getNextPoseSuggestions(newFlow);
    setSuggestions(nextSuggestions);
    setIsLoadingSuggestions(false);
  };

  const handleRemovePose = async (index: number) => {
    setIsLoadingSuggestions(true);
    const newFlow = currentFlow.filter((_, i) => i !== index);
    setCurrentFlow(newFlow);

    const nextSuggestions = await getNextPoseSuggestions(newFlow);
    setSuggestions(nextSuggestions);
    setIsLoadingSuggestions(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Flow</h2>
        <div className="bg-gray-100 p-4 rounded-lg min-h-[200px] flex items-center shadow-inner">
          {currentFlow.length === 0 ? (
            <p className="text-gray-500 w-full text-center">Your flow is empty. Add a pose from the suggestions below.</p>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {currentFlow.map((pose, index) => (
                <div key={`${pose.id}-${index}`} className="relative flex-shrink-0">
                    <PoseCard pose={pose} />
                    <button
                        onClick={() => handleRemovePose(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition-colors"
                        aria-label={`Remove ${pose.name}`}
                    >
                        X
                    </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">AI Suggestions</h2>
        <div className="bg-gray-100 p-4 rounded-lg min-h-[200px] flex items-center justify-center shadow-inner">
          {isLoadingSuggestions ? (
            <p>Loading suggestions...</p>
          ) : (
            <div className="flex items-center space-x-4">
                <div className="flex space-x-4">
                    {suggestions.map((pose, index) => (
                        <PoseCard
                        key={`${pose.id}-${index}`}
                        pose={pose}
                        onClick={() => handleSelectSuggestion(pose)}
                        />
                    ))}
                </div>
                <div className="flex flex-col space-y-2 pl-4 border-l">
                    <Button variant="outline">Search</Button>
                    <Button variant="outline">Library</Button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
