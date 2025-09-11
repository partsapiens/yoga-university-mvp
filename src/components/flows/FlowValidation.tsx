import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { PoseId } from '@/types/yoga';
import { POSES } from '@/lib/yoga-data';

interface FlowValidationProps {
  flow: PoseId[];
  totalSeconds: number;
  className?: string;
}

interface ValidationMessage {
  type: 'warning' | 'info' | 'success';
  message: string;
  suggestion?: string;
}

export function FlowValidation({ flow, totalSeconds, className = '' }: FlowValidationProps) {
  const messages: ValidationMessage[] = [];

  // Check flow length
  if (flow.length === 0) {
    messages.push({
      type: 'info',
      message: 'Start building your flow by adding poses',
      suggestion: 'Try the AI generator or browse the pose library below'
    });
    return renderMessages(messages, className);
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
    messages.push({
      type: 'success',
      message: 'Your flow looks well-balanced!',
      suggestion: 'Ready to practice or save your sequence'
    });
  }

  return renderMessages(messages, className);
}

function renderMessages(messages: ValidationMessage[], className: string) {
  if (messages.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${
            msg.type === 'warning' 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
              : msg.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          }`}
        >
          {msg.type === 'warning' && <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />}
          {msg.type === 'success' && <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />}
          {msg.type === 'info' && <Info size={16} className="flex-shrink-0 mt-0.5" />}
          <div>
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