import React from 'react';
import { getTableOfContents, getManualPages } from '@/lib/manual';
import ManualIndexPageClient from './ManualIndexPageClient';

export default async function ManualIndexPage() {
  const tocData = await getTableOfContents();
  const pagesData = getManualPages();

  return <ManualIndexPageClient toc={tocData.contentHtml} pages={pagesData} />;
}
