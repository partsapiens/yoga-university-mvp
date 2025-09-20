"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  BookOpen, 
  Heart, 
  Calendar,
  Users,
  CheckCircle,
  RefreshCw,
  Database,
  Clock
} from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [cacheStatus, setCacheStatus] = useState<{count: number, lastUpdate: string} | null>(null);
  const [offlineData, setOfflineData] = useState({
    poses: 0,
    flows: 0,
    manualChapters: 7,
    meditationSessions: 0
  });

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Check cache status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          if (event.data.type === 'CACHE_STATUS') {
            setCacheStatus({
              count: event.data.count,
              lastUpdate: new Date().toLocaleString()
            });
          }
        };
        
        registration.active?.postMessage(
          { type: 'GET_CACHE_STATUS' },
          [channel.port2]
        );
      });
    }
    
    // Load offline data from localStorage
    const savedPoses = localStorage.getItem('offlinePoses');
    const savedFlows = localStorage.getItem('offlineFlows');
    const savedSessions = localStorage.getItem('meditationSessions');
    
    setOfflineData({
      poses: savedPoses ? JSON.parse(savedPoses).length : 0,
      flows: savedFlows ? JSON.parse(savedFlows).length : 0,
      manualChapters: 7,
      meditationSessions: savedSessions ? JSON.parse(savedSessions).length : 0
    });
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const offlineFeatures = [
    {
      title: 'Pose Library',
      description: 'Browse cached poses with detailed instructions',
      count: offlineData.poses,
      icon: <Heart className="w-6 h-6" />,
      color: 'red',
      link: '/poses'
    },
    {
      title: 'Flow Sequences',
      description: 'Access your saved yoga flows',
      count: offlineData.flows,
      icon: <Users className="w-6 h-6" />,
      color: 'blue',
      link: '/flows'
    },
    {
      title: 'Training Manual',
      description: 'Complete teacher training chapters',
      count: offlineData.manualChapters,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'green',
      link: '/manual'
    },
    {
      title: 'Meditation Timer',
      description: 'Practice with offline meditation sessions',
      count: offlineData.meditationSessions,
      icon: <Clock className="w-6 h-6" />,
      color: 'purple',
      link: '/meditation'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
              isOnline 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              {isOnline ? (
                <Wifi className="w-16 h-16 text-green-600" />
              ) : (
                <WifiOff className="w-16 h-16 text-gray-600" />
              )}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isOnline ? 'You&apos;re Back Online!' : 'Offline Mode'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            {isOnline 
              ? 'Your connection has been restored. You can now access all features and sync your offline practice data.'
              : 'No internet connection detected, but your yoga practice doesn&apos;t have to stop. Continue with our offline features.'
            }
          </p>

          {isOnline ? (
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh App
            </button>
          ) : (
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Reconnecting
            </button>
          )}
        </div>

        {/* Cache Status */}
        {cacheStatus && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cache Status
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cacheStatus.count} items cached • Last updated: {cacheStatus.lastUpdate}
                </p>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  App is fully functional offline
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Offline Features */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Available Offline Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Continue your practice with these cached features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {offlineFeatures.map((feature, index) => (
              <Link
                key={index}
                href={feature.link}
                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(feature.color)}`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </h3>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {feature.count}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Offline Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Offline Practice Tips
          </h3>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p>Your practice data is saved locally and will sync when you reconnect</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p>Meditation timers work completely offline with local audio cues</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p>Previously viewed poses and flows remain accessible with full instructions</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p>Teacher training manual chapters are fully cached for offline reading</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/poses"
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <Heart className="w-4 h-4" />
            Browse Poses
          </Link>
          <Link
            href="/meditation"
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Start Meditation
          </Link>
          <Link
            href="/manual"
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Read Manual
          </Link>
        </div>
      </div>
    </div>
  );
}