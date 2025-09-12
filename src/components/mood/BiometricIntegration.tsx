"use client";

import React, { useState, useEffect } from 'react';

interface BiometricData {
  heartRate?: number;
  heartRateVariability?: number;
  stressLevel?: 'low' | 'medium' | 'high';
  sleepQuality?: number;
  timestamp: string;
}

interface BiometricIntegrationProps {
  onBiometricData?: (data: BiometricData) => void;
  className?: string;
}

export const BiometricIntegration: React.FC<BiometricIntegrationProps> = ({ 
  onBiometricData, 
  className = '' 
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentData, setCurrentData] = useState<BiometricData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if Web Bluetooth or other biometric APIs are available
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = () => {
    // Check for various biometric APIs
    const hasWebBluetooth = 'bluetooth' in navigator;
    const hasHeartRate = 'HeartRateMonitor' in window;
    const hasHealthSensors = 'Sensor' in window;
    
    if (!hasWebBluetooth && !hasHeartRate && !hasHealthSensors) {
      setErrorMessage('Biometric sensors not supported on this device');
    }
  };

  const requestPermissions = async () => {
    try {
      setIsConnecting(true);
      setErrorMessage(null);

      // Request permissions for health/fitness data
      if ('permissions' in navigator && 'health' in navigator.permissions) {
        const permission = await (navigator.permissions as any).query({ name: 'health' });
        if (permission.state === 'granted') {
          setHasPermission(true);
        }
      }

      // Mock biometric data for demo purposes
      // In a real implementation, this would connect to actual sensors
      const mockData: BiometricData = {
        heartRate: 72 + Math.floor(Math.random() * 20), // 72-92 BPM
        heartRateVariability: 25 + Math.floor(Math.random() * 30), // 25-55 ms
        stressLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        sleepQuality: 3 + Math.floor(Math.random() * 5), // 3-7 score
        timestamp: new Date().toISOString()
      };

      setCurrentData(mockData);
      setIsEnabled(true);
      setHasPermission(true);

      if (onBiometricData) {
        onBiometricData(mockData);
      }

    } catch (error) {
      console.error('Failed to connect to biometric sensors:', error);
      setErrorMessage('Failed to connect to biometric sensors. Please check device compatibility.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectSensors = () => {
    setIsEnabled(false);
    setCurrentData(null);
    setHasPermission(false);
    setErrorMessage(null);
  };

  const calculateStressFromHRV = (hrv?: number): 'low' | 'medium' | 'high' => {
    if (!hrv) return 'medium';
    if (hrv > 40) return 'low';
    if (hrv > 25) return 'medium';
    return 'high';
  };

  const getStressColor = (stress: string): string => {
    switch (stress) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRecommendationBasedOnBiometrics = (): string => {
    if (!currentData) return '';

    const { heartRate, heartRateVariability, stressLevel } = currentData;
    
    if (stressLevel === 'high' || (heartRate && heartRate > 90)) {
      return 'Your biometric data suggests high stress. Try a calming breathing exercise.';
    }
    
    if (heartRateVariability && heartRateVariability < 20) {
      return 'Low HRV detected. Consider a heart coherence breathing pattern.';
    }
    
    if (stressLevel === 'low' && heartRate && heartRate < 70) {
      return 'Your stress levels look good! Perfect time for focus meditation.';
    }
    
    return 'Biometric data looks normal. Choose any practice that appeals to you.';
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">💓 Biometric Integration</h3>
        {isEnabled && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">Connected</span>
          </div>
        )}
      </div>

      {!isEnabled && !hasPermission && (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">⌚</div>
          <h4 className="text-md font-medium text-gray-700 mb-2">
            Connect Biometric Sensors
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Get personalized recommendations based on your heart rate, HRV, and stress levels
          </p>
          
          <button
            onClick={requestPermissions}
            disabled={isConnecting}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isConnecting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isConnecting ? 'Connecting...' : 'Connect Sensors'}
          </button>

          <div className="mt-4 text-xs text-gray-500">
            <p>🔒 Privacy First: Data stays on your device</p>
            <p>📱 Supports: Heart rate monitors, fitness trackers</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {isEnabled && currentData && (
        <div className="space-y-4">
          {/* Biometric Data Display */}
          <div className="grid grid-cols-2 gap-4">
            {currentData.heartRate && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{currentData.heartRate}</div>
                <div className="text-sm text-gray-600">BPM</div>
              </div>
            )}
            
            {currentData.heartRateVariability && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{currentData.heartRateVariability}</div>
                <div className="text-sm text-gray-600">HRV (ms)</div>
              </div>
            )}
            
            {currentData.stressLevel && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className={`text-2xl font-bold ${getStressColor(currentData.stressLevel)}`}>
                  {currentData.stressLevel.toUpperCase()}
                </div>
                <div className="text-sm text-gray-600">Stress Level</div>
              </div>
            )}
            
            {currentData.sleepQuality && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-800">{currentData.sleepQuality}/10</div>
                <div className="text-sm text-gray-600">Sleep Quality</div>
              </div>
            )}
          </div>

          {/* Biometric-based Recommendation */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
            <h4 className="text-sm font-medium text-blue-800 mb-1">📊 Biometric Insight</h4>
            <p className="text-sm text-blue-700">{getRecommendationBasedOnBiometrics()}</p>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={disconnectSensors}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Disconnect Sensors
            </button>
            
            <div className="text-xs text-gray-500">
              Updated: {new Date(currentData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          🔒 Your biometric data is processed locally and never shared. 
          <br />
          You can disconnect anytime and data will be cleared.
        </p>
      </div>
    </div>
  );
};