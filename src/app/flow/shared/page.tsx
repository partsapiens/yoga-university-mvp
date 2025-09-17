"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseSharedFlowData, FlowExportData } from '@/lib/flowExport';
import { Clock, Users, Target, Calendar, Play, Download, Copy } from 'lucide-react';

export default function SharedFlowPage() {
  const searchParams = useSearchParams();
  const [flowData, setFlowData] = useState<FlowExportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSetDocumentTitle = (flowData: FlowExportData) => {
    if (typeof window !== 'undefined') {
      document.title = `${flowData.name} - Shared Yoga Flow | Yoga Flow University`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${flowData.name} - A ${flowData.difficulty} yoga flow with ${flowData.poses.length} poses lasting ${Math.round(flowData.totalDuration / 60)} minutes. Focus: ${flowData.focus_areas.join(', ')}`
        );
      }
    }
  };

  useEffect(() => {
    // Set current URL for sharing
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }

    if (!searchParams) {
      setError('No search parameters available');
      setLoading(false);
      return;
    }
    
    const data = searchParams.get('data');
    
    if (!data) {
      setError('No flow data provided');
      setLoading(false);
      return;
    }

    try {
      const parsedData = parseSharedFlowData(data);
      if (parsedData) {
        setFlowData(parsedData);
        handleSetDocumentTitle(parsedData);
      } else {
        setError('Invalid flow data');
      }
    } catch (err) {
      setError('Failed to load flow data');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Share link copied to clipboard!');
    }
  };

  const handleImportFlow = () => {
    // Navigate to flow creation page with current flow data
    const flowParams = new URLSearchParams(window.location.search);
    const importUrl = `/flows/create?import=${flowParams.get('data')}`;
    window.location.href = importUrl;
  };

  // Add client-side check to prevent hydration issues
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading Flow...</h2>
          <p className="text-gray-600 dark:text-gray-400">Preparing your yoga sequence</p>
        </div>
      </div>
    );
  }

  if (error || !flowData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">😔</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Flow Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The requested flow could not be loaded. The link may be invalid or expired.'}
          </p>
          <div className="space-y-3">
            <a 
              href="/flows/create" 
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Play size={18} className="mr-2" />
              Create Your Own Flow
            </a>
            <a 
              href="/" 
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🧘</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {flowData?.name || 'Shared Yoga Flow'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Shared from Yoga Flow University
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Copy size={16} />
                Copy Link
              </button>
              <button
                onClick={handleImportFlow}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Download size={16} />
                Import Flow
              </button>
              <a 
                href="/flows/create" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Play size={16} />
                Create Similar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Info Cards */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  {Math.round(flowData.totalDuration / 60)} min
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Poses</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">
                  {flowData.poses.length}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white capitalize">
                  {flowData.difficulty}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
                <div className="font-bold text-sm text-gray-900 dark:text-white">
                  {new Date(flowData.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        {flowData.focus_areas && flowData.focus_areas.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Focus Areas
            </h3>
            <div className="flex flex-wrap gap-3">
              {flowData.focus_areas.map((area, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium shadow-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pose Sequence */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Play className="w-6 h-6 text-indigo-600" />
              Pose Sequence ({flowData.poses.length} poses)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Follow this sequence for your {Math.round(flowData.totalDuration / 60)}-minute yoga practice
            </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {flowData.poses.map((pose, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                          {pose.pose?.name || `Pose ${index + 1}`}
                        </h3>
                        {pose.pose?.sanskrit_name && (
                          <p className="text-indigo-600 dark:text-indigo-400 italic text-sm mb-2 font-medium">
                            {pose.pose.sanskrit_name}
                          </p>
                        )}
                        {pose.pose?.category && (
                          <div className="flex items-center gap-2">
                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                              {pose.pose.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold shadow-sm">
                          <Clock size={16} />
                          {formatDuration(pose.duration)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Practice Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 mt-8 border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-xl text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            💡 Practice Tips & Safety Guidelines
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🧘‍♀️ Mindful Practice</h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
                <li>• Listen to your body and modify poses as needed</li>
                <li>• Focus on your breath throughout the practice</li>
                <li>• Move slowly and mindfully between poses</li>
                <li>• Honor your limits and avoid pushing too hard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">⚡ Preparation & Safety</h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
                <li>• Practice on an empty stomach (2-3 hours after meals)</li>
                <li>• Stay hydrated before and after practice</li>
                <li>• Use a non-slip yoga mat for safety</li>
                <li>• Warm up adequately before challenging poses</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mt-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Practice?</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Import this flow to your personal library, create similar flows, or start practicing right away with our guided experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleImportFlow}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Import to My Library
            </button>
            <a
              href="/flows/create"
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-colors"
            >
              Create Your Own Flow
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🧘</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Yoga Flow University</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Empowering practitioners with intelligent flow creation and mindful yoga practice
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="/flows/create" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Create Flow
            </a>
            <a href="/poses" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Pose Library
            </a>
            <a href="/meditation" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Meditation
            </a>
            <a href="/about" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              About
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}