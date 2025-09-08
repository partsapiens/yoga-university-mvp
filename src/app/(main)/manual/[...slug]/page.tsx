import React from 'react';
import { getManualPage, getManualPages } from '@/lib/manual';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export async function generateStaticParams() {
  const pages = getManualPages();
  return pages.map(page => ({
    slug: [page.id],
  }));
}

const ManualPage = async ({ params }: { params: { slug: string[] } }) => {
  const { slug } = params;
  const pageId = slug[0];
  const page = await getManualPage(pageId);
  const pages = getManualPages();
  const pageIndex = pages.findIndex(p => p.id === pageId);

  const nextPage = pageIndex < pages.length - 1 ? pages[pageIndex + 1] : null;
  const prevPage = pageIndex > 0 ? pages[pageIndex - 1] : null;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
      <div className="flex justify-between mt-8">
        <div>
          {prevPage && (
            <Link href={`/manual/${prevPage.id}`}>
              <Button>
                &larr; Previous
              </Button>
            </Link>
          )}
        </div>
        <div>
          {nextPage && (
            <Link href={`/manual/${nextPage.id}`}>
              <Button>
                Next &rarr;
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualPage;
