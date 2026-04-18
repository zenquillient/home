import { getPageData } from '@/lib/cms';
import PageLayout from '@/components/PageLayout/PageLayout';

export const revalidate = 60; // Cache pages for 60 seconds

// @ts-ignore
export default async function GenericPage({ params }) {
  const { slug } = await params;
  
  // Valid verticals: vertical-1, vertical-2, etc. If it fails, fallback kicks in via getPageData.
  const pageData = await getPageData(slug);

  return (
    <PageLayout pageData={pageData} />
  );
}
