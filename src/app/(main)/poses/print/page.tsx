"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PrintablePoseCard from '../../../../components/PoseLibrary/PrintablePoseCard';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock pose data - in a real app, this would come from your database
const mockPoses = [
  {
    id: '1',
    slug: 'mountain-pose',
    name_en: 'Mountain Pose',
    name_sanskrit: 'Tadasana',
    family_id: 'Standing',
    thumbnail_url: '/images/poses/mountain-pose.jpg',
    benefits: [
      'Improves posture and body awareness',
      'Strengthens legs and core muscles',
      'Calms the mind and reduces stress',
      'Establishes foundation for other poses'
    ],
    instructions: [
      'Stand with feet hip-width apart, parallel to each other',
      'Distribute weight evenly across both feet',
      'Engage leg muscles, lift kneecaps slightly',
      'Lengthen spine, crown of head reaching toward ceiling',
      'Relax shoulders away from ears',
      'Breathe deeply and hold for 30 seconds to 1 minute'
    ],
    contraindications: [
      'Low blood pressure (avoid prolonged holding)',
      'Recent leg or ankle injuries'
    ],
    anatomy: {
      primary_muscles: ['Quadriceps', 'Glutes', 'Core muscles'],
      secondary_muscles: ['Calves', 'Erector spinae', 'Deep postural muscles'],
      joint_actions: ['Neutral spine', 'Hip extension', 'Knee extension']
    }
  },
  {
    id: '2',
    slug: 'downward-dog',
    name_en: 'Downward Facing Dog',
    name_sanskrit: 'Adho Mukha Svanasana',
    family_id: 'Inversion',
    thumbnail_url: '/images/poses/downward-dog.jpg',
    benefits: [
      'Strengthens arms, shoulders, and legs',
      'Stretches hamstrings and calves',
      'Improves circulation and energizes the body',
      'Calms the nervous system'
    ],
    instructions: [
      'Start in tabletop position on hands and knees',
      'Tuck toes under and lift hips up and back',
      'Straighten legs as much as comfortable',
      'Press palms firmly into the ground',
      'Create an inverted V-shape with your body',
      'Hold for 1-3 minutes, breathing steadily'
    ],
    contraindications: [
      'Wrist or shoulder injuries',
      'High blood pressure',
      'Headache or migraine',
      'Pregnancy (modify as needed)'
    ],
    anatomy: {
      primary_muscles: ['Deltoids', 'Triceps', 'Quadriceps', 'Core'],
      secondary_muscles: ['Latissimus dorsi', 'Serratus anterior', 'Hamstrings'],
      joint_actions: ['Shoulder flexion', 'Elbow extension', 'Hip flexion', 'Spinal extension']
    }
  },
  {
    id: '3',
    slug: 'warrior-1',
    name_en: 'Warrior I',
    name_sanskrit: 'Virabhadrasana I',
    family_id: 'Standing',
    thumbnail_url: '/images/poses/warrior-1.jpg',
    benefits: [
      'Strengthens legs, glutes, and core',
      'Opens hips and chest',
      'Improves balance and stability',
      'Builds confidence and focus'
    ],
    instructions: [
      'Step left foot back 3-4 feet from right foot',
      'Turn left foot out 45 degrees',
      'Bend right knee directly over ankle',
      'Square hips toward front of mat',
      'Raise arms overhead',
      'Hold for 30 seconds to 1 minute, then repeat on other side'
    ],
    contraindications: [
      'Knee injuries (avoid deep bending)',
      'Hip injuries',
      'High blood pressure (keep arms at heart level)'
    ],
    anatomy: {
      primary_muscles: ['Quadriceps', 'Glutes', 'Hip flexors'],
      secondary_muscles: ['Core muscles', 'Deltoids', 'Calf muscles'],
      joint_actions: ['Hip flexion/extension', 'Knee flexion', 'Shoulder flexion']
    }
  }
];

export default function PrintPosePage() {
  const searchParams = useSearchParams();
  const [selectedPoses, setSelectedPoses] = useState<string[]>([]);
  const [includeInstructions, setIncludeInstructions] = useState(true);
  const [includeAnatomy, setIncludeAnatomy] = useState(false);
  const [poses, setPoses] = useState(mockPoses);

  useEffect(() => {
    // Get pose IDs from URL parameters
    const poseIds = searchParams?.get('poses')?.split(',') || [];
    setSelectedPoses(poseIds);
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  const filteredPoses = selectedPoses.length > 0 
    ? poses.filter(pose => selectedPoses.includes(pose.id))
    : poses;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Print Controls - Hidden in print */}
      <div className="no-print bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/poses"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Poses
              </Link>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Print Pose Cards ({filteredPoses.length} poses)
              </h2>
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
                Print Cards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Print Header - Only visible in print */}
        <div className="print-only mb-8">
          <h1 className="text-2xl font-bold text-center mb-2">Yoga Pose Reference Cards</h1>
          <p className="text-center text-gray-600 mb-4">
            Generated from Yoga University MVP • {new Date().toLocaleDateString()}
          </p>
          <div className="border-b border-gray-300 mb-6"></div>
        </div>

        {filteredPoses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No poses selected
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Select poses from the pose library to print reference cards.
            </p>
            <Link
              href="/poses"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Browse Poses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
            {filteredPoses.map((pose) => (
              <PrintablePoseCard
                key={pose.id}
                pose={pose}
                includeInstructions={includeInstructions}
                includeAnatomy={includeAnatomy}
              />
            ))}
          </div>
        )}
      </div>

      {/* Print Footer - Only visible in print */}
      <div className="print-only mt-8 pt-4 border-t border-gray-300">
        <div className="text-center text-sm text-gray-500">
          <p>Practice safely and mindfully. Consult a qualified yoga instructor for guidance.</p>
          <p className="mt-1">© Yoga University MVP • www.yogauniversity.com</p>
        </div>
      </div>
    </div>
  );
}