"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PrintableSequence from '../../../../components/PoseLibrary/PrintableSequence';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock flow data - in a real app, this would come from your database
const mockFlowData = {
  title: 'Morning Sun Salutation Flow',
  description: 'A gentle morning sequence to awaken the body and mind, building heat and energy for the day ahead.',
  totalDuration: 900, // 15 minutes
  difficulty: 'beginner',
  focusAreas: ['Full Body', 'Core Strength', 'Flexibility'],
  poses: [
    {
      pose: {
        id: '1',
        slug: 'mountain-pose',
        name_en: 'Mountain Pose',
        name_sanskrit: 'Tadasana',
        family_id: 'Standing',
        thumbnail_url: '/images/poses/mountain-pose.jpg',
        benefits: [
          'Improves posture and body awareness',
          'Strengthens legs and core muscles',
          'Calms the mind and reduces stress'
        ],
        instructions: [
          'Stand with feet hip-width apart',
          'Distribute weight evenly across both feet',
          'Engage leg muscles, lift kneecaps slightly',
          'Lengthen spine, crown of head reaching toward ceiling'
        ],
        anatomy: {
          primary_muscles: ['Quadriceps', 'Glutes', 'Core muscles'],
          joint_actions: ['Neutral spine', 'Hip extension', 'Knee extension']
        }
      },
      duration: 30,
      breath_count: 5,
      notes: 'Begin by centering yourself and setting an intention for your practice.'
    },
    {
      pose: {
        id: '2',
        slug: 'upward-salute',
        name_en: 'Upward Salute',
        name_sanskrit: 'Urdhva Hastasana',
        family_id: 'Standing',
        thumbnail_url: '/images/poses/upward-salute.jpg',
        benefits: [
          'Stretches sides of body and arms',
          'Improves digestion',
          'Energizes the body'
        ],
        instructions: [
          'From Mountain Pose, sweep arms overhead',
          'Keep arms shoulder-width apart or palms touching',
          'Lift chest and gaze up slightly',
          'Breathe deeply'
        ],
        anatomy: {
          primary_muscles: ['Deltoids', 'Intercostals', 'Core'],
          joint_actions: ['Shoulder flexion', 'Spinal extension']
        }
      },
      duration: 30,
      breath_count: 3
    },
    {
      pose: {
        id: '3',
        slug: 'standing-forward-fold',
        name_en: 'Standing Forward Fold',
        name_sanskrit: 'Uttanasana',
        family_id: 'Standing',
        thumbnail_url: '/images/poses/forward-fold.jpg',
        benefits: [
          'Stretches hamstrings and calves',
          'Calms the nervous system',
          'Improves digestion'
        ],
        instructions: [
          'Exhale and hinge forward from hips',
          'Keep knees soft, let arms hang',
          'Hold opposite elbows if comfortable',
          'Sway gently side to side'
        ],
        contraindications: [
          'Lower back injuries',
          'High blood pressure'
        ],
        anatomy: {
          primary_muscles: ['Hamstrings', 'Calves', 'Erector spinae'],
          joint_actions: ['Hip flexion', 'Spinal flexion']
        }
      },
      duration: 45,
      breath_count: 5,
      notes: 'Bend knees as much as needed to maintain comfort.'
    },
    {
      pose: {
        id: '4',
        slug: 'downward-dog',
        name_en: 'Downward Facing Dog',
        name_sanskrit: 'Adho Mukha Svanasana',
        family_id: 'Inversion',
        thumbnail_url: '/images/poses/downward-dog.jpg',
        benefits: [
          'Strengthens arms and shoulders',
          'Stretches hamstrings and calves',
          'Energizes the body'
        ],
        instructions: [
          'Plant palms, step back to inverted V',
          'Press palms down, lift hips up',
          'Straighten legs as comfortable',
          'Pedal feet to warm up'
        ],
        anatomy: {
          primary_muscles: ['Deltoids', 'Triceps', 'Quadriceps'],
          joint_actions: ['Shoulder flexion', 'Hip flexion', 'Spinal extension']
        }
      },
      duration: 60,
      breath_count: 8,
      notes: 'Pedal the feet and bend knees to warm up the legs.'
    },
    {
      pose: {
        id: '5',
        slug: 'child-pose',
        name_en: 'Child\'s Pose',
        name_sanskrit: 'Balasana',
        family_id: 'Resting',
        thumbnail_url: '/images/poses/child-pose.jpg',
        benefits: [
          'Calms the nervous system',
          'Gently stretches hips and back',
          'Provides rest and introspection'
        ],
        instructions: [
          'Kneel on floor with big toes touching',
          'Sit back on heels',
          'Fold forward, extending arms in front',
          'Rest forehead on mat'
        ],
        anatomy: {
          primary_muscles: ['Hip flexors', 'Lower back'],
          joint_actions: ['Hip flexion', 'Spinal flexion']
        }
      },
      duration: 60,
      breath_count: 8,
      notes: 'Use this pose to rest and reconnect with your breath.'
    }
  ]
};

export default function PrintSequencePage() {
  const searchParams = useSearchParams();
  const [flowData, setFlowData] = useState(mockFlowData);
  const [includeInstructions, setIncludeInstructions] = useState(true);
  const [includeAnatomy, setIncludeAnatomy] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the sequence data based on URL parameters
    const sequenceId = searchParams?.get('id');
    if (sequenceId) {
      // Fetch sequence data from API/database
      console.log('Loading sequence:', sequenceId);
    }
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Print Controls - Hidden in print */}
      <div className="no-print bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/flows"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Flows
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Print Sequence: {flowData.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={includeInstructions}
                    onChange={(e) => setIncludeInstructions(e.target.checked)}
                    className="mr-2"
                  />
                  Include Instructions
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={includeAnatomy}
                    onChange={(e) => setIncludeAnatomy(e.target.checked)}
                    className="mr-2"
                  />
                  Include Anatomy
                </label>
              </div>
              
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print Sequence
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PrintableSequence
          flowData={flowData}
          includeInstructions={includeInstructions}
          includeAnatomy={includeAnatomy}
        />
      </div>
    </div>
  );
}