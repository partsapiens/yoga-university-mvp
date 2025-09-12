"use client";

import React, { useState, useEffect } from 'react';
import { MoodTrackingService, MoodPreferences } from '@/lib/services/moodTracking';

interface PrivacyControlsProps {
  className?: string;
}

export const PrivacyControls: React.FC<PrivacyControlsProps> = ({ className = '' }) => {
  const [preferences, setPreferences] = useState<MoodPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDataExport, setShowDataExport] = useState(false);
  const [exportData, setExportData] = useState<any>(null);

  const moodTracker = MoodTrackingService.getInstance();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    try {
      const prefs = moodTracker.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = (key: keyof MoodPreferences, value: any) => {
    if (!preferences) return;

    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    moodTracker.updatePreferences({ [key]: value });
  };

  const handleDataExport = () => {
    try {
      const data = moodTracker.exportData();
      setExportData(data);
      setShowDataExport(true);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const downloadExportedData = () => {
    if (!exportData) return;

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `yoga-mood-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    setShowDataExport(false);
  };

  const handleClearAllData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete all your mood tracking data? This action cannot be undone.'
    );
    
    if (confirmed) {
      try {
        moodTracker.clearAllData();
        alert('All mood tracking data has been cleared.');
        loadPreferences(); // Reload with defaults
      } catch (error) {
        console.error('Failed to clear data:', error);
        alert('Failed to clear data. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!preferences) return null;

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">🔒 Privacy & Data Controls</h3>
      
      {/* Tracking Preferences */}
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Mood Tracking</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Enable Mood Tracking</label>
                <p className="text-xs text-gray-500">Store your mood data locally for personalized recommendations</p>
              </div>
              <button
                onClick={() => updatePreference('enableTracking', !preferences.enableTracking)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.enableTracking ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.enableTracking ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Share Anonymous Analytics</label>
                <p className="text-xs text-gray-500">Help improve our recommendations with anonymized usage data</p>
              </div>
              <button
                onClick={() => updatePreference('shareAnalytics', !preferences.shareAnalytics)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.shareAnalytics ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.shareAnalytics ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Reminders</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mood Check-in Frequency
            </label>
            <select
              value={preferences.reminderFrequency}
              onChange={(e) => updatePreference('reminderFrequency', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="never">Never</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        {/* Data Retention */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Data Retention</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keep data for (days)
            </label>
            <select
              value={preferences.dataRetentionDays}
              onChange={(e) => updatePreference('dataRetentionDays', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={365}>1 year</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Data older than this will be automatically deleted
            </p>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Data Management</h4>
          
          <div className="space-y-3">
            <button
              onClick={handleDataExport}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              📥 Export My Data
            </button>
            
            <button
              onClick={handleClearAllData}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              🗑️ Delete All Data
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Information */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-md font-medium text-gray-700 mb-3">How We Protect Your Privacy</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✓</span>
            <p>All mood data is stored locally on your device</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✓</span>
            <p>No personal information is transmitted to our servers</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✓</span>
            <p>Text inputs are hashed for privacy protection</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✓</span>
            <p>You can export or delete your data at any time</p>
          </div>
        </div>
      </div>

      {/* Data Export Modal */}
      {showDataExport && exportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Export Your Data</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Your data includes:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {exportData.history.length} mood tracking entries</li>
                <li>• Privacy preferences</li>
                <li>• No personally identifiable information</li>
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={downloadExportedData}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Download JSON
              </button>
              <button
                onClick={() => setShowDataExport(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};