"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Shield, Camera, Volume2, Bell } from 'lucide-react';

interface PoseAnalysisSettings {
  enabled: boolean;
  autoStart: boolean;
  showSkeleton: boolean;
  confidenceThreshold: number;
  analysisFrequency: number; // in milliseconds
  voiceFeedback: boolean;
  visualFeedback: boolean;
  privacyMode: boolean;
  saveProgress: boolean;
  notifications: boolean;
}

interface PoseAnalysisSettingsProps {
  onSettingsChange?: (settings: PoseAnalysisSettings) => void;
  className?: string;
}

const defaultSettings: PoseAnalysisSettings = {
  enabled: true,
  autoStart: false,
  showSkeleton: true,
  confidenceThreshold: 0.3,
  analysisFrequency: 500,
  voiceFeedback: false,
  visualFeedback: true,
  privacyMode: true,
  saveProgress: true,
  notifications: false
};

export function PoseAnalysisSettings({ onSettingsChange, className = '' }: PoseAnalysisSettingsProps) {
  const [settings, setSettings] = useState<PoseAnalysisSettings>(defaultSettings);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem('pose_analysis_settings');
    if (stored) {
      try {
        const parsedSettings = { ...defaultSettings, ...JSON.parse(stored) };
        setSettings(parsedSettings);
        if (onSettingsChange) {
          onSettingsChange(parsedSettings);
        }
      } catch (error) {
        console.error('Error loading pose analysis settings:', error);
      }
    }
  }, [onSettingsChange]);

  const updateSetting = <K extends keyof PoseAnalysisSettings>(
    key: K,
    value: PoseAnalysisSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem('pose_analysis_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving pose analysis settings:', error);
    }
    
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem('pose_analysis_settings');
    } catch (error) {
      console.error('Error resetting pose analysis settings:', error);
    }
    
    if (onSettingsChange) {
      onSettingsChange(defaultSettings);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Pose Analysis Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure how pose detection works
            </p>
          </div>
        </div>
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>

      {/* Settings Panel */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-6 border-t border-gray-200 dark:border-gray-700">
          
          {/* General Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4" />
              General
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Pose Analysis
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Turn on computer vision-based pose detection
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => updateSetting('enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto-start with Flow
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Automatically start pose analysis when beginning a flow
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoStart}
                  onChange={(e) => updateSetting('autoStart', e.target.checked)}
                  disabled={!settings.enabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Skeleton Overlay
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Display pose detection points and connections
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showSkeleton}
                  onChange={(e) => updateSetting('showSkeleton', e.target.checked)}
                  disabled={!settings.enabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Detection Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Detection Accuracy</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confidence Threshold: {Math.round(settings.confidenceThreshold * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.1"
                  value={settings.confidenceThreshold}
                  onChange={(e) => updateSetting('confidenceThreshold', parseFloat(e.target.value))}
                  disabled={!settings.enabled}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Higher values require more confident pose detection
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Analysis Frequency: {settings.analysisFrequency}ms
                </label>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="100"
                  value={settings.analysisFrequency}
                  onChange={(e) => updateSetting('analysisFrequency', parseInt(e.target.value))}
                  disabled={!settings.enabled}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Lower values = more frequent analysis (higher CPU usage)
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Feedback
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Voice Feedback
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hear audio corrections and suggestions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.voiceFeedback}
                  onChange={(e) => updateSetting('voiceFeedback', e.target.checked)}
                  disabled={!settings.enabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Visual Feedback
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show on-screen corrections and accuracy
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.visualFeedback}
                  onChange={(e) => updateSetting('visualFeedback', e.target.checked)}
                  disabled={!settings.enabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy & Data
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Privacy Mode
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    All processing happens locally, no data sent to servers
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacyMode}
                  onChange={(e) => updateSetting('privacyMode', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Save Progress Data
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Store accuracy and improvement metrics locally
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.saveProgress}
                  onChange={(e) => updateSetting('saveProgress', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Practice Notifications
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get reminders to practice with pose analysis
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => updateSetting('notifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={resetToDefaults}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              Reset to Default Settings
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Privacy First:</strong> All pose analysis happens locally on your device. 
                No video data or pose information is ever sent to external servers. Your practice 
                data remains completely private and under your control.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook to use pose analysis settings
export function usePoseAnalysisSettings() {
  const [settings, setSettings] = useState<PoseAnalysisSettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem('pose_analysis_settings');
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch (error) {
        console.error('Error loading pose analysis settings:', error);
      }
    }
  }, []);

  return settings;
}