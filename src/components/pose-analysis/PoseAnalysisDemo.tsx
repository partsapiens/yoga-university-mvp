"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ProgressTracking, PoseAnalysisSettings } from '@/components/pose-analysis';
import { PoseId } from '@/types/yoga';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Camera, BarChart3, Settings, Play, Info } from 'lucide-react';

const PoseAnalysis = dynamic(() => import('./PoseAnalysis').then(mod => mod.PoseAnalysis), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading Analysis Engine...</div>
});

export function PoseAnalysisDemo() {
  const [activeDemo, setActiveDemo] = useState<'downdog' | 'warrior' | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleStartDemo = (pose: 'downdog' | 'warrior') => {
    setActiveDemo(pose);
    setShowAnalysis(true);
  };

  const handleStopDemo = () => {
    setActiveDemo(null);
    setShowAnalysis(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          AI-Powered Pose Analysis
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Experience real-time computer vision pose analysis with privacy-first local processing. 
          Get instant feedback on your yoga poses and track your improvement over time.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-blue-600" />
            <h3 className="text-xl font-semibold">Real-Time Analysis</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Live pose detection using TensorFlow.js MoveNet model with instant feedback 
            on your form and alignment.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <h3 className="text-xl font-semibold">Progress Tracking</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Track your improvement over time with detailed analytics and 
            personalized insights stored locally on your device.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-purple-600" />
            <h3 className="text-xl font-semibold">Privacy-First</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            All processing happens locally on your device. No video data 
            or pose information is ever sent to external servers.
          </p>
        </Card>
      </div>

      {/* Demo Section */}
      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-6">
          {!showAnalysis ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Try Pose Analysis</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Select a pose to analyze with your webcam. Make sure you have good lighting 
                  and your full body is visible.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🐕</div>
                    <h3 className="text-xl font-semibold">Downward Dog</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Analyze your Downward Dog pose with detailed feedback on 
                      spine alignment, arm positioning, and leg placement.
                    </p>
                    <Button 
                      onClick={() => handleStartDemo('downdog')}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Analyze Downward Dog
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🏹</div>
                    <h3 className="text-xl font-semibold">Warrior I</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Get feedback on your Warrior I pose including knee alignment, 
                      thigh position, and torso uprightness.
                    </p>
                    <Button 
                      onClick={() => handleStartDemo('warrior')}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Analyze Warrior I
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Analyzing: {activeDemo === 'downdog' ? 'Downward Dog' : 'Warrior I'}
                </h2>
                <Button variant="outline" onClick={handleStopDemo}>
                  Stop Analysis
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Tips for best results:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure good lighting conditions</li>
                      <li>Keep your full body visible in the camera frame</li>
                      <li>Wear contrasting colors against your background</li>
                      <li>Hold the pose steady for accurate analysis</li>
                    </ul>
                  </div>
                </div>
              </div>

              <PoseAnalysis
                currentPoseId={activeDemo === 'downdog' ? PoseId.DownDog : PoseId.Warrior1Right}
                poseName={activeDemo === 'downdog' ? 'Downward Dog' : 'Warrior I'}
                isActive={showAnalysis}
                className="max-w-2xl mx-auto"
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Progress</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Track your improvement over time with detailed analytics and insights.
            </p>
            <ProgressTracking />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Pose Analysis Settings</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Customize how pose analysis works to match your preferences and device capabilities.
            </p>
            <PoseAnalysisSettings />
          </div>
        </TabsContent>
      </Tabs>

      {/* Technical Info */}
      <Card className="p-6 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-xl font-semibold mb-4">Technical Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Technology Stack</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>• TensorFlow.js for machine learning</li>
              <li>• MoveNet model for pose detection</li>
              <li>• WebGL for GPU acceleration</li>
              <li>• Canvas API for visualization</li>
              <li>• MediaDevices API for webcam access</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Privacy & Security</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>• 100% local processing</li>
              <li>• No data transmission to servers</li>
              <li>• Browser-based storage only</li>
              <li>• GDPR compliant</li>
              <li>• User-controlled data deletion</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}