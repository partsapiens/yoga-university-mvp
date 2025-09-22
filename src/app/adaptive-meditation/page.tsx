"use client";

import React, { useState } from 'react';
import { MoodInput } from '@/components/meditation/MoodInput';
import { MoodAnalyticsComponent } from '@/components/mood/MoodAnalytics';
import { BiometricIntegration } from '@/components/mood/BiometricIntegration';
import { PrivacyControls } from '@/components/mood/PrivacyControls';
import { MeditationInput } from '@/types/ai';

export default function AdaptiveMeditationPage() {
  const [selectedTab, setSelectedTab] = useState<'meditation' | 'analytics' | 'biometric' | 'privacy'>('meditation');
  const [generatedMeditation, setGeneratedMeditation] = useState<MeditationInput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMeditation = async (input: MeditationInput) => {
    setIsGenerating(true);
    try {
      // Simulate meditation generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedMeditation(input);
      
      // In a real implementation, this would call the meditation generation API
      console.log('Generated meditation for:', input);
    } catch (error) {
      console.error('Failed to generate meditation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧘‍♀️ Adaptive Meditation Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience personalized meditation powered by mood detection, sentiment analysis, and adaptive ✨ recommendations.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setSelectedTab('meditation')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedTab === 'meditation'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🎯 Smart Meditation
            </button>
            <button
              onClick={() => setSelectedTab('analytics')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedTab === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📊 Mood Analytics
            </button>
            <button
              onClick={() => setSelectedTab('biometric')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedTab === 'biometric'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              💓 Biometric
            </button>
            <button
              onClick={() => setSelectedTab('privacy')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedTab === 'privacy'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🔒 Privacy
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {selectedTab === 'meditation' && (
            <div className="space-y-8">
              {/* Enhanced Mood Input */}
              <MoodInput 
                onGenerate={handleGenerateMeditation}
                isGenerating={isGenerating}
              />

              {/* Generated Meditation Display */}
              {generatedMeditation && (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    🎉 Your Personalized Meditation
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Meditation Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mood:</span>
                          <span className="font-medium capitalize">{generatedMeditation.mood}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Style:</span>
                          <span className="font-medium capitalize">{generatedMeditation.style}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{generatedMeditation.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time of Day:</span>
                          <span className="font-medium capitalize">{generatedMeditation.timeOfDay}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Your Goal</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {generatedMeditation.goal}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                      🎧 Start Meditation
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                      💾 Save for Later
                    </button>
                  </div>
                </div>
              )}

              {/* Feature Highlights */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">✨ Powered Features</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🧠</div>
                    <h4 className="font-medium text-gray-700 mb-1">Sentiment Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Advanced ✨ analyzes your text input to understand your emotional state
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-2xl mb-2">📈</div>
                    <h4 className="font-medium text-gray-700 mb-1">Mood Tracking</h4>
                    <p className="text-sm text-gray-600">
                      Track patterns over time to get smarter recommendations
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-medium text-gray-700 mb-1">Adaptive Learning</h4>
                    <p className="text-sm text-gray-600">
                      The system learns from your feedback to improve over time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'analytics' && (
            <MoodAnalyticsComponent />
          )}

          {selectedTab === 'biometric' && (
            <BiometricIntegration 
              onBiometricData={(data) => console.log('Biometric data:', data)}
            />
          )}

          {selectedTab === 'privacy' && (
            <PrivacyControls />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white/60 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Privacy-First Design</h3>
            <p className="text-sm text-gray-600 mb-4">
              All your mood data is stored locally on your device. We use sentiment analysis to provide 
              better recommendations while keeping your personal information completely private.
            </p>
            <div className="flex justify-center space-x-6 text-xs text-gray-500">
              <span>🔒 Local Storage</span>
              <span>🚫 No Data Collection</span>
              <span>✅ GDPR Compliant</span>
              <span>🎯 Smart Recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}