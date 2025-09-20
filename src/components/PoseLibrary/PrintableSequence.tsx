import React from 'react';
import PrintablePoseCard from './PrintablePoseCard';

interface SequencePose {
  pose: {
    id: string;
    slug: string;
    name_en?: string;
    name_sanskrit?: string;
    family_id?: string;
    thumbnail_url?: string;
    icon_url?: string;
    benefits?: string[];
    instructions?: string[];
    contraindications?: string[];
    anatomy?: {
      primary_muscles?: string[];
      secondary_muscles?: string[];
      joint_actions?: string[];
    };
  };
  duration?: number;
  notes?: string;
  breath_count?: number;
}

interface FlowData {
  title: string;
  description?: string;
  totalDuration: number;
  difficulty?: string;
  focusAreas?: string[];
  poses: SequencePose[];
}

interface PrintableSequenceProps {
  flowData: FlowData;
  includeInstructions?: boolean;
  includeAnatomy?: boolean;
}

export default function PrintableSequence({ 
  flowData, 
  includeInstructions = true, 
  includeAnatomy = false 
}: PrintableSequenceProps) {
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  return (
    <div className="printable-sequence">
      {/* Sequence Header */}
      <div className="sequence-header bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6 break-inside-avoid">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{flowData.title}</h1>
        {flowData.description && (
          <p className="text-gray-700 mb-4">{flowData.description}</p>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-gray-600">Duration</div>
            <div className="text-lg font-bold text-blue-600">
              {Math.round(flowData.totalDuration / 60)} min
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-gray-600">Poses</div>
            <div className="text-lg font-bold text-green-600">
              {flowData.poses.length}
            </div>
          </div>
          
          {flowData.difficulty && (
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold text-gray-600">Level</div>
              <div className="text-lg font-bold text-purple-600 capitalize">
                {flowData.difficulty}
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg p-3">
            <div className="font-semibold text-gray-600">Focus</div>
            <div className="text-sm text-gray-800">
              {flowData.focusAreas?.slice(0, 2).join(', ') || 'General'}
            </div>
          </div>
        </div>
      </div>

      {/* Sequence Overview */}
      <div className="sequence-overview mb-6 break-inside-avoid">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Sequence Overview</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 gap-2 text-sm">
            {flowData.poses.map((sequencePose, index) => {
              const pose = sequencePose.pose;
              return (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-medium text-gray-900">
                        {pose?.name_en || `Pose ${index + 1}`}
                      </span>
                      {pose?.name_sanskrit && (
                        <span className="text-gray-500 italic ml-2">
                          ({pose.name_sanskrit})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-600 text-xs">
                    {sequencePose.duration ? formatDuration(sequencePose.duration) : '30s'}
                    {sequencePose.breath_count && (
                      <span className="ml-2">• {sequencePose.breath_count} breaths</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Pose Instructions */}
      <div className="detailed-poses">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Pose Instructions</h2>
        <div className="space-y-6">
          {flowData.poses.map((sequencePose, index) => {
            const pose = sequencePose.pose;
            if (!pose || !pose.name_en) return null;

            return (
              <div key={index} className="pose-detail break-inside-avoid">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {pose.name_en}
                    {pose.name_sanskrit && (
                      <span className="text-gray-500 italic ml-2 text-base font-normal">
                        ({pose.name_sanskrit})
                      </span>
                    )}
                  </h3>
                </div>

                {pose && pose.name_en && (
                  <PrintablePoseCard 
                    pose={pose as any}
                    includeInstructions={includeInstructions}
                    includeAnatomy={includeAnatomy}
                  />
                )}

                {/* Sequence-specific notes */}
                {sequencePose.notes && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                      Sequence Notes:
                    </h4>
                    <p className="text-sm text-yellow-700">{sequencePose.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="sequence-footer mt-8 pt-4 border-t border-gray-300 break-inside-avoid">
        <div className="text-center text-sm text-gray-500">
          <p>Generated by Yoga University MVP</p>
          <p>Printed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          <p className="mt-2 text-xs text-gray-400">
            Always practice mindfully and listen to your body. Consult a qualified yoga instructor for guidance.
          </p>
        </div>
      </div>
    </div>
  );
}