'use client'

import { useState } from 'react'
import PoseCard from './PoseCard'
import type { Pose } from '@/types'

interface PoseLibraryProps {
  poses: Pose[];
  onAddToFlow?: (poseId: string) => void;
}

export default function PoseLibrary({ poses, onAddToFlow }: PoseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const filteredPoses = poses.filter(pose => {
    const matchesSearch = pose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pose.sanskrit.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || pose.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(poses.map(pose => pose.category)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search poses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoses.map(pose => (
          <PoseCard
            key={pose.id}
            pose={pose}
            onAddToFlow={onAddToFlow}
          />
        ))}
      </div>

      {filteredPoses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🤷‍♀️</div>
          <p>No poses found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
