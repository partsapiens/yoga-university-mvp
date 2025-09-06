'use client'

import { useState } from 'react'
import type { Pose } from '@/types'

interface PoseCardProps {
  pose: Pose;
  onAddToFlow?: (poseId: string) => void;
}

export default function PoseCard({ pose, onAddToFlow }: PoseCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-6xl">{pose.icon}</div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{pose.name}</h3>
        <p className="text-sm text-gray-500 italic mb-3">{pose.sanskrit}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pose.level)}`}>
            {pose.level}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {pose.category}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Targets: {pose.muscles.slice(0, 2).join(', ')}
          {pose.muscles.length > 2 && ` +${pose.muscles.length - 2} more`}
        </p>

        <div className="flex gap-2">
          {onAddToFlow && (
            <button
              onClick={() => onAddToFlow(pose.id)}
              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Add to Flow
            </button>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
          >
            Details
          </button>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                <p className="text-sm text-gray-600">{pose.description}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Key Cues</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {pose.cues.slice(0, 3).map((cue, index) => (
                    <li key={index}>{cue}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Benefits</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {pose.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
