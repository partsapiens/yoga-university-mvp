import React from 'react';
import { getManualContent } from '@/lib/manual';
import { ManualPage, ManualPageContent } from '@/types';

const ManualPageDisplay = () => {
  const manual = getManualContent();

  const renderContent = (item: ManualPageContent, index: number) => {
    switch (item.type) {
      case 'h1':
        return <h1 key={index} className="text-3xl font-bold my-4">{item.text}</h1>;
      case 'h3':
        return <h3 key={index} className="text-xl font-bold my-3">{item.text}</h3>;
      case 'p':
        return <p key={index} className="my-2">{item.text}</p>;
      case 'ul':
        return (
          <ul key={index} className="list-disc list-inside my-2">
            {item.items.map((li, i) => <li key={i}>{li}</li>)}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Yoga Teacher Training Manual</h1>
      {manual.pages.map((page: ManualPage) => (
        <div key={page.pageNumber} className="mb-12 p-6 border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Page {page.pageNumber}</h2>
          <div className="prose max-w-none">
            {page.content.map(renderContent)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManualPageDisplay;
