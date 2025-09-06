'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import PoseLibrary from '@/components/poses/PoseLibrary'
import FlowBuilder from '@/components/flows/FlowBuilder'
import Journal from '@/components/journal/Journal'
import Navigation from '@/components/layout/Navigation'
import type { Pose, Flow, FlowStep } from '@/types'

export default function Home() {
  const [currentTab, setCurrentTab] = useState('poses')
  const [poses, setPoses] = useState<Pose[]>([])
  const [currentFlow, setCurrentFlow] = useState<Flow | null>(null)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    loadPoses()
  }, [])

  const loadPoses = async () => {
    try {
      const { data, error } = await supabase
        .from('poses')
        .select('*')
        .order('name')

      if (error) throw error

      // Transform database data to app format
      const transformedPoses: Pose[] = (data || []).map(pose => ({
        id: pose.id,
        name: pose.name,
        sanskrit: pose.sanskrit || '',
        category: pose.category,
        level: pose.level,
        muscles: pose.benefits || [],
        icon: pose.icon || '🧘‍♀️',
        description: pose.description || '',
        cues: pose.cues || [],
        benefits: pose.benefits || [],
        meta: pose.meta || {
          intensity: 1,
          sides: 'bilateral',
          typicalHoldSec: 30,
          counterposes: [],
          warmsUp: [],
          contraindications: [],
          musclesEngaged: [],
          musclesStretched: []
        }
      }))

      setPoses(transformedPoses)
    } catch (error) {
      console.error('Error loading poses:', error)
      // Fallback to sample data
      setPoses([
        {
          id: 'mountain',
          name: 'Mountain Pose',
          sanskrit: 'Tadasana',
          category: 'Standing',
          level: 'Beginner',
          muscles: ['Core', 'Legs'],
          icon: '🏔️',
          description: 'Foundation pose for alignment',
          cues: ['Stand tall', 'Ground through feet'],
          benefits: ['Improves posture', 'Builds awareness'],
          meta: {
            intensity: 1,
            sides: 'bilateral',
            typicalHoldSec: 30,
            counterposes: [],
            warmsUp: ['tree'],
            contraindications: [],
            musclesEngaged: ['Core'],
            musclesStretched: []
          }
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateFlow = (updates: Partial<Flow>) => {
    setCurrentFlow(prev => prev ? { ...prev, ...updates } : null)
  }

  const handleSaveFlow = async () => {
    if (!currentFlow) return

    try {
      const { error } = await supabase
        .from('flows')
        .insert({
          title: currentFlow.title || 'Untitled Flow',
          steps: currentFlow.steps,
          goal: currentFlow.goal,
          class_type: currentFlow.class_type,
          est_minutes: Math.round(
            currentFlow.steps.reduce((sum, step) => sum + step.holdSeconds, 0) / 60
          )
        })

      if (error) throw error
      alert('Flow saved successfully!')
    } catch (error) {
      console.error('Error saving flow:', error)
      alert('Error saving flow')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🧘‍♀️</div>
          <div>Loading Yoga Flow University...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />

      <main className="container mx-auto px-4 py-8">
        {currentTab === 'poses' && (
          <PoseLibrary
            poses={poses}
            onAddToFlow={(poseId) => {
              const pose = poses.find(p => p.id === poseId)
              if (!pose) return

              const newFlow: Flow = currentFlow || {
                id: '',
                title: '',
                owner_id: '',
                visibility: 'private',
                steps: [],
                goal: 'Hips',
                class_type: 'HPF',
                est_minutes: 0,
                tags: [],
                created_at: '',
                updated_at: ''
              }

              const newStep: FlowStep = {
                poseId,
                holdSeconds: pose.meta.typicalHoldSec,
                sides: pose.meta.sides === 'unilateral' ? 'R' : 'both',
                order: newFlow.steps.length,
              };

              setCurrentFlow({
                ...newFlow,
                steps: [...newFlow.steps, newStep]
              })
              setCurrentTab('flows')
            }}
          />
        )}

        {currentTab === 'flows' && (
          <FlowBuilder
            poses={poses}
            currentFlow={currentFlow}
            onUpdateFlow={handleUpdateFlow}
            onSaveFlow={handleSaveFlow}
            onExportPDF={() => alert('PDF export coming soon!')}
            onShareFlow={() => alert('Sharing coming soon!')}
          />
        )}

        {currentTab === 'journal' && <Journal />}
      </main>
    </div>
  )
}
