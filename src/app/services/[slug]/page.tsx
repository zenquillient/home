import { getPageData, getVerticalNames, getAllReviews } from '@/lib/cms';
import PageLayout from '@/components/PageLayout/PageLayout';
// import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const [pageData, verticals, allReviews] = await Promise.all([
    getPageData(slug),
    getVerticalNames(),
    getAllReviews() // Could optimize to just fetch vertical reviews, but this is fine for now
  ]);

  // Filter reviews for this specific vertical if allReviews were fetched globally
  // Wait, PageLayout handles this:
  // const reviews = (allReviews && allReviews.length > 0) ? allReviews : pageData.reviews;
  // Actually, for vertical pages, we ONLY want its own reviews. So we don't pass allReviews.
  
  return (
    <>
      <PageLayout pageData={pageData} verticals={verticals} />
    </>
  );
}
