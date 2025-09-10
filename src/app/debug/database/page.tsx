"use client";

import React, { useState, useEffect } from 'react';

const DatabaseTestPage = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [poses, setPoses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      try {
        setLoading(true);
        
        // Import functions dynamically
        const { testSupabaseConnection, getPosesFromDatabase, debugDatabaseConnection } = await import('@/lib/database');
        
        // Test connection
        console.log('Running database connection test...');
        const connectionWorking = await testSupabaseConnection();
        setConnectionStatus(connectionWorking ? 'Connected' : 'Failed');
        
        if (connectionWorking) {
          // Run debug
          await debugDatabaseConnection();
          
          // Get poses
          const dbPoses = await getPosesFromDatabase();
          setPoses(dbPoses);
          
          if (dbPoses.length === 0) {
            setError('Connection successful but no poses found');
          }
        } else {
          setError('Could not connect to Supabase database');
        }
      } catch (err) {
        console.error('Test failed:', err);
        setError(`Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
      
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
          <p className={`text-lg font-medium ${
            connectionStatus === 'Connected' ? 'text-green-600' : 
            connectionStatus === 'Failed' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {connectionStatus}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error</h2>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200">Running tests...</p>
          </div>
        )}

        {/* Poses Count */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Poses Found</h2>
          <p className="text-lg">
            {loading ? 'Loading...' : `${poses.length} poses`}
          </p>
          
          {poses.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Sample Poses:</h3>
              <ul className="space-y-1">
                {poses.slice(0, 5).map((pose, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {pose.name} ({pose.sanskrit || 'No Sanskrit'}) - {pose.category || 'No Category'} - {pose.level || 'No Level'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Environment Variables */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Environment</h2>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Supabase URL:</span>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
            </p>
            <p>
              <span className="font-medium">Supabase Key:</span>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Debug Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-yellow-700 dark:text-yellow-300 text-sm">
            <li>Check the browser console for detailed debug information</li>
            <li>Verify your .env.local file has the correct Supabase credentials</li>
            <li>Ensure the poses table exists in your Supabase database</li>
            <li>Check that there are poses in the table (no is_published filter needed)</li>
            <li>Verify network connectivity to Supabase (check for ad blockers)</li>
            <li>Confirm the table schema matches: id, slug, name, sanskrit, category, level, etc.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTestPage;