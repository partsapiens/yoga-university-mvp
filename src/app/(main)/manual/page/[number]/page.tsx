import { Metadata } from 'next';
import ManualPageViewer from '@/components/ManualPageViewer';

interface Props {
  params: { number: string };
}

export function generateStaticParams() {
  // We'll generate these dynamically based on the page manifest
  // For now, return a reasonable range
  const pages = [];
  for (let i = 1; i <= 50; i++) {
    pages.push({ number: i.toString() });
  }
  return pages;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pageNumber = parseInt(params.number, 10);
  
  return {
    title: `Manual Page ${pageNumber} - Yoga Flow University`,
    description: `Yoga Teacher Training Manual - Page ${pageNumber}`,
  };
}

export default function ManualPageRoute({ params }: Props) {
  const pageNumber = parseInt(params.number, 10);
  
  if (isNaN(pageNumber) || pageNumber < 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Page Number</h1>
          <p className="text-gray-600 mt-2">Please enter a valid page number.</p>
        </div>
      </div>
    );
  }

  return <ManualPageViewer pageNumber={pageNumber} />;
}