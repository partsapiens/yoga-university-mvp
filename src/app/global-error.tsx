'use client';

import React from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="mb-8">
              {/* Error illustration */}
              <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-6xl">😵</span>
              </div>
              
              <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Something Went Wrong
              </h2>
              <p className="text-gray-600 mb-8">
                Our server encountered an unexpected condition. Take a deep breath - 
                we're working to restore balance.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={reset}
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mr-4"
              >
                Try Again
              </button>
              
              <Link
                href="/"
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Return Home
              </Link>
            </div>
            
            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="font-semibold text-red-800 mb-2">Error Details (Development)</h3>
                <p className="text-sm text-red-700 mb-2">
                  <strong>Message:</strong> {error.message}
                </p>
                {error.digest && (
                  <p className="text-sm text-red-700">
                    <strong>Digest:</strong> {error.digest}
                  </p>
                )}
              </div>
            )}
            
            {/* Breathing exercise for stress relief */}
            <div className="mt-12 p-4 bg-white/50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Take a Mindful Moment</h3>
              <p className="text-sm text-gray-600">
                Breathe in slowly for 4 counts, hold for 4, exhale for 4. 
                Sometimes technical difficulties are just reminders to pause and center ourselves.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}