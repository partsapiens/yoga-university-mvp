"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseSharedFlowData, FlowExportData } from '@/lib/flowExport';
import { Clock, Users, Target, Calendar } from 'lucide-react';

export default function SharedFlowPage() {
  const searchParams = useSearchParams();
  const [flowData, setFlowData] = useState<FlowExportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      } else {
        setError('Invalid flow data');
      }
    } catch (err) {
      setError('Failed to load flow data');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flow...</p>
        </div>
      </div>
    );
  }

  if (error || !flowData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Flow Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested flow could not be loaded.'}</p>
          <a 
            href="/flows/create" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your Own Flow
          </a>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{flowData.name}</h1>
              <p className="text-gray-600 mt-1">Shared Yoga Flow</p>
            </div>
            <div className="text-right">
              <a 
                href="/flows/create" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Similar Flow
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Info */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold">{Math.round(flowData.totalDuration / 60)} min</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Poses</div>
                <div className="font-semibold">{flowData.poses.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Difficulty</div>
                <div className="font-semibold capitalize">{flowData.difficulty}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-sm text-gray-600">Created</div>
                <div className="font-semibold">
                  {new Date(flowData.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        {flowData.focus_areas && flowData.focus_areas.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold mb-2">Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {flowData.focus_areas.map((area, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pose Sequence */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Pose Sequence</h2>
          <div className="space-y-4">
            {flowData.poses.map((pose, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {pose.pose?.name || `Pose ${index + 1}`}
                  </h3>
                  {pose.pose?.sanskrit_name && (
                    <p className="text-sm text-gray-600 italic">{pose.pose.sanskrit_name}</p>
                  )}
                  {pose.pose?.category && (
                    <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {pose.pose.category.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatDuration(pose.duration)}
                  </div>
                  <div className="text-sm text-gray-600">duration</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Tips */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Practice Tips</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Listen to your body and modify poses as needed</li>
            <li>• Focus on your breath throughout the practice</li>
            <li>• Move slowly and mindfully between poses</li>
            <li>• Stay hydrated and practice on an empty stomach</li>
            <li>• Consider warming up before starting this sequence</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 py-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Created with Yoga Flow University • 
            <a href="/flows/create" className="text-blue-600 hover:underline ml-1">
              Create your own flow
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}