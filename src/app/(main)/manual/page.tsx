'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManualPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the manual index HTML file
    window.location.href = '/manual/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to Manual...</p>
      </div>
    </div>
  );
}