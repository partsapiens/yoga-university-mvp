import React from 'react';
import Image from 'next/image';

interface Pose {
  id: string;
  slug: string;
  name_en: string;
  name_sanskrit: string;
  family_id: string;
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
}

interface PrintablePoseCardProps {
  pose: Pose;
  includeInstructions?: boolean;
  includeAnatomy?: boolean;
}

export default function PrintablePoseCard({ 
  pose, 
  includeInstructions = true, 
  includeAnatomy = false 
}: PrintablePoseCardProps) {
  return (
    <div className="printable-pose-card bg-white border border-gray-300 rounded-lg p-4 break-inside-avoid">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={pose.thumbnail_url || pose.icon_url || '/images/pose-placeholder.svg'}
            alt={`${pose.name_en} (${pose.name_sanskrit}) - ${pose.family_id} yoga pose`}
            fill
            className="object-cover rounded-lg"
            sizes="80px"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{pose.name_en}</h3>
          <p className="text-sm text-gray-600 italic">{pose.name_sanskrit}</p>
          <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1">
            {pose.family_id}
          </span>
        </div>
      </div>

      {/* Benefits */}
      {pose.benefits && pose.benefits.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Benefits:</h4>
          <ul className="text-xs text-gray-700 space-y-1">
            {pose.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-green-600 mt-0.5">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      {includeInstructions && pose.instructions && pose.instructions.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Instructions:</h4>
          <ol className="text-xs text-gray-700 space-y-1">
            {pose.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 font-medium min-w-[1rem]">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Anatomy Information */}
      {includeAnatomy && pose.anatomy && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Anatomy:</h4>
          <div className="text-xs text-gray-700 space-y-1">
            {pose.anatomy.primary_muscles && pose.anatomy.primary_muscles.length > 0 && (
              <div>
                <span className="font-medium">Primary muscles:</span> {pose.anatomy.primary_muscles.join(', ')}
              </div>
            )}
            {pose.anatomy.secondary_muscles && pose.anatomy.secondary_muscles.length > 0 && (
              <div>
                <span className="font-medium">Secondary muscles:</span> {pose.anatomy.secondary_muscles.join(', ')}
              </div>
            )}
            {pose.anatomy.joint_actions && pose.anatomy.joint_actions.length > 0 && (
              <div>
                <span className="font-medium">Joint actions:</span> {pose.anatomy.joint_actions.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contraindications */}
      {pose.contraindications && pose.contraindications.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-red-700 mb-2">Contraindications:</h4>
          <ul className="text-xs text-red-600 space-y-1">
            {pose.contraindications.map((contraindication, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span>{contraindication}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 pt-2 mt-4">
        <div className="text-xs text-gray-500 text-center">
          Yoga University MVP • {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}