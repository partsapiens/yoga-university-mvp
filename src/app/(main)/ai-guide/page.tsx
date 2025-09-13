"use client";

import React, { useState } from 'react';
import { Camera, Video, Play, AlertCircle, Info, BookOpen } from 'lucide-react';
import { PoseAnalysisDemo } from '@/components/pose-analysis/PoseAnalysisDemo';

export default function AIGuidePage() {
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately since we just wanted to check permissions
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
    }
  };

  const handleTryDemo = () => {
    setShowDemo(true);
  };

  if (showDemo) {
    return <PoseAnalysisDemo />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Powered Yoga Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get real-time feedback on your yoga poses using advanced AI computer vision technology.
            Perfect your alignment and improve your practice with instant guidance.
          </p>
        </div>

        {/* Camera Permission Flow */}
        {cameraPermission === null && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Enable Camera for AI Guidance</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                To provide real-time pose analysis and feedback, we need access to your camera. 
                Your video is processed locally on your device and never uploaded or stored.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={requestCameraPermission}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Camera className="w-5 h-5 inline mr-2" />
                Enable Camera
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Don&apos;t want to use your camera?</p>
                <button
                  onClick={handleTryDemo}
                  className="text-blue-600 hover:text-blue-700 underline text-sm"
                >
                  Try Demo Mode Instead
                </button>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-800 dark:text-green-200 mb-1">Privacy First</p>
                  <p className="text-green-700 dark:text-green-300">
                    All pose analysis happens locally in your browser. Your video never leaves your device,
                    ensuring complete privacy and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Camera Granted */}
        {cameraPermission === 'granted' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="text-green-600 mb-4">
              <Camera className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Camera Access Granted!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Great! You&apos;re ready to start your AI-guided yoga session.
            </p>
            <button
              onClick={handleTryDemo}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Play className="w-5 h-5 inline mr-2" />
              Start Guided Session
            </button>
          </div>
        )}

        {/* Camera Denied - Fallback Options */}
        {cameraPermission === 'denied' && (
          <div className="max-w-4xl mx-auto">
            {/* Main Fallback Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
              <div className="text-center mb-6">
                <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-4">Camera Access Not Available</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  No worries! You can still benefit from our AI yoga guidance with these alternatives.
                </p>
              </div>

              {/* Fallback Options */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Demo Mode */}
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Video className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Try Demo Mode</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    Experience the AI pose analysis interface with sample poses and learn how it works.
                  </p>
                  <button
                    onClick={handleTryDemo}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Launch Demo
                  </button>
                </div>

                {/* Static Guidance */}
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <BookOpen className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Static Pose Guide</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    Browse our comprehensive pose library with detailed alignment cues and instructions.
                  </p>
                  <a
                    href="/poses"
                    className="w-full inline-block bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm text-center"
                  >
                    View Pose Library
                  </a>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Want to try camera mode later?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="font-medium text-blue-600">1.</span>
                  <p>Click the camera icon in your browser&apos;s address bar</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium text-blue-600">2.</span>
                  <p>Select &ldquo;Allow&rdquo; for camera permissions</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium text-blue-600">3.</span>
                  <p>Refresh this page and click &ldquo;Enable Camera&rdquo; again</p>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="text-blue-600 hover:text-blue-700 underline text-sm"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">AI Yoga Guide Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant feedback on your pose alignment using advanced computer vision technology.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Guidance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive specific cues for improving your posture, alignment, and breathing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy Focused</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All processing happens locally on your device. Your video never leaves your browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}