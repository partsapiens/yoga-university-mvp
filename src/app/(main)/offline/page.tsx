"use client";

import React from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          {/* Offline meditation illustration */}
          <div className="w-32 h-32 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">🧘‍♀️</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Practice Offline
          </h1>
          <p className="text-gray-600 mb-8">
            You're currently offline, but your mindfulness practice doesn't have to stop. 
            Try these offline techniques while we reconnect.
          </p>
        </div>
        
        {/* Offline practice suggestions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Mindful Moments You Can Practice Now
          </h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 mt-1">🫁</span>
              <div>
                <h3 className="font-medium text-gray-900">Box Breathing</h3>
                <p className="text-sm text-gray-600">Inhale 4, hold 4, exhale 4, hold 4. Repeat for 2-5 minutes.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-purple-600 mt-1">🧠</span>
              <div>
                <h3 className="font-medium text-gray-900">Body Scan</h3>
                <p className="text-sm text-gray-600">Starting from your toes, mentally scan each part of your body.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-green-600 mt-1">🙏</span>
              <div>
                <h3 className="font-medium text-gray-900">Gratitude Practice</h3>
                <p className="text-sm text-gray-600">Think of three things you're grateful for right now.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-orange-600 mt-1">🌅</span>
              <div>
                <h3 className="font-medium text-gray-900">Sun Salutation</h3>
                <p className="text-sm text-gray-600">A gentle sequence to energize your body and mind.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Try Reconnecting
          </button>
          
          <div className="text-sm text-gray-500">
            <p>This page works offline thanks to our Progressive Web App.</p>
            <p className="mt-1">Your practice data is safely stored locally until you reconnect.</p>
          </div>
        </div>
        
        {/* Offline functionality info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Available Offline</h3>
          <ul className="text-sm text-blue-700 text-left space-y-1">
            <li>• Previously loaded meditation timers</li>
            <li>• Local practice tracking and statistics</li>
            <li>• Saved yoga flows and preferences</li>
            <li>• Cached pose instructions and images</li>
          </ul>
        </div>
      </div>
    </div>
  );
}