import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          {/* Yoga pose illustration placeholder */}
          <div className="w-32 h-32 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">🧘‍♀️</span>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            This page seems to have wandered off into deep meditation. 
            Let&apos;s guide you back to your practice.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Return Home
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/poses"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Poses
            </Link>
            <span className="hidden sm:inline text-gray-400">•</span>
            <Link
              href="/flows/create"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create Flow
            </Link>
            <span className="hidden sm:inline text-gray-400">•</span>
            <Link
              href="/meditation"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Try Meditation
            </Link>
          </div>
        </div>
        
        {/* Mindful quote */}
        <div className="mt-12 p-4 bg-white/50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 italic">
            &quot;The present moment is the only moment available to us, and it is the door to all moments.&quot;
          </p>
          <p className="text-xs text-gray-500 mt-2">— Thich Nhat Hanh</p>
        </div>
      </div>
    </div>
  );
}