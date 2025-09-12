import React, { useState } from 'react';
import { adaptFlow } from '@/lib/api/ai';
import { PoseId } from '@/types/yoga';

interface AdaptiveFlowProps {
  currentFlow: {
    poses: PoseId[];
    durations: number[];
    totalDuration: number;
  };
  userProfile: {
    experience: 'beginner' | 'intermediate' | 'advanced';
    physicalLimitations?: string[];
    preferences?: string[];
    pastPerformance?: any;
  };
  onFlowAdapted?: (adaptedFlow: any, insights: any) => void;
  className?: string;
}

export function AdaptiveFlow({
  currentFlow,
  userProfile,
  onFlowAdapted,
  className = ''
}: AdaptiveFlowProps) {
  const [loading, setLoading] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState({
    difficulty: '',
    energy: '',
    timeConstraint: 0,
    specificRequest: ''
  });
  const [adaptationResult, setAdaptationResult] = useState<any>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const handleAdaptFlow = async (adaptationType: string) => {
    setLoading(true);
    try {
      const result = await adaptFlow({
        currentFlow,
        userProfile,
        sessionFeedback: adaptationType === 'real-time' ? sessionFeedback : undefined,
        adaptationType
      });
      
      setAdaptationResult(result);
      onFlowAdapted?.(result.adaptedFlow, result.personalizationInsights);
    } catch (error) {
      console.error('Failed to adapt flow:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdapt = (feedbackType: string) => {
    const quickFeedback = {
      'easier': { difficulty: 'too-hard', energy: 'low' },
      'harder': { difficulty: 'too-easy', energy: 'high' },
      'shorter': { timeConstraint: Math.floor(currentFlow.totalDuration / 60 / 2) },
      'longer': { timeConstraint: Math.floor(currentFlow.totalDuration / 60 * 1.5) }
    };

    setSessionFeedback({ ...sessionFeedback, ...quickFeedback[feedbackType as keyof typeof quickFeedback] });
    handleAdaptFlow('real-time');
  };

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          🎯 Adaptive Flow Modifications
        </h3>
        <button
          onClick={() => setShowFeedbackForm(!showFeedbackForm)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showFeedbackForm ? 'Hide Feedback' : 'Give Feedback'}
        </button>
      </div>

      {/* Quick Adaptation Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => handleQuickAdapt('easier')}
          disabled={loading}
          className="p-3 text-sm bg-green-50 hover:bg-green-100 text-green-800 rounded-lg border border-green-200 transition-colors disabled:opacity-50"
        >
          Make Easier
        </button>
        <button
          onClick={() => handleQuickAdapt('harder')}
          disabled={loading}
          className="p-3 text-sm bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-lg border border-orange-200 transition-colors disabled:opacity-50"
        >
          Make Harder
        </button>
        <button
          onClick={() => handleQuickAdapt('shorter')}
          disabled={loading}
          className="p-3 text-sm bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg border border-blue-200 transition-colors disabled:opacity-50"
        >
          Shorten Flow
        </button>
        <button
          onClick={() => handleQuickAdapt('longer')}
          disabled={loading}
          className="p-3 text-sm bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg border border-purple-200 transition-colors disabled:opacity-50"
        >
          Extend Flow
        </button>
      </div>

      {/* Detailed Feedback Form */}
      {showFeedbackForm && (
        <div className="border-t pt-4 mb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How does this flow feel?
            </label>
            <select
              value={sessionFeedback.difficulty}
              onChange={(e) => setSessionFeedback({...sessionFeedback, difficulty: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select difficulty...</option>
              <option value="too-easy">Too Easy</option>
              <option value="just-right">Just Right</option>
              <option value="too-hard">Too Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your energy level
            </label>
            <select
              value={sessionFeedback.energy}
              onChange={(e) => setSessionFeedback({...sessionFeedback, energy: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select energy...</option>
              <option value="low">Low Energy</option>
              <option value="medium">Medium Energy</option>
              <option value="high">High Energy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time available (minutes)
            </label>
            <input
              type="number"
              value={sessionFeedback.timeConstraint || ''}
              onChange={(e) => setSessionFeedback({...sessionFeedback, timeConstraint: parseInt(e.target.value) || 0})}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specific request (optional)
            </label>
            <textarea
              value={sessionFeedback.specificRequest}
              onChange={(e) => setSessionFeedback({...sessionFeedback, specificRequest: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              placeholder="e.g., 'Focus more on hip openers' or 'Avoid arm balances today'"
            />
          </div>

          <button
            onClick={() => handleAdaptFlow('real-time')}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Adapting Flow...' : 'Adapt Flow'}
          </button>
        </div>
      )}

      {/* Adaptation Results */}
      {adaptationResult && (
        <div className="border-t pt-4 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              ✨ Flow Adapted
            </h4>
            <p className="text-blue-800 text-sm mb-3">
              {adaptationResult.personalizationInsights.adaptationSummary}
            </p>
            <p className="text-blue-700 text-sm">
              <strong>Why this works:</strong> {adaptationResult.personalizationInsights.whyThisWorks}
            </p>
          </div>

          {adaptationResult.adaptedFlow.modifications.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">Specific Modifications:</h5>
              {adaptationResult.adaptedFlow.modifications.map((mod: any, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">
                    {mod.instruction}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {mod.reason}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Progress note:</strong> {adaptationResult.personalizationInsights.progressNotes}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        AI adapts your flow based on your experience level, preferences, and real-time feedback.
      </div>
    </div>
  );
}