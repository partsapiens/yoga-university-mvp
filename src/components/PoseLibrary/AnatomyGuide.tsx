import React, { useState } from 'react';
import { Heart, Brain, Zap, Shield, Target } from 'lucide-react';

interface AnatomyData {
  primary_muscles: string[];
  secondary_muscles: string[];
  joint_actions: string[];
  benefits: string[];
  contraindications: string[];
  alignment_cues: string[];
  modifications: string[];
  breathing_pattern?: string;
  chakra_connection?: string;
  energy_effect?: 'grounding' | 'energizing' | 'calming' | 'balancing';
}

interface AnatomyGuideProps {
  poseName: string;
  anatomyData: AnatomyData;
  className?: string;
}

export default function AnatomyGuide({ poseName, anatomyData, className = '' }: AnatomyGuideProps) {
  const [activeTab, setActiveTab] = useState<'muscles' | 'alignment' | 'benefits' | 'modifications'>('muscles');

  const energyIcons = {
    grounding: '🌱',
    energizing: '⚡',
    calming: '🌙',
    balancing: '⚖️'
  };

  const tabs = [
    { id: 'muscles', label: 'Muscles & Joints', icon: <Target className="w-4 h-4" /> },
    { id: 'alignment', label: 'Alignment', icon: <Shield className="w-4 h-4" /> },
    { id: 'benefits', label: 'Benefits', icon: <Heart className="w-4 h-4" /> },
    { id: 'modifications', label: 'Modifications', icon: <Brain className="w-4 h-4" /> }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Anatomy & Alignment Guide
          </h3>
          {anatomyData.energy_effect && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-2xl">{energyIcons[anatomyData.energy_effect]}</span>
              <span className="font-medium text-gray-600 dark:text-gray-400 capitalize">
                {anatomyData.energy_effect}
              </span>
            </div>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Advanced guidance for {poseName}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'muscles' && (
          <div className="space-y-6">
            {/* Primary Muscles */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Primary Muscles Engaged
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {anatomyData.primary_muscles.map((muscle, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {muscle}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Muscles */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Secondary Muscles Engaged
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {anatomyData.secondary_muscles.map((muscle, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {muscle}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Joint Actions */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Joint Actions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {anatomyData.joint_actions.map((action, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breathing Pattern */}
            {anatomyData.breathing_pattern && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Breathing Pattern
                </h4>
                <p className="text-purple-700 dark:text-purple-200 text-sm">
                  {anatomyData.breathing_pattern}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alignment' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Alignment Cues
            </h4>
            <div className="space-y-3">
              {anatomyData.alignment_cues.map((cue, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                    {cue}
                  </p>
                </div>
              ))}
            </div>

            {anatomyData.chakra_connection && (
              <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                  Chakra Connection
                </h4>
                <p className="text-indigo-700 dark:text-indigo-200 text-sm">
                  {anatomyData.chakra_connection}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-6">
            {/* Benefits */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Physical & Mental Benefits
              </h4>
              <div className="space-y-3">
                {anatomyData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
                      <Heart className="w-full h-full" />
                    </div>
                    <span className="text-gray-900 dark:text-white text-sm">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contraindications */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contraindications & Precautions
              </h4>
              <div className="space-y-3">
                {anatomyData.contraindications.map((contraindication, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5">
                      ⚠️
                    </div>
                    <span className="text-gray-900 dark:text-white text-sm">
                      {contraindication}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modifications' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Modifications & Variations
            </h4>
            <div className="space-y-3">
              {anatomyData.modifications.map((modification, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                    {modification}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}