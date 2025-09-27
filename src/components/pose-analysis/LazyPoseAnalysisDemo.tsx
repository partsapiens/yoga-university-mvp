"use client";

import React, { Suspense, lazy } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

// Lazy load the PoseAnalysisDemo component to reduce initial bundle size
const PoseAnalysisDemo = lazy(() => import('./PoseAnalysisDemo').then(module => ({ default: module.PoseAnalysisDemo })));

interface LazyPoseAnalysisDemoProps {
  onBack?: () => void;
}

export function LazyPoseAnalysisDemo({ onBack }: LazyPoseAnalysisDemoProps) {
  return (
    <div className="min-h-screen">
      <Suspense 
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Loading AI Pose Analysis...
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                We're preparing the AI-powered pose analysis tools. This includes loading TensorFlow.js 
                and computer vision models for real-time pose detection.
              </p>
              {onBack && (
                <Button variant="outline" onClick={onBack} className="mt-4">
                  Go Back
                </Button>
              )}
            </div>
          </div>
        }
      >
        <PoseAnalysisDemo />
      </Suspense>
    </div>
  );
}