'use client'

import { useState, useEffect } from 'react'
import type { Flow, FlowStep, Pose, FlowGoal, ClassType } from '@/types'

interface FlowBuilderProps {
  poses: Pose[];
  currentFlow: Flow | null;
  onUpdateFlow: (flow: Partial<Flow>) => void;
  onSaveFlow: () => void;
  onExportPDF: () => void;
  onShareFlow: () => void;
}

export default function FlowBuilder({
  poses,
  currentFlow,
  onUpdateFlow,
  onSaveFlow,
  onExportPDF,
  onShareFlow
}: FlowBuilderProps) {
  const [selectedGoal, setSelectedGoal] = useState<FlowGoal>('Hips')

  const goals: FlowGoal[] = ['Hips', 'Shoulders', 'Back', 'Balance', 'Calm', 'Energize']

  const goalIcons = {
    Hips: '🦴',
    Shoulders: '💪',
    Back: '🧘‍♀️',
    Balance: '⚖️',
    Calm: '😌',
    Energize: '⚡'
  }

  const handleGoalChange = (goal: FlowGoal) => {
    setSelectedGoal(goal)
    onUpdateFlow({ goal })
  }

  const addPoseToFlow = (poseId: string) => {
    const pose = poses.find(p => p.id === poseId)
    if (!pose || !currentFlow) return

    const newStep: FlowStep = {
      poseId,
      holdSeconds: pose.meta.typicalHoldSec,
      sides: pose.meta.sides === 'unilateral' ? 'R' : 'both',
      order: currentFlow.steps.length
    }

    onUpdateFlow({ steps: [...currentFlow.steps, newStep] })
  }

  const removeStep = (index: number) => {
    if (!currentFlow) return

    const updatedSteps = currentFlow.steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, order: i }))

    onUpdateFlow({ steps: updatedSteps })
  }

  return (
    <div className="space-y-6">
      {/* Goal Selection */}
      {(!currentFlow?.steps || currentFlow.steps.length === 0) && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Start Your Flow</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {goals.map((goal) => (
              <button
                key={goal}
                onClick={() => handleGoalChange(goal)}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedGoal === goal
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-3xl mb-2">{goalIcons[goal]}</div>
                <div className="font-medium">{goal}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Flow Timeline */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Flow Sequence</h3>
          {currentFlow?.steps && currentFlow.steps.length > 0 && (
            <div className="text-sm text-gray-500">
              {currentFlow.steps.length} poses
            </div>
          )}
        </div>

        {currentFlow?.steps && currentFlow.steps.length > 0 ? (
          <div className="space-y-3">
            {currentFlow.steps.map((step, index) => {
              const pose = poses.find(p => p.id === step.poseId)
              if (!pose) return null

              return (
                <div
                  key={`${step.poseId}-${index}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl">{pose.icon}</div>

                  <div className="flex-1">
                    <div className="font-medium">{pose.name}</div>
                    <div className="text-sm text-gray-500">
                      {step.sides === "both" ? "Both sides" : step.sides === "R" ? "Right side" : "Left side"} •
                      {step.holdSeconds}s hold
                    </div>
                  </div>

                  <button
                    onClick={() => removeStep(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🧘‍♀️</div>
            <p>Select a goal above to start building your flow</p>
          </div>
        )}

        {/* Actions */}
        {currentFlow?.steps && currentFlow.steps.length > 0 && (
          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button
              onClick={onSaveFlow}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Flow
            </button>
            <button
              onClick={onExportPDF}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Export PDF
            </button>
          </div>
        )}
      </div>

      {/* Quick Add Poses */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Quick Add</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {poses.slice(0, 8).map(pose => (
            <button
              key={pose.id}
              onClick={() => addPoseToFlow(pose.id)}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-2xl mb-1">{pose.icon}</div>
              <div className="text-sm font-medium truncate">{pose.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
