import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const ManualPage = () => {
  const manualUrl = "https://drive.google.com/file/d/1mzd90qEnwVsx25c6OGJ6asDg2bnxRIjI/view?usp=sharing";

  return (
    <div className="container mx-auto p-4 md:p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Yoga Teacher Training Manual</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        This is the complete 300-hour teacher training manual. Click the button below to open the manual in a new tab.
      </p>
      <Link href={manualUrl} target="_blank" rel="noopener noreferrer">
        <Button size="lg">
          View Manual
        </Button>
      </Link>
    </div>
  );
};

export default ManualPage;
