import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, Zap, RefreshCw } from 'lucide-react';
import { PoseId } from '@/types/yoga';
import { POSES } from '@/lib/yoga-data';

interface FlowValidationProps {
  flow: PoseId[];
  totalSeconds: number;
  className?: string;
  onSaferAlternative?: (flow: PoseId[]) => void;
}

interface ValidationMessage {
  type: 'warning' | 'info' | 'success' | 'ai-warning';
  message: string;
  suggestion?: string;
}

interface TransitionRisk {
  fromPose: string;
  toPose: string;
  riskLevel: 'low' | 'medium' | 'high';
  reason: string;
  suggestion: string;
}

interface AIValidationResult {
  overallSafety: 'safe' | 'caution' | 'unsafe';
  transitionRisks: TransitionRisk[];
  suggestions: string[];
  saferAlternatives?: PoseId[];
}

export function FlowValidation({ flow, totalSeconds, className = '', onSaferAlternative }: FlowValidationProps) {
  const [aiValidation, setAIValidation] = useState<AIValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Trigger AI validation when flow changes
  useEffect(() => {
    if (flow.length > 1) {
      validateSequence();
    } else {
      setAIValidation(null);
    }
  }, [flow]);
  
  const validateSequence = async () => {
    setIsValidating(true);
    setValidationError(null);
    
    try {
      const response = await fetch('/api/ai/validateSequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flow, totalSeconds })
      });
      
      if (response.ok) {
        const result: AIValidationResult = await response.json();
        setAIValidation(result);
      } else {
        setValidationError('🤖 validation temporarily unavailable');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationError('AI validation temporarily unavailable');
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleAcceptSaferAlternative = () => {
    if (aiValidation?.saferAlternatives && onSaferAlternative) {
      onSaferAlternative(aiValidation.saferAlternatives);
    }
  };

  const messages: ValidationMessage[] = [];

  // Add AI validation messages
  if (aiValidation) {
    // Add transition risk warnings
    aiValidation.transitionRisks.forEach(risk => {
      messages.push({
        type: risk.riskLevel === 'high' ? 'ai-warning' : 'warning',
        message: `${risk.fromPose} → ${risk.toPose}: ${risk.reason}`,
        suggestion: risk.suggestion
      });
    });
    
    // Add AI suggestions
    aiValidation.suggestions.forEach(suggestion => {
      messages.push({
        type: 'info',
        message: suggestion
      });
    });
    
    // Overall safety assessment
    if (aiValidation.overallSafety === 'unsafe') {
      messages.unshift({
        type: 'ai-warning',
        message: 'This sequence has safety concerns that should be addressed',
        suggestion: aiValidation.saferAlternatives ? 'Click below to see a safer alternative' : undefined
      });
    } else if (aiValidation.overallSafety === 'caution') {
      messages.unshift({
        type: 'warning',
        message: 'This sequence could be improved for safety',
        suggestion: 'Review the suggestions below to enhance your practice'
      });
    }
  }
  
  // Add validation loading/error states
  if (isValidating && flow.length > 1) {
    messages.unshift({
      type: 'info',
      message: 'AI is analyzing your sequence for safety...'
    });
  }
  
  if (validationError) {
    messages.unshift({
      type: 'info',
      message: validationError,
      suggestion: 'Basic validation is still available below'
    });
  }

  // Check flow length
  if (flow.length === 0) {
    messages.push({
      type: 'info',
      message: 'Start building your flow by adding poses',
      suggestion: 'Try the 🤖 generator or browse the pose library below'
    });
    return (
      <div className={className}>
        {renderMessages(messages)}
      </div>
    );
  }

  // Check if flow is too short
  if (totalSeconds < 300) { // Less than 5 minutes
    messages.push({
      type: 'warning',
      message: 'Your flow is quite short',
      suggestion: 'Consider adding more poses or increasing durations for a more complete practice'
    });
  }

  // Check if flow is too long
  if (totalSeconds > 5400) { // More than 90 minutes
    messages.push({
      type: 'warning',
      message: 'Your flow is very long',
      suggestion: 'Consider breaking it into shorter sessions or removing some poses'
    });
  }

  // Check for warm-up poses
  const warmupPoses = [PoseId.Child, PoseId.DownDog, PoseId.ForwardFold];
  const hasWarmup = flow.slice(0, 2).some(pose => warmupPoses.includes(pose));
  if (!hasWarmup && flow.length > 3) {
    messages.push({
      type: 'info',
      message: 'Consider starting with a warm-up pose',
      suggestion: 'Child\'s Pose, Downward Dog, or Forward Fold are great warm-up options'
    });
  }

  // Check for rest/cool-down poses
  const restPoses = [PoseId.Child, PoseId.Butterfly];
  const hasRest = flow.slice(-2).some(pose => restPoses.includes(pose));
  if (!hasRest && flow.length > 3) {
    messages.push({
      type: 'info',
      message: 'Consider ending with a rest pose',
      suggestion: 'Child\'s Pose or Butterfly are excellent for cool-down'
    });
  }

  // Check for balance in pose types
  const poseDetails = flow.map(id => POSES.find(p => p.id === id)).filter(Boolean);
  const families = poseDetails.map(p => p!.family);
  const standingCount = families.filter(f => f === 'Standing').length;
  const seatedCount = families.filter(f => f === 'Seated').length;
  
  if (standingCount > 0 && seatedCount === 0 && flow.length > 4) {
    messages.push({
      type: 'info',
      message: 'Your flow is mostly standing poses',
      suggestion: 'Consider adding some seated or floor poses for variety'
    });
  }

  // Check for flow intensity progression
  const intensities = poseDetails.map(p => p!.intensity);
  const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;
  if (avgIntensity > 4 && flow.length > 2) {
    messages.push({
      type: 'warning',
      message: 'This is a high-intensity flow',
      suggestion: 'Make sure to include adequate rest periods and proper warm-up'
    });
  }

  // Success message for well-balanced flows
  if (messages.length === 0 && flow.length >= 3) {
    if (aiValidation?.overallSafety === 'safe') {
      messages.push({
        type: 'success',
        message: 'AI analysis confirms this is a well-balanced, safe sequence!',
        suggestion: 'Ready to practice or save your sequence'
      });
    } else {
      messages.push({
        type: 'success',
        message: 'Your flow looks well-balanced!',
        suggestion: 'Ready to practice or save your sequence'
      });
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {renderMessages(messages)}
      
      {/* AI Safer Alternative Button */}
      {aiValidation?.saferAlternatives && aiValidation.overallSafety !== 'safe' && (
        <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                ✨-Optimized Safer Alternative Available
              </span>
            </div>
            <button
              onClick={handleAcceptSaferAlternative}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
            >
              Use Safer Flow
            </button>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Our 🤖 has created a modified version that addresses the safety concerns above.
          </p>
        </div>
      )}
      
      {/* Manual AI Validation Trigger */}
      {!isValidating && flow.length > 1 && !aiValidation && (
        <div className="mt-3">
          <button
            onClick={validateSequence}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 transition-colors"
          >
            <RefreshCw size={14} />
            Get 🤖 Safety Analysis
          </button>
        </div>
      )}
    </div>
  );
}

function renderMessages(messages: ValidationMessage[]) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-2">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${
            msg.type === 'ai-warning' 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              : msg.type === 'warning' 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
              : msg.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          }`}
        >
          {msg.type === 'ai-warning' && <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />}
          {msg.type === 'warning' && <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />}
          {msg.type === 'success' && <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />}
          {msg.type === 'info' && <Info size={16} className="flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <div className="font-medium">{msg.message}</div>
            {msg.suggestion && (
              <div className="text-xs mt-1 opacity-80">{msg.suggestion}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}